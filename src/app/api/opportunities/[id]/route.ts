import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import Opportunity from '@/lib/models/Opportunity'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const opp = await Opportunity.findOne({ id: params.id })
    if (!opp) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
    }

    return NextResponse.json(opp)
  } catch (error: any) {
    console.error('[Opportunity GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    await connectToDatabase()

    // Map deadline to Date object if provided in body
    const updateData = { ...body }
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline)
    }

    const updatedOpp = await Opportunity.findOneAndUpdate(
      { id: params.id },
      { $set: updateData },
      { new: true }
    )

    if (!updatedOpp) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
    }

    return NextResponse.json(updatedOpp)
  } catch (error: any) {
    console.error('[Opportunity PUT] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const result = await Opportunity.deleteOne({ id: params.id })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Opportunity deleted successfully' })
  } catch (error: any) {
    console.error('[Opportunity DELETE] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
