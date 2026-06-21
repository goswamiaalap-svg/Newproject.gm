'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
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
      console.log("Copy button clicked");

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

      console.log(brief);

      await navigator.clipboard.writeText(brief);

      console.log("Copied successfully");

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
        <div className="rounded-card border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-semibold leading-relaxed text-amber-800">
          {generationNote}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="xl:col-span-4">
          <div className="sticky top-6 space-y-4 rounded-card border border-border-default bg-white p-5 shadow-card">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className={`${headingFont} font-display text-base font-bold text-text-primary`}>Student profile</h2>
              <Wand2 className="h-4 w-4 text-teal" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
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

            <button
              type="button"
              onClick={generateIdeas}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-btn bg-teal px-4 py-3 text-xs font-bold text-white shadow-teal-glow transition-all hover:bg-teal-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Generating briefs...' : 'Generate placement-ready ideas'}
            </button>
          </div>
        </aside>

        <main className="space-y-5 xl:col-span-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {sortedProjects.map((project, index) => {
              const isSaved = savedProjects.includes(project.title)

              return (
              <motion.button
                type="button"
                key={project.id}
                onClick={() => setActiveId(project.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={cn(
                  'rounded-card border bg-white p-4 text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover',
                  activeProject.id === project.id ? 'border-teal/30 ring-4 ring-teal/5' : 'border-border-default'
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
              </motion.button>
              )
            })}
          </div>

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
                onClick={() => {
                  console.log("BUTTON CLICKED");
                  alert("BUTTON CLICKED");
                  copyBrief();
                }}
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

            <div className={`${headingFont} grid grid-cols-1 gap-5 py-5 lg:grid-cols-3`}>
              {[
                ['Recruiter relevance', activeProject.recruiterValue, 35, Target],
                ['Technical depth', activeProject.fitScore - 58, 30, Code2],
                ['Originality', activeProject.originality, 20, Gauge],
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

            <div className={`${headingFont} grid grid-cols-1 gap-5 lg:grid-cols-2`}>
              <BriefBlock icon={Lightbulb} title="Problem statement" items={[activeProject.problem]} />
              <BriefBlock icon={Layers3} title="MVP features" items={activeProject.mvp} />
              <BriefBlock icon={GitBranch} title="Build roadmap" items={activeProject.roadmap} />
              <BriefBlock icon={Clipboard} title="Resume bullets" items={activeProject.resumeBullets} />
              <BriefBlock icon={BookOpen} title="Interview defense" items={activeProject.interviewQuestions} />
              <BriefBlock icon={ListChecks} title="Validation plan" items={[activeProject.validation, ...activeProject.extensions.map((item) => `Extension: ${item}`)]} />
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
