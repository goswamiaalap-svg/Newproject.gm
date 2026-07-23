import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import WeeklyCheckin from '@/lib/models/WeeklyCheckin'

export const dynamic = 'force-dynamic'

// Helper to get the start of the current calendar week (Sunday 00:00:00)
function getStartOfCurrentWeek(): Date {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 1 = Monday, etc.
  const diff = now.getDate() - day
  const start = new Date(now.setDate(diff))
  start.setHours(0, 0, 0, 0)
  return start
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const startOfWeek = getStartOfCurrentWeek()

    // Find any check-in (completed or dismissed) in the current calendar week
    const latestCheckinThisWeek = await WeeklyCheckin.findOne({
      userId,
      timestamp: { $gte: startOfWeek }
    })

    return NextResponse.json({
      shouldShow: !latestCheckinThisWeek,
      lastCheckin: latestCheckinThisWeek
    })
  } catch (error: any) {
    console.error('[WeeklyCheckin GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { hitGoal, obstacle, dismissed } = await req.json()

    await connectToDatabase()

    const newCheckin = await WeeklyCheckin.create({
      userId,
      hitGoal: dismissed ? 'Dismissed' : (hitGoal || ''),
      obstacle: obstacle || '',
      dismissed: !!dismissed,
      timestamp: new Date()
    })

    return NextResponse.json({ success: true, checkin: newCheckin })
  } catch (error: any) {
    console.error('[WeeklyCheckin POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
