import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import CareerTarget from '@/lib/models/CareerTarget'

export const dynamic = 'force-dynamic'

const IDEAL_PROFILE_SYSTEM_PROMPT = `You are an expert career architect and technical mentor. Given a target role/outcome, its category, and a description, generate a detailed "North Star" ideal profile of what a successful candidate looks like.
You must return ONLY valid JSON with this exact shape:
{
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
}
Generate 4-8 core technical skills, 3-5 soft skills, 2-3 specific, relevant project ideas that would make them stand out, and 3-4 key milestones/experiences they should achieve (e.g., "Build an open-source tool with 50+ stars", "Complete a mock interview under 45 mins"). Do not include any markdown styling, code block ticks, or text outside the JSON.`

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

    // Call Groq API to generate the ideal profile
    console.log(`[CareerTarget POST] Requesting ideal profile from Groq for: ${targetTitle}`)
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
        max_tokens: 1500,
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

    let idealProfile
    try {
      const cleanJson = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim()
      idealProfile = JSON.parse(cleanJson)
    } catch (parseError: any) {
      console.error('[CareerTarget POST] JSON parse error:', parseError, 'Raw content:', content)
      return NextResponse.json({ error: 'Failed to generate structured ideal profile' }, { status: 500 })
    }

    await connectToDatabase()

    // Deactivate previous targets
    await CareerTarget.updateMany({ userId, isActive: true }, { isActive: false })

    // Save the new target
    const newTarget = await CareerTarget.create({
      userId,
      targetType,
      targetTitle,
      targetDescription,
      idealProfile,
      isActive: true,
      readinessScore: 0,
    })

    return NextResponse.json(newTarget)
  } catch (error: any) {
    console.error('[CareerTarget POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
