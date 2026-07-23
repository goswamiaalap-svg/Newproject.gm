import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/lib/models/User'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()
    let user = await User.findOne({ clerkId: userId })
    
    if (!user) {
      // Create user document on the fly using Clerk data if webhook didn't fire yet
      const { currentUser } = await import('@clerk/nextjs/server')
      const clerkUser = await currentUser()
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || ''
        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'LaunchPad User'
        user = await User.create({
          clerkId: userId,
          name,
          email,
          year: '',
          collegeName: '',
        })
      } else {
        return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 })
      }
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      year: (user as any).year || '',
      collegeName: (user as any).collegeName || '',
    })
  } catch (error: any) {
    console.error('[User Profile GET] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, year, collegeName } = await req.json()

    await connectToDatabase()
    
    // Update user document (or upsert if missing)
    let user = await User.findOne({ clerkId: userId })
    if (!user) {
      const { currentUser } = await import('@clerk/nextjs/server')
      const clerkUser = await currentUser()
      const email = clerkUser?.emailAddresses[0]?.emailAddress || ''
      user = await User.create({
        clerkId: userId,
        name: name || [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') || 'LaunchPad User',
        email,
        year: year || '',
        collegeName: collegeName || '',
      })
    } else {
      user.name = name || user.name
      user.year = year || ''
      user.collegeName = collegeName || ''
      await user.save()
    }

    return NextResponse.json({
      name: user.name,
      email: user.email,
      year: (user as any).year || '',
      collegeName: (user as any).collegeName || '',
    })
  } catch (error: any) {
    console.error('[User Profile POST] Error:', error)
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
  }
}
