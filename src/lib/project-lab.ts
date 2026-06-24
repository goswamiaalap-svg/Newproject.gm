export type ProjectIdea = {
  id: string
  title: string
  role: string
  difficulty: string
  timeline: string
  fitScore: number
  originality: number
  recruiterValue: number
  feasibility: number
  problem: string
  whyItWorks: string
  stack: string[]
  mvp: string[]
  roadmap: string[]
  resumeBullets: string[]
  interviewQuestions: string[]
  validation: string
  extensions: string[]
}

export type ProjectLabProfile = {
  year: string
  role: string
  timeline: string
  target: string
  skills: string[]
}

export const projectIdeaTemplates: ProjectIdea[] = [
  {
    id: 'resume-match',
    title: 'AI Resume-to-Job Match Analyzer',
    role: 'Full Stack + AI',
    difficulty: 'Intermediate',
    timeline: '10-14 days',
    fitScore: 91,
    originality: 18,
    recruiterValue: 34,
    feasibility: 14,
    problem: 'Students apply with one resume everywhere and never know why they are rejected for a specific role.',
    whyItWorks: 'It converts a common placement pain into a measurable workflow: upload resume, paste job description, receive missing skills, ATS keywords, and project rewrite suggestions.',
    stack: ['Next.js', 'Node.js', 'MongoDB', 'PDF parser', 'Groq optional'],
    mvp: ['Resume text extraction', 'Job description parser', 'Skill gap matrix', 'ATS keyword score', 'Actionable rewrite suggestions'],
    roadmap: ['Day 1-2: resume upload and text extraction', 'Day 3-4: job description analyzer', 'Day 5-7: scoring and recommendation UI', 'Day 8-10: dashboard, copy buttons, and test cases'],
    resumeBullets: [
      'Built a resume-job matching platform that identifies missing skills, ATS keywords, and weak project descriptions from uploaded resumes.',
      'Designed a scoring system for recruiter relevance, keyword coverage, and impact language to produce actionable improvement reports.',
      'Validated recommendations using sample internship descriptions and student resumes from campus placement scenarios.',
    ],
    interviewQuestions: ['How did you extract and clean resume text?', 'How did you design the scoring formula?', 'How would you reduce generic AI suggestions?', 'How would this scale for 10,000 resumes?'],
    validation: 'Test with 20 student resumes and 10 real job descriptions, then compare whether suggested keywords and project rewrites are actually relevant.',
    extensions: ['Chrome extension for LinkedIn jobs', 'Version history for resume improvements', 'Company-wise resume templates'],
  },
  {
    id: 'github-quality',
    title: 'GitHub Profile Quality Analyzer',
    role: 'SDE / DevTools',
    difficulty: 'Intermediate',
    timeline: '7-10 days',
    fitScore: 87,
    originality: 17,
    recruiterValue: 31,
    feasibility: 15,
    problem: 'Many students have projects on GitHub, but their repositories look unfinished and fail quick recruiter screening.',
    whyItWorks: 'It gives a concrete score for README quality, commit consistency, repo structure, issue hygiene, deployment links, and project credibility.',
    stack: ['Next.js', 'GitHub API', 'Node.js', 'PostgreSQL', 'Recharts'],
    mvp: ['GitHub username scan', 'Repository quality score', 'README checklist', 'Commit heatmap', 'Fix priority list'],
    roadmap: ['Day 1: GitHub API profile scan', 'Day 2-3: repository scoring rules', 'Day 4-5: visual dashboard', 'Day 6-7: README recommendations and export'],
    resumeBullets: [
      'Developed a GitHub profile analyzer that scores repository quality across README depth, commit activity, deployment readiness, and issue hygiene.',
      'Integrated GitHub API data with custom ranking rules to generate actionable fixes for placement-focused developer portfolios.',
    ],
    interviewQuestions: ['Which GitHub signals are useful for recruiters?', 'How did you handle API rate limits?', 'What makes your score trustworthy?', 'How would you prevent gaming the score?'],
    validation: 'Compare scores across 15 student GitHub profiles and manually verify whether higher scores correspond to cleaner, more recruiter-ready repositories.',
    extensions: ['README generator', 'Portfolio import', 'Repository cleanup checklist'],
  },
  {
    id: 'internship-crm',
    title: 'Internship Application CRM for Students',
    role: 'Full Stack',
    difficulty: 'Beginner-Intermediate',
    timeline: '5-8 days',
    fitScore: 84,
    originality: 15,
    recruiterValue: 30,
    feasibility: 15,
    problem: 'Students track applications in messy spreadsheets and miss follow-ups, referrals, or deadlines.',
    whyItWorks: 'It shows product thinking and solves a problem reviewers immediately understand: application tracking, deadline reminders, referral status, and interview notes.',
    stack: ['Next.js', 'Supabase', 'PostgreSQL', 'Tailwind', 'Calendar API'],
    mvp: ['Application pipeline board', 'Deadline reminders', 'Referral tracker', 'Company notes', 'Status analytics'],
    roadmap: ['Day 1: database schema and auth', 'Day 2-3: application board', 'Day 4: reminders and filters', 'Day 5-6: analytics and CSV export'],
    resumeBullets: [
      'Built an internship CRM that helps students manage company applications, referral status, deadlines, and interview notes in one dashboard.',
      'Implemented status analytics and reminder flows to reduce missed follow-ups during placement season.',
    ],
    interviewQuestions: ['Why is this more useful than a spreadsheet?', 'How did you design the application state model?', 'How would reminders work in production?', 'What metrics would you track?'],
    validation: 'Use it for one placement cycle or simulate 30 applications, then check whether deadline and follow-up visibility improves.',
    extensions: ['Gmail import', 'Off-campus opportunity feed', 'Referral message templates'],
  },
  {
    id: 'dsa-weakness',
    title: 'DSA Weakness Analyzer',
    role: 'SDE Prep',
    difficulty: 'Intermediate',
    timeline: '8-12 days',
    fitScore: 89,
    originality: 16,
    recruiterValue: 33,
    feasibility: 14,
    problem: 'Students solve random questions but do not know which patterns are actually weak before interviews.',
    whyItWorks: 'It turns problem history into a targeted plan by mapping solved and failed questions to patterns like sliding window, graphs, DP, and binary search.',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Charts', 'CSV import'],
    mvp: ['Problem log import', 'Pattern tagging', 'Weakness score', '7-day practice plan', 'Progress heatmap'],
    roadmap: ['Day 1-2: problem log and pattern schema', 'Day 3-4: weakness scoring', 'Day 5-6: roadmap generation', 'Day 7-8: charts and revision mode'],
    resumeBullets: [
      'Created a DSA analytics dashboard that identifies weak algorithmic patterns and generates targeted weekly practice plans.',
      'Designed a weighted scoring model using difficulty, recency, failed attempts, and pattern coverage.',
    ],
    interviewQuestions: ['How do you classify a question by pattern?', 'How is weakness score calculated?', 'How would you integrate LeetCode data?', 'How do you avoid recommending only easy problems?'],
    validation: 'Track one week of practice for 10 users and compare whether repeated weak patterns reduce after targeted recommendations.',
    extensions: ['LeetCode scraper with user consent', 'Peer challenge mode', 'Company-wise pattern filter'],
  },
]

