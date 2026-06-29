'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Code2,
  Copy,
  Gauge,
  GitBranch,
  Layers3,
  Lightbulb,
  ListChecks,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  Wand2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Inter, Manrope } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const manrope = Manrope({
  subsets: ["latin"],
});

type ProjectIdea = {
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

const skillPresets = ['React', 'Next.js', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'FastAPI', 'Tailwind', 'GitHub API']

const templates: ProjectIdea[] = [
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
    stack: ['Next.js', 'Node.js', 'MongoDB', 'PDF parser', 'Grok optional'],
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
  {
    id: 'placement-mock-interview',
    title: 'Mock Interview Feedback Coach',
    role: 'Full Stack + AI',
    difficulty: 'Intermediate',
    timeline: '10-12 days',
    fitScore: 88,
    originality: 17,
    recruiterValue: 32,
    feasibility: 14,
    problem: 'Students practice answers alone but do not get structured feedback on clarity, confidence, examples, or technical accuracy.',
    whyItWorks: 'It creates a repeatable interview practice loop with question sets, recorded answers, AI feedback, score trends, and next-practice prompts.',
    stack: ['Next.js', 'Node.js', 'Groq optional', 'MongoDB', 'Web Audio API'],
    mvp: ['Role-based question bank', 'Timed answer recorder', 'Answer transcript review', 'Feedback scorecard', 'Practice history'],
    roadmap: ['Day 1-2: question bank and session flow', 'Day 3-4: recording and transcript storage', 'Day 5-7: feedback scoring and tips', 'Day 8-10: progress dashboard and export'],
    resumeBullets: [
      'Built an AI mock interview coach that records practice answers, generates feedback scorecards, and tracks improvement over repeated sessions.',
      'Designed rubric-based scoring for answer structure, role relevance, technical depth, and confidence indicators.',
    ],
    interviewQuestions: ['How did you design the feedback rubric?', 'How would you prevent vague AI feedback?', 'What privacy concerns exist with recorded answers?', 'How would you test feedback quality?'],
    validation: 'Ask 10 students to complete two practice sessions and compare whether their second answers improve against the same rubric.',
    extensions: ['Peer review mode', 'Company-specific interview packs', 'Voice confidence analytics'],
  },
  {
    id: 'campus-resource-finder',
    title: 'Campus Placement Resource Finder',
    role: 'Full Stack',
    difficulty: 'Beginner-Intermediate',
    timeline: '6-9 days',
    fitScore: 85,
    originality: 16,
    recruiterValue: 29,
    feasibility: 16,
    problem: 'Students waste time searching scattered PDFs, drives, seniors messages, and YouTube playlists for company-specific preparation.',
    whyItWorks: 'It organizes preparation material by role, company, topic, freshness, and student rating so the best resources surface quickly.',
    stack: ['Next.js', 'Supabase', 'PostgreSQL', 'Tailwind', 'Search'],
    mvp: ['Resource submission form', 'Company and topic filters', 'Rating and bookmark system', 'Freshness labels', 'Admin moderation queue'],
    roadmap: ['Day 1: schema and resource form', 'Day 2-3: filters and search', 'Day 4-5: bookmarks and ratings', 'Day 6-7: moderation and analytics'],
    resumeBullets: [
      'Created a placement resource discovery platform with company filters, peer ratings, bookmarks, and moderation workflows.',
      'Improved resource retrieval by categorizing preparation material across roles, topics, freshness, and student usefulness scores.',
    ],
    interviewQuestions: ['How do you rank useful resources?', 'How would you prevent spam submissions?', 'What database schema did you use?', 'How would search scale?'],
    validation: 'Seed 100 resources from a college placement group and measure whether students find relevant material faster than manual searching.',
    extensions: ['Senior notes verification', 'Auto-expiring stale links', 'Personal prep collections'],
  },
  {
    id: 'skill-gap-roadmap',
    title: 'Skill Gap Roadmap Generator',
    role: 'AI/ML',
    difficulty: 'Intermediate',
    timeline: '8-11 days',
    fitScore: 90,
    originality: 18,
    recruiterValue: 33,
    feasibility: 14,
    problem: 'Students know their target role but do not know the exact skill gaps between their current profile and realistic job expectations.',
    whyItWorks: 'It compares a student profile against job descriptions and turns the missing skills into a weekly learning roadmap with project proof.',
    stack: ['Next.js', 'Groq optional', 'Node.js', 'MongoDB', 'Charts'],
    mvp: ['Profile skill input', 'Job description comparison', 'Gap priority score', 'Weekly roadmap', 'Project proof suggestions'],
    roadmap: ['Day 1-2: profile and target role inputs', 'Day 3-4: skill extraction and matching', 'Day 5-7: roadmap builder', 'Day 8-9: charts and progress tracking'],
    resumeBullets: [
      'Built a skill gap analyzer that compares student profiles against job descriptions and generates prioritized weekly learning roadmaps.',
      'Implemented gap scoring based on role relevance, missing frequency, current skill confidence, and project proof availability.',
    ],
    interviewQuestions: ['How are skill gaps detected?', 'How do you prioritize roadmap items?', 'How would you avoid hallucinated skills?', 'How can users prove completion?'],
    validation: 'Run 15 target job descriptions through the tool and manually verify whether extracted gaps match real role requirements.',
    extensions: ['Resume import', 'Progress streaks', 'Mentor review workflow'],
  },
  {
    id: 'portfolio-case-study-builder',
    title: 'Portfolio Case Study Builder',
    role: 'Frontend',
    difficulty: 'Beginner-Intermediate',
    timeline: '5-7 days',
    fitScore: 86,
    originality: 15,
    recruiterValue: 31,
    feasibility: 16,
    problem: 'Students build projects but present them as screenshots and generic descriptions, so recruiters cannot judge decisions or impact.',
    whyItWorks: 'It guides students to turn projects into case studies with problem, users, architecture, tradeoffs, metrics, screenshots, and resume-ready copy.',
    stack: ['Next.js', 'Tailwind', 'Supabase', 'Image upload', 'Markdown'],
    mvp: ['Project intake wizard', 'Case study sections', 'Screenshot upload', 'Public portfolio page', 'Resume bullet export'],
    roadmap: ['Day 1: template and data model', 'Day 2-3: intake wizard', 'Day 4: public case study page', 'Day 5-6: exports and polish'],
    resumeBullets: [
      'Developed a portfolio case study builder that converts student projects into structured recruiter-ready stories with metrics and tradeoffs.',
      'Implemented reusable templates for architecture notes, decisions, screenshots, validation, and resume bullet generation.',
    ],
    interviewQuestions: ['What makes a good project case study?', 'How do you store draft sections?', 'How would you handle image uploads?', 'How would you improve SEO?'],
    validation: 'Compare recruiter readability of 10 plain project pages versus generated case studies using a checklist and peer review.',
    extensions: ['Custom domains', 'Analytics for portfolio visits', 'PDF portfolio export'],
  },
]

function getFitLabel(
  projectId: string,
  bestProjectId: string
) {
  return projectId === bestProjectId
    ? 'Excellent Fit'
    : 'Strong Match'
}


export default function ProjectsPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Next.js', 'Python'])
  const [skillInput, setSkillInput] = useState('')
  const [year, setYear] = useState('3rd Year')
  const [role, setRole] = useState('Full Stack')
  const [timeline, setTimeline] = useState('2 weeks')
  const [target, setTarget] = useState('Product startups')
  const [activeId, setActiveId] = useState(templates[0].id)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>(templates)
  const [generationNote, setGenerationNote] = useState('Ideas are ready. Add GROQ_API_KEY to enable live Groq generation.')
  const [savedProjects, setSavedProjects] = useState<string[]>([])

  const projects = useMemo(() => {
    const roleBoost = role.includes('AI') ? ['Groq optional', 'Prompt design'] : role.includes('Backend') ? ['API design', 'PostgreSQL'] : ['UI systems', 'Analytics']
    return generatedIdeas.map((project, index) => ({
      ...project,
      fitScore: Math.min(96, project.fitScore + (selectedSkills.some((skill) => project.stack.includes(skill)) ? 3 : 0) - (index === 2 && timeline === '3 days' ? 5 : 0)),
      stack: Array.from(new Set([...project.stack, ...selectedSkills.slice(0, 2), ...roleBoost.slice(0, 1)])),
    }))
  }, [generatedIdeas, role, selectedSkills, timeline])

  useEffect(() => {
    fetch('/api/projects/save')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // data is array of saved projects, map by title
          setSavedProjects(data.map(p => p.title))
        }
      })
      .catch(console.error)

    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data && data.configured) {
          setGenerationNote('AI engine is active. Generate personalized project ideas with Groq.')
        } else {
          setGenerationNote('Ideas are ready. Add GROQ_API_KEY to enable live Groq generation.')
        }
      })
      .catch(() => {
        setGenerationNote('Ideas are ready. Add GROQ_API_KEY to enable live Groq generation.')
      })
  }, [])

  const bestProject = [...projects].sort(
    (a, b) => b.fitScore - a.fitScore
  )[0]

  const sortedProjects = [...projects].sort(
    (a, b) => b.fitScore - a.fitScore
  )

  const headingFont = manrope.className;


  const activeProject = projects.find((project) => project.id === activeId) ?? projects[0]


  const addSkill = (skill: string) => {
    const value = skill.trim()
    if (!value || selectedSkills.includes(value)) return
    setSelectedSkills([...selectedSkills, value])
    setSkillInput('')
  }


  const handleToggleSave = async (project: ProjectIdea, event: React.MouseEvent) => {
    event.stopPropagation()
    const isSaved = savedProjects.includes(project.title)

    if (isSaved) {
      setSavedProjects(savedProjects.filter((title) => title !== project.title))
    } else {
      setSavedProjects([...savedProjects, project.title])
    }

    try {
      await fetch('/api/projects/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isSaved ? 'unsave' : 'save',
          title: project.title,
          description: project.problem,
          tags: project.stack.join(','),
        }),
      })
    } catch (e) {
      console.error('Failed to sync save state to db', e)
    }
  }

  const generateIdeas = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          role,
          timeline,
          target,
          skills: selectedSkills,
        }),
      })
      const result = await response.json()
      if (Array.isArray(result?.ideas) && result.ideas.length > 0) {
        const ranked = [...result.ideas].sort(
          (a, b) => b.fitScore - a.fitScore
        )

        setGeneratedIdeas(ranked)
        setActiveId(ranked[0].id)
        setGenerationNote(result.note || 'Project ideas generated.')
      }
    } catch {
      setGenerationNote('AI generation failed, so the local zero-cost project ideas stayed active.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyBrief = async () => {
    try {
      const brief = `
  ${activeProject.title}
  
  Problem:
  ${activeProject.problem}
  
  Stack:
  ${activeProject.stack.join(", ")}
  
  MVP:
  ${activeProject.mvp.join("\n")}
  
  Resume Bullets:
  ${activeProject.resumeBullets.join("\n")}
  `;

      await navigator.clipboard.writeText(brief);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1400);

    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className={`${inter.className} space-y-6`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal/10 bg-teal-light px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal">
            <Sparkles className={`${headingFont} h-3.5 w-3.5`} />
            Project Lab
          </span>
          <h1 className={`${headingFont} mt-3 font-display text-3xl font-extrabold tracking-tight text-text-primary`}>
            Build projects recruiters can evaluate.
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">
            Generate practical, placement-ready project briefs with fit scores, validation plans, resume bullets, and interview defense points.
          </p>
        </div>
      </div>

      <section className="rounded-card border border-border-default bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 border-b border-border-subtle pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-btn bg-teal-light text-teal">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className={`${headingFont} font-display text-base font-bold text-text-primary`}>Student profile</h2>
              <p className="text-xs text-text-secondary">Tune your profile once, then compare project briefs below.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={generateIdeas}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 rounded-btn bg-teal px-4 py-2.5 text-xs font-bold text-white shadow-teal-glow transition-all hover:bg-teal-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate ideas'}
          </button>
        </div>

        <div className="grid gap-4 pt-4 xl:grid-cols-[1fr_1.25fr_220px] xl:items-start">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ['Year', year, setYear, ['1st Year', '2nd Year', '3rd Year', '4th Year']],
                ['Target role', role, setRole, ['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'Data Analyst']],
                ['Timeline', timeline, setTimeline, ['3 days', '1 week', '2 weeks', '1 month']],
                ['Company target', target, setTarget, ['Service companies', 'Product startups', 'MNC internships', 'Open source programs']],
              ].map(([label, value, setter, options]) => (
                <label key={label as string} className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{label as string}</span>
                  <select
                    value={value as string}
                    onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)}
                    className="w-full rounded-btn border border-border-default bg-bg-base px-3 py-2 text-xs font-semibold text-text-primary outline-none transition-colors focus:border-teal"
                  >
                    {(options as string[]).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Skills</span>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') addSkill(skillInput)
                }}
                placeholder="Add a skill"
                className="min-w-0 flex-1 rounded-btn border border-border-default bg-bg-base px-3 py-2 text-xs font-semibold outline-none transition-colors focus:border-teal"
              />
              <button
                type="button"
                onClick={() => addSkill(skillInput)}
                className="rounded-btn bg-teal px-3 text-white shadow-teal-glow transition-transform active:scale-95"
                aria-label="Add skill"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillPresets.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => (selectedSkills.includes(skill) ? setSelectedSkills(selectedSkills.filter((item) => item !== skill)) : addSkill(skill))}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors',
                    selectedSkills.includes(skill)
                      ? 'border-teal/20 bg-teal-light text-teal'
                      : 'border-border-subtle bg-white text-text-secondary hover:border-teal/20'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedSkills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-indigo/5 px-2.5 py-1 text-[10px] font-bold text-indigo">
                  {skill}
                  <button type="button" onClick={() => setSelectedSkills(selectedSkills.filter((item) => item !== skill))} aria-label={`Remove ${skill}`}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Ideas', projects.length],
              ['Saved', savedProjects.length],
              ['Skills', selectedSkills.length],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-btn border border-border-subtle bg-bg-base px-2 py-2">
                <p className="text-sm font-black text-text-primary">{value as number}</p>
                <p className="text-[9px] font-bold uppercase text-text-muted">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,2fr)]">
        <aside className="space-y-4">
          <div className="rounded-card border border-teal/10 bg-teal-light/70 p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal">Best match</p>
                <h3 className={`${headingFont} mt-1 text-sm font-extrabold leading-tight text-text-primary`}>
                  {bestProject.title}
                </h3>
              </div>
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-white text-teal">
                <span className="text-lg font-black leading-none">{bestProject.fitScore}</span>
                <span className="text-[8px] font-bold uppercase">Fit</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-1">
            {sortedProjects.map((project, index) => {
              const isSaved = savedProjects.includes(project.title)
              const isActive = activeProject.id === project.id

              return (
              <motion.article
                role="button"
                tabIndex={0}
                key={project.id}
                onClick={() => setActiveId(project.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveId(project.id)
                  }
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={cn(
                  'cursor-pointer rounded-card border bg-white p-4 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-teal/10',
                  isActive ? 'border-teal/30 ring-4 ring-teal/5' : 'border-border-default'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-bg-subtle px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                        {project.role}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] font-bold ${project.id === bestProject.id
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                          }`}
                      >
                        {getFitLabel(project.id, bestProject.id)}
                      </span>
                      <span
                        className={`hidden rounded-full px-2 py-1 text-[9px] font-bold ${project.id === bestProject.id
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                          }`}
                      >
                        {project.id === bestProject.id
                          ? '⭐ Excellent Fit'
                          : 'Strong Match'}
                      </span>
                    </div>
                    <h3 className={`${headingFont} mt-3 font-display text-base font-bold leading-tight text-text-primary`}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={(event) => handleToggleSave(project, event)}
                      className={cn(
                        'rounded-btn border p-2 transition-all',
                        isSaved
                          ? 'border-gold bg-gold-light text-gold shadow-sm'
                          : 'border-border-default bg-white text-text-muted hover:text-text-primary'
                      )}
                      title="Save project idea"
                    >
                      <Star className={cn('h-4 w-4', isSaved && 'fill-current')} />
                    </button>
                    <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-teal-light text-teal">
                      <span className="text-lg font-black leading-none">{project.fitScore}</span>
                      <span className="text-[8px] font-bold uppercase">Fit</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-text-secondary">{project.problem}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 4).map((tech) => (
                    <span key={tech} className="rounded bg-bg-subtle px-2 py-0.5 font-mono text-[9px] font-semibold text-text-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  <span>{isActive ? 'Selected brief' : 'View brief'}</span>
                  <ChevronDown className={cn('h-4 w-4 -rotate-90 transition-transform', isActive && 'rotate-0 text-teal')} />
                </div>
              </motion.article>
              )
            })}
          </div>

        </aside>

        <main className="space-y-5 xl:sticky xl:top-6 xl:self-start xl:max-h-[calc(100vh-48px)] xl:overflow-y-auto xl:pr-2">
          <section className="rounded-card border border-border-default bg-white p-5 shadow-card">
            <div className="flex flex-col gap-4 border-b border-border-subtle pb-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-light px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {getFitLabel(
                      activeProject.id,
                      bestProject.id
                    )}
                  </span>
                  <span className="rounded-full bg-indigo-light px-3 py-1 text-[10px] font-bold text-indigo">{activeProject.difficulty}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-light px-3 py-1 text-[10px] font-bold text-gold">
                    <Timer className="h-3.5 w-3.5" />
                    {activeProject.timeline}
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-text-primary">{activeProject.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">{activeProject.whyItWorks}</p>
              </div>
              <button
                type="button"
                onClick={copyBrief}
                className="relative z-50 inline-flex items-center justify-center gap-2 rounded-btn border border-border-default bg-bg-subtle px-4 py-2 text-xs font-bold text-text-primary transition-colors hover:border-teal/20 hover:text-teal cursor-pointer"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4 text-teal" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy brief"}
              </button>
            </div>

            <div className={`${headingFont} grid grid-cols-1 gap-5 py-5 sm:grid-cols-2 lg:grid-cols-4`}>
              {[
                ['Recruiter relevance', activeProject.recruiterValue, 35, Target],
                ['Technical depth', activeProject.fitScore - 58, 30, Code2],
                ['Originality', activeProject.originality, 20, Gauge],
                ['Feasibility score', activeProject.feasibility, 20, ShieldCheck],
              ].map(([label, value, max, Icon]) => (
                <div key={label as string} className="rounded-card border border-border-subtle bg-bg-base p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary">{label as string}</span>
                    {React.createElement(Icon as typeof Target, { className: 'h-4 w-4 text-teal' })}
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-gradient-to-r from-teal to-indigo" style={{ width: `${((value as number) / (max as number)) * 100}%` }} />
                  </div>
                  <p className="mt-2 text-[10px] font-bold text-text-muted">
                    {value as number}/{max as number}
                  </p>
                </div>
              ))}
            </div>

            <div className={`${headingFont} grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3`}>
              <BriefBlock icon={Lightbulb} title="Problem statement" items={[activeProject.problem]} />
              <BriefBlock icon={Layers3} title="MVP features" items={activeProject.mvp} />
              <BriefBlock icon={GitBranch} title="Build roadmap" items={activeProject.roadmap} />
              <BriefBlock icon={Clipboard} title="Resume bullets" items={activeProject.resumeBullets} />
              <BriefBlock icon={BookOpen} title="Interview defense" items={activeProject.interviewQuestions} />
              <BriefBlock icon={ListChecks} title="Validation plan" items={[activeProject.validation, ...activeProject.extensions.map((item) => `Extension: ${item}`)]} />
            </div>

            <div className="mt-6 border-t border-border-subtle pt-6">
              <h3 className="font-display text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Rocket className="h-4 w-4 text-indigo" />
                Recommended Next Steps to Start
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-btn border border-border-default bg-bg-base p-4 transition-all hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Step 1</p>
                    <span className="text-[10px] font-bold text-teal bg-teal/5 px-2 py-0.5 rounded-full">Git Setup</span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-text-primary">Initialize Repository</p>
                  <p className="mt-1 text-[11px] text-text-secondary leading-relaxed">
                    Create a new repository on GitHub named <code className="bg-white px-1 py-0.5 rounded border border-border-subtle font-mono text-[10px]">{activeProject.id}</code>.
                  </p>
                </div>
                <div className="rounded-btn border border-border-default bg-bg-base p-4 transition-all hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Step 2</p>
                    <span className="text-[10px] font-bold text-indigo bg-indigo/5 px-2 py-0.5 rounded-full">Boilerplate</span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-text-primary">Setup Tech Stack</p>
                  <p className="mt-1 text-[11px] text-text-secondary leading-relaxed">
                    Initialize your project folder using <code className="bg-white px-1 py-0.5 rounded border border-border-subtle font-mono text-[10px]">{activeProject.stack.includes('Next.js') ? 'npx create-next-app@latest' : 'npm init'}</code>.
                  </p>
                </div>
                <div className="rounded-btn border border-border-default bg-bg-base p-4 transition-all hover:shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Step 3</p>
                    <span className="text-[10px] font-bold text-gold bg-gold/5 px-2 py-0.5 rounded-full">Development</span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-text-primary">Implement MVP</p>
                  <p className="mt-1 text-[11px] text-text-secondary leading-relaxed">
                    Focus strictly on the MVP features first: {activeProject.mvp.slice(0, 2).join(', ')}.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

function BriefBlock({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Rocket
  title: string
  items: string[]
}) {
  return (
    <div className="rounded-card border border-border-default bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-btn bg-teal-light text-teal">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-display text-sm font-bold text-text-primary">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-relaxed text-text-secondary">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
