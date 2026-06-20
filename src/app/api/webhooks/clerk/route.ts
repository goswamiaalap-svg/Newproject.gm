// =============================================================================
// Clerk Webhook Handler — POST /api/webhooks/clerk
// 
// Triggered by Clerk when a user signs up (user.created event).
// Verifies the webhook signature using svix, then creates a matching
// User document in MongoDB containing: clerkId, name, email, createdAt.
//
// Setup: Go to Clerk Dashboard > Webhooks > Add Endpoint
//   URL: https://your-domain.com/api/webhooks/clerk
//   Events: user.created
//   Copy the signing secret into WEBHOOK_SECRET in .env
// =============================================================================

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/lib/models/User'

// Clerk webhook event shape for user.created
interface ClerkUserCreatedEvent {
  type: 'user.created'
  data: {
    id: string
    first_name: string | null
    last_name: string | null
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    primary_email_address_id: string
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('[Clerk Webhook] WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Get Svix headers for signature verification
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  // Get and verify the raw body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: ClerkUserCreatedEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserCreatedEvent
  } catch (err) {
    console.error('[Clerk Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  // Only handle user.created events
  if (evt.type !== 'user.created') {
    return NextResponse.json({ message: 'Event type not handled' }, { status: 200 })
  }

  const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data

  // Find the primary email address
  const primaryEmail = email_addresses.find(
    (e) => e.id === primary_email_address_id
  )?.email_address

  if (!primaryEmail) {
    console.error('[Clerk Webhook] No primary email found for user:', id)
    return NextResponse.json({ error: 'No primary email found' }, { status: 400 })
  }

  // Construct the full name
  const name = [first_name, last_name].filter(Boolean).join(' ') || 'LaunchPad User'

  try {
    await connectToDatabase()

    // Upsert: create if not exists, update if already synced
    await User.findOneAndUpdate(
      { clerkId: id },
      { clerkId: id, name, email: primaryEmail },
      { upsert: true, new: true, runValidators: true }
    )

    console.log(`[Clerk Webhook] User synced to MongoDB: ${id} (${primaryEmail})`)
    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('[Clerk Webhook] Failed to save user to MongoDB:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
