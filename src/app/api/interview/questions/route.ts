import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

const FALLBACK_QUESTIONS_BY_CATEGORY: Record<string, Array<{ id: number; question: string; category: string; difficulty: string; timeLimit: number; hint: string }>> = {
  DSA: [
    {
      id: 101,
      question: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Explain time and space complexity.',
      category: 'DSA',
      difficulty: 'Medium',
      timeLimit: 180,
      hint: 'Consider using a HashMap for O(N) lookup instead of brute-force O(N^2).'
    },
    {
      id: 102,
      question: 'Implement a LRU (Least Recently Used) Cache with `get` and `put` operations in O(1) time complexity. Describe your data structures.',
      category: 'DSA',
      difficulty: 'Medium',
      timeLimit: 240,
      hint: 'A combination of Doubly Linked List and Hash Map allows O(1) removals and insertions.'
    },
    {
      id: 103,
      question: 'Given the head of a binary tree, return its maximum depth. How would you handle recursive stack overflow for deep trees?',
      category: 'DSA',
      difficulty: 'Easy',
      timeLimit: 150,
      hint: 'Compare DFS recursion vs BFS iteration using a queue.'
    }
  ],
  'System Design': [
    {
      id: 201,
      question: 'Design a high-throughput URL shortening service like bit.ly. Walk through your database schema, hashing strategy, and caching layer.',
      category: 'System Design',
      difficulty: 'Hard',
      timeLimit: 300,
      hint: 'Address read-to-write ratios, Base62 encoding, Redis caching, and database sharding.'
    },
    {
      id: 202,
      question: 'How would you design a real-time Notification System that scales to 10M daily active users across Web, iOS, and Android?',
      category: 'System Design',
      difficulty: 'Medium',
      timeLimit: 240,
      hint: 'Discuss Message Queues (Kafka/RabbitMQ), WebSockets vs Push Notifications, and idempotency.'
    },
    {
      id: 203,
      question: 'Design a Distributed Rate Limiter for an API Gateway. Compare Token Bucket vs Leaky Bucket algorithms.',
      category: 'System Design',
      difficulty: 'Hard',
      timeLimit: 240,
      hint: 'Explain distributed locks using Redis/Memcached and sliding window counters.'
    }
  ],
  'OS Concepts': [
    {
      id: 301,
      question: 'Explain the difference between Process and Thread. How does the OS kernel handle context switching for both?',
      category: 'OS Concepts',
      difficulty: 'Medium',
      timeLimit: 180,
      hint: 'Detail virtual memory space, PCB/TCB overhead, and CPU register saving.'
    },
    {
      id: 302,
      question: 'What is Deadlock in operating systems? Explain Coffman conditions and how the Banker\'s algorithm prevents deadlocks.',
      category: 'OS Concepts',
      difficulty: 'Hard',
      timeLimit: 210,
      hint: 'Four conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.'
    },
    {
      id: 303,
      question: 'Compare Paging vs Segmentation in Memory Management. What is Page Fault and how is it resolved?',
      category: 'OS Concepts',
      difficulty: 'Medium',
      timeLimit: 180,
      hint: 'Mention TLB (Translation Lookaside Buffer), Virtual Address translation, and swap space.'
    }
  ],
  Behavioral: [
    {
      id: 401,
      question: 'Describe a situation where you had a major technical disagreement with a team member or mentor. How did you resolve it?',
      category: 'Behavioral',
      difficulty: 'Medium',
      timeLimit: 180,
      hint: 'Use the STAR method (Situation, Task, Action, Result) with emphasis on data-driven reasoning.'
    },
    {
      id: 402,
      question: 'Tell me about a project that failed or missed a critical deadline. What did you learn and how did you adapt?',
      category: 'Behavioral',
      difficulty: 'Medium',
      timeLimit: 180,
      hint: 'Demonstrate ownership, root cause analysis, and preventive mechanisms added afterwards.'
    },
    {
      id: 403,
      question: 'Why do you want to join our target company specifically, and how do your skills align with our engineering culture?',
      category: 'Behavioral',
      difficulty: 'Easy',
      timeLimit: 150,
      hint: 'Reference company core principles, recent tech scale challenges, and long-term trajectory.'
    }
  ]
}

const QUESTION_GEN_PROMPT = `You are a Principal Tech Recruiter and Senior Technical Interviewer.
Generate 3 distinct, high-quality technical interview questions tailored specifically for:
- Category/Domain: {{CATEGORY}}
- Target Company: {{COMPANY}}
- Difficulty Level: {{DIFFICULTY}}

Rules:
1. Make questions realistic and typical of actual tech interview rounds at {{COMPANY}}.
2. For DSA/Coding, include clear input/output expectations.
3. For System Design, include scale constraints.
4. For OS/DBMS/CN, test deep understanding.
5. Provide a helpful 1-sentence hint for candidate preparation.

You must return ONLY valid JSON matching this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "string",
      "category": "string",
      "difficulty": "string",
      "timeLimit": number (seconds, e.g. 180 or 240 or 300),
      "hint": "string"
    }
  ]
}`

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { category = 'DSA', difficulty = 'Medium', company = 'Amazon' } = await req.json().catch(() => ({}))

    const groqApiKey = process.env.GROQ_API_KEY
    if (groqApiKey) {
      try {
        const prompt = QUESTION_GEN_PROMPT
          .replace(/{{CATEGORY}}/g, category)
          .replace(/{{COMPANY}}/g, company)
          .replace(/{{DIFFICULTY}}/g, difficulty)

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1500,
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
            const parsed = JSON.parse(cleanJson)
            if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
              const formatted = parsed.questions.map((q: any, idx: number) => ({
                id: q.id || idx + 1,
                question: q.question,
                category: q.category || category,
                difficulty: q.difficulty || difficulty,
                timeLimit: q.timeLimit || (difficulty === 'Hard' ? 300 : 180),
                hint: q.hint || 'Focus on clarity, complexity analysis, and edge cases.'
              }))
              return NextResponse.json({ questions: formatted, source: 'ai' })
            }
          }
        }
      } catch (aiErr) {
        console.warn('[Interview Questions API] AI generation warning, falling back:', aiErr)
      }
    }

    // Fallback to rich category template
    const fallbackList = FALLBACK_QUESTIONS_BY_CATEGORY[category] || FALLBACK_QUESTIONS_BY_CATEGORY['DSA']
    const formattedFallback = fallbackList.map((q, idx) => ({
      ...q,
      id: idx + 1,
      question: `[${company} ${difficulty} Round] ${q.question}`
    }))

    return NextResponse.json({ questions: formattedFallback, source: 'fallback' })
  } catch (error: any) {
    console.error('[Interview Questions POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
