import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import DsaProgress from '@/lib/models/DsaProgress'
import DsaTopic from '@/lib/models/DsaTopic'
import DsaProblem from '@/lib/models/DsaProblem'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const [topics, problems, progress] = await Promise.all([
      DsaTopic.find({}).sort({ id: 1 }),
      DsaProblem.find({}),
      DsaProgress.findOne({ userId })
    ])

    return NextResponse.json({
      solvedProblems: progress?.solvedProblems || [],
      streak: progress?.streak || 0,
      topics: topics || [],
      problems: problems || []
    })
  } catch (error: any) {
    console.error('[DSA GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { solvedProblems, streak } = await req.json()

    await connectToDatabase()
    const progress = await DsaProgress.findOneAndUpdate(
      { userId },
      {
        solvedProblems: solvedProblems || [],
        streak: typeof streak === 'number' ? streak : 0,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    )

    return NextResponse.json(progress)
  } catch (error: any) {
    console.error('[DSA POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
