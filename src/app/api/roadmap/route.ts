import { NextResponse } from 'next/server'
import { mockRoadmapWeeks } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return NextResponse.json(mockRoadmapWeeks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 })
  }
}
