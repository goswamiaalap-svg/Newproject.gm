'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { transformGeminiToRoadmap } from '@/components/roadmap/generator'
import type { RoadmapConfig, WizardInput, GeminiRoadmapOutput } from '@/components/roadmap/types'
import RoadmapWizard from '@/components/roadmap/RoadmapWizard'
import RoadmapCanvas from '@/components/roadmap/RoadmapCanvas'
import AIInsightsPanel from '@/components/roadmap/AIInsightsPanel'
import {
  Map, Sparkles, ChevronRight, ChevronLeft, RotateCcw, Target,
  Zap, Clock, BookOpen, AlertCircle, Brain, ArrowRight,
  CheckCircle2, ListTodo, TrendingUp, Users, Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Hero */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center shadow-2xl shadow-teal-200">
          <Map className="w-11 h-11 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow">
          <Sparkles className="w-3 h-3 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center max-w-md mb-10"
      >
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 leading-tight">
          Your Career Journey<br />Starts Here
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Answer 7 quick questions. Get a personalized, week-by-week roadmap built for your exact goal and skill level.
        </p>
      </motion.div>

      {/* Journey preview */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-10 flex-wrap justify-center"
      >
        {['Where you are now', null, 'Skill gaps identified', null, 'Step-by-step plan', null, 'Dream career'].map((label, i) =>
          label === null ? (
            <ArrowRight key={i} className="w-4 h-4 text-slate-300" />
          ) : (
            <span
              key={i}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold border',
                i === 0 ? 'bg-slate-100 border-slate-200 text-slate-600' :
                i === 12 ? 'bg-teal-500 border-teal-500 text-white' :
                'bg-white border-slate-200 text-slate-600'
              )}
            >
              {label}
            </span>
          )
        )}
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-2 mb-8 text-xs text-slate-400"
      >
        <div className="flex -space-x-1.5">
          {['bg-teal-400', 'bg-indigo-400', 'bg-amber-400', 'bg-rose-400'].map((c, i) => (
            <div key={i} className={`w-6 h-6 rounded-full ${c} border-2 border-white`} />
          ))}
        </div>
        <span>Join students already using LaunchPad to plan their career</span>
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onStart}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2.5 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all text-base"
      >
        <Sparkles className="w-4 h-4 text-teal-300" />
        Build My Personalized Roadmap
        <ChevronRight className="w-4 h-4" />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-4 text-xs text-slate-400"
      >
        Takes 3 minutes · No signup required · 100% personalized
      </motion.p>
    </div>
  )
}

// ─── Generating Overlay ────────────────────────────────────────────────────────

function GeneratingOverlay() {
  const steps = [
    { label: 'Analyzing your profile...', icon: Users },
    { label: 'Mapping your skill gaps...', icon: TrendingUp },
    { label: 'Designing your curriculum...', icon: ListTodo },
    { label: 'Curating the best resources...', icon: BookOpen },
  ]
  const [currentStep, setCurrentStep] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(s => (s + 1) % steps.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-32 space-y-8"
    >
      {/* Spinner */}
      <div className="relative w-28 h-28">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 border-r-teal-300/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border-4 border-transparent border-b-indigo-500 border-l-indigo-300/30"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-slate-700" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center">
        <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Building your roadmap</h3>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-slate-500 text-sm"
          >
            {steps[currentStep].label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Step dots */}
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: i === currentStep ? 1.2 : 0.7,
              opacity: i === currentStep ? 1 : 0.3,
              backgroundColor: i <= currentStep ? '#14B8A6' : '#CBD5E1',
            }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 max-w-md mx-auto text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Generation Failed</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all"
      >
        Try Again
      </button>
    </div>
  )
}

// ─── Summary / Career Journey View ───────────────────────────────────────────

