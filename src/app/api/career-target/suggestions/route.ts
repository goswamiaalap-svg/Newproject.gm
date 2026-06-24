import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

const SUGGESTIONS_SYSTEM_PROMPT = `You are an expert career counselor and mentor. Given a student's chosen career category (e.g., job, gig/freelance, solo creator/startup, or higher-education/research), their interests, and their current skills, suggest 3 to 5 specific, tailored target outcomes/roles they could aim for.
For each suggestion, provide:
1. "title": A precise role title (e.g., "Full-Stack Developer at a Product Startup", "Technical Writer", "AI Research Assistant")
2. "description": A brief description of what this target involves.
3. "whyItFits": A clear, encouraging sentence explaining why this matches their stated interests and skills.

You must return ONLY valid JSON in this exact shape:
{
  "suggestions": [
    {
      "title": "string",
      "description": "string",
      "whyItFits": "string"
    }
  ]
}
Do not include any markdown styling, code block ticks, or text outside the JSON.`

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetType, interests, skills } = await req.json()
    if (!targetType) {
      return NextResponse.json({ error: 'targetType is required' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key is not configured' }, { status: 500 })
    }

    console.log(`[Suggestions POST] Requesting career suggestions from Groq for category: ${targetType}`)
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
            content: SUGGESTIONS_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Category: ${targetType}\nUser Interests: ${interests || 'None specified'}\nCurrent Skills: ${skills || 'None specified'}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 1000,
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
      console.error('[Suggestions POST] JSON parse error:', parseError, 'Raw content:', content)
      return NextResponse.json({ error: 'Failed to generate career suggestions' }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('[Suggestions POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
