import type { Opportunity, OpportunityType } from '@/types/opportunity'

type OpportunityListResponse = {
  opportunities: Opportunity[]
}

type ActionResponse = {
  success: boolean
  message: string
}

async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Request failed'
    throw new Error(message)
  }

  return payload as T
}

export async function getOpportunities(search?: string, type?: OpportunityType | 'all'): Promise<Opportunity[]> {
  const params = new URLSearchParams()

  if (search) {
    params.set('search', search)
  }

  if (type && type !== 'all') {
    params.set('type', type)
  }

  const query = params.toString()
  const url = query ? `/api/opportunities?${query}` : '/api/opportunities'
  const data = await requestJson<OpportunityListResponse>(url)
  return data.opportunities
}

export async function searchOpportunities(search: string): Promise<Opportunity[]> {
  return getOpportunities(search)
}

export async function filterOpportunities(type: OpportunityType): Promise<Opportunity[]> {
  return getOpportunities(undefined, type)
}

export async function applyToOpportunity(opportunityId: string): Promise<ActionResponse> {
  return requestJson<ActionResponse>('/api/opportunities/apply', {
    method: 'POST',
    body: JSON.stringify({ opportunityId }),
  })
}

export async function toggleReminder(opportunityId: string): Promise<ActionResponse> {
  return requestJson<ActionResponse>('/api/opportunities/reminder', {
    method: 'POST',
    body: JSON.stringify({ opportunityId }),
  })
}