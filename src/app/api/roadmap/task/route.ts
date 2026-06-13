import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { taskId, completed } = await request.json()

    const updatedTask = await prisma.roadmapItem.update({
      where: { id: taskId },
      data: { completed },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Failed to update task', error)
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}
