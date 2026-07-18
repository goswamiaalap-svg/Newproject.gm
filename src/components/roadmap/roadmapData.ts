// ─── Types ────────────────────────────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'
export type DifficultyBadge = 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert'

export interface Resource {
  type: 'video' | 'article' | 'practice' | 'course'
  title: string
  url: string
  duration?: string
  platform?: string
}

export interface SubTopic {
  id: string
  title: string
  estimatedHours: number
  resources: Resource[]
}

export interface RoadmapTask {
  id: string
  title: string
  type: 'dsa' | 'subject' | 'project' | 'system-design' | 'behavioral'
  difficulty: DifficultyBadge
  estimatedHours: number
  completed: boolean
  subtopics: SubTopic[]
  resources: Resource[]
}

export interface RoadmapWeek {
  id: string
  weekNum: number
  title: string
  theme: string
  tasks: RoadmapTask[]
  milestoneTitle: string
}

export interface GeneratedRoadmap {
  id: string
  title: string
  targetCompany: string
  skillLevel: SkillLevel
  totalWeeks: number
  dailyHours: number
  weeks: RoadmapWeek[]
  createdAt: string
}

export interface WizardFormData {
  targetCompany: string
  skillLevel: SkillLevel
  durationWeeks: number
  dailyHours: number
  goals: string[]
}

export interface ProgressStats {
  completedTasks: number
  totalTasks: number
  completionPct: number
  currentStreak: number
  totalStudyHours: number
  weeklyGoalHours: number
  weeklyStudiedHours: number
}

export interface CompanyReadiness {
  company: string
  logo: string
  readinessPct: number
  color: string
  skillGaps: string[]
}

export interface SmartInsight {
  strongestSkills: string[]
  weakestSkills: string[]
  recommendations: string[]
  focusAreas: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  locked: boolean
  color: string
}

// ─── Static Data ──────────────────────────────────────────────────────────────

export const COMPANIES = [
  { id: 'google', name: 'Google', logo: '🔵', tier: 'FAANG', color: '#4285F4' },
  { id: 'amazon', name: 'Amazon', logo: '🟠', tier: 'FAANG', color: '#FF9900' },
  { id: 'microsoft', name: 'Microsoft', logo: '🟦', tier: 'FAANG', color: '#00A4EF' },
  { id: 'meta', name: 'Meta', logo: '🔷', tier: 'FAANG', color: '#0866FF' },
  { id: 'apple', name: 'Apple', logo: '⚫', tier: 'FAANG', color: '#555555' },
  { id: 'flipkart', name: 'Flipkart', logo: '🟡', tier: 'Tier-1', color: '#F9A825' },
  { id: 'razorpay', name: 'Razorpay', logo: '🔵', tier: 'Tier-1', color: '#2D85E8' },
  { id: 'swiggy', name: 'Swiggy', logo: '🟠', tier: 'Tier-1', color: '#FC8019' },
  { id: 'zepto', name: 'Zepto', logo: '🟣', tier: 'Tier-1', color: '#8B5CF6' },
  { id: 'tcs', name: 'TCS', logo: '🔷', tier: 'Service', color: '#0072C6' },
  { id: 'infosys', name: 'Infosys', logo: '🟦', tier: 'Service', color: '#007CC3' },
  { id: 'startup', name: 'Startup', logo: '🚀', tier: 'Startup', color: '#10B981' },
]

export const SKILL_LEVELS: { id: SkillLevel; label: string; description: string }[] = [
  { id: 'beginner', label: 'Beginner', description: 'Just getting started with coding concepts' },
  { id: 'intermediate', label: 'Intermediate', description: 'Comfortable with basics, building projects' },
  { id: 'advanced', label: 'Advanced', description: 'Strong foundation, ready for complex problems' },
]

export const DURATION_OPTIONS = [
  { weeks: 4, label: '4 Weeks', description: 'Crash course / Last-minute prep', icon: '⚡' },
  { weeks: 8, label: '8 Weeks', description: 'Balanced and comprehensive prep', icon: '🎯' },
  { weeks: 12, label: '12 Weeks', description: 'Deep-dive with strong foundation', icon: '🏆' },
]

