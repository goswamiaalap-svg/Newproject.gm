'use client'

import React from 'react'
import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { RoadmapNodeData, Resource } from './types'
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  PlayCircle,
  FileText,
  BookOpen,
  Code2,
  Link2,
  ExternalLink,
  Loader2,
} from 'lucide-react'

// ─── Status colours ───────────────────────────────────────────────────────────

const STATUS_MAP = {
  done: {
    ring: 'border-teal-400',
    bg: 'bg-teal-500',
    text: 'text-white',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    icon: CheckCircle2,
    iconColor: 'text-teal-500',
  },
  'in-progress': {
    ring: 'border-indigo-400',
    bg: 'bg-indigo-500',
    text: 'text-white',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Loader2,
    iconColor: 'text-indigo-500',
  },
  pending: {
    ring: 'border-slate-200',
    bg: 'bg-white',
    text: 'text-slate-700',
    badge: 'bg-slate-50 text-slate-500 border-slate-200',
    icon: Circle,
    iconColor: 'text-slate-300',
  },
}

const DIFF_MAP = {
  beginner: { label: 'Beginner', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  intermediate: { label: 'Intermediate', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  advanced: { label: 'Advanced', color: 'text-rose-600 bg-rose-50 border-rose-200' },
}

const RES_ICON: Record<string, React.ElementType> = {
  video: PlayCircle,
  article: FileText,
  course: BookOpen,
  practice: Code2,
  docs: Link2,
}

// ─── Resource Chip ────────────────────────────────────────────────────────────

function ResourceChip({ res }: { res: Resource }) {
  const Icon = RES_ICON[res.type] ?? Link2
  return (
    <a
      href={res.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 text-[11px] font-medium text-slate-600 hover:text-slate-800 transition-all group"
    >
      <Icon className="w-3 h-3 text-slate-400 group-hover:text-teal-500 transition-colors" />
      <span className="truncate max-w-[120px]">{res.title}</span>
      {res.platform && <span className="text-slate-400 text-[10px]">· {res.platform}</span>}
      <ExternalLink className="w-2.5 h-2.5 text-slate-300 group-hover:text-teal-400 transition-colors flex-shrink-0" />
    </a>
  )
}

// ─── Section Node ─────────────────────────────────────────────────────────────
// The large labelled header for each curriculum block

export function SectionNode({ data, id }: NodeProps) {
  const nodeData = data as unknown as RoadmapNodeData

  const sectionColors: Record<string, string> = {
    'Data Structures & Algorithms': 'from-teal-500 to-teal-600',
    'CS Fundamentals': 'from-indigo-500 to-indigo-600',
    'System Design': 'from-violet-500 to-violet-600',
    'Behavioral & Leadership': 'from-amber-500 to-amber-600',
    'HR & Aptitude': 'from-amber-500 to-amber-600',
    'Portfolio Projects': 'from-emerald-500 to-emerald-600',
  }
  const grad = sectionColors[nodeData.label] ?? 'from-slate-500 to-slate-600'

  return (
    <div
      className={cn(
        'flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r text-white shadow-lg font-bold text-sm tracking-wide cursor-default select-none',
        grad
      )}
      style={{ minWidth: 220 }}
    >
      {nodeData.label}
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-white/60 !border-0" />
    </div>
  )
}

// ─── Topic Node ───────────────────────────────────────────────────────────────
// The primary expandable card — mirrors roadmap.sh node interaction

export function TopicNode({
  data,
  id,
  selected,
}: NodeProps & { selected?: boolean }) {
  const nodeData = data as unknown as RoadmapNodeData & {
    onStatusCycle?: (id: string) => void
    onSelect?: (id: string) => void
  }

  const [expanded, setExpanded] = React.useState(false)
  const status = nodeData.status
  const S = STATUS_MAP[status as keyof typeof STATUS_MAP]
  const StatusIcon = S.icon

  const hasDiff = !!nodeData.difficulty
  const diff = nodeData.difficulty ? DIFF_MAP[nodeData.difficulty as keyof typeof DIFF_MAP] : null
  const hasResources = nodeData.resources && nodeData.resources.length > 0

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    nodeData.onStatusCycle?.(id)
  }

  const { updateNode } = useReactFlow()

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (nodeData.description || hasResources) {
      const nextState = !expanded
      setExpanded(nextState)
      updateNode(id, { style: { zIndex: nextState ? 1000 : 0 } })
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ minWidth: 280, maxWidth: 320 }}
      className={cn(
        'bg-white rounded-xl border-2 shadow-sm transition-all duration-200 cursor-pointer',
        status === 'done' ? 'border-teal-200 shadow-teal-50' :
        status === 'in-progress' ? 'border-indigo-200 shadow-indigo-50' :
        'border-slate-150',
        selected ? 'ring-2 ring-indigo-400 ring-offset-1' : '',
        'hover:shadow-md hover:border-slate-300',
      )}
      onClick={() => nodeData.onSelect?.(id)}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-300 !border-0" />

      {/* ── Header row ── */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        {/* Status dot / button */}
        <button
          onClick={handleStatusClick}
          title="Click to cycle status"
          className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-full"
        >
          <StatusIcon
            className={cn(
              'w-5 h-5 transition-transform hover:scale-110',
              S.iconColor,
              status === 'in-progress' && 'animate-spin'
            )}
          />
        </button>

        {/* Label */}
        <span
          className={cn(
            'flex-1 text-[13px] font-semibold leading-tight text-slate-800',
            status === 'done' && 'line-through text-slate-400'
          )}
        >
          {nodeData.label}
        </span>

        {/* Expand toggle */}
        {(nodeData.description || hasResources) && (
          <button
            onClick={handleExpand}
            className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-slate-50 flex items-center justify-center transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.div>
          </button>
        )}
      </div>

      {/* ── Meta chips (always visible) ── */}
      <div className="flex items-center gap-1.5 px-3.5 pb-2.5 flex-wrap">
        {diff && (
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold', diff.color)}>
            {diff.label}
          </span>
        )}
        {nodeData.estimatedHours && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-medium">
            <Clock className="w-2.5 h-2.5" />
            {nodeData.estimatedHours}h
          </span>
        )}
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold', S.badge)}>
          {status === 'done' ? 'Done' : status === 'in-progress' ? 'In Progress' : 'Pending'}
        </span>
      </div>

      {/* ── Expanded body ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-50 space-y-3">
              {nodeData.description && (
                <p className="text-[12px] text-slate-500 leading-relaxed">{nodeData.description}</p>
              )}
              {hasResources && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resources</p>
                  <div className="flex flex-wrap gap-1.5">
                    {nodeData.resources!.map((res: Resource, i: number) => (
                      <ResourceChip key={i} res={res} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-slate-300 !border-0" />
    </motion.div>
  )
}

// ─── Subtopic Node (compact) ──────────────────────────────────────────────────

export function SubtopicNode({ data, id }: NodeProps) {
  const nodeData = data as unknown as RoadmapNodeData & {
    onStatusCycle?: (id: string) => void
  }
  const status = nodeData.status
  const S = STATUS_MAP[status as keyof typeof STATUS_MAP]
  const StatusIcon = S.icon

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 bg-white rounded-lg border text-[12px] font-medium text-slate-600 shadow-sm cursor-pointer hover:border-slate-300 transition-all',
        status === 'done' ? 'border-teal-200' : 'border-slate-150'
      )}
      style={{ minWidth: 180 }}
      onClick={() => nodeData.onStatusCycle?.(id)}
    >
      <Handle type="target" position={Position.Left} className="!w-1.5 !h-1.5 !bg-slate-300 !border-0" />
      <StatusIcon className={cn('w-4 h-4 flex-shrink-0', S.iconColor)} />
      <span className={cn(status === 'done' && 'line-through text-slate-400')}>{nodeData.label}</span>
    </div>
  )
}
