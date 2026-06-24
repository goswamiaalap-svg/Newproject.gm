import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import CareerTarget from '@/lib/models/CareerTarget'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { taskId, completed } = await req.json()
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
    }

    await connectToDatabase()

    const target = await CareerTarget.findOne({ userId, isActive: true })
    if (!target || !target.roadmap) {
      return NextResponse.json({ error: 'Active target or roadmap not found' }, { status: 404 })
    }

    // Traverse weeks and update task status
    let taskFound = false
    target.roadmap = target.roadmap.map((week) => {
      const updatedItems = week.items.map((item) => {
        if (item.id === taskId) {
          item.completed = completed
          taskFound = true
        }
        return item
      })
      week.items = updatedItems
      return week
    })

    if (!taskFound) {
      return NextResponse.json({ error: 'Task not found in roadmap' }, { status: 404 })
    }

    // Mark Mongoose mixed array as modified
    target.markModified('roadmap')
    await target.save()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Roadmap Task POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
