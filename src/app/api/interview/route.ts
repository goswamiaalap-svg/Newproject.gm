import { NextResponse } from 'next/server'
import { mockInterviewResults } from '@/lib/mock-data'

export async function POST() {
  return NextResponse.json(mockInterviewResults)
}

export async function GET() {
  return NextResponse.json([mockInterviewResults])
}
