import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import CareerTarget from '@/lib/models/CareerTarget'

export const dynamic = 'force-dynamic'

const IDEAL_PROFILE_SYSTEM_PROMPT = `You are an expert career architect and technical mentor. Given a target role/outcome, its category, and a description, generate a detailed "North Star" ideal profile of what a successful candidate looks like, AND construct a "Perfect target resume" representing excellence (not just generic formatting) for that role.
For a gig or solopreneur category, tailor the resume and ideal profile specifically for freelancer profiles or creator-builder milestones rather than standard 9-5 employee profiles.
You must return ONLY valid JSON with this exact shape:
{
  "idealProfile": {
    "skills": {
      "technical": ["string"],
      "soft": ["string"]
    },
    "projects": [
      {
        "title": "string",
        "description": "string",
        "difficulty": "beginner" | "intermediate" | "advanced"
      }
    ],
    "experience": {
      "milestones": ["string"]
    }
  },
  "perfectResume": {
    "summary": "string (3-4 sentences professional summary for the target outcome, focusing on excellence, competence, and hands-on capability)",
    "skills": [
      {
        "category": "string (e.g. 'Programming Languages', 'Backend/Cloud')",
        "items": ["string"]
      }
    ],
    "projects": [
      {
        "title": "string",
        "description": "string",
        "technologies": ["string"],
        "bullets": ["string (2-3 high-impact, quantified bullets showing standout quality and engineering excellence)"]
      }
    ],
    "experience": [
      {
        "role": "string",
        "organization": "string",
        "duration": "string",
        "bullets": ["string (2-3 high-impact accomplishment bullets aligned with the milestones)"]
      }
    ]
  }
}
Do not include any markdown styling, code block ticks, or text outside the JSON.`

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const activeTarget = await CareerTarget.findOne({ userId, isActive: true })

    return NextResponse.json(activeTarget)
  } catch (error: any) {
    console.error('[CareerTarget GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetType, targetTitle, targetDescription } = await req.json()
    if (!targetType || !targetTitle || !targetDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key is not configured' }, { status: 500 })
    }

    // Call Groq API to generate the ideal profile and perfect resume
    console.log(`[CareerTarget POST] Requesting ideal profile & perfect resume from Groq for: ${targetTitle}`)
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
            content: IDEAL_PROFILE_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Target Category: ${targetType}\nTarget Title: ${targetTitle}\nDescription / Goals: ${targetDescription}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
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
      console.error('[CareerTarget POST] JSON parse error:', parseError, 'Raw content:', content)
      return NextResponse.json({ error: 'Failed to generate structured target details' }, { status: 500 })
    }

    await connectToDatabase()

    // Deactivate previous targets
    await CareerTarget.updateMany({ userId, isActive: true }, { isActive: false })

    // Save the new target with both idealProfile and perfectResume
    const newTarget = await CareerTarget.create({
      userId,
      targetType,
      targetTitle,
      targetDescription,
      idealProfile: parsed.idealProfile,
      perfectResume: parsed.perfectResume,
      isActive: true,
      readinessScore: 0,
    })

    return NextResponse.json(newTarget)
  } catch (error: any) {
    console.error('[CareerTarget POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
