import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import InterviewResult from '@/lib/models/InterviewResult'

export const dynamic = 'force-dynamic'

const EVALUATOR_SYSTEM_PROMPT = `You are a Senior Technical Recruiter and Engineering Coach at top tech firms (FAANG/Unicorns).
Your task is to evaluate a candidate's mock interview responses.
You will receive target role details and a list of interview questions along with the user's submitted transcript/code solution.

Evaluate the candidate across 5 key performance dimensions (each scored strictly from 0 to 100 based on actual content quality):
1. correctness: Technical accuracy, algorithm logic, and adherence to constraints.
2. clarity: Structure, conciseness, and articulation of thought.
3. depth: Discussion of trade-offs, time/space complexity, edge cases, and scale.
4. communication: Professional tone, structured delivery (e.g. STAR method or systematic breakdown).
5. speed: Efficiency and completeness of the solution within the allocated timer.

Also evaluate each question individually:
- score: Integer between 0 and 100 based on the quality of user's answer. (Assign 0-20 if no answer/gibberish, 40-60 for partial, 70-95 for solid solutions).
- feedback: Specific, constructive review (2-3 sentences) detailing strengths, missed edge cases, or complexity improvements.
- idealAnswer: A comprehensive, expert reference solution (code snippet or structured breakdown, 4-6 sentences) demonstrating senior SDE standard.

Return ONLY valid JSON in this exact shape:
{
  "overallScore": number,
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

// Smart fallback evaluation generator in case AI service is unavailable
function generateSmartFallbackEvaluation(targetRole: string, evaluationInput: Array<{ questionId: number; questionText: string; category: string; userAnswer: string }>) {
  let totalScore = 0
  const questionResults = evaluationInput.map((item) => {
    const len = item.userAnswer ? item.userAnswer.trim().length : 0
    const hasCode = /function|const|let|var|def|class|return|import|select|from|where/i.test(item.userAnswer)
    const hasKeyTerms = /complexity|time|space|hashmap|array|queue|cache|index|database|scale|star|result/i.test(item.userAnswer)

    let score = 30
    if (len > 30) score += 25
    if (len > 100) score += 20
    if (hasCode || hasKeyTerms) score += 15
    if (len < 10) score = 15

    score = Math.min(95, score)
    totalScore += score

    return {
      questionId: item.questionId,
      score,
      feedback: len > 40
        ? `Good effort in articulating your thoughts for ${item.category}. To score higher for ${targetRole}, specify exact Big-O time/space complexities and cover edge cases (e.g., empty input, overflow).`
        : `Your response was brief. In actual ${targetRole} rounds, elaborate on your algorithm step-by-step and walk through code execution trace.`,
      idealAnswer: `For optimal performance in ${item.category}: 1. State the baseline approach and Big-O complexity. 2. Introduce optimized data structures (e.g. HashMap, Double-ended Queue, or Caching layer). 3. Walk through edge cases cleanly.`
    }
  })

  const avg = Math.round(totalScore / (questionResults.length || 1))

  return {
    overallScore: avg,
    breakdown: {
      correctness: Math.min(98, Math.max(20, avg + 2)),
      clarity: Math.min(98, Math.max(20, avg - 3)),
      depth: Math.min(98, Math.max(20, avg - 5)),
      communication: Math.min(98, Math.max(20, avg + 4)),
      speed: Math.min(98, Math.max(20, avg + 1)),
    },
    questionResults,
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
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

    const { targetRole = 'General SDE', questions = [], answers = {} } = await req.json()
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Answers object is required' }, { status: 400 })
    }

    // Build array of questions with answers
    const evaluationInput = (questions && Array.isArray(questions) && questions.length > 0)
      ? questions.map((q: any) => ({
          questionId: Number(q.id),
          questionText: q.question || 'Technical Interview Question',
          category: q.category || 'DSA',
          userAnswer: String(answers[q.id] || answers[String(q.id)] || '[No answer provided]'),
        }))
      : Object.entries(answers).map(([qId, text]) => ({
          questionId: Number(qId),
          questionText: `Interview Question #${qId}`,
          category: 'Technical',
          userAnswer: String(text || '[No answer provided]'),
        }))

    const groqApiKey = process.env.GROQ_API_KEY
    let evalResult = null

    if (groqApiKey) {
      try {
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
              { role: 'system', content: EVALUATOR_SYSTEM_PROMPT },
              {
                role: 'user',
                content: `Target Role/Company: ${targetRole}\n\nQuestions & Answers to evaluate:\n${JSON.stringify(evaluationInput, null, 2)}`,
              },
            ],
            temperature: 0.3,
            max_tokens: 2500,
            response_format: { type: 'json_object' },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const content = data?.choices?.[0]?.message?.content
          if (content) {
            const cleanJson = content
              .replace(/^```json\s*/i, '')
              .replace(/^```\s*/i, '')
              .replace(/```\s*$/i, '')
              .trim()
            evalResult = JSON.parse(cleanJson)
          }
        }
      } catch (aiErr) {
        console.warn('[Interview POST] AI evaluation failed, using fallback evaluator:', aiErr)
      }
    }

    if (!evalResult) {
      evalResult = generateSmartFallbackEvaluation(targetRole, evaluationInput)
    }

    // Ensure valid non-null numerical values
    const finalOverallScore = Math.max(0, Math.min(100, Math.round(Number(evalResult.overallScore) || 0)))
    const finalBreakdown = {
      correctness: Math.max(0, Math.min(100, Math.round(Number(evalResult.breakdown?.correctness) || finalOverallScore))),
      clarity: Math.max(0, Math.min(100, Math.round(Number(evalResult.breakdown?.clarity) || finalOverallScore))),
      depth: Math.max(0, Math.min(100, Math.round(Number(evalResult.breakdown?.depth) || finalOverallScore))),
      communication: Math.max(0, Math.min(100, Math.round(Number(evalResult.breakdown?.communication) || finalOverallScore))),
      speed: Math.max(0, Math.min(100, Math.round(Number(evalResult.breakdown?.speed) || finalOverallScore))),
    }

    // Save to MongoDB database if available
    try {
      await connectToDatabase()
      const savedResult = await InterviewResult.create({
        userId,
        targetRole: targetRole || 'General SDE',
        overallScore: finalOverallScore,
        breakdown: finalBreakdown,
        questionResults: evalResult.questionResults || [],
      })
      return NextResponse.json(savedResult)
    } catch (dbErr) {
      console.warn('[Interview POST] DB Save warning:', dbErr)
      // Return evaluated result directly if DB fails
      return NextResponse.json({
        userId,
        targetRole,
        overallScore: finalOverallScore,
        breakdown: finalBreakdown,
        questionResults: evalResult.questionResults || [],
        createdAt: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error('[Interview POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
