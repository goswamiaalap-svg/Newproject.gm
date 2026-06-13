import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { mockResumeAnalysis } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fileName } = body

    // 1. Get or create dummy user
    let user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'dummy@example.com', name: 'Student' },
      })
    }

    // 2. Save the "AI" parsed resume result to the Database
    const analysisResult = await prisma.resumeAnalysis.create({
      data: {
        userId: user.id,
        score: mockResumeAnalysis.overallScore,
        breakdown: JSON.stringify(mockResumeAnalysis.breakdown),
        feedback: JSON.stringify(mockResumeAnalysis.feedback),
      }
    })

    // Return the database saved object along with parsed JSON for the frontend
    return NextResponse.json({
      id: analysisResult.id,
      overallScore: analysisResult.score,
      breakdown: JSON.parse(analysisResult.breakdown),
      feedback: JSON.parse(analysisResult.feedback)
    })
  } catch (error) {
    console.error('Resume API Error:', error)
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) return NextResponse.json(null)

    // Fetch the most recent resume analysis
    const analysis = await prisma.resumeAnalysis.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!analysis) return NextResponse.json(null)

    return NextResponse.json({
      id: analysis.id,
      overallScore: analysis.score,
      breakdown: JSON.parse(analysis.breakdown),
      feedback: JSON.parse(analysis.feedback)
    })
  } catch (error) {
    console.error('Resume GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}
