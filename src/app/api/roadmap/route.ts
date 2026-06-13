import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Generate a dummy roadmap and save it to Prisma
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { targetCompany, durationWeeks, skillsSelected } = body

    // 1. Get or create a dummy user
    let user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'dummy@example.com',
          name: 'Student',
        },
      })
    }

    // 2. Delete any existing roadmap for this user (for the sake of the demo MVP)
    await prisma.roadmap.deleteMany({
      where: { userId: user.id },
    })

    // 3. Create new roadmap based on the wizard settings
    const roadmap = await prisma.roadmap.create({
      data: {
        userId: user.id,
        title: `Placement Prep: ${targetCompany} (${durationWeeks} Weeks)`,
        progress: 0,
        weeks: {
          create: Array.from({ length: durationWeeks }).map((_, i) => {
            const weekNum = i + 1;
            return {
              weekNum,
              title: weekNum === 1 ? 'Foundation & Setup' : weekNum === durationWeeks ? 'Mock Interviews & Final Polish' : `Core Practice - Part ${weekNum - 1}`,
              items: {
                create: [
                  { title: `Solve 10 ${skillsSelected.includes('DSA') ? 'DSA' : 'Logic'} problems`, type: 'dsa', completed: false },
                  { title: `Review ${skillsSelected.includes('React & Frontend') ? 'React' : 'Core'} concepts`, type: 'subject', completed: false },
                  { title: weekNum % 2 === 0 ? 'Work on portfolio project' : 'Read system design chapter', type: weekNum % 2 === 0 ? 'project' : 'subject', completed: false }
                ]
              }
            }
          })
        }
      },
      include: {
        weeks: {
          include: { items: true },
          orderBy: { weekNum: 'asc' }
        }
      }
    })

    return NextResponse.json(roadmap)
  } catch (error) {
    console.error('Failed to generate roadmap', error)
    return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 })
  }
}

// Fetch the existing roadmap
export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) return NextResponse.json(null)

    const roadmap = await prisma.roadmap.findFirst({
      where: { userId: user.id },
      include: {
        weeks: {
          include: { items: true },
          orderBy: { weekNum: 'asc' }
        }
      }
    })

    return NextResponse.json(roadmap)
  } catch (error) {
    console.error('Failed to fetch roadmap', error)
    return NextResponse.json({ error: 'Failed to fetch roadmap' }, { status: 500 })
  }
}
