import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { WizardInput, GeminiRoadmapOutput } from '@/components/roadmap/types'

// ─── Prompt Builder ────────────────────────────────────────────────────────────

function buildPrompt(input: WizardInput): string {
  // Cap at 8 weeks so the JSON response doesn't get cut off due to token limits
  const weeks = Math.min(Math.max(input.timeAvailable * 4, 4), 8)
  return `You are an expert career mentor for CS students in India. Generate a personalized learning roadmap.

Student: ${input.currentYear}, ${input.branch}, CGPA: ${input.cgpa || 'N/A'}
Goal: ${input.goal}
LeetCode: ${input.leetcodeCount} problems | Projects: ${input.projectsBuilt} | Internship: ${input.hasInternship} | Resume: ${input.hasResume}
Time: ${input.dailyHours}h/day for ${input.timeAvailable} months | Style: ${input.learningStyle} | Challenge: ${input.biggestChallenge}
Situation: ${input.currentSituation || 'Not provided'}
Aspirations: ${input.careerAspirations || 'Not provided'}
Challenges: ${input.currentChallenges || 'Not provided'}

Return ONLY raw JSON (no markdown):
{"title":"...","subtitle":"...","insights":{"mentorChat":"Write a detailed, 2-3 paragraph conversational message directly to the student. Speak like an expert mentor evaluating their input. Address their specific challenges, praise their current progress, and explain exactly why you structured the roadmap this way. Use bold text and bullet points inside the chat if needed for emphasis.","focusAreas":["...","...","..."],"readinessTimeline":"..."},"weeks":[{"week":1,"title":"...","theme":"...","tasks":[{"title":"...","description":"...","difficulty":"Beginner","estimatedHours":5,"topics":["..."],"resources":[{"type":"video","title":"...","url":"https://...","platform":"YouTube","free":true}]}]}]}

Rules: Generate exactly ${weeks} weeks. 2 tasks per week. Keep descriptions concise. Personalize based on LeetCode count and goal. Different profiles = different roadmaps.`
}

// ─── Mock Fallback Generator ──────────────────────────────────────────────────
// Used when Gemini API quota is exhausted — generates realistic structured data

