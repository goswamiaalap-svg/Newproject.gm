import { NextResponse } from 'next/server'
import { mockRoadmapWeeks } from '@/lib/mock-data'

const roadmapResponse = {
  id: 'roadmap-1',
  title: 'Placement Preparation Roadmap',
  progress: 25,
  weeks: mockRoadmapWeeks.map((week) => ({
    id: `week-${week.week}`,
    weekNum: week.week,
    title: week.title,
    items: week.tasks.map((task) => ({
      id: task.id,
      title: task.task,
      type: task.type,
      completed: task.completed,
    })),
  })),
}

export async function GET() {
  return NextResponse.json(roadmapResponse)
}

export async function POST() {
  return NextResponse.json(roadmapResponse)
}