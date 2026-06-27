import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import InterviewResult from '@/lib/models/InterviewResult'
import { mockInterviewQuestions } from '@/lib/mock-data'

export const dynamic = 'force-dynamic'

const EVALUATOR_SYSTEM_PROMPT = `You are a Senior Technical Recruiter and Engineering Coach.
Your task is to evaluate a candidate's mock interview answers.
You will receive the target company/role and a list of questions, each with the user's transcribed answer.

Evaluate the answers across 5 dimensions (each on a scale of 0 to 100):
1. correctness (technical accuracy)
2. clarity (articulation, conciseness)
3. depth (handling edge cases, explaining complex elements, system scale)
4. communication (tone, structured delivery)
5. speed (pace of logic presentation)

You must also evaluate each question individually, providing:
- score: an integer between 0 and 100.
- feedback: a specific, constructive review (2-3 sentences) detailing strengths and what they missed.
- idealAnswer: a structured, correct reference answer (4-5 sentences, or code snippet/outline if coding) showing senior SDE capability.

Return ONLY valid JSON in this exact shape:
{
  "overallScore": number (average of categories),
  "breakdown": {
    "correctness": number,
    "clarity": number,
    "depth": number,
    "communication": number,
    "speed": number
  },
  "questionResults": [
    {
      "questionId": number,
      "score": number,
      "feedback": "string",
      "idealAnswer": "string"
    }
  ]
}`

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    // Fetch the most recent interview result
    const latestResult = await InterviewResult.findOne({ userId }).sort({ createdAt: -1 })
    return NextResponse.json(latestResult)
  } catch (error: any) {
    console.error('[Interview GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { targetRole, answers } = await req.json()
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Answers object is required' }, { status: 400 })
    }

    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API key is not configured' }, { status: 500 })
    }

    // Map each answer to its question text
    const evaluationInput = Object.entries(answers).map(([qId, answerText]) => {
      const questionId = parseInt(qId)
      const matchedQ = mockInterviewQuestions.find((q) => q.id === questionId)
      return {
        questionId,
        questionText: matchedQ ? matchedQ.question : `Question ID ${questionId}`,
        category: matchedQ ? matchedQ.category : 'General',
        userAnswer: answerText || '[No answer provided]',
      }
    })

    console.log(`[Interview POST] Submitting answers to Groq for evaluation...`)
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
            content: EVALUATOR_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Target Company/Template: ${targetRole}\n\nAnswers to evaluate:\n${JSON.stringify(evaluationInput, null, 2)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 2500,
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
      console.error('[Interview POST] JSON parse error:', parseError, 'Raw content:', content)
      return NextResponse.json({ error: 'Failed to generate interview evaluation' }, { status: 500 })
    }

    // Save to MongoDB database
    await connectToDatabase()
    const savedResult = await InterviewResult.create({
      userId,
      targetRole: targetRole || 'General',
      overallScore: parsed.overallScore || 0,
      breakdown: {
        correctness: parsed.breakdown?.correctness || 0,
        clarity: parsed.breakdown?.clarity || 0,
        depth: parsed.breakdown?.depth || 0,
        communication: parsed.breakdown?.communication || 0,
        speed: parsed.breakdown?.speed || 0,
      },
      questionResults: parsed.questionResults || [],
    })

    return NextResponse.json(savedResult)
  } catch (error: any) {
    console.error('[Interview POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
