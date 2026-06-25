// ─── Core Domain Types ────────────────────────────────────────────────────────

export type NodeStatus = 'done' | 'in-progress' | 'pending'
export type NodeKind = 'root' | 'section' | 'topic' | 'subtopic'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Resource {
  type: 'video' | 'article' | 'practice' | 'course' | 'docs'
  title: string
  url: string
  platform?: string
  duration?: string
  free: boolean
}

export interface RoadmapNodeData {
  id: string
  label: string
  kind: NodeKind
  description?: string
  difficulty?: Difficulty
  estimatedHours?: number
  status: NodeStatus
  resources?: Resource[]
  children?: string[]
  section?: string
}

// ─── Gemini JSON Schema ────────────────────────────────────────────────────────
// The exact structure we ask Gemini to return

export interface GeminiTask {
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedHours: number
  topics: string[]
  resources: {
    type: 'video' | 'article' | 'practice' | 'course' | 'docs'
    title: string
    url: string
    platform: string
    free: boolean
  }[]
}

export interface GeminiWeek {
  week: number
  title: string
  theme: string
  tasks: GeminiTask[]
}

export interface GeminiInsights {
  mentorChat: string
  focusAreas: string[]
  readinessTimeline: string
}

export interface GeminiRoadmapOutput {
  title: string
  subtitle: string
  insights: GeminiInsights
  weeks: GeminiWeek[]
}

// ─── Transformed Roadmap ──────────────────────────────────────────────────────

export interface RoadmapConfig {
  id: string
  title: string
  subtitle: string
  goal: string
  currentLevel: string
  totalWeeks: number
  dailyHours: number
  generatedAt: string
  nodes: RoadmapNodeData[]
  edges: RoadmapEdgeDef[]
  readinessPct: number
  focusAreas: string[]
  insights: GeminiInsights
}

export interface RoadmapEdgeDef {
  id: string
  source: string
  target: string
  animated?: boolean
}

// ─── Enhanced Wizard Input ────────────────────────────────────────────────────

export interface WizardInput {
  // Step 1 – Academic Profile
  currentYear: string
  branch: string
  cgpa: string

  // Step 2 – Career Goal
  goal: string

  // Step 3 – Progress
  leetcodeCount: string
  projectsBuilt: string
  hasInternship: string
  hasResume: string

  // Step 4 – Time
  dailyHours: number
  timeAvailable: number // months

  // Step 5 – Learning Preference
  learningStyle: string

  // Step 6 – Biggest Challenge
  biggestChallenge: string

  // Step 7 – Free Text
  currentSituation: string
  careerAspirations: string
  currentChallenges: string
  additionalNotes: string
}
