import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import Opportunity from '@/lib/models/Opportunity'
import OpportunityState from '@/lib/models/OpportunityState'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const [opps, states] = await Promise.all([
      Opportunity.find({}),
      OpportunityState.find({ userId })
    ])

    return NextResponse.json({
      opportunities: opps || [],
      states: states || []
    })
  } catch (error: any) {
    console.error('[Opportunities GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { opportunityId, field, value } = await req.json()
    if (!opportunityId || !field) {
      return NextResponse.json({ error: 'opportunityId and field are required' }, { status: 400 })
    }

    if (field !== 'applied' && field !== 'reminded') {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
    }

    await connectToDatabase()

    const updateDoc: Record<string, any> = {
      userId,
      opportunityId,
      updatedAt: new Date(),
    }
    updateDoc[field] = Boolean(value)

    const state = await OpportunityState.findOneAndUpdate(
      { userId, opportunityId },
      updateDoc,
      { upsert: true, new: true }
    )

    return NextResponse.json(state)
  } catch (error: any) {
    console.error('[Opportunities POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
