import { NextResponse } from 'next/server'
import { mockDashboardStats, mockRecentActivity } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({
    userName: 'Aalap',
    resumeScore: mockDashboardStats.resumeScore,
    dsaStreak: 0,
    problemsSolved: 0,
    totalProblems: 200,
    recentInterviews: mockRecentActivity.slice(0, 3)
  })
}
