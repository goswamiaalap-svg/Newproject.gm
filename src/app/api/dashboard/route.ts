import { NextResponse } from 'next/server'
import { mockDashboardStats, mockRecentActivity } from '@/lib/mock-data'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const user = await currentUser()
  const name = user ? (user.firstName || user.fullName || 'Student') : 'Student'

  return NextResponse.json({
    userName: name,
    resumeScore: mockDashboardStats.resumeScore,
    dsaStreak: 0,
    problemsSolved: 0,
    totalProblems: 200,
    recentInterviews: mockRecentActivity.slice(0, 3)
  })
}
