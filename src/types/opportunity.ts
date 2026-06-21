export type OpportunityType = 'internship' | 'hackathon' | 'open-source' | 'fellowship'

export interface Opportunity {
  id: string
  title: string
  company: string
  type: OpportunityType
  description: string
  deadline: string
  applyUrl: string
  applied: boolean
  reminderEnabled: boolean
}
