import { NextResponse } from 'next/server'
import {
  buildProjectLabPrompt,
  personalizeProjectIdeas,
  type ProjectIdea,
  type ProjectLabProfile,
} from '@/lib/project-lab'

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile'

function normaliseProfile(body: Partial<ProjectLabProfile>): ProjectLabProfile {
  return {
    year: body.year || '3rd Year',
    role: body.role || 'Full Stack',
    timeline: body.timeline || '2 weeks',
    target: body.target || 'Product startups',
    skills: Array.isArray(body.skills) && body.skills.length > 0 ? body.skills : ['Next.js', 'Python'],
  }
}

function isProjectIdea(value: unknown): value is ProjectIdea {
  if (!value || typeof value !== 'object') return false
  const idea = value as ProjectIdea
  return Boolean(
    idea.id &&
      idea.title &&
      Array.isArray(idea.stack) &&
      Array.isArray(idea.mvp) &&
      Array.isArray(idea.resumeBullets) &&
      Array.isArray(idea.interviewQuestions)
  )
}

function parseIdeas(content: string): ProjectIdea[] {
  const cleaned = content.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed)) return []
  return parsed.filter(isProjectIdea).slice(0, 4)
}

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY
  const configured = Boolean(apiKey && apiKey !== 'your_groq_api_key_here')
  return NextResponse.json({ configured })
}

export async function POST(request: Request) {
  const profile = normaliseProfile(await request.json().catch(() => ({})))
  const fallbackIdeas = personalizeProjectIdeas(profile)
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return NextResponse.json({
      provider: 'local',
      note: 'GROQ_API_KEY is not configured, so local zero-cost ideas were used.',
      ideas: fallbackIdeas,
    })
  }

  try {
    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
        temperature: 0.55,
        max_tokens: 3500,
        messages: [
          {
            role: 'system',
            content:
              'You are a practical placement mentor for Indian CSE/IT students. Return strict JSON only.',
          },
          {
            role: 'user',
            content: buildProjectLabPrompt(profile),
          },
        ],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({
        provider: 'local',
        note: `Groq API returned ${response.status}, so local fallback ideas were used.`,
        ideas: fallbackIdeas,
      })
    }

    const result = await response.json()
    const content = result?.choices?.[0]?.message?.content
    const ideas = typeof content === 'string' ? parseIdeas(content) : []

    return NextResponse.json({
      provider: ideas.length > 0 ? 'groq' : 'local',
      note: ideas.length > 0 ? 'Generated with Groq API.' : 'Groq returned an invalid shape, so local fallback ideas were used.',
      ideas: ideas.length > 0 ? personalizeProjectIdeas(profile, ideas) : fallbackIdeas,
    })
  } catch {
    return NextResponse.json({
      provider: 'local',
      note: 'Groq request failed, so local fallback ideas were used.',
      ideas: fallbackIdeas,
    })
  }
}