function RoadmapSummary({
  config,
  onViewGraph,
  onViewInsights,
  onReset,
}: {
  config: RoadmapConfig
  onViewGraph: () => void
  onViewInsights: () => void
  onReset: () => void
}) {
  // Compute Week 1 next actions
  const week1 = config.nodes.filter(n => n.id.startsWith('week-1') || n.id.startsWith('task-1-'))
  const firstTasks = config.nodes.filter(n => n.kind === 'topic').slice(0, 3)
  const personalizedAdvice = config.insights && 'personalizedAdvice' in config.insights
    ? (config.insights as any).personalizedAdvice as string | undefined
    : undefined

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-5">

      {/* ── Career Journey Banner ── */}
      <motion.div
        initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-3xl p-7 text-white overflow-hidden relative"
      >
        {/* bg decoration */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-teal-500/10" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full bg-indigo-500/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">Your Career Journey</span>
          </div>

          {/* From → To */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Where you are</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-sm font-semibold text-white border border-white/10">
                {config.currentLevel}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-400 mt-4 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your goal</span>
              <span className="px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-lg text-sm font-bold text-teal-200">
                {config.goal}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-400 mt-4 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timeline</span>
              <span className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-400/30 rounded-lg text-sm font-bold text-indigo-200">
                {config.totalWeeks} weeks · {config.dailyHours}h/day
              </span>
            </div>
          </div>

          {/* Readiness progress bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-semibold">Current Readiness</span>
              <span className="text-white font-black">{config.readinessPct}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${config.readinessPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                className="h-full bg-gradient-to-r from-teal-400 to-teal-300 rounded-full"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {config.readinessPct < 30 ? 'Keep going — the roadmap starts from your exact level' :
               config.readinessPct < 60 ? 'Good foundation — focus on filling the gaps' :
               'Strong base — focus on advanced topics and projects'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── What to do this week ── */}
      {firstTasks.length > 0 && (
        <motion.div
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
              <ListTodo className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Start Here — Week 1 Actions</h2>
              <p className="text-xs text-slate-500">Your first steps based on your current level</p>
            </div>
          </div>
          <div className="space-y-3">
            {firstTasks.map((task, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group">
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-teal-400 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-teal-500">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800">{task.label}</p>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                </div>
                {task.estimatedHours && (
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">{task.estimatedHours}h</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Focus Areas + AI Advice ── */}
      <motion.div
        initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Focus Areas */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-extrabold text-slate-800">Priority Focus Areas</h3>
          </div>
          <div className="space-y-2">
            {config.focusAreas.map((area, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-semibold text-slate-700">{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-800">Roadmap Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Topics</span>
              <span className="text-sm font-black text-slate-800">{config.nodes.filter(n => n.kind === 'topic').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Study Weeks</span>
              <span className="text-sm font-black text-slate-800">{config.totalWeeks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Daily Hours</span>
              <span className="text-sm font-black text-slate-800">{config.dailyHours}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Study Time</span>
              <span className="text-sm font-black text-slate-800">
                ~{config.totalWeeks * config.dailyHours * 7}h
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Mentor Advice ── */}
      {personalizedAdvice && (
        <motion.div
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-slate-900 rounded-3xl p-6 text-white"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/20 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-teal-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2">AI Mentor Says</p>
              <p className="text-sm leading-relaxed text-slate-300">{personalizedAdvice}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── CTAs ── */}
      <motion.div
        initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onViewGraph}
          className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
        >
          <Map className="w-4 h-4" />
          Open Full Roadmap Graph
          <ChevronRight className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onViewInsights}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:border-teal-300 hover:text-teal-700 transition-all"
        >
          <Sparkles className="w-4 h-4 text-teal-500" />
          View AI Insights & Analysis
        </motion.button>
      </motion.div>

      {/* Reset link */}
      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Start Over with a Different Profile
        </button>
      </div>
    </div>
  )
}

// ─── Canvas Header (progress strip) ──────────────────────────────────────────

function CanvasHeader({
  config,
  completedCount,
  total,
  onSummary,
  onInsights,
  onReset,
}: {
  config: RoadmapConfig
  completedCount: number
  total: number
  onSummary: () => void
  onInsights: () => void
  onReset: () => void
}) {
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  return (
    <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-2.5 flex items-center gap-4">
      {/* Nav */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onSummary}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Summary
        </button>
        <button
          onClick={onInsights}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 rounded-lg text-xs font-semibold text-teal-700 transition-all border border-teal-100"
        >
          <Sparkles className="w-3 h-3" /> AI Insights
        </button>
      </div>

      {/* Progress bar — center */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full"
          />
        </div>
        <span className="text-xs font-bold text-slate-600 shrink-0">{completedCount}/{total} done</span>
      </div>

      {/* Goal chip */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg">
        <Target className="w-3 h-3 text-teal-500" />
        <span className="text-xs font-semibold text-slate-600 truncate max-w-32">{config.goal}</span>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        title="Start over"
        className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100 shrink-0"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Phase = 'empty' | 'wizard' | 'generating' | 'summary' | 'canvas' | 'insights'

export default function RoadmapPage() {
  const [phase, setPhase] = React.useState<Phase>('empty')
  const [roadmap, setRoadmap] = React.useState<RoadmapConfig | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [completedTopics, setCompletedTopics] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('launchpad_roadmap_v4')
      if (saved) {
        const parsed = JSON.parse(saved) as RoadmapConfig
        setRoadmap(parsed)
        setPhase('canvas')
      }
      const savedProgress = localStorage.getItem('launchpad_progress_v4')
      if (savedProgress) setCompletedTopics(new Set(JSON.parse(savedProgress)))
    } catch (e) { /* ignore */ }
    setIsLoading(false)
  }, [])

  const handleWizardComplete = async (input: WizardInput) => {
    setPhase('generating')
    setError(null)

    try {
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate roadmap. Please try again.')
      }

      const geminiOutput = data.roadmap as GeminiRoadmapOutput
      const config = transformGeminiToRoadmap(geminiOutput, input)
      ;(config as any).source = data.source ?? 'gemini'

      setRoadmap(config)
      setCompletedTopics(new Set())
      localStorage.setItem('launchpad_roadmap_v4', JSON.stringify(config))
      localStorage.removeItem('launchpad_progress_v4')
      setPhase('summary')
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setPhase('empty')
    }
  }

  const handleReset = () => {
    localStorage.removeItem('launchpad_roadmap_v4')
    localStorage.removeItem('launchpad_progress_v4')
    setRoadmap(null)
    setError(null)
    setCompletedTopics(new Set())
    setPhase('empty')
  }

  const totalTopics = roadmap?.nodes.filter(n => n.kind === 'topic').length ?? 0
  const completedCount = completedTopics.size

  if (isLoading) return <div className="h-screen w-full bg-[#FAFBFC]" />

  return (
    <div className={cn(
      'w-full bg-[#FAFBFC]',
      phase === 'canvas' ? 'fixed inset-0 z-50' : 'min-h-screen overflow-y-auto'
    )}>
      <AnimatePresence mode="wait">

        {phase === 'empty' && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {error
              ? <div className="flex items-center justify-center min-h-screen"><ErrorState message={error} onRetry={() => setPhase('wizard')} /></div>
              : <EmptyState onStart={() => setPhase('wizard')} />
            }
          </motion.div>
        )}

        {phase === 'wizard' && (
          <motion.div key="wizard"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-start justify-center py-10 px-4"
          >
            <RoadmapWizard onComplete={handleWizardComplete} isGenerating={false} />
          </motion.div>
        )}

        {phase === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center"
          >
            <GeneratingOverlay />
          </motion.div>
        )}

        {phase === 'summary' && roadmap && (
          <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Top nav */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-500 flex items-center justify-center">
                  <Map className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-800">Your Roadmap is Ready</span>
              </div>
              <div className="flex items-center gap-2">
                {completedCount > 0 && (
                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-1 rounded-lg">
                    {completedCount} topics done
                  </span>
                )}
                <button onClick={() => setPhase('canvas')} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-1.5 bg-slate-100 rounded-lg">
                  <Map className="w-3.5 h-3.5" /> Open Graph
                </button>
              </div>
            </div>
            <RoadmapSummary
              config={roadmap}
              onViewGraph={() => setPhase('canvas')}
              onViewInsights={() => setPhase('insights')}
              onReset={handleReset}
            />
          </motion.div>
        )}

        {phase === 'insights' && roadmap?.insights && (
          <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-100 px-6 py-3 flex items-center justify-between">
              <button onClick={() => setPhase('summary')} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <span className="text-sm font-bold text-slate-800">AI Insights</span>
              <button onClick={() => setPhase('canvas')} className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-lg transition-colors">
                <Map className="w-3.5 h-3.5" /> Roadmap Graph
              </button>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-10">
              <AIInsightsPanel insights={roadmap.insights} />
            </div>
          </motion.div>
        )}

        {phase === 'canvas' && roadmap && (
          <motion.div key="canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col"
          >
            <CanvasHeader
              config={roadmap}
              completedCount={completedCount}
              total={totalTopics}
              onSummary={() => setPhase('summary')}
              onInsights={() => setPhase('insights')}
              onReset={handleReset}
            />
            <div className="flex-1 pt-14">
              <RoadmapCanvas config={roadmap} onReset={handleReset} />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
