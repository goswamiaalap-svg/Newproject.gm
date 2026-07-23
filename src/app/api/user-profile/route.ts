import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import UserProfile from '@/lib/models/UserProfile'
import User from '@/lib/models/User'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const profile = await UserProfile.findOne({ userId })

    return NextResponse.json({
      hasProfile: !!profile,
      completed: profile?.onboardingCompleted || false,
      dismissed: profile?.onboardingDismissed || false,
      profile: profile || null,
    })
  } catch (error: any) {
    console.error('[UserProfile GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { year, goal, hoursPerWeek, dismissed } = await req.json()

    await connectToDatabase()

    let profile = await UserProfile.findOne({ userId })

    if (dismissed) {
      if (profile) {
        profile.onboardingDismissed = true
        await profile.save()
      } else {
        profile = await UserProfile.create({
          userId,
          onboardingDismissed: true,
          onboardingCompleted: false,
        })
      }
      return NextResponse.json({ success: true, profile })
    }

    if (profile) {
      profile.year = year || ''
      profile.goal = goal || ''
      profile.hoursPerWeek = hoursPerWeek || ''
      profile.onboardingCompleted = true
      profile.onboardingDismissed = false
      await profile.save()
    } else {
      profile = await UserProfile.create({
        userId,
        year: year || '',
        goal: goal || '',
        hoursPerWeek: hoursPerWeek || '',
        onboardingCompleted: true,
        onboardingDismissed: false,
      })
    }

    // Also sync year to standard User collection if provided
    if (year) {
      await User.updateOne({ clerkId: userId }, { year })
    }

    return NextResponse.json({ success: true, profile })
  } catch (error: any) {
    console.error('[UserProfile POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
