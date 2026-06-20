import { NextResponse } from 'next/server'
import { mockOpportunities } from '@/lib/mock-data'
import type { Opportunity, OpportunityType } from '@/types/opportunity'

function toOpportunity(item: (typeof mockOpportunities)[number]): Opportunity {
  return {
    id: item.id,
    title: item.title,
    company: item.company,
    type: item.type,
    description: item.description || `${item.company} opportunity for motivated candidates.`,
    deadline: item.deadline instanceof Date ? item.deadline.toISOString() : new Date(item.deadline).toISOString(),
    applyUrl: item.applyUrl || `https://www.${item.company.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com/careers`,
    applied: item.applied,
    reminderEnabled: item.reminderEnabled ?? item.reminded ?? false,
  }
}

const allowedTypes: OpportunityType[] = ['internship', 'hackathon', 'open-source', 'fellowship']

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim().toLowerCase() || ''
  const type = searchParams.get('type') as OpportunityType | null

  const opportunities = mockOpportunities
    .map(toOpportunity)
    .filter((opportunity) => {
      const matchesSearch =
        search.length === 0 ||
        opportunity.title.toLowerCase().includes(search) ||
        opportunity.company.toLowerCase().includes(search)

      const matchesType = !type || !allowedTypes.includes(type) || opportunity.type === type

      return matchesSearch && matchesType
    })

  return NextResponse.json({ opportunities })
}