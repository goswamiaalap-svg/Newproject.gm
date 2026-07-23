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
      Opportunity.find({ $or: [{ userId: { $exists: false } }, { userId }] }),
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

    // 1. Check if we are creating a new custom opportunity
    if (body.title && body.company) {
      const { title, company, type, deadline, applyUrl, logo, notes } = body

      if (!type || !deadline) {
        return NextResponse.json({ error: 'title, company, type, and deadline are required' }, { status: 400 })
      }

      await connectToDatabase()

      // Generate a unique ID for the custom opportunity
      const oppId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      
      const newOpp = await Opportunity.create({
        id: oppId,
        title,
        company,
        type,
        deadline: new Date(deadline),
        logo: logo || '💼',
        applyUrl: applyUrl || '',
        userId,
      })

      let initialState = null
      if (notes) {
        initialState = await OpportunityState.create({
          userId,
          opportunityId: oppId,
          notes,
          applied: false,
          reminded: false,
        })
      }

      return NextResponse.json({
        opportunity: newOpp,
        state: initialState,
      }, { status: 201 })
    }

    // 2. Otherwise, update state (applied, reminded, or notes)
    const { opportunityId, field, value } = body
    if (!opportunityId || !field) {
      return NextResponse.json({ error: 'opportunityId and field are required' }, { status: 400 })
    }

    if (field !== 'applied' && field !== 'reminded' && field !== 'notes') {
      return NextResponse.json({ error: 'Invalid field' }, { status: 400 })
    }

    await connectToDatabase()

    const updateDoc: Record<string, any> = {
      userId,
      opportunityId,
      updatedAt: new Date(),
    }
    
    if (field === 'notes') {
      updateDoc[field] = String(value)
    } else {
      updateDoc[field] = Boolean(value)
    }

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
