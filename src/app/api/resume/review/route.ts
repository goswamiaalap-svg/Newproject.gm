// =============================================================================
// Resume Review API — POST /api/resume/review
//
// Takes a resumeId, fetches the extractedText from MongoDB, sends it to
// Claude claude-sonnet-4-6 for analysis, and saves the parsed result back.
//
// Flow:
//   1. Authenticate the user via Clerk
//   2. Fetch the Resume document by resumeId, verify it belongs to this user
//   3. Send extractedText to Claude with a strict JSON-only system prompt
//   4. Parse Claude's JSON response into the IReviewResult shape
//   5. Update MongoDB document with reviewResult and status: "complete"
//   6. Return the parsed result
//
// Claude System Prompt: Forces Claude to return ONLY valid JSON with the exact
//   shape: { overallScore, atsScore, quantifiedAchievements, strengths, weaknesses }
// =============================================================================

import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
// import Anthropic from '@anthropic-ai/sdk'
import { connectToDatabase } from '@/lib/mongoose'
import Resume from '@/lib/models/Resume'
import { getPusherServer, getResumeChannel, RESUME_EVENTS } from '@/lib/pusher'

export const dynamic = 'force-dynamic'

/*
let _anthropic: Anthropic | null = null

function getAnthropicClient(): Anthropic {
  if (_anthropic) return _anthropic

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Anthropic API key is not configured. Set ANTHROPIC_API_KEY in Vercel settings.')
  }

  _anthropic = new Anthropic({ apiKey })
  return _anthropic
}
*/

// System prompt that instructs Groq to return strict JSON only
const RESUME_REVIEW_SYSTEM_PROMPT = `You are an expert technical resume reviewer for Indian startup and product company hiring standards. Analyze the resume text and return ONLY valid JSON (no markdown, no extra text) with this exact shape: { "overallScore": number (0-100), "atsScore": number (0-100), "quantifiedAchievements": number (0-100), "strengths": string[], "weaknesses": [{ "issue": string, "severity": "high"|"medium"|"low", "suggestion": string }] }`

