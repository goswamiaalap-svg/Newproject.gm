'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, CheckCircle, CheckSquare, Square, Award, BookOpen, Code2, Sparkles, ExternalLink, Compass, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SkeletonCard } from '@/components/shared/SkeletonLoader'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  type: string
  completed: boolean
}

interface Week {
  id: string
  weekNum: number
  title: string
  items: Task[]
}

interface Roadmap {
  id: string
  title: string
  progress: number
  weeks: Week[]
}

export default function RoadmapPage() {
  const [hasRoadmap, setHasRoadmap] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Onboarding wizard states
  const [targetCompany, setTargetCompany] = useState('Tier-1 Product')
  const [durationWeeks, setDurationWeeks] = useState(4)
  const [skillsSelected, setSkillsSelected] = useState<string[]>(['React & Frontend', 'Data Structures (DSA)'])
  const [activeTarget, setActiveTarget] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null)

  // Fetch initial roadmap & active target from DB
  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      fetch('/api/roadmap').then(res => res.json()).catch(() => null),
      fetch('/api/career-target').then(res => res.json()).catch(() => null)
    ])
      .then(([roadmap, target]) => {
        if (roadmap && roadmap.id && !roadmap.error) {
          setRoadmapData(roadmap)
          setHasRoadmap(true)
        }
        if (target && !target.error) {
          setActiveTarget(target)
          // Map gap-analysis missing skills to pre-selected wizard checkboxes
          const missing = target.gapAnalysis?.missingSkills || []
          if (missing.length > 0) {
            const mappedSkills: string[] = []
            const lowerMissing = missing.map((s: string) => s.toLowerCase())
            
            if (lowerMissing.some((s: string) => s.includes('react') || s.includes('frontend') || s.includes('css') || s.includes('next.js') || s.includes('html'))) {
              mappedSkills.push('React & Frontend')
            }
            if (lowerMissing.some((s: string) => s.includes('node') || s.includes('backend') || s.includes('express') || s.includes('database') || s.includes('mongodb') || s.includes('sql'))) {
              mappedSkills.push('Node & Backend')
            }
            if (lowerMissing.some((s: string) => s.includes('dsa') || s.includes('algorithm') || s.includes('data structures') || s.includes('leetcode') || s.includes('tree') || s.includes('graph'))) {
              mappedSkills.push('Data Structures (DSA)')
            }
            if (lowerMissing.some((s: string) => s.includes('os') || s.includes('dbms') || s.includes('operating system') || s.includes('networking'))) {
              mappedSkills.push('OS/DBMS Fundamentals')
            }
            if (lowerMissing.some((s: string) => s.includes('system design') || s.includes('architecture') || s.includes('scaling'))) {
              mappedSkills.push('System Design Basics')
            }

            if (mappedSkills.length > 0) {
              setSkillsSelected(mappedSkills)
            }
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    // Optimistic UI update
    if (!roadmapData || !roadmapData.weeks) return
    const updatedRoadmap = { ...roadmapData }
    let taskFound = false
    updatedRoadmap.weeks.forEach(w => {
      if (w.items) {
        w.items.forEach(t => {
          if (t.id === taskId) {
            t.completed = !currentStatus
            taskFound = true
          }
        })
      }
    })
    if (taskFound) setRoadmapData(updatedRoadmap)

    // Sync to DB
    try {
      await fetch('/api/roadmap/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed: !currentStatus })
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCompany, durationWeeks, skillsSelected })
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Failed to generate learning roadmap. Please check your setup details.')
        return
      }
      setRoadmapData(data)
      setHasRoadmap(true)
    } catch (e) {
      console.error(e)
      setError('A network connection timeout occurred. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Calculate progress
  const totalTasks = roadmapData && roadmapData.weeks ? roadmapData.weeks.reduce((acc, week) => acc + (week.items || []).length, 0) : 0
  const completedTasks = roadmapData && roadmapData.weeks ? roadmapData.weeks.reduce(
    (acc, week) => acc + (week.items || []).filter((t) => t.completed).length,
    0
  ) : 0
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'dsa': return <Code2 className="w-4 h-4 text-teal" />
      case 'subject': return <BookOpen className="w-4 h-4 text-indigo" />
      case 'project': return <Award className="w-4 h-4 text-gold" />
      default: return <CheckCircle className="w-4 h-4 text-text-muted" />
    }
  }

  const getTaskBadge = (type: string) => {
    switch (type) {
      case 'dsa': return 'bg-teal/5 text-teal border-teal/10'
      case 'subject': return 'bg-indigo/5 text-indigo border-indigo/10'
      case 'project': return 'bg-gold/5 text-gold border-gold/10'
      default: return 'bg-bg-subtle text-text-secondary border-border-default'
    }
  }

  // Curated Focus Area Resources mapping
  const getSelectedSkillsResources = () => {
    const resources: { category: string; icon: any; links: { label: string; url: string }[] }[] = []

    if (skillsSelected.includes('React & Frontend')) {
      resources.push({
        category: 'React & Frontend',
        icon: <Code2 className="w-4 h-4 text-indigo" />,
        links: [
          { label: 'Next.js 14 Official Documentation', url: 'https://nextjs.org/docs' },
          { label: 'Tailwind CSS Layout Cheatsheet', url: 'https://tailwindcss.com/docs' },
          { label: 'React Hooks & State Management Guide', url: 'https://react.dev/reference/react' }
        ]
      })
    }
    if (skillsSelected.includes('Node & Backend')) {
      resources.push({
        category: 'Node & Backend',
        icon: <BookOpen className="w-4 h-4 text-teal" />,
        links: [
          { label: 'Express.js API Design Patterns', url: 'https://expressjs.com' },
          { label: 'Mongoose Schemas & MongoDB Reference', url: 'https://mongoosejs.com/docs' },
          { label: 'PostgreSQL & SQL Query Optimizer Guide', url: 'https://www.postgresql.org/docs' }
        ]
      })
    }
    if (skillsSelected.includes('Data Structures (DSA)')) {
      resources.push({
        category: 'Data Structures (DSA)',
        icon: <Code2 className="w-4 h-4 text-teal" />,
        links: [
          { label: 'LeetCode Top 75 Curated Gaps Checklist', url: 'https://leetcode.com' },
          { label: 'NeetCode DSA Roadmap Video Guide', url: 'https://neetcode.io' },
          { label: 'Interactive Binary Trees Visualizer', url: 'https://visualgo.net' }
        ]
      })
    }
    if (skillsSelected.includes('OS/DBMS Fundamentals')) {
      resources.push({
        category: 'OS/DBMS Fundamentals',
        icon: <BookOpen className="w-4 h-4 text-indigo" />,
        links: [
          { label: 'Operating Systems Process & Threads Guide', url: 'https://www.geeksforgeeks.org' },
          { label: 'DBMS Normalization Forms (1NF to BCNF)', url: 'https://www.javatpoint.com' },
          { label: 'Computer Networks TCP/IP 3-Way Handshake', url: 'https://www.tutorialspoint.com' }
        ]
      })
    }
    if (skillsSelected.includes('System Design Basics')) {
      resources.push({
        category: 'System Design Basics',
        icon: <Award className="w-4 h-4 text-gold" />,
        links: [
          { label: 'System Design Primer (GitHub Repository)', url: 'https://github.com/donnemartin/system-design-primer' },
          { label: 'Designing bit.ly URL Shortener Walkthrough', url: 'https://bytebytego.com' },
          { label: 'Load Balancers, Caching, & Rate Limiting 101', url: 'https://systemdesign.one' }
        ]
      })
    }

    if (resources.length === 0) {
      resources.push({
        category: 'General SDE Preparation',
        icon: <Sparkles className="w-4 h-4 text-teal" />,
        links: [
          { label: 'GeeksforGeeks SDE Sheet Guide', url: 'https://www.geeksforgeeks.org' },
          { label: 'GitHub Standout Engineer Interview Guide', url: 'https://github.com' }
        ]
      })
    }

    return resources
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-border-default animate-pulse rounded-md"></div>
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Area Wrapper */}
      <div className="!bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold !text-[#0F172A]">
            {activeTarget ? `Time-based Plan to Earn Your Target Resume: ${activeTarget.targetTitle}` : 'Placement Prep Learning Path'}
          </h1>
          <p className="!text-[#475569] text-sm mt-1">
            {activeTarget ? `A customized sequence to bridge your gaps and build your Resume of Excellence.` : 'Personalized week-by-week preparation plan.'}
          </p>
        </div>

        {hasRoadmap && (
          <button
            onClick={() => setHasRoadmap(false)}
            className="px-4 py-2 !bg-white border !border-[#E2E8F0] hover:!bg-[#F1F5F9] !text-[#475569] hover:!text-[#0F172A] text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 self-start sm:self-center shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Roadmap</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Onboarding Wizard Form - Dual-Column layout */}
        {!hasRoadmap && activeTarget && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto"
          >
            {/* Left Column: Wizard Setup */}
            <div className="lg:col-span-7 bg-white border border-border-default rounded-card p-6 shadow-card space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
                <Sparkles className="w-5 h-5 text-teal fill-teal/10" />
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Roadmap Setup Wizard
                </h3>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs leading-relaxed font-semibold">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                    Dream Company Tier
                  </label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-btn text-xs focus:outline-none focus:border-teal text-text-primary"
                  >
                    <option value="FAANG">FAANG (Google, Amazon, etc.)</option>
                    <option value="Tier-1 Product">Tier-1 Product (Flipkart, Razorpay, etc.)</option>
                    <option value="Service">Mass Recruiters (TCS, Infosys, Wipro)</option>
                    <option value="Startups">Early Stage Startups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                    Preparation Window
                  </label>
                  <select
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-bg-base border border-border-default rounded-btn text-xs focus:outline-none focus:border-teal text-text-primary"
                  >
                    <option value={4}>4 Weeks (Crash course/Revision)</option>
                    <option value={8}>8 Weeks (Balanced prep)</option>
                    <option value={12}>12 Weeks (Comprehensive syllabus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                    Focus Areas
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['React & Frontend', 'Node & Backend', 'Data Structures (DSA)', 'OS/DBMS Fundamentals', 'System Design Basics'].map((skill) => (
                      <label
                        key={skill}
                        className={cn(
                          'flex items-center gap-2 p-2.5 rounded-btn border cursor-pointer hover:bg-bg-subtle/50 transition-colors',
                          skillsSelected.includes(skill)
                            ? 'border-indigo bg-indigo/5 text-indigo font-semibold'
                            : 'border-border-default text-text-secondary'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={skillsSelected.includes(skill)}
                          onChange={() => {
                            if (skillsSelected.includes(skill)) {
                              setSkillsSelected(skillsSelected.filter((s) => s !== skill))
                            } else {
                              setSkillsSelected([...skillsSelected, skill])
                            }
                          }}
                          className="hidden"
                        />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 bg-teal hover:bg-teal-600 disabled:opacity-50 text-white font-bold rounded-btn flex items-center justify-center gap-1.5 shadow-teal-glow transition-all active:scale-95 text-xs"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
                <span>{isGenerating ? 'Generating in DB...' : 'Generate Roadmap'}</span>
              </button>
            </div>

            {/* Right Column: Path Gaps & Company Tier Overview */}
            <div className="lg:col-span-5 bg-white border border-border-default rounded-card p-6 shadow-card flex flex-col justify-between min-h-[450px]">
              {activeTarget ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                    <Award className="w-5 h-5 text-teal" />
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                      Target Path: {activeTarget.targetTitle}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
                      <span>Path Readiness</span>
                      <span className="font-bold text-teal">{activeTarget.readinessScore || 0}% Ready</span>
                    </div>
                    <div className="w-full bg-bg-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
                      <div
                        className="bg-teal h-full rounded-full transition-all duration-1000"
                        style={{ width: `${activeTarget.readinessScore || 0}%` }}
                      />
                    </div>
                  </div>

                  {activeTarget.gapAnalysis && (
                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wider block">
                          Matched Skills ({activeTarget.gapAnalysis.matchingSkills?.length || 0})
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-0.5">
                          {activeTarget.gapAnalysis.matchingSkills?.slice(0, 8)?.map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[9px] font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded border border-green-100"
                            >
                              ✓ {s}
                            </span>
                          ))}
                          {(activeTarget.gapAnalysis.matchingSkills?.length || 0) === 0 && (
                            <span className="text-[9px] text-text-muted italic">No matching skills detected yet</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block">
                          Missing Skill Gaps ({activeTarget.gapAnalysis.missingSkills?.length || 0})
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-0.5">
                          {activeTarget.gapAnalysis.missingSkills?.slice(0, 8)?.map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[9px] font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100 animate-pulse"
                            >
                              ✗ {s}
                            </span>
                          ))}
                          {(activeTarget.gapAnalysis.missingSkills?.length || 0) === 0 && (
                            <span className="text-[9px] text-green-700 italic font-bold">All target skills matched!</span>
                          )}
                        </div>
                      </div>

                      {activeTarget.gapAnalysis.recommendedProjects && activeTarget.gapAnalysis.recommendedProjects.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">
                            Recommended Projects Gaps
                          </span>
                          <div className="space-y-1">
                            {activeTarget.gapAnalysis.recommendedProjects.slice(0, 2)?.map((p: any, idx: number) => (
                              <div key={idx} className="p-2 bg-bg-base/30 rounded border border-border-subtle/50 text-[10px]">
                                <span className="font-bold text-text-primary block">{p.title}</span>
                                <span className="text-text-muted text-[9px] leading-tight block mt-0.5">{p.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                    <BookOpen className="w-5 h-5 text-teal" />
                    <h4 className="font-heading text-sm font-bold text-text-primary">
                      Dream Company Tier Guide
                    </h4>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Different target tiers expect specific preparation parameters. Use this reference to guide your roadmap selection.
                  </p>

                  <div className="space-y-3.5 pr-1">
                    <div className="p-3 bg-teal/5 border border-teal/10 rounded-lg">
                      <span className="text-[9px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded uppercase">FAANG</span>
                      <h5 className="font-bold text-xs text-text-primary mt-1.5">Google, Amazon, Meta, etc.</h5>
                      <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                        Expects high-quality DSA problem solving (Trees, Graphs, DP), System Design fundamentals, and core CS fundamentals (OS, DBMS, CN).
                      </p>
                    </div>
                    <div className="p-3 bg-indigo/5 border border-indigo/10 rounded-lg">
                      <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded uppercase">Tier-1 Product</span>
                      <h5 className="font-bold text-xs text-text-primary mt-1.5">Flipkart, Razorpay, Atlassian</h5>
                      <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                        Focuses heavily on Full Stack system architectures, machine coding rounds, Javascript/Node capabilities, and medium-level DSA algorithms.
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <span className="text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase">Early Startups</span>
                      <h5 className="font-bold text-xs text-text-primary mt-1.5">Fast-Growing Tech Teams</h5>
                      <p className="text-[10px] text-text-secondary mt-0.5 leading-normal">
                        Requires quick deployment capacity, expert proficiency in React, Node, WebSockets, or databases, and highly functional SDE portfolio projects.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-bg-subtle p-3 rounded-lg border border-border-default flex items-start gap-2.5 mt-4">
                <Sparkles className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[10px] font-bold text-text-primary">Strive for Competence</h5>
                  <p className="text-[9px] text-text-muted mt-0.5 leading-relaxed font-medium">
                    "Aim for excellence, and success will pursue you." Setup your target details under **Define Your Path** to unlock customized readiness audits!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!hasRoadmap && !activeTarget && (
          <motion.div
            key="define-path-required"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto"
          >
            {/* Left Column: Guidance & Direct Link */}
            <div className="lg:col-span-7 bg-white border border-border-default rounded-card p-8 shadow-card flex flex-col justify-between space-y-6 min-h-[400px]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
                  <Compass className="w-6 h-6 text-teal" />
                  <h3 className="font-heading text-lg font-bold text-text-primary">
                    Unlock Your Learning Path
                  </h3>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg flex items-start gap-2.5">
                  <Target className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs text-amber-900">Career Target Required</h5>
                    <p className="text-[10px] text-amber-800 mt-0.5 leading-relaxed font-medium">
                      Your learning path is dynamically compiled based on your target company goals and the skills gaps found in your resume. You must first set a target role to continue.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">Onboarding Checklist</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-bg-base/30 rounded-lg border border-border-subtle">
                      <div className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <span className="font-bold text-xs text-text-primary block">Define Your Target Path</span>
                        <span className="text-[10px] text-text-muted mt-0.5 block leading-normal">
                          Choose your dream job title, target companies, and core technical stacks.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-bg-base/10 rounded-lg border border-border-subtle/50 opacity-60">
                      <div className="w-5 h-5 rounded-full bg-border-default text-text-muted flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                      <div>
                        <span className="font-bold text-xs text-text-muted block">Verify Resume Gaps</span>
                        <span className="text-[10px] text-text-muted mt-0.5 block leading-normal">
                          Upload your resume to automatically audit match percentages and extract missing skills.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-bg-base/10 rounded-lg border border-border-subtle/50 opacity-60">
                      <div className="w-5 h-5 rounded-full bg-border-default text-text-muted flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <span className="font-bold text-xs text-text-muted block">Generate Learning Roadmap</span>
                        <span className="text-[10px] text-text-muted mt-0.5 block leading-normal">
                          Compile your customized, week-by-week preparation plan.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard/path"
                className="w-full py-3 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn shadow-teal-glow transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Define Your Path Now ✦</span>
              </Link>
            </div>

            {/* Right Column: Information card / FAQ */}
            <div className="lg:col-span-5 bg-white border border-border-default rounded-card p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <BookOpen className="w-5 h-5 text-teal" />
                <h4 className="font-heading text-sm font-bold text-text-primary">
                  Why Set a Career Path?
                </h4>
              </div>
              
              <div className="space-y-3.5">
                <div className="p-3 bg-teal/5 border border-teal/10 rounded-lg">
                  <h5 className="font-bold text-xs text-text-primary">Targeted DSA & System Design</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                    FAANG companies focus heavily on complex algorithms, while early-stage startups expect deployable system architecture. Setting your target ensures your curriculum focuses on what matters.
                  </p>
                </div>

                <div className="p-3 bg-indigo/5 border border-indigo/10 rounded-lg">
                  <h5 className="font-bold text-xs text-text-primary">Resume Gap Matching</h5>
                  <p className="text-[10px] text-text-secondary mt-0.5 leading-relaxed">
                    The platform audits your resume against real-world job requirements, pinpointing missing skills so your learning plan is designed directly to bridge those exact gaps.
                  </p>
                </div>

                <div className="bg-bg-subtle p-3 rounded-lg border border-border-default flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] font-bold text-text-primary">Ready in 2 Minutes</h5>
                    <p className="text-[9px] text-text-muted mt-0.5 leading-relaxed">
                      Completing the Setup form takes less than 2 minutes and unlocks advanced resume checklists across the entire dashboard!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Roadmap Timeline view - Dual-Column layout */}
        {hasRoadmap && roadmapData && (roadmapData.weeks || []).length > 0 ? (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto"
          >
            {/* Left Column: Timeline Checklist */}
            <div className="lg:col-span-8 space-y-6">
              {/* Progress Bar Card */}
              <div className="bg-white border border-border-default rounded-card p-5 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-sm font-bold text-text-primary">
                    {roadmapData.title}
                  </h3>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {completedTasks} of {totalTasks} milestones achieved
                  </p>
                </div>

                <div className="flex-1 max-w-md w-full flex items-center gap-3">
                  <div className="flex-1 h-3 bg-bg-subtle rounded-full overflow-hidden border border-border-subtle">
                    <motion.div
                      className="bg-gradient-to-r from-teal to-teal-500 h-full rounded-full"
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="font-mono text-sm font-bold text-text-primary">{progressPct}%</span>
                </div>
              </div>

              {/* Timeline Weeks list */}
              <div className="relative border-l-2 border-border-subtle pl-6 md:pl-8 ml-3 space-y-8">
                {roadmapData.weeks.map((week) => (
                  <div key={week.id} className="relative group">
                    {/* Timeline week badge node */}
                    <div className="absolute -left-[39px] md:-left-[47px] top-0.5 w-7 h-7 md:w-9 md:h-9 rounded-full bg-white border-2 border-teal flex items-center justify-center font-heading font-extrabold text-[10px] md:text-xs text-teal shadow-sm">
                      W{week.weekNum}
                    </div>

                    {/* Week info block */}
                    <div className="space-y-3">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-text-muted tracking-wider">
                          Timeline Step {week.weekNum}
                        </span>
                        <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-teal transition-colors">
                          {week.title}
                        </h4>
                      </div>

                      {/* Task checklist */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {week.items.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id, task.completed)}
                            className={cn(
                              'flex items-start justify-between p-3.5 bg-white border border-border-default rounded-card shadow-sm cursor-pointer hover:border-teal/30 transition-all select-none',
                              task.completed && 'bg-bg-base/30 opacity-70 border-border-subtle'
                            )}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <button className="focus:outline-none flex-shrink-0 mt-0.5">
                                {task.completed ? (
                                  <CheckSquare className="w-4 h-4 text-teal fill-teal/5" />
                                ) : (
                                  <Square className="w-4 h-4 text-text-muted hover:text-teal" />
                                )}
                              </button>
                              <span className={cn('text-xs text-text-secondary leading-snug', task.completed && 'line-through text-text-muted')}>
                                {task.title}
                              </span>
                            </div>

                            <span className={cn('text-[8px] font-bold px-2 py-0.5 rounded border uppercase flex items-center gap-1 flex-shrink-0 ml-2 mt-0.5', getTaskBadge(task.type))}>
                              {getTaskIcon(task.type)}
                              <span>{task.type}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Focus Area Resources sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-border-default rounded-card p-6 shadow-card space-y-5">
                <div className="border-b border-border-subtle pb-3">
                  <h4 className="font-heading text-sm font-bold text-text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal fill-teal/10" />
                    <span>Focus Area Resources</span>
                  </h4>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Curated tutorials, documentation, and cheatsheets to help you check off the roadmap tasks.
                  </p>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {getSelectedSkillsResources().map((res, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        {res.icon}
                        <h5 className="font-bold text-xs text-text-primary">{res.category}</h5>
                      </div>
                      <ul className="space-y-1.5 pl-5 list-disc text-xs text-indigo hover:text-indigo-600">
                        {res.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-2.5 h-2.5 inline flex-shrink-0" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="bg-bg-subtle p-3 rounded-lg border border-border-default text-xs leading-relaxed text-text-muted">
                  <strong>💡 Tip:</strong> Try to check off at least **3 milestones** each week. Add your completed projects and skills to your draft resume to verify metrics growth.
                </div>
              </div>
            </div>
          </motion.div>
        ) : hasRoadmap ? (
          <div className="bg-white border border-border-default rounded-card p-10 text-center max-w-lg mx-auto space-y-4 shadow-card mt-6">
            <Compass className="w-8 h-8 text-teal mx-auto animate-pulse" />
            <h3 className="font-heading text-base font-bold text-text-primary">Learning Roadmap Unavailable</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              We couldn't retrieve your roadmap tasks. It may have failed to compile or was recently cleared. Use the wizard below to setup a fresh timeline.
            </p>
            <button
              onClick={() => {
                setHasRoadmap(false)
                setError(null)
              }}
              className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-btn transition-colors shadow-teal-glow active:scale-95 mt-2"
            >
              Configure Setup Wizard
            </button>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
