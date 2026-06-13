import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { title, description, tags, action } = await request.json()

    let user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'dummy@example.com', name: 'Student' },
      })
    }

    if (action === 'save') {
      const saved = await prisma.project.create({
        data: {
          userId: user.id,
          title,
          description,
          tags,
        }
      })
      return NextResponse.json(saved)
    } else if (action === 'unsave') {
      // Find and delete the project with this title for this user
      const project = await prisma.project.findFirst({
        where: { userId: user.id, title }
      })
      if (project) {
        await prisma.project.delete({ where: { id: project.id } })
      }
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Projects API Error:', error)
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { email: 'dummy@example.com' } })
    if (!user) return NextResponse.json([])

    const savedProjects = await prisma.project.findMany({
      where: { userId: user.id }
    })

    return NextResponse.json(savedProjects)
  } catch (error) {
    console.error('Projects GET Error:', error)
    return NextResponse.json({ error: 'Failed to fetch saved projects' }, { status: 500 })
  }
}