export const GOAL_OPTIONS = [
  'Land a FAANG internship',
  'Get a full-time offer',
  'Clear DSA rounds',
  'Improve System Design',
  'Build portfolio projects',
  'Ace behavioral interviews',
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-task', title: 'First Step', description: 'Complete your first task', icon: '🌱', locked: false, color: '#10B981', unlockedAt: 'Today' },
  { id: 'week-1', title: 'Week Warrior', description: 'Finish Week 1 milestones', icon: '⚔️', locked: false, color: '#6366F1', unlockedAt: 'Day 7' },
  { id: '3-day-streak', title: 'On Fire', description: '3-day study streak', icon: '🔥', locked: false, color: '#F59E0B', unlockedAt: 'Day 3' },
  { id: '7-day-streak', title: 'Unstoppable', description: '7-day study streak', icon: '⚡', locked: true, color: '#F97316' },
  { id: '50-pct', title: 'Halfway There', description: 'Reach 50% completion', icon: '🎯', locked: true, color: '#0D9488' },
  { id: 'complete', title: 'LaunchPad Pro', description: 'Complete entire roadmap', icon: '🚀', locked: true, color: '#8B5CF6' },
]

// ─── Mock Roadmap Generator ────────────────────────────────────────────────────

const DSA_TASKS: RoadmapTask[] = [
  {
    id: 'arrays-strings',
    title: 'Arrays & Strings Mastery',
    type: 'dsa',
    difficulty: 'Foundational',
    estimatedHours: 6,
    completed: false,
    subtopics: [
      { id: 'two-pointer', title: 'Two Pointer Technique', estimatedHours: 1.5, resources: [
        { type: 'video', title: 'Two Pointers - NeetCode', url: '#', platform: 'YouTube', duration: '15min' },
        { type: 'practice', title: 'LeetCode Two Sum', url: '#', platform: 'LeetCode' },
      ]},
      { id: 'sliding-window', title: 'Sliding Window', estimatedHours: 2, resources: [
        { type: 'article', title: 'Sliding Window Pattern Guide', url: '#', platform: 'Medium' },
      ]},
      { id: 'prefix-sum', title: 'Prefix Sum & Difference Array', estimatedHours: 1.5, resources: [] },
    ],
    resources: [
      { type: 'course', title: 'Striver A-Z DSA Sheet', url: '#', platform: 'TakeUForward' },
      { type: 'video', title: 'Arrays Complete Playlist', url: '#', platform: 'YouTube', duration: '3h' },
    ],
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists Deep Dive',
    type: 'dsa',
    difficulty: 'Intermediate',
    estimatedHours: 5,
    completed: false,
    subtopics: [
      { id: 'sll', title: 'Singly & Doubly Linked List', estimatedHours: 2, resources: [] },
      { id: 'fast-slow', title: 'Fast & Slow Pointer Pattern', estimatedHours: 1.5, resources: [] },
      { id: 'reversal', title: 'Reversal & Merge Techniques', estimatedHours: 1.5, resources: [] },
    ],
    resources: [
      { type: 'practice', title: 'LeetCode Linked List Tag', url: '#', platform: 'LeetCode' },
    ],
  },
  {
    id: 'trees-graphs',
    title: 'Trees & Graphs',
    type: 'dsa',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    completed: false,
    subtopics: [
      { id: 'bst', title: 'Binary Search Trees', estimatedHours: 2.5, resources: [] },
      { id: 'traversals', title: 'BFS / DFS Traversals', estimatedHours: 2, resources: [] },
      { id: 'graph-algo', title: 'Dijkstra, Prim, Kruskal', estimatedHours: 3.5, resources: [] },
    ],
    resources: [
      { type: 'video', title: 'Graph Theory - William Fiset', url: '#', platform: 'YouTube', duration: '7h' },
    ],
  },
  {
    id: 'dp',
    title: 'Dynamic Programming Patterns',
    type: 'dsa',
    difficulty: 'Advanced',
    estimatedHours: 10,
    completed: false,
    subtopics: [
      { id: 'memoization', title: 'Memoization & Tabulation', estimatedHours: 3, resources: [] },
      { id: 'knapsack', title: 'Knapsack Variants', estimatedHours: 3, resources: [] },
      { id: 'interval', title: 'Interval & String DP', estimatedHours: 4, resources: [] },
    ],
    resources: [
      { type: 'video', title: 'DP - Aditya Verma Playlist', url: '#', platform: 'YouTube', duration: '12h' },
    ],
  },
]

const SUBJECT_TASKS: RoadmapTask[] = [
  {
    id: 'os',
    title: 'Operating Systems Fundamentals',
    type: 'subject',
    difficulty: 'Foundational',
    estimatedHours: 4,
    completed: false,
    subtopics: [
      { id: 'process', title: 'Processes & Threads', estimatedHours: 1.5, resources: [] },
      { id: 'scheduling', title: 'CPU Scheduling Algorithms', estimatedHours: 1.5, resources: [] },
      { id: 'deadlock', title: 'Deadlocks & Memory Management', estimatedHours: 1, resources: [] },
    ],
    resources: [
      { type: 'article', title: 'OS Interview Cheatsheet', url: '#', platform: 'GeeksForGeeks' },
    ],
  },
  {
    id: 'dbms',
    title: 'DBMS & SQL Mastery',
    type: 'subject',
    difficulty: 'Intermediate',
    estimatedHours: 5,
    completed: false,
    subtopics: [
      { id: 'sql', title: 'Advanced SQL Queries', estimatedHours: 2, resources: [] },
      { id: 'normalization', title: 'Normalization & ACID', estimatedHours: 1.5, resources: [] },
      { id: 'indexing', title: 'Indexing & Query Optimization', estimatedHours: 1.5, resources: [] },
    ],
    resources: [],
  },
]

