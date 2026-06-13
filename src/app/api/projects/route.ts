import { NextResponse } from 'next/server'
import { mockProjectIdeas } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Simulated delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return NextResponse.json(mockProjectIdeas)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate project ideas' }, { status: 500 })
  }
}
