import { NextResponse } from 'next/server'
import { mockInterviewQuestions, mockInterviewResults } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(mockInterviewQuestions)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return NextResponse.json(mockInterviewResults)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process interview evaluation' }, { status: 500 })
  }
}