const SYSTEM_DESIGN_TASKS: RoadmapTask[] = [
  {
    id: 'sd-basics',
    title: 'System Design Fundamentals',
    type: 'system-design',
    difficulty: 'Advanced',
    estimatedHours: 8,
    completed: false,
    subtopics: [
      { id: 'scalability', title: 'Scalability & Load Balancing', estimatedHours: 2, resources: [] },
      { id: 'caching', title: 'Caching Strategies (Redis)', estimatedHours: 2, resources: [] },
      { id: 'databases', title: 'SQL vs NoSQL Decisions', estimatedHours: 2, resources: [] },
      { id: 'url-shortener', title: 'Case Study: URL Shortener', estimatedHours: 2, resources: [] },
    ],
    resources: [
      { type: 'course', title: 'System Design Primer', url: '#', platform: 'GitHub' },
    ],
  },
]

const PROJECT_TASKS: RoadmapTask[] = [
  {
    id: 'portfolio-project',
    title: 'Build a Portfolio-Grade Project',
    type: 'project',
    difficulty: 'Advanced',
    estimatedHours: 12,
    completed: false,
    subtopics: [
      { id: 'design', title: 'Architecture & Database Design', estimatedHours: 3, resources: [] },
      { id: 'backend', title: 'REST API Development', estimatedHours: 4, resources: [] },
      { id: 'frontend', title: 'Frontend Implementation', estimatedHours: 4, resources: [] },
      { id: 'deploy', title: 'Deploy to Production', estimatedHours: 1, resources: [] },
    ],
    resources: [],
  },
]

const BEHAVIORAL_TASKS: RoadmapTask[] = [
  {
    id: 'star-method',
    title: 'STAR Method Behavioral Prep',
    type: 'behavioral',
    difficulty: 'Foundational',
    estimatedHours: 3,
    completed: false,
    subtopics: [
      { id: 'story-bank', title: 'Build Your Story Bank', estimatedHours: 1.5, resources: [] },
      { id: 'leadership', title: 'Leadership & Conflict Stories', estimatedHours: 1.5, resources: [] },
    ],
    resources: [],
  },
]

