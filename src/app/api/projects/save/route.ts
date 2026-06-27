import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import SavedProject from '@/lib/models/SavedProject'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    const savedList = await SavedProject.find({ userId }).sort({ savedAt: -1 })
    return NextResponse.json(savedList)
  } catch (error: any) {
    console.error('[Projects Save GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, title, description, tags } = await request.json()
    if (!title) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 })
    }

    await connectToDatabase()

    if (action === 'save') {
      await SavedProject.findOneAndUpdate(
        { userId, title },
        {
          userId,
          title,
          description: description || '',
          tags: tags || '',
          savedAt: new Date(),
        },
        { upsert: true, new: true }
      )
      return NextResponse.json({ success: true, message: 'Saved successfully' })
    } else if (action === 'unsave') {
      await SavedProject.deleteOne({ userId, title })
      return NextResponse.json({ success: true, message: 'Removed successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('[Projects Save POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
