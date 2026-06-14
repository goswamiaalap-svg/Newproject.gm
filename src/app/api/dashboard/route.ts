import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    let user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'dummy@example.com', name: 'Aalap' },
      })
    }

    // Get latest resume score
    const latestResume = await prisma.resumeAnalysis.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    const resumeScore = latestResume?.score || 0

    // Get DSA problems solved (completed RoadmapItems of type DSA)
    // We'll approximate this by just counting all completed roadmap items for now,
    // or specifically ones inside the user's roadmap
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: user.id },
      include: {
        weeks: {
          include: { items: true }
        }
      }
    })

    let problemsSolved = 0
    let totalProblems = 0
    let dsaStreak = 0 // In a real app this would be calculated from submission timestamps

    roadmaps.forEach(roadmap => {
      roadmap.weeks.forEach(week => {
        week.items.forEach(item => {
          if (item.type === 'DSA') {
            totalProblems++
            if (item.completed) problemsSolved++
          }
        })
      })
    })

    if (totalProblems === 0) {
      totalProblems = 200 // Default target for new users
    }

    // Get recent activity (mix of interviews and resumes)
    const recentInterviews = await prisma.interview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
    
    return NextResponse.json({
      userName: user.name,
      resumeScore,
      dsaStreak,
      problemsSolved,
      totalProblems,
      recentInterviews
    })

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