export function generateMockRoadmap(form: WizardFormData): GeneratedRoadmap {
  const { targetCompany, skillLevel, durationWeeks, dailyHours } = form
  const company = COMPANIES.find(c => c.id === targetCompany) || COMPANIES[0]

  const isFAANG = company.tier === 'FAANG'
  const isAdvanced = skillLevel === 'advanced'

  const weeks: RoadmapWeek[] = []

  if (durationWeeks >= 4) {
    weeks.push({
      id: 'week-1',
      weekNum: 1,
      title: 'Foundation & Core DSA',
      theme: 'Build your algorithmic intuition',
      milestoneTitle: '✅ Complete 20 LeetCode Easy/Medium',
      tasks: [DSA_TASKS[0], SUBJECT_TASKS[0]],
    })
    weeks.push({
      id: 'week-2',
      weekNum: 2,
      title: 'Linked Lists, Trees & DBMS',
      theme: 'Master pointer-based data structures',
      milestoneTitle: '✅ Solve all classic linked list problems',
      tasks: [DSA_TASKS[1], SUBJECT_TASKS[1]],
    })
    weeks.push({
      id: 'week-3',
      weekNum: 3,
      title: 'Graphs & Advanced DSA',
      theme: 'Graph algorithms unlock harder problems',
      milestoneTitle: '✅ Solve 10 graph problems on LeetCode',
      tasks: [DSA_TASKS[2]],
    })
    weeks.push({
      id: 'week-4',
      weekNum: 4,
      title: 'Mock Interviews & Portfolio Polish',
      theme: 'Simulate real interview conditions',
      milestoneTitle: '✅ Complete 3 mock interviews',
      tasks: [BEHAVIORAL_TASKS[0], PROJECT_TASKS[0]],
    })
  }

  if (durationWeeks >= 8) {
    weeks.push({
      id: 'week-5',
      weekNum: 5,
      title: 'Dynamic Programming Patterns',
      theme: 'DP is the key differentiator at FAANG',
      milestoneTitle: '✅ Solve all DP patterns from Striver sheet',
      tasks: [DSA_TASKS[3]],
    })
    weeks.push({
      id: 'week-6',
      weekNum: 6,
      title: isFAANG ? 'System Design Fundamentals' : 'Project Building Phase',
      theme: isFAANG ? 'Design systems at scale' : 'Ship a real product',
      milestoneTitle: isFAANG ? '✅ Design Twitter / Instagram at scale' : '✅ Deploy project to production',
      tasks: isFAANG ? [SYSTEM_DESIGN_TASKS[0]] : [PROJECT_TASKS[0]],
    })
    weeks.push({
      id: 'week-7',
      weekNum: 7,
      title: 'Advanced Patterns & Edge Cases',
      theme: 'Focus on problem-solving speed',
      milestoneTitle: '✅ Attempt 2 timed mock assessments',
      tasks: [DSA_TASKS[0], DSA_TASKS[2]],
    })
    weeks.push({
      id: 'week-8',
      weekNum: 8,
      title: 'Final Sprint & Interview Simulation',
      theme: 'Sharpen instincts, reduce cold-start time',
      milestoneTitle: '🏆 Complete full mock interview loop',
      tasks: [BEHAVIORAL_TASKS[0]],
    })
  }

  if (durationWeeks >= 12) {
    weeks.push({
      id: 'week-9',
      weekNum: 9,
      title: 'Advanced System Design',
      theme: 'Distributed systems & scalability',
      milestoneTitle: '✅ Design 3 production systems',
      tasks: [SYSTEM_DESIGN_TASKS[0]],
    })
    weeks.push({
      id: 'week-10',
      weekNum: 10,
      title: 'Competitive Programming Sprint',
      theme: 'Go beyond LeetCode for an edge',
      milestoneTitle: '✅ Participate in 1 Codeforces round',
      tasks: [DSA_TASKS[3]],
    })
    weeks.push({
      id: 'week-11',
      weekNum: 11,
      title: 'Portfolio & Open Source',
      theme: 'Let GitHub speak for you',
      milestoneTitle: '✅ 3 merged PRs to open source projects',
      tasks: [PROJECT_TASKS[0]],
    })
    weeks.push({
      id: 'week-12',
      weekNum: 12,
      title: 'Final Readiness Audit',
      theme: 'You are ready. Trust the process.',
      milestoneTitle: '🚀 Apply to 10 target companies',
      tasks: [BEHAVIORAL_TASKS[0]],
    })
  }

  // Mark some tasks as completed for demo
  weeks.forEach((week, wIdx) => {
    week.tasks.forEach((task, tIdx) => {
      if (wIdx === 0 && tIdx === 0) task.completed = true
    })
  })

  return {
    id: `roadmap-${Date.now()}`,
    title: `${company.name} Placement Roadmap — ${durationWeeks}W Plan`,
    targetCompany,
    skillLevel,
    totalWeeks: durationWeeks,
    dailyHours,
    weeks,
    createdAt: new Date().toISOString(),
  }
}

export function calcProgress(roadmap: GeneratedRoadmap): ProgressStats {
  let total = 0
  let completed = 0
  roadmap.weeks.forEach(week => {
    week.tasks.forEach(task => {
      total++
      if (task.completed) completed++
    })
  })
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0
  return {
    completedTasks: completed,
    totalTasks: total,
    completionPct,
    currentStreak: 3,
    totalStudyHours: completed * 5,
    weeklyGoalHours: roadmap.dailyHours * 7,
    weeklyStudiedHours: Math.round(roadmap.dailyHours * 4.5),
  }
}

export function getCompanyReadiness(targetCompany: string): CompanyReadiness[] {
  const company = COMPANIES.find(c => c.id === targetCompany)
  return [
    { company: company?.name || 'Target Company', logo: company?.logo || '🎯', readinessPct: 42, color: company?.color || '#0D9488', skillGaps: ['Dynamic Programming', 'System Design', 'Behavioral'] },
    { company: 'Similar Tier Companies', logo: '🏢', readinessPct: 67, color: '#6366F1', skillGaps: ['Advanced DSA', 'Project Depth'] },
    { company: 'Service Companies', logo: '⚙️', readinessPct: 88, color: '#10B981', skillGaps: ['Aptitude Speed'] },
  ]
}

export function getSmartInsights(): SmartInsight {
  return {
    strongestSkills: ['Arrays & Strings', 'Basic Data Structures', 'Problem Decomposition'],
    weakestSkills: ['Dynamic Programming', 'System Design', 'Graph Algorithms'],
    recommendations: [
      'Spend 2 extra hours on DP patterns this week',
      'Practice 1 system design case study daily',
      'Mock interview before Week 4 milestone',
    ],
    focusAreas: ['Dynamic Programming', 'Graph Traversals', 'DBMS Transactions'],
  }
}
