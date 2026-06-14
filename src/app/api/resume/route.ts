import { NextResponse } from 'next/server'
import { mockResumeAnalysis } from '@/lib/mock-data'

export async function POST(request: Request) {
  return NextResponse.json({
    id: 'mock-1',
    overallScore: mockResumeAnalysis.overallScore,
    breakdown: mockResumeAnalysis.breakdown,
    feedback: mockResumeAnalysis.feedback
  })
}

export async function GET() {
  return NextResponse.json({
    id: 'mock-1',
    overallScore: mockResumeAnalysis.overallScore,
    breakdown: mockResumeAnalysis.breakdown,
    feedback: mockResumeAnalysis.feedback
  })
}