function generateMockRoadmap(input: WizardInput): GeminiRoadmapOutput {
  const weeks = Math.min(Math.max(input.timeAvailable * 4, 4), 12)
  const isPlacement = input.goal.includes('Placement') || input.goal.includes('Software') || input.goal.includes('Product')
  const isWebDev = input.goal.includes('Full Stack')
  const isAIML = input.goal.includes('AI/ML')
  const isBeginnerDSA = input.leetcodeCount === '0' || input.leetcodeCount === '1–50'

  const dsaWeeks = [
    { week: 1, title: 'Arrays, Strings & Hashing', theme: 'DSA Foundations', tasks: [
      { title: 'Arrays & Two Pointers', description: 'Master array traversal, prefix sums, and the two-pointer technique — the foundation of 40% of placement questions.', difficulty: 'Beginner' as const, estimatedHours: 6, topics: ['Array traversal', 'Prefix sums', 'Two Sum', 'Best Time to Buy/Sell Stock'], resources: [
        { type: 'video' as const, title: 'NeetCode Arrays & Hashing', url: 'https://www.youtube.com/watch?v=0K_eZGS5NsU', platform: 'YouTube', free: true },
        { type: 'practice' as const, title: 'LeetCode: Two Sum', url: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode', free: true },
      ]},
      { title: 'Sliding Window Pattern', description: 'Learn the sliding window technique to solve subarray/substring problems in O(n) instead of O(n²).', difficulty: 'Beginner' as const, estimatedHours: 5, topics: ['Fixed window', 'Variable window', 'Longest Substring Without Repeating Characters'], resources: [
        { type: 'video' as const, title: 'Sliding Window - Striver', url: 'https://takeuforward.org/data-structure/sliding-window-two-pointer-problems/', platform: 'TakeUForward', free: true },
        { type: 'practice' as const, title: 'LeetCode: Longest Substring', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', platform: 'LeetCode', free: true },
      ]},
    ]},
    { week: 2, title: 'Linked Lists & Stacks', theme: 'Linear Data Structures', tasks: [
      { title: 'Linked List Operations', description: 'Reversal, cycle detection using Floyd\'s algorithm, and merge operations — these appear in nearly every company\'s interview.', difficulty: 'Beginner' as const, estimatedHours: 6, topics: ['Reversal', 'Floyd\'s cycle detection', 'Merge sorted lists'], resources: [
        { type: 'video' as const, title: 'Linked Lists - NeetCode', url: 'https://www.youtube.com/watch?v=G0_I-ZF0S38', platform: 'YouTube', free: true },
        { type: 'practice' as const, title: 'LeetCode: Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', platform: 'LeetCode', free: true },
      ]},
      { title: 'Stack & Queue Problems', description: 'Monotonic stacks, valid parentheses, and BFS using queues are essential patterns tested in coding rounds.', difficulty: 'Intermediate' as const, estimatedHours: 5, topics: ['Monotonic stack', 'Valid parentheses', 'Next Greater Element'], resources: [
        { type: 'practice' as const, title: 'LeetCode: Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', platform: 'LeetCode', free: true },
      ]},
    ]},
    { week: 3, title: 'Trees & Binary Search', theme: 'Non-Linear Structures', tasks: [
      { title: 'Binary Trees', description: 'DFS traversals (inorder, preorder, postorder), LCA, and max depth problems are staples of mid-level interviews.', difficulty: 'Intermediate' as const, estimatedHours: 8, topics: ['Inorder/Preorder/Postorder', 'LCA', 'Max depth', 'Level order BFS'], resources: [
        { type: 'video' as const, title: 'Binary Trees - Striver Series', url: 'https://takeuforward.org/binary-tree/binary-tree-traversal-inorder-preorder-postorder/', platform: 'TakeUForward', free: true },
      ]},
      { title: 'Binary Search', description: 'Binary search on answers (not just sorted arrays) is a high-frequency pattern. Practice search in rotated arrays and peak element.', difficulty: 'Intermediate' as const, estimatedHours: 5, topics: ['Classic binary search', 'Rotated array', 'Search on answer space'], resources: [
        { type: 'practice' as const, title: 'LeetCode: Binary Search', url: 'https://leetcode.com/problems/binary-search/', platform: 'LeetCode', free: true },
      ]},
    ]},
    { week: 4, title: 'Graphs & Dynamic Programming', theme: 'Advanced Algorithms', tasks: [
      { title: 'Graph Algorithms', description: 'BFS/DFS for matrix traversal, topological sort, and shortest path (Dijkstra) are asked in product-based companies.', difficulty: 'Advanced' as const, estimatedHours: 10, topics: ['BFS/DFS', 'Number of Islands', 'Topological Sort', 'Dijkstra'], resources: [
        { type: 'video' as const, title: 'Graph Theory - WilliamFiset', url: 'https://www.youtube.com/watch?v=09_LlHjoEiY', platform: 'YouTube', free: true },
        { type: 'practice' as const, title: 'LeetCode: Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', platform: 'LeetCode', free: true },
      ]},
      { title: '1D Dynamic Programming', description: 'Start with Fibonacci-style DP, then Coin Change and Climbing Stairs to build intuition for state transitions.', difficulty: 'Advanced' as const, estimatedHours: 8, topics: ['Memoization', 'Tabulation', 'Coin Change', 'Climbing Stairs'], resources: [
        { type: 'video' as const, title: 'DP Playlist - Aditya Verma', url: 'https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go', platform: 'YouTube', free: true },
      ]},
    ]},
  ]

  const csWeeks = [
    { week: dsaWeeks.length + 1, title: 'DBMS & SQL', theme: 'CS Fundamentals', tasks: [
      { title: 'Database Fundamentals', description: 'ACID properties, normalization (1NF to BCNF), and joins are asked in every service-based and product-based interview.', difficulty: 'Intermediate' as const, estimatedHours: 8, topics: ['ACID', 'Normalization', 'Joins', 'Indexing', 'Transactions'], resources: [
        { type: 'video' as const, title: 'DBMS - Gate Smashers', url: 'https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8Qwfwq6iS15TvsBw8', platform: 'YouTube', free: true },
        { type: 'practice' as const, title: 'SQLZoo Interactive SQL', url: 'https://sqlzoo.net/', platform: 'SQLZoo', free: true },
        { type: 'practice' as const, title: 'LeetCode SQL 50', url: 'https://leetcode.com/studyplan/top-sql-50/', platform: 'LeetCode', free: true },
      ]},
    ]},
    { week: dsaWeeks.length + 2, title: 'OS & Computer Networks', theme: 'CS Fundamentals', tasks: [
      { title: 'Operating Systems', description: 'Process vs Thread, CPU scheduling, deadlocks (Banker\'s algorithm), and virtual memory are high-frequency HR and technical interview topics.', difficulty: 'Intermediate' as const, estimatedHours: 7, topics: ['Process & Thread', 'CPU Scheduling', 'Deadlocks', 'Virtual Memory', 'Paging'], resources: [
        { type: 'video' as const, title: 'OS - Neso Academy', url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O', platform: 'YouTube', free: true },
        { type: 'article' as const, title: 'OS Interview Questions', url: 'https://www.interviewbit.com/operating-system-interview-questions/', platform: 'InterviewBit', free: true },
      ]},
      { title: 'Computer Networks', description: 'OSI model, TCP/IP, HTTP vs HTTPS, and how DNS works are commonly asked in system design and HR rounds.', difficulty: 'Intermediate' as const, estimatedHours: 5, topics: ['OSI Model', 'TCP vs UDP', 'HTTP/HTTPS', 'DNS'], resources: [
        { type: 'article' as const, title: 'CN Interview Questions', url: 'https://www.interviewbit.com/networking-interview-questions/', platform: 'InterviewBit', free: true },
      ]},
    ]},
  ]

  const webWeeks = [
    { week: 1, title: 'HTML, CSS & JavaScript Foundations', theme: 'Web Fundamentals', tasks: [
      { title: 'Modern JavaScript (ES6+)', description: 'Arrow functions, Promises, async/await, destructuring, and modules are prerequisites for any modern web framework.', difficulty: 'Beginner' as const, estimatedHours: 8, topics: ['Arrow functions', 'Promises', 'Async/Await', 'Modules', 'Destructuring'], resources: [
        { type: 'course' as const, title: 'JavaScript - The Complete Guide', url: 'https://javascript.info/', platform: 'javascript.info', free: true },
      ]},
    ]},
    { week: 2, title: 'React Fundamentals', theme: 'Frontend Framework', tasks: [
      { title: 'React Core Concepts', description: 'Components, JSX, hooks (useState, useEffect, useContext), and props are the building blocks of every React application.', difficulty: 'Intermediate' as const, estimatedHours: 10, topics: ['Components', 'Hooks', 'State', 'Props', 'Context API'], resources: [
        { type: 'docs' as const, title: 'React Official Docs', url: 'https://react.dev/learn', platform: 'React', free: true },
        { type: 'video' as const, title: 'React Crash Course', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', platform: 'YouTube', free: true },
      ]},
    ]},
    { week: 3, title: 'Node.js & Express Backend', theme: 'Backend Development', tasks: [
      { title: 'REST API Development', description: 'Build RESTful APIs with Express, implement JWT authentication, and connect to MongoDB — the core of full-stack development.', difficulty: 'Intermediate' as const, estimatedHours: 12, topics: ['REST principles', 'Express routing', 'JWT Auth', 'MongoDB/Mongoose'], resources: [
        { type: 'video' as const, title: 'Node.js & Express API', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE', platform: 'YouTube', free: true },
      ]},
    ]},
    { week: 4, title: 'Full Stack Project', theme: 'Portfolio Building', tasks: [
      { title: 'Build a Complete MERN App', description: 'Deploy a full-stack application with authentication, database, and a polished UI. This becomes your most important portfolio piece.', difficulty: 'Advanced' as const, estimatedHours: 20, topics: ['MERN stack', 'Authentication', 'Deployment', 'Vercel/Render'], resources: [
        { type: 'video' as const, title: 'MERN Stack Full Tutorial', url: 'https://www.youtube.com/watch?v=-0exw-9YJBo', platform: 'YouTube', free: true },
      ]},
    ]},
  ]

  const aiWeeks = [
    { week: 1, title: 'Python & Math Foundations', theme: 'AI/ML Prerequisites', tasks: [
      { title: 'Python for Data Science', description: 'NumPy, Pandas, and Matplotlib are the essential tools for data manipulation and visualization in every ML project.', difficulty: 'Beginner' as const, estimatedHours: 8, topics: ['NumPy', 'Pandas', 'Matplotlib', 'Data cleaning'], resources: [
        { type: 'course' as const, title: 'Kaggle Python Course', url: 'https://www.kaggle.com/learn/python', platform: 'Kaggle', free: true },
      ]},
    ]},
    { week: 2, title: 'Machine Learning Fundamentals', theme: 'Core ML Algorithms', tasks: [
      { title: 'Supervised Learning', description: 'Linear/logistic regression, decision trees, and SVM — understanding these algorithms deeply is essential before moving to deep learning.', difficulty: 'Intermediate' as const, estimatedHours: 10, topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'SVM'], resources: [
        { type: 'course' as const, title: 'Andrew Ng ML Course', url: 'https://www.coursera.org/learn/machine-learning', platform: 'Coursera', free: false },
        { type: 'course' as const, title: 'Fast.ai Practical DL', url: 'https://fast.ai', platform: 'fast.ai', free: true },
      ]},
    ]},
  ]

  // Build week list based on goal
  let allWeeks: typeof dsaWeeks = []
  if (isWebDev) {
    allWeeks = [...webWeeks]
    if (weeks > 4) allWeeks.push(...dsaWeeks.slice(0, Math.min(2, weeks - 4)))
  } else if (isAIML) {
    allWeeks = [...aiWeeks]
    if (weeks > 2) allWeeks.push(...dsaWeeks.slice(0, Math.min(2, weeks - 2)))
  } else {
    // Placement / Software Engineer
    const dsaCount = isBeginnerDSA ? Math.min(4, weeks) : Math.min(3, weeks)
    allWeeks = [...dsaWeeks.slice(0, dsaCount)]
    if (weeks > dsaCount) allWeeks.push(...csWeeks.slice(0, weeks - dsaCount))
  }

  // Renumber weeks sequentially and cap to requested count
  const finalWeeks = allWeeks.slice(0, weeks).map((w, i) => ({ ...w, week: i + 1 }))

  // Personalized insights
  const strengths: string[] = []
  const weaknesses: string[] = []
  if (input.projectsBuilt !== '0') strengths.push(`You've built ${input.projectsBuilt} projects — practical experience is a huge differentiator`)
  if (input.leetcodeCount === '200+') strengths.push('Strong DSA foundation with 200+ problems solved')
  if (input.hasInternship === 'Yes') strengths.push('Internship experience puts you ahead of most candidates')
  if (strengths.length === 0) strengths.push('Fresh perspective and eagerness to learn', 'No bad habits to unlearn')
  if (input.leetcodeCount === '0' || input.leetcodeCount === '1–50') weaknesses.push('DSA needs significant work before placement interviews')
  if (input.projectsBuilt === '0') weaknesses.push('No projects yet — this is the #1 thing to fix')
  if (input.hasResume === 'No') weaknesses.push('Resume not ready — should be built in parallel with learning')
  if (weaknesses.length === 0) weaknesses.push('Consistency in practice is key at your level', 'Depth of knowledge in system design needs improvement')

  const mentorChat = isBeginnerDSA
    ? `Hey there! I noticed you're just starting out with LeetCode. That's perfectly fine—everyone starts somewhere. Since your goal is **${input.goal}**, we need to build a rock-solid foundation first. \n\nI've designed this roadmap to intentionally start slow with Arrays and Strings before we touch anything complex like Dynamic Programming. Focus heavily on recognizing patterns rather than memorizing solutions. \n\nYou mentioned your biggest challenge is ${input.biggestChallenge}. My advice: stick to the curated resources I've provided. Don't jump between 10 different tutorials. Complete the tasks, write the code yourself, and you'll be interview-ready in exactly ${input.timeAvailable} months.`
    : `Hey! I see you've already completed ${input.leetcodeCount} problems and built ${input.projectsBuilt} projects. You have a massive head start towards your goal of **${input.goal}**. \n\nSince you already know the basics, I've skipped the beginner tutorials in your roadmap. We are diving straight into advanced patterns—Graphs, DP, and System Design. \n\nRegarding your challenge with ${input.biggestChallenge}, I've specifically added resources that focus on deep-dive architectural thinking rather than just syntax. Stick to the ${input.dailyHours} hours a day you committed to, and you'll easily hit your target timeline.`

  return {
    title: isPlacement ? 'SDE Interview Preparation' : isWebDev ? 'Full Stack Developer Track' : 'AI/ML Engineering Path',
    subtitle: `Customized ${weeks}-week roadmap for ${input.currentYear} student`,
    insights: {
      mentorChat,
      focusAreas: isBeginnerDSA ? ['Array & String Patterns', 'Linked Lists & Trees', 'Mock Interviews'] : ['Dynamic Programming', 'Graph Algorithms', 'System Design'],
      readinessTimeline: `${weeks} weeks at ${input.dailyHours} hours/day`
    },
    weeks: finalWeeks,
  }
}

// ─── API Route Handler ────────────────────────────────────────────────────────

function parseAIText(raw: string): GeminiRoadmapOutput {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  return JSON.parse(cleaned)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { input: WizardInput }
    const { input } = body
    if (!input) return NextResponse.json({ error: 'Missing input data' }, { status: 400 })

    const prompt = buildPrompt(input)

    // ══ STRATEGY 1: Groq — FREE, no credit card, no quota issues ══
    // Get your free key at https://console.groq.com → API Keys → Create API Key
    const groqKey = process.env.GROQ_API_KEY
    if (groqKey && groqKey.trim().length > 10) {
      try {
        console.log('[Groq] Calling Llama 3.3 70B...')
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are an expert career mentor. Return ONLY valid JSON, no markdown.' },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 8192,
          }),
        })
        if (res.ok) {
          const json = await res.json()
          const rawText: string = json?.choices?.[0]?.message?.content ?? ''
          if (rawText) {
            const parsed = parseAIText(rawText)
            console.log('[Groq] ✅ Real AI roadmap generated!')
            return NextResponse.json({ roadmap: parsed, source: 'groq', model: 'llama-3.3-70b' })
          }
        } else {
          console.warn(`[Groq] ❌ HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`)
        }
      } catch (e: any) {
        console.warn(`[Groq] ❌ ${e?.message?.slice(0, 100)}`)
      }
    } else {
      console.log('[Groq] No GROQ_API_KEY — skipping. Get free key at console.groq.com')
    }

    // ══ STRATEGY 2: Gemini (works if you have a working key) ══
    const geminiKey = process.env.GEMINI_API_KEY
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      const ai = new GoogleGenAI({ apiKey: geminiKey })
      for (const model of ['gemini-2.5-flash', 'gemini-2.0-flash']) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`[Gemini] ${model} attempt ${attempt}...`)
            const response = await ai.models.generateContent({
              model, contents: prompt,
              config: { temperature: 0.7, topP: 0.95, maxOutputTokens: 8192 },
            })
            const parsed = parseAIText(response.text ?? '')
            console.log(`[Gemini] ✅ ${model} succeeded`)
            return NextResponse.json({ roadmap: parsed, source: 'gemini', model })
          } catch (e: any) {
            const status = e?.status ?? 0
            console.warn(`[Gemini] ❌ ${model} attempt ${attempt} status=${status}`)
            if (status === 429 || status === 404 || status === 401 || status === 403) break
            if (attempt < 2) await new Promise(r => setTimeout(r, 3000))
          }
        }
      }
    }

    // ══ STRATEGY 3: Smart personalized mock (always works) ══
    console.log('[Mock] Using personalized mock fallback')
    return NextResponse.json({ roadmap: generateMockRoadmap(input), source: 'mock' })

  } catch (err: any) {
    console.error('Route error:', err)
    return NextResponse.json({ error: err.message || 'Failed to generate roadmap.' }, { status: 500 })
  }
}
