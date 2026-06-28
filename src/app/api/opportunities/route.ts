import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import Opportunity from '@/lib/models/Opportunity'
import OpportunityState from '@/lib/models/OpportunityState'
import crypto from 'crypto'

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

    const body = await req.json()

    // If it's a state toggle/update request
    if (body.opportunityId && body.field) {
      const { opportunityId, field, value } = body
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
    }

    // Otherwise, it is a request to create a new opportunity
    const { title, type, company, deadline, logo, applyUrl, id } = body
    if (!title || !type || !company || !deadline || !logo || !applyUrl) {
      return NextResponse.json(
        { error: 'title, type, company, deadline, logo, and applyUrl are required to create an opportunity' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const oppId = id || crypto.randomUUID()

    const newOpp = await Opportunity.create({
      id: oppId,
      title,
      type,
      company,
      deadline: new Date(deadline),
      logo,
      applyUrl,
    })

    return NextResponse.json(newOpp, { status: 201 })
  } catch (error: any) {
    console.error('[Opportunities POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
