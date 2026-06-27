import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import Teammate from '@/lib/models/Teammate'
import Hackathon from '@/lib/models/Hackathon'
import TeamInvitation from '@/lib/models/TeamInvitation'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const [teammates, hackathons, invites] = await Promise.all([
      Teammate.find({}),
      Hackathon.find({}),
      TeamInvitation.find({ userId })
    ])

    return NextResponse.json({
      teammates: teammates || [],
      hackathons: hackathons || [],
      invitations: invites || []
    })
  } catch (error: any) {
    console.error('[Teams GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { teammateId, action } = await req.json()
    if (!teammateId || !action) {
      return NextResponse.json({ error: 'teammateId and action are required' }, { status: 400 })
    }

    await connectToDatabase()

    if (action === 'invite') {
      await TeamInvitation.findOneAndUpdate(
        { userId, teammateId },
        { userId, teammateId, createdAt: new Date() },
        { upsert: true, new: true }
      )
      return NextResponse.json({ success: true, message: 'Invitation sent' })
    } else if (action === 'cancel') {
      await TeamInvitation.deleteOne({ userId, teammateId })
      return NextResponse.json({ success: true, message: 'Invitation cancelled' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[Teams POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
