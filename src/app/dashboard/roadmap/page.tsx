'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, CheckCircle, CheckSquare, Square, Award, BookOpen, Code2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SkeletonCard } from '@/components/shared/SkeletonLoader'

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
  
  const [roadmapData, setRoadmapData] = useState<Roadmap | null>(null)

  // Fetch initial roadmap from DB
  useEffect(() => {
    fetch('/api/roadmap')
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setRoadmapData(data)
          setHasRoadmap(true)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    // Optimistic UI update
    if (!roadmapData) return
    const updatedRoadmap = { ...roadmapData }
    let taskFound = false
    updatedRoadmap.weeks.forEach(w => {
      w.items.forEach(t => {
        if (t.id === taskId) {
          t.completed = !currentStatus
          taskFound = true
        }
      })
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
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCompany, durationWeeks, skillsSelected })
      })
      const data = await res.json()
      setRoadmapData(data)
      setHasRoadmap(true)
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  // Calculate progress
  const totalTasks = roadmapData ? roadmapData.weeks.reduce((acc, week) => acc + week.items.length, 0) : 0
  const completedTasks = roadmapData ? roadmapData.weeks.reduce(
    (acc, week) => acc + week.items.filter((t) => t.completed).length,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-text-primary">
            Placement Prep Learning Path
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Personalized week-by-week preparation plan from our live Database.
          </p>
        </div>

        {hasRoadmap && (
          <button
            onClick={() => setHasRoadmap(false)}
            className="px-4 py-2 bg-white border border-border-default hover:bg-bg-base text-text-secondary hover:text-text-primary text-xs font-bold rounded-btn transition-colors flex items-center gap-1.5 self-start sm:self-center shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Roadmap</span>
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Onboarding Wizard Form */}
        {!hasRoadmap && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-border-default rounded-card p-6 shadow-card max-w-2xl mx-auto space-y-6"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
              <Sparkles className="w-5 h-5 text-teal fill-teal/10" />
              <h3 className="font-heading text-lg font-bold text-text-primary">
                Roadmap Setup Wizard
              </h3>
            </div>

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
          </motion.div>
        )}

        {/* Roadmap Timeline view */}
        {hasRoadmap && roadmapData && (
          <motion.div
            key="roadmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
