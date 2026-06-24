import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import Resume from '@/lib/models/Resume'
import CareerTarget from '@/lib/models/CareerTarget'

export const dynamic = 'force-dynamic'

const COMPARE_SYSTEM_PROMPT = `You are a Senior Technical Recruiter and Career Mentor.
Compare the user's resume text against the Ideal Target Profile (which lists target technical skills, soft skills, projects, and milestones).
Assess the alignment:
1. Identify "matchingSkills" (skills from the ideal profile that are present in the resume).
2. Identify "missingSkills" (important skills from the ideal profile that are missing from the resume).
3. Compute a "readinessScore" (an integer from 0 to 100) representing how ready the candidate is for this specific target. If they match almost nothing, score is 10-30; if they match some, 40-70; if they match almost all, 85-100.
4. Recommend 2 tailored, high-impact "recommendedProjects" specifically designed to bridge the missing skill gaps. Each project must list the "skillsAddressed".
5. Define 3-5 concrete, sequential "actionSteps" they should take to reach readiness.

You must return ONLY valid JSON in this exact shape:
{
  "readinessScore": number,
  "gapAnalysis": {
    "missingSkills": ["string"],
    "matchingSkills": ["string"],
    "recommendedProjects": [
      {
        "title": "string",
        "description": "string",
        "skillsAddressed": ["string"]
      }
    ],
    "actionSteps": ["string"]
  }
}
Do not include any markdown styling, code block ticks, or text outside the JSON.`

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { resumeId } = await req.json()
    if (!resumeId) {
      return NextResponse.json({ error: 'resumeId is required' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key is not configured' }, { status: 500 })
    }

    await connectToDatabase()

    // 1. Fetch Resume and verify ownership
    const resume = await Resume.findById(resumeId)
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }
    if (resume.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 2. Fetch Active Career Target
    const target = await CareerTarget.findOne({ userId, isActive: true })
    if (!target) {
      return NextResponse.json({ error: 'No active career target found. Please define your path first.' }, { status: 404 })
    }

    console.log(`[Compare POST] Comparing resume ${resumeId} with active target: ${target.targetTitle}`)

    // 3. Call Groq
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
            content: COMPARE_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Resume Text:\n${resume.extractedText}\n\nIdeal Profile:\n${JSON.stringify(target.idealProfile, null, 2)}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Groq API returned status ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      throw new Error('Groq completions response is empty')
    }

    let parsed
    try {
      const cleanJson = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()
      parsed = JSON.parse(cleanJson)
    } catch (parseError: any) {
      console.error('[Compare POST] JSON parse error:', parseError, 'Raw content:', content)
      return NextResponse.json({ error: 'Failed to generate comparison analysis' }, { status: 500 })
    }

    // 4. Update the active career target in MongoDB
    target.readinessScore = parsed.readinessScore
    target.gapAnalysis = parsed.gapAnalysis
    await target.save()

    return NextResponse.json(target)
  } catch (error: any) {
    console.error('[Compare POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
