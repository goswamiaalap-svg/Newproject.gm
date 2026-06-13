import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { mockInterviewResults } from '@/lib/mock-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { targetRole } = body

    let user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'dummy@example.com', name: 'Student' },
      })
    }

    const savedInterview = await prisma.interview.create({
      data: {
        userId: user.id,
        role: targetRole || 'Software Engineer',
        score: mockInterviewResults.overallScore,
        feedback: JSON.stringify(mockInterviewResults)
      }
    })

    return NextResponse.json({
      id: savedInterview.id,
      ...mockInterviewResults
    })
  } catch (error) {
    console.error('Interview API Error:', error)
    return NextResponse.json({ error: 'Failed to process interview evaluation' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) return NextResponse.json(null)

    const latestInterview = await prisma.interview.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    if (!latestInterview) return NextResponse.json(null)

    return NextResponse.json({
      id: latestInterview.id,
      role: latestInterview.role,
      ...JSON.parse(latestInterview.feedback)
    })
  } catch (error) {
    console.error('Interview GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch interview evaluation' }, { status: 500 })
  }
}
