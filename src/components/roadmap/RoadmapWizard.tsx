'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { WizardInput } from './types'
import {
  User, Target, TrendingUp, Clock, BookOpen, Zap, MessageSquare,
  ChevronRight, ChevronLeft, Sparkles, CheckCircle2, Circle, Sun,
} from 'lucide-react'

interface Props {
  onComplete: (data: WizardInput) => void
  isGenerating: boolean
}

const STEPS = [
  { id: 0, label: 'Profile', icon: User },
  { id: 1, label: 'Goal', icon: Target },
  { id: 2, label: 'Progress', icon: TrendingUp },
  { id: 3, label: 'Time', icon: Clock },
  { id: 4, label: 'Style', icon: BookOpen },
  { id: 5, label: 'Challenge', icon: Zap },
  { id: 6, label: 'About You', icon: MessageSquare },
]

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']
const BRANCHES = ['CSE', 'IT', 'AI/ML', 'ECE', 'Other']

const GOALS = [
  { id: 'Crack Placements', emoji: '🎯', desc: 'Campus / off-campus placement prep' },
  { id: 'Get Internship', emoji: '💼', desc: 'Land a tech internship this season' },
  { id: 'Full Stack Developer', emoji: '🌐', desc: 'Build production web apps' },
  { id: 'AI/ML Engineer', emoji: '🤖', desc: 'Deep learning, ML, and data science' },
  { id: 'Product-Based Company', emoji: '🏆', desc: 'FAANG / top product companies' },
  { id: 'App Developer', emoji: '📱', desc: 'iOS, Android, or cross-platform' },
  { id: 'Explore Career Paths', emoji: '🧭', desc: 'Not sure yet — help me decide' },
]

const LEETCODE_OPTIONS = ['0', '1–50', '50–200', '200+']
const PROJECTS_OPTIONS = ['0', '1–2', '3–5', '5+']
const YES_NO = ['Yes', 'No']

const MONTHS_OPTIONS = [
  { val: 1, label: '1 Month', sub: 'Crash course' },
  { val: 3, label: '3 Months', sub: 'Intensive prep' },
  { val: 6, label: '6 Months', sub: 'Balanced prep' },
  { val: 12, label: '12 Months', sub: 'Deep mastery' },
]

const LEARNING_STYLES = [
  { id: 'Videos', emoji: '📺' },
  { id: 'Documentation', emoji: '📄' },
  { id: 'Building Projects', emoji: '🔨' },
  { id: 'Solving Problems', emoji: '🧩' },
  { id: 'Mixed Approach', emoji: '🔀' },
]

const CHALLENGES = [
  "Don't know where to start",
  'Inconsistency',
  'Weak DSA',
  'Weak Development Skills',
  'Poor Communication',
  'No Projects',
  'Placement Anxiety',
]

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function RadioCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all text-sm font-medium w-full',
        selected
          ? 'border-slate-800 bg-slate-800 text-white shadow-md'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50',
      )}
    >
      {selected ? <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
      {children}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{children}</p>
}

function StepTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-extrabold text-slate-800">{title}</h2>
      <p className="text-sm text-slate-500 mt-1">{sub}</p>
    </div>
  )
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function RoadmapWizard({ onComplete, isGenerating }: Props) {
  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState(1)

  const [form, setForm] = React.useState<WizardInput>({
    currentYear: '',
    branch: '',
    cgpa: '',
    goal: '',
    leetcodeCount: '',
    projectsBuilt: '',
    hasInternship: '',
    hasResume: '',
    dailyHours: 3,
    timeAvailable: 6,
    learningStyle: '',
    biggestChallenge: '',
    currentSituation: '',
    careerAspirations: '',
    currentChallenges: '',
    additionalNotes: '',
  })

  const update = <K extends keyof WizardInput>(k: K, v: WizardInput[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const canAdvance = (() => {
    if (step === 0) return !!form.currentYear && !!form.branch
    if (step === 1) return !!form.goal
    if (step === 2) return !!form.leetcodeCount && !!form.projectsBuilt && !!form.hasInternship && !!form.hasResume
    if (step === 3) return form.dailyHours > 0 && form.timeAvailable > 0
    if (step === 4) return !!form.learningStyle
    if (step === 5) return !!form.biggestChallenge
    return true // Step 6 is optional text
  })()

  const goNext = () => { if (step < 6) { setDirection(1); setStep(s => s + 1) } else onComplete(form) }
  const goBack = () => { setDirection(-1); setStep(s => s - 1) }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white border border-slate-100 rounded-[28px] shadow-lg overflow-hidden">
        {/* ── Header ── */}
        <div className="px-8 pt-8 pb-5 border-b border-slate-50">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Personalized Setup</span>
          </div>

          {/* Stepper */}
          <div className="flex items-start gap-1 overflow-x-auto scrollbar-hide">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              const isDone = i < step
              const isCurrent = i === step
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1 shrink-0 min-w-[40px]">
                    <motion.div
                      animate={{
                        backgroundColor: isDone ? '#0D9488' : isCurrent ? '#F0FDFA' : '#F8FAFC',
                        borderColor: isDone ? '#0D9488' : isCurrent ? '#14B8A6' : '#E2E8F0',
                      }}
                      className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                    >
                      {isDone
                        ? <CheckCircle2 className="w-4 h-4 text-white" />
                        : <Icon className={cn('w-3.5 h-3.5', isCurrent ? 'text-teal-600' : 'text-slate-300')} />
                      }
                    </motion.div>
                    <span className={cn(
                      'text-[8px] font-bold tracking-wider text-center leading-tight hidden sm:block',
                      isCurrent ? 'text-teal-600' : isDone ? 'text-slate-400' : 'text-slate-300'
                    )}>
                      {s.label.toUpperCase()}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <motion.div
                      animate={{ backgroundColor: i < step ? '#14B8A6' : '#E2E8F0' }}
                      className="h-0.5 flex-1 min-w-4 rounded-full mt-4"
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="px-8 py-7 min-h-[420px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >

              {/* ── Step 0: Academic Profile ── */}
              {step === 0 && (
                <div>
                  <StepTitle title="Academic Profile" sub="Tell us about where you are in your journey." />
                  <div className="space-y-5">
                    <div>
                      <SectionLabel>Current Year</SectionLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {YEARS.map(y => (
                          <RadioCard key={y} selected={form.currentYear === y} onClick={() => update('currentYear', y)}>
                            {y}
                          </RadioCard>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Branch / Stream</SectionLabel>
                      <div className="flex flex-wrap gap-2">
                        {BRANCHES.map(b => (
                          <button
                            key={b}
                            onClick={() => update('branch', b)}
                            className={cn(
                              'px-4 py-2 rounded-full border text-sm font-semibold transition-all',
                              form.branch === b ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            )}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Current CGPA (optional)</SectionLabel>
                      <input
                        type="text"
                        placeholder="e.g. 7.5"
                        value={form.cgpa}
                        onChange={e => update('cgpa', e.target.value)}
                        className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 text-sm font-medium text-slate-700 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1: Goal ── */}
              {step === 1 && (
                <div>
                  <StepTitle title="What is your Goal?" sub="Your entire roadmap will be optimized for this outcome." />
                  <div className="space-y-2">
                    {GOALS.map(g => (
                      <button
                        key={g.id}
                        onClick={() => update('goal', g.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all',
                          form.goal === g.id
                            ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        )}
                      >
                        <span className="text-xl shrink-0">{g.emoji}</span>
                        <div>
                          <p className={cn('text-sm font-bold', form.goal === g.id ? 'text-white' : 'text-slate-800')}>{g.id}</p>
                          <p className={cn('text-xs mt-0.5', form.goal === g.id ? 'text-slate-300' : 'text-slate-500')}>{g.desc}</p>
                        </div>
                        {form.goal === g.id && <CheckCircle2 className="w-5 h-5 text-teal-400 ml-auto shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 2: Progress ── */}
              {step === 2 && (
                <div>
                  <StepTitle title="Current Progress" sub="Honest answers help us generate a more accurate roadmap." />
                  <div className="space-y-5">
                    <div>
                      <SectionLabel>LeetCode Problems Solved</SectionLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {LEETCODE_OPTIONS.map(o => (
                          <RadioCard key={o} selected={form.leetcodeCount === o} onClick={() => update('leetcodeCount', o)}>
                            {o}
                          </RadioCard>
                        ))}
                      </div>
                    </div>
                    <div>
                      <SectionLabel>Projects Built</SectionLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PROJECTS_OPTIONS.map(o => (
                          <RadioCard key={o} selected={form.projectsBuilt === o} onClick={() => update('projectsBuilt', o)}>
                            {o}
                          </RadioCard>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <SectionLabel>Completed Internship?</SectionLabel>
                        <div className="space-y-2">
                          {YES_NO.map(o => (
                            <RadioCard key={o} selected={form.hasInternship === o} onClick={() => update('hasInternship', o)}>
                              {o}
                            </RadioCard>
                          ))}
                        </div>
                      </div>
                      <div>
                        <SectionLabel>Resume Ready?</SectionLabel>
                        <div className="space-y-2">
                          {YES_NO.map(o => (
                            <RadioCard key={o} selected={form.hasResume === o} onClick={() => update('hasResume', o)}>
                              {o}
                            </RadioCard>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Time ── */}
              {step === 3 && (
                <div>
                  <StepTitle title="Time Commitment" sub="Be realistic — consistent effort beats intensity." />
                  <div className="space-y-7">
                    <div>
                      <SectionLabel>Target Timeline</SectionLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {MONTHS_OPTIONS.map(m => (
                          <button
                            key={m.val}
                            onClick={() => update('timeAvailable', m.val)}
                            className={cn(
                              'flex flex-col items-center py-4 rounded-xl border transition-all',
                              form.timeAvailable === m.val
                                ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            )}
                          >
                            <span className={cn('text-2xl font-black', form.timeAvailable === m.val ? 'text-white' : 'text-slate-800')}>{m.val}</span>
                            <span className={cn('text-[10px] font-bold mt-1 uppercase tracking-wide', form.timeAvailable === m.val ? 'text-slate-300' : 'text-slate-500')}>{m.val === 1 ? 'Month' : 'Months'}</span>
                            <span className={cn('text-[10px] mt-0.5', form.timeAvailable === m.val ? 'text-teal-300' : 'text-slate-400')}>{m.sub}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <SectionLabel>Daily Study Hours</SectionLabel>
                        <span className="flex items-center gap-1.5 text-sm font-black text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1 rounded-lg">
                          <Sun className="w-3.5 h-3.5" />
                          {form.dailyHours} hr/day
                        </span>
                      </div>
                      <input
                        type="range" min={1} max={8} step={1}
                        value={form.dailyHours}
                        onChange={e => update('dailyHours', Number(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-teal-500"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                        <span>1h Casual</span><span>4h Balanced</span><span>8h Intense</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: Learning Style ── */}
              {step === 4 && (
                <div>
                  <StepTitle title="Preferred Learning Style" sub="We'll tailor resource recommendations to how you learn best." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {LEARNING_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => update('learningStyle', s.id)}
                        className={cn(
                          'flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all',
                          form.learningStyle === s.id
                            ? 'border-slate-800 bg-slate-800 text-white shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        )}
                      >
                        <span className="text-2xl">{s.emoji}</span>
                        <span className={cn('text-sm font-bold', form.learningStyle === s.id ? 'text-white' : 'text-slate-700')}>{s.id}</span>
                        {form.learningStyle === s.id && <CheckCircle2 className="w-4 h-4 text-teal-300 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 5: Biggest Challenge ── */}
              {step === 5 && (
                <div>
                  <StepTitle title="Biggest Challenge" sub="What's currently blocking you the most? Be honest." />
                  <div className="space-y-2">
                    {CHALLENGES.map(c => (
                      <button
                        key={c}
                        onClick={() => update('biggestChallenge', c)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all',
                          form.biggestChallenge === c
                            ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-sm'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        )}
                      >
                        {form.biggestChallenge === c
                          ? <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                          : <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        }
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 6: Free Text ── */}
              {step === 6 && (
                <div>
                  <StepTitle title="Tell Us About Yourself" sub="The more detail you share, the more personalized your roadmap will be." />
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Current Situation <span className="text-slate-400 font-normal">(skills, projects, internships, hackathons…)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.currentSituation}
                        onChange={e => update('currentSituation', e.target.value)}
                        placeholder="e.g. I built 2 MERN projects, participated in SIH, know basic React but struggle with DSA…"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 text-sm text-slate-700 resize-none outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Career Aspirations <span className="text-slate-400 font-normal">(dream job, target companies…)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.careerAspirations}
                        onChange={e => update('careerAspirations', e.target.value)}
                        placeholder="e.g. I want to become an AI Engineer, targeting product-based companies like Google or Flipkart…"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 text-sm text-slate-700 resize-none outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Current Challenges <span className="text-slate-400 font-normal">(what's holding you back?)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={form.currentChallenges}
                        onChange={e => update('currentChallenges', e.target.value)}
                        placeholder="e.g. I'm inconsistent and often don't know what to learn next…"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 text-sm text-slate-700 resize-none outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={form.additionalNotes}
                        onChange={e => update('additionalNotes', e.target.value)}
                        placeholder="Anything else the AI mentor should know about you…"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 text-sm text-slate-700 resize-none outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-slate-50/40">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-[11px] font-bold text-slate-400 tracking-widest">{step + 1} OF {STEPS.length}</span>

          <motion.button
            onClick={goNext}
            disabled={!canAdvance || isGenerating}
            whileHover={{ scale: canAdvance ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all',
              canAdvance
                ? 'bg-slate-800 text-white shadow-lg hover:bg-slate-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            )}
          >
            {isGenerating
              ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /><span>Generating...</span></>
              : step === 6
                ? <><Sparkles className="w-4 h-4 text-teal-300" /><span>Generate AI Roadmap</span></>
                : <><span>Next Step</span><ChevronRight className="w-4 h-4" /></>
            }
          </motion.button>
        </div>
      </div>
    </div>
  )
}