export async function POST(req: Request) {
  try {
    // ---- 1. Auth check ----
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ---- 2. Parse request body ----
    let resumeId: string
    try {
      const body = await req.json()
      resumeId = body.resumeId
      if (!resumeId) {
        return NextResponse.json({ error: 'resumeId is required' }, { status: 400 })
      }
    } catch (jsonErr: any) {
      console.error('[Resume Review] Request body parse error:', jsonErr)
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // ---- 3. Fetch resume from MongoDB ----
    let resume
    try {
      await connectToDatabase()
      resume = await Resume.findById(resumeId)
    } catch (dbError: any) {
      console.error('[Resume Review] MongoDB read error:', dbError)
      return NextResponse.json(
        { error: `Database connection failed: ${dbError.message || 'Unknown database error'}` },
        { status: 500 }
      )
    }

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    // Security: ensure this resume belongs to the authenticated user
    if (resume.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!resume.extractedText || resume.extractedText.trim().length < 50) {
      try {
        await Resume.findByIdAndUpdate(resumeId, {
          status: 'error',
          errorMessage: 'Resume text is too short to analyze.',
        })
      } catch (dbError) {
        console.error('[Resume Review] MongoDB update error for short text:', dbError)
      }
      return NextResponse.json(
        { error: 'Resume text is too short to generate a meaningful review.' },
        { status: 422 }
      )
    }

    // ---- 4. Call Groq API ----
    let rawReviewResponse: string
    try {
      const groqApiKey = process.env.GROQ_API_KEY
      if (!groqApiKey) {
        throw new Error('Groq API key is not configured. Set GROQ_API_KEY in Vercel settings.')
      }

      // Emit AI started event
      try {
        const pusher = getPusherServer()
        await pusher.trigger(getResumeChannel(userId), RESUME_EVENTS.AI_STARTED, {})
      } catch (e) {
        console.error('[Pusher] Failed to emit AI_STARTED:', e)
      }

      console.log(`[Resume Review] Calling Groq API with model: llama-3.3-70b-versatile...`)
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: RESUME_REVIEW_SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: `Please review this resume:\n\n${resume.extractedText}`,
            },
          ],
          temperature: 0.2,
          max_tokens: 1024,
          response_format: { type: 'json_object' }, // strict JSON mode
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Groq API returned status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      rawReviewResponse = data?.choices?.[0]?.message?.content
      if (!rawReviewResponse) {
        throw new Error('Groq completions response is missing choices message content')
      }
    } catch (groqError: any) {
      console.error('[Resume Review] Groq API error:', groqError)

      // Update resume status to error
      try {
        await Resume.findByIdAndUpdate(resumeId, {
          status: 'error',
          errorMessage: `AI analysis failed: ${groqError.message || 'Unknown error'}. Please try again.`,
        })
      } catch (dbError) {
        console.error('[Resume Review] MongoDB update error after Groq failure:', dbError)
      }

      try {
        const pusher = getPusherServer()
        await pusher.trigger(getResumeChannel(userId), RESUME_EVENTS.ERROR, { message: 'AI analysis failed.' })
      } catch (e) {}

      return NextResponse.json(
        { error: `AI analysis failed: ${groqError.message || 'Groq service exception'}` },
        { status: 502 }
      )
    }

    // ---- 5. Parse Groq's JSON response ----
    let reviewResult
    try {
      // Groq JSON mode guarantees it's a valid JSON block, but let's strip markdown code blocks just in case
      const cleanJson = rawReviewResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()

      reviewResult = JSON.parse(cleanJson)

      // Basic validation of the expected shape
      if (
        typeof reviewResult.overallScore !== 'number' ||
        typeof reviewResult.atsScore !== 'number' ||
        typeof reviewResult.quantifiedAchievements !== 'number' ||
        !Array.isArray(reviewResult.strengths) ||
        !Array.isArray(reviewResult.weaknesses)
      ) {
        throw new Error('Unexpected JSON shape from Groq')
      }
    } catch (parseError: any) {
      console.error('[Resume Review] Failed to parse Groq JSON:', parseError)
      console.error('[Resume Review] Raw Groq response:', rawReviewResponse)

      try {
        await Resume.findByIdAndUpdate(resumeId, {
          status: 'error',
          errorMessage: `Failed to process AI response: ${parseError.message || 'Unknown error'}. Please try again.`,
        })
      } catch (dbError) {
        console.error('[Resume Review] MongoDB update error after parse failure:', dbError)
      }

      try {
        const pusher = getPusherServer()
        await pusher.trigger(getResumeChannel(userId), RESUME_EVENTS.ERROR, { message: 'Failed to process AI response.' })
      } catch (e) {}

      return NextResponse.json(
        { error: `Failed to process AI response: ${parseError.message || 'Invalid JSON format'}` },
        { status: 500 }
      )
    }

    // ---- 6. Save results to MongoDB and mark complete ----
    try {
      const updatedResume = await Resume.findByIdAndUpdate(
        resumeId,
        {
          status: 'complete',
          reviewResult,
        },
        { new: true }
      )

      try {
        const pusher = getPusherServer()
        await pusher.trigger(getResumeChannel(userId), RESUME_EVENTS.AI_COMPLETE, { reviewResult })
      } catch (e) {
        console.error('[Pusher] Failed to emit AI_COMPLETE:', e)
      }

      return NextResponse.json({
        resumeId,
        fileName: updatedResume?.fileName,
        fileUrl: updatedResume?.fileUrl,
        status: 'complete',
        reviewResult,
      })
    } catch (dbError: any) {
      console.error('[Resume Review] MongoDB update error:', dbError)
      return NextResponse.json(
        { error: `Failed to save review results: ${dbError.message || 'Database write failure'}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[Resume Review] Critical unhandled route crash:', error)
    return NextResponse.json(
      { error: `Server Error: ${error.message || 'An unexpected error occurred'}` },
      { status: 500 }
    )
  }
}
