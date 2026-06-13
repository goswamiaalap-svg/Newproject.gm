import { NextResponse } from 'next/server'
import { mockProjectIdeas } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Instant response for MVP
    return NextResponse.json(mockProjectIdeas)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate project ideas' }, { status: 500 })
  }
}
