import { NextResponse } from 'next/server'
import { mockResumeAnalysis } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return NextResponse.json(mockResumeAnalysis)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }
}
