import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import UserEvent from '@/lib/models/UserEvent'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventType, eventData } = await req.json()
    if (!eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 })
    }

    await connectToDatabase()
    const newEvent = await UserEvent.create({
      userId,
      eventType,
      eventData: eventData || {},
      timestamp: new Date()
    })

    return NextResponse.json({ success: true, event: newEvent })
  } catch (error: any) {
    console.error('[UserEvent POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