export function personalizeProjectIdeas(profile: ProjectLabProfile, ideas = projectIdeaTemplates): ProjectIdea[] {
  const roleBoost = profile.role.includes('AI')
    ? ['Groq optional', 'Prompt design']
    : profile.role.includes('Backend')
      ? ['API design', 'PostgreSQL']
      : ['UI systems', 'Analytics']

  return ideas.map((project, index) => ({
    ...project,
    fitScore: Math.min(
      96,
      project.fitScore +
        (profile.skills.some((skill) => project.stack.includes(skill)) ? 3 : 0) -
        (index === 2 && profile.timeline === '3 days' ? 5 : 0)
    ),
    stack: Array.from(new Set([...project.stack, ...profile.skills.slice(0, 2), ...roleBoost.slice(0, 1)])),
  }))
}

export function buildProjectLabPrompt(profile: ProjectLabProfile) {
  return `Generate 4 practical, placement-ready software project ideas for an Indian Tier 2/3 CSE/IT student.

Student profile:
- Year: ${profile.year}
- Target role: ${profile.role}
- Build timeline: ${profile.timeline}
- Company target: ${profile.target}
- Skills: ${profile.skills.join(', ')}

Return only valid JSON. No markdown. Shape:
[
  {
    "id": "short-slug",
    "title": "Project title",
    "role": "Best-fit role",
    "difficulty": "Beginner-Intermediate | Intermediate | Advanced",
    "timeline": "estimated days",
    "fitScore": 85,
    "originality": 16,
    "recruiterValue": 32,
    "feasibility": 14,
    "problem": "real student/placement problem",
    "whyItWorks": "why this helps in placements",
    "stack": ["tech"],
    "mvp": ["feature"],
    "roadmap": ["day-wise build step"],
    "resumeBullets": ["strong resume bullet"],
    "interviewQuestions": ["question interviewer may ask"],
    "validation": "how to test this with real users",
    "extensions": ["future enhancement"]
  }
]

Keep projects practical, non-generic, and buildable. Avoid todo apps, calculators, weather apps, and simple clones.`
}
