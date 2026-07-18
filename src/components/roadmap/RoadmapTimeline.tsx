'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  type GeneratedRoadmap,
  type RoadmapWeek,
  type RoadmapTask,
  type DifficultyBadge,
} from './roadmapData'
import {
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Code2,
  BookOpen,
  Award,
  Cpu,
  Users,
  Clock,
  PlayCircle,
  FileText,
  ExternalLink,
  Trophy,
  Flame,
} from 'lucide-react'

interface Props {
  roadmap: GeneratedRoadmap
  onToggleTask: (taskId: string, currentStatus: boolean) => void
  completionPct: number
  completedTasks: number
  totalTasks: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const taskConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  dsa: { label: 'DSA', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100', icon: Code2 },
  subject: { label: 'Core CS', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-100', icon: BookOpen },
  project: { label: 'Project', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: Award },
  'system-design': { label: 'Sys Design', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100', icon: Cpu },
  behavioral: { label: 'Behavioral', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-100', icon: Users },
}

const difficultyConfig: Record<DifficultyBadge, { color: string; dot: string }> = {
  Foundational: { color: 'text-emerald-600', dot: 'bg-emerald-400' },
  Intermediate: { color: 'text-amber-600', dot: 'bg-amber-400' },
  Advanced: { color: 'text-orange-600', dot: 'bg-orange-400' },
  Expert: { color: 'text-red-600', dot: 'bg-red-400' },
}

const resourceIconMap: Record<string, React.ElementType> = {
  video: PlayCircle,
  article: FileText,
  practice: Code2,
  course: BookOpen,
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({ task, onToggle }: { task: RoadmapTask; onToggle: () => void }) {
  const [expanded, setExpanded] = React.useState(false)
  const cfg = taskConfig[task.type] || taskConfig.dsa
  const diff = difficultyConfig[task.difficulty]
  const TaskIcon = cfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white border rounded-2xl overflow-hidden transition-shadow duration-300',
        task.completed
          ? 'border-teal-100 shadow-[0_1px_4px_rgba(13,148,136,0.06)]'
          : 'border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)]'
      )}
    >
      {/* Top row */}
      <div className="flex items-start gap-3.5 p-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-md"
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <motion.div whileTap={{ scale: 0.85 }}>
            {task.completed
              ? <CheckSquare className="w-5 h-5 text-teal fill-teal/10" />
              : <Square className="w-5 h-5 text-slate-300 hover:text-teal transition-colors" />
            }
          </motion.div>
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <span className={cn('text-sm font-semibold leading-snug transition-colors', task.completed ? 'line-through text-text-muted' : 'text-text-primary')}>
              {task.title}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {/* Type badge */}
            <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border', cfg.bg, cfg.border, cfg.color)}>
              <TaskIcon className="w-2.5 h-2.5" />
              {cfg.label}
            </span>

            {/* Difficulty */}
            <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium', diff.color)}>
              <span className={cn('w-1.5 h-1.5 rounded-full', diff.dot)} />
              {task.difficulty}
            </span>

            {/* Est time */}
            <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
              <Clock className="w-2.5 h-2.5" />
              {task.estimatedHours}h
            </span>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center transition-colors"
          aria-expanded={expanded}
        >
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </motion.div>
        </button>
      </div>

      {/* Expanded subtopics & resources */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-50 px-4 pb-4 pt-3.5 space-y-3">
              {/* Subtopics */}
              {task.subtopics.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Subtopics</p>
                  <div className="space-y-1.5">
                    {task.subtopics.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-xl">
                        <span className="text-xs text-text-secondary font-medium">{sub.title}</span>
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />{sub.estimatedHours}h
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {task.resources.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Learning Resources</p>
                  <div className="space-y-1.5">
                    {task.resources.map((res, i) => {
                      const ResIcon = resourceIconMap[res.type] || FileText
                      return (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl group transition-colors"
                        >
                          <ResIcon className="w-3.5 h-3.5 text-text-muted group-hover:text-teal transition-colors flex-shrink-0" />
                          <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors flex-1 min-w-0 truncate">{res.title}</span>
                          {res.platform && (
                            <span className="text-[9px] text-text-muted px-1.5 py-0.5 bg-white border border-slate-100 rounded-md flex-shrink-0">{res.platform}</span>
                          )}
                          <ExternalLink className="w-3 h-3 text-slate-200 group-hover:text-teal transition-colors flex-shrink-0" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Week Section ─────────────────────────────────────────────────────────────

function WeekSection({ week, index, onToggleTask }: { week: RoadmapWeek; index: number; onToggleTask: (id: string, curr: boolean) => void }) {
  const [open, setOpen] = React.useState(index === 0)
  const weekCompleted = week.tasks.filter(t => t.completed).length
  const weekTotal = week.tasks.length
  const weekPct = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0
  const isAllDone = weekCompleted === weekTotal

  const NODE_COLORS = [
    'from-teal-400 to-teal-600',
    'from-indigo-400 to-indigo-600',
    'from-violet-400 to-violet-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-cyan-400 to-cyan-600',
    'from-emerald-400 to-emerald-600',
    'from-pink-400 to-pink-600',
    'from-orange-400 to-orange-600',
    'from-sky-400 to-sky-600',
    'from-teal-400 to-teal-600',
    'from-indigo-400 to-indigo-600',
  ]
  const nodeColor = NODE_COLORS[index % NODE_COLORS.length]

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.4, 0, 0.2, 1] }}
      className="relative pl-12 md:pl-16"
    >
      {/* Timeline node */}
      <div className={cn(
        'absolute left-0 top-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br flex items-center justify-center shadow-md',
        nodeColor
      )}>
        {isAllDone
          ? <Trophy className="w-4 h-4 text-white" />
          : <span className="text-white font-bold text-xs md:text-sm">{week.weekNum}</span>
        }
      </div>

      {/* Week card */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-start gap-4 p-5 text-left group"
          aria-expanded={open}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Week {week.weekNum}</span>
              {isAllDone && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal bg-teal/8 px-2 py-0.5 rounded-full">
                  <CheckSquare className="w-2.5 h-2.5" /> Complete
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-text-primary group-hover:text-teal transition-colors">{week.title}</h3>
            <p className="text-xs text-text-muted mt-0.5 italic">{week.theme}</p>

            {/* Milestone chip */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-medium text-text-secondary">
              <Flame className="w-3 h-3 text-amber-400" />
              {week.milestoneTitle}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {/* Mini progress ring */}
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke={isAllDone ? '#0D9488' : '#6366F1'}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="87.96"
                  animate={{ strokeDashoffset: 87.96 * (1 - weekPct / 100) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-text-secondary">
                {weekPct}%
              </span>
            </div>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </div>
        </button>

        {/* Expanded tasks */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-50 px-5 pb-5 pt-4 space-y-3">
                {week.tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={() => onToggleTask(task.id, task.completed)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Main Timeline Component ───────────────────────────────────────────────────

export default function RoadmapTimeline({ roadmap, onToggleTask, completionPct, completedTasks, totalTasks }: Props) {
  return (
    <div className="space-y-5">
      {/* Overall progress bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-text-primary">{roadmap.title}</h3>
            <p className="text-xs text-text-muted mt-0.5">{completedTasks} of {totalTasks} milestones complete</p>
          </div>
          <div className="text-right">
            <motion.p
              key={completionPct}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-text-primary"
            >
              {completionPct}%
            </motion.p>
            <p className="text-[10px] text-text-muted">Completion</p>
          </div>
        </div>
        <div className="h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal to-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        {completionPct === 100 && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-teal font-semibold mt-2 text-center"
          >
            🎉 Roadmap complete! You're ready to conquer placements.
          </motion.p>
        )}
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[17px] md:left-[21px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-teal-100 via-indigo-100 to-slate-100 rounded-full" />

        <div className="space-y-5">
          {roadmap.weeks.map((week, idx) => (
            <WeekSection key={week.id} week={week} index={idx} onToggleTask={onToggleTask} />
          ))}
        </div>
      </div>
    </div>
  )
}
