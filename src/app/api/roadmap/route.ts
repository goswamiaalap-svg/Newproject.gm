import { NextResponse } from 'next/server'
import { mockRoadmapWeeks } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(mockRoadmapWeeks)
}

export async function POST() {
  return NextResponse.json({ success: true, weeks: mockRoadmapWeeks })
}
