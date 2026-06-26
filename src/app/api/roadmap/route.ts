import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import CareerTarget from '@/lib/models/CareerTarget'

export const dynamic = 'force-dynamic'

const ROADMAP_SYSTEM_PROMPT = `You are a world-class Engineering Career Mentor and curriculum designer.
Given a student's career target, target company tier, preparation window in weeks, currently selected focus areas, and skill gaps identified in their resume, draft a highly structured, realistic week-by-week learning roadmap.

You must return ONLY valid JSON in this exact shape:
{
  "title": "string (overall roadmap title, e.g. 'Personalized SDE path for Google')",
  "weeks": [
    {
      "id": "string (e.g., 'week-1')",
      "weekNum": number,
      "title": "string (theme of the week, e.g., 'Arrays & Basic Databases')",
      "items": [
        {
          "id": "string (unique task id, e.g., 'w1t1')",
          "title": "string (actionable milestone/task details, e.g., 'Build the caching layer using Redis and add it to your Resume')",
          "type": "dsa" | "subject" | "project" | "general"
        }
      ]
    }
  ]
}
Each week should contain exactly 3 to 4 items. Distribute the focus areas and missing skills across the weeks logically. Make tasks concrete, specific and actionable. Mark all tasks as not completed.
IMPORTANT: Design every week's tasks to actively guide the student toward building and earning their "Perfect Target Resume" (Resume of Excellence). Write tasks like 'Learn [Skill] and add it to your draft resume', or 'Implement [Project Title] to fill your portfolio project gap'. The roadmap is the time-based plan to transform their current resume into the Resume of Excellence. Do not include markdown code block ticks or any text outside the JSON.`

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const target = await CareerTarget.findOne({ userId, isActive: true })
    if (!target || !target.roadmap || target.roadmap.length === 0) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: target._id.toString(),
      title: `Path to: ${target.targetTitle}`,
      progress: target.readinessScore || 0,
      weeks: target.roadmap
    })
  } catch (error: any) {
    console.error('[Roadmap GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetCompany, durationWeeks, skillsSelected } = await req.json()

    await connectToDatabase()
    const target = await CareerTarget.findOne({ userId, isActive: true })
    if (!target) {
      return NextResponse.json({ error: 'Please define your career target first' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key is not configured' }, { status: 500 })
    }

    const missingSkills = target.gapAnalysis?.missingSkills || []
    const userPrompt = `
Career Target Title: ${target.targetTitle}
Target Category: ${target.targetType}
Target Company/Outcome Tier: ${targetCompany || 'General'}
Roadmap Duration: ${durationWeeks || 4} weeks
User Selected Focus Areas: ${skillsSelected?.join(', ') || 'None selected'}
Identified Skill Gaps from Resume: ${missingSkills.join(', ') || 'None (General Prep)'}
`

    console.log(`[Roadmap POST] Calling Groq to generate roadmap for target: ${target.targetTitle}`)
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
            content: ROADMAP_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
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
      console.error('[Roadmap POST] JSON parse error:', parseError, 'Raw content:', content)
      return NextResponse.json({ error: 'Failed to generate learning roadmap' }, { status: 500 })
    }

    // Set completed: false for all items
    const formattedWeeks = (parsed.weeks || []).map((week: any) => ({
      id: week.id || `week-${week.weekNum}`,
      weekNum: Number(week.weekNum),
      title: week.title || `Week ${week.weekNum}`,
      items: (week.items || []).map((item: any, itemIdx: number) => ({
        id: item.id || `w${week.weekNum}t${itemIdx + 1}`,
        title: item.title,
        type: item.type || 'general',
        completed: false
      }))
    }))

    target.roadmap = formattedWeeks
    await target.save()

    return NextResponse.json({
      id: target._id.toString(),
      title: parsed.title || `Path to: ${target.targetTitle}`,
      progress: target.readinessScore || 0,
      weeks: target.roadmap
    })
  } catch (error: any) {
    console.error('[Roadmap POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
