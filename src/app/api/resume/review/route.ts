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
import Anthropic from '@anthropic-ai/sdk'
import { connectToDatabase } from '@/lib/mongoose'
import Resume from '@/lib/models/Resume'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// System prompt that instructs Claude to return strict JSON only
const RESUME_REVIEW_SYSTEM_PROMPT = `You are an expert technical resume reviewer for Indian startup and product company hiring standards. Analyze the resume text and return ONLY valid JSON (no markdown, no extra text) with this exact shape: { "overallScore": number (0-100), "atsScore": number (0-100), "quantifiedAchievements": number (0-100), "strengths": string[], "weaknesses": [{ "issue": string, "severity": "high"|"medium"|"low", "suggestion": string }] }`

export async function POST(req: Request) {
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
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // ---- 3. Fetch resume from MongoDB ----
  await connectToDatabase()

  const resume = await Resume.findById(resumeId)

  if (!resume) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  // Security: ensure this resume belongs to the authenticated user
  if (resume.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!resume.extractedText || resume.extractedText.trim().length < 50) {
    await Resume.findByIdAndUpdate(resumeId, {
      status: 'error',
      errorMessage: 'Resume text is too short to analyze.',
    })
    return NextResponse.json(
      { error: 'Resume text is too short to generate a meaningful review.' },
      { status: 422 }
    )
  }

  // ---- 4. Call Claude API ----
  let claudeResponse: string
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      system: RESUME_REVIEW_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Please review this resume:\n\n${resume.extractedText}`,
        },
      ],
    })

    // Extract the text content from Claude's response
    const textBlock = message.content.find((block) => block.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text content in Claude response')
    }
    claudeResponse = textBlock.text
  } catch (claudeError) {
    console.error('[Resume Review] Claude API error:', claudeError)

    // Update resume status to error
    await Resume.findByIdAndUpdate(resumeId, {
      status: 'error',
      errorMessage: 'AI analysis failed. Please try again.',
    })

    return NextResponse.json(
      { error: 'AI analysis failed. Please try uploading your resume again.' },
      { status: 502 }
    )
  }

  // ---- 5. Parse Claude's JSON response ----
  let reviewResult
  try {
    // Claude might occasionally wrap with markdown fences — strip them just in case
    const cleanJson = claudeResponse
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
      throw new Error('Unexpected JSON shape from Claude')
    }
  } catch (parseError) {
    console.error('[Resume Review] Failed to parse Claude JSON:', parseError)
    console.error('[Resume Review] Raw Claude response:', claudeResponse)

    await Resume.findByIdAndUpdate(resumeId, {
      status: 'error',
      errorMessage: 'Failed to parse AI response. Please try again.',
    })

    return NextResponse.json(
      { error: 'Failed to process AI response. Please try uploading again.' },
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

    return NextResponse.json({
      resumeId,
      fileName: updatedResume?.fileName,
      fileUrl: updatedResume?.fileUrl,
      status: 'complete',
      reviewResult,
    })
  } catch (dbError) {
    console.error('[Resume Review] MongoDB update error:', dbError)
    return NextResponse.json(
      { error: 'Failed to save review results. Please try again.' },
      { status: 500 }
    )
  }
}
