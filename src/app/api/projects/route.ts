import { NextResponse } from 'next/server'
import { mockProjectIdeas } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(mockProjectIdeas)
}
