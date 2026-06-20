import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))

    if (!body?.opportunityId || typeof body.opportunityId !== 'string') {
      return NextResponse.json({ success: false, message: 'opportunityId is required' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Reminder updated successfully',
      opportunityId: body.opportunityId,
    })
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to update reminder' }, { status: 500 })
  }
}