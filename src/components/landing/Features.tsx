'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FileText, Flame, Code, Calendar, Users, Briefcase, Lock, Sparkles, ArrowRight, ShieldCheck, TrendingUp, CheckCircle, Video, Clock, AlertTriangle, AlertCircle, Award } from 'lucide-react'
import Link from 'next/link'

/* ── Types ── */
interface SubPoint {
  title: string
  description: string
  visual: React.ReactNode
}

interface FeatureSectionProps {
  label: string
  headline: string
  description: string
  exploreHref: string
  subPoints: SubPoint[]
  imageSide: 'left' | 'right'
}

/* ── SubPoint component that reports when it is in view ── */
interface SubPointProps {
  index: number
  title: string
  description: string
  isActive: boolean
  setActiveIndex: (index: number) => void
  visual: React.ReactNode
}

function SubPoint({ index, title, description, isActive, setActiveIndex, visual }: SubPointProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, {
    margin: "-30% 0px -30% 0px", // Trigger when element hits middle of screen
  })

  useEffect(() => {
    if (inView) {
      setActiveIndex(index)
    }
  }, [inView, index, setActiveIndex])

  return (
    <div
      ref={ref}
      className={cn(
        "py-10 border-l-2 transition-all duration-500 pl-6 space-y-2 cursor-pointer",
        isActive 
          ? "border-teal opacity-100" 
          : "border-[#333333] hover:border-zinc-300 opacity-40"
      )}
      onClick={() => setActiveIndex(index)}
    >
      <h4 className="font-display font-bold text-lg sm:text-xl text-white">
        {title}
      </h4>
      <p className="text-[#A0A0A0] font-sans text-sm sm:text-base leading-relaxed">
        {description}
      </p>

      {/* Stacked mobile visual, hidden on desktop */}
      <div className="block lg:hidden pt-6">
        <div className={cn(
          "bg-[#222222]/50 rounded-2xl border border-[#333333] p-6 flex items-center justify-center min-h-[300px] transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-40"
        )}>
          {visual}
        </div>
      </div>
    </div>
  )
}

/* ── FeatureSection: Handles the sticky layout side-by-side ── */
function FeatureSection({
  label,
  headline,
  description,
  exploreHref,
  subPoints,
  imageSide,
}: FeatureSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="bg-[#1A1A1A] py-24 lg:py-36 border-b border-[#333333] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start",
          imageSide === 'left' ? "dir-rtl" : "" // Handle text/image side swapping
        )}>
          
          {/* Left Column: Text (always reads left-to-right inside, even if layout is swapped) */}
          <div className={cn(
            "lg:col-span-6 flex flex-col space-y-8",
            imageSide === 'left' ? "dir-ltr" : ""
          )}>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                {label}
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-none">
                {headline}
              </h2>
              <p className="text-[#A0A0A0] font-sans text-base sm:text-lg leading-relaxed max-w-xl">
                {description}
              </p>
              <div>
                <Link
                  href={exploreHref}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-400-700 transition-colors group"
                >
                  <span>Explore {label}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Scrollable Points */}
            <div className="space-y-6 pt-8">
              {subPoints.map((pt, idx) => (
                <SubPoint
                  key={idx}
                  index={idx}
                  title={pt.title}
                  description={pt.description}
                  isActive={activeIndex === idx}
                  setActiveIndex={setActiveIndex}
                  visual={pt.visual}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Sticky Visual container (hidden on mobile, stacked inside SubPoint) */}
          <div className={cn(
            "hidden lg:block lg:col-span-6 sticky top-32 h-[500px]",
            imageSide === 'left' ? "dir-ltr" : ""
          )}>
            <div className="w-full h-full bg-[#222222]/50 rounded-3xl border border-[#333333] flex items-center justify-center p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {subPoints[activeIndex].visual}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ── Main Features Component ── */
export default function Features() {
  
  // Section 1: Resume subpoints and visual components
  const resumePoints: SubPoint[] = [
    {
      title: "ATS Score Check",
      description: "Get a comprehensive compatibility check on headers, document structure, and keywords immediately upon upload.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 shadow-soft max-w-sm space-y-4 font-sans text-xs">
          <div className="flex items-center gap-4 border-b border-[#333333] pb-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                <circle cx="24" cy="24" r="20" stroke="#0D9488" strokeWidth="4" fill="none" strokeDasharray={2*Math.PI*20} strokeDashoffset={2*Math.PI*20*0.22} />
              </svg>
              <span className="absolute text-[11px] font-bold text-white">78</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Resume Score Report</p>
              <p className="text-[10px] text-zinc-400 font-medium">ATS Readability Check</p>
            </div>
          </div>
          <div className="space-y-2 text-[10px] font-semibold text-[#A0A0A0]">
            <div className="flex justify-between">
              <span>ATS Compatibility</span>
              <span className="text-cyan-400">82%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 w-[82%]" />
            </div>
            <div className="flex justify-between">
              <span>Quantified Achievements</span>
              <span className="text-amber-550">65%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[65%]" />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Keyword Matching",
      description: "Compare your resume against your target job descriptions to identify missing skills and industry keywords.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <h5 className="font-bold text-white border-b border-zinc-55 pb-2">Target Skills Gap Analysis</h5>
          <div className="space-y-2.5">
            {[
              { skill: "React / Next.js", match: true },
              { skill: "TypeScript", match: true },
              { skill: "Node.js & Express", match: true },
              { skill: "System Design (scalable APIs)", match: false },
              { skill: "MongoDB & Mongoose", match: true },
            ].map((s, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px]">
                <span className="font-medium text-zinc-700">{s.skill}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-bold",
                  s.match ? "bg-cyan-500-light text-cyan-400 border border-teal/10" : "bg-red-50 text-red-600 border border-red-100"
                )}>
                  {s.match ? "Matched ✓" : "Missing ❌"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Impact Analysis",
      description: "Audits your description bullet points to replace weak verbs and prompt you for missing percentage metrics.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <h5 className="font-bold text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Impact Verb Audit
          </h5>
          <div className="space-y-2 pt-1">
            <div className="p-3 bg-[#222222] border border-[#333333] rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400">
                <span className="line-through">Worked on</span>
                <span className="text-[#A0A0A0]">➔</span>
                <span className="text-cyan-400 font-extrabold">Architected</span>
              </div>
              <p className="text-[10px] text-[#A0A0A0] leading-normal">
                &quot;<span className="text-cyan-400 font-bold">Architected</span> the student matching system...&quot;
              </p>
            </div>
            <div className="p-3 bg-[#222222] border border-[#333333] rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400">
                <span className="line-through">Responsible for</span>
                <span className="text-[#A0A0A0]">➔</span>
                <span className="text-cyan-400 font-extrabold">Spearheaded</span>
              </div>
              <p className="text-[10px] text-[#A0A0A0] leading-normal">
                &quot;<span className="text-cyan-400 font-bold">Spearheaded</span> the migration of database queries...&quot;
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Actionable Feedback",
      description: "Receive priority checklists (high, medium, low severity) detailing exactly what line to edit and why.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <h5 className="font-bold text-white flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Actionable Suggestions
          </h5>
          <div className="space-y-2">
            <div className="p-3 bg-red-50/50 border border-red-150 rounded-lg text-red-950 text-[10px] leading-relaxed">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">🔴 High Priority</span>
                <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-extrabold">Missing Metric</span>
              </div>
              Add percentage results and metrics under your internship projects to quantify your impact.
            </div>
            <div className="p-3 bg-amber-50/50 border border-amber-150 rounded-lg text-amber-950 text-[10px] leading-relaxed">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">🟡 Medium Priority</span>
                <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-extrabold">Weak Verbs</span>
              </div>
              Replace passive words like &quot;helped with&quot; with action verbs like &quot;optimized&quot;.
            </div>
          </div>
        </div>
      )
    }
  ]

  // Section 2: Practice subpoints and visual components
  const practicePoints: SubPoint[] = [
    {
      title: "Tailored Roadmaps",
      description: "Get a week-by-week personalized DSA roadmap that structures topics from basic arrays to dynamic programming.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-6 shadow-soft max-w-sm space-y-4 font-sans text-xs">
          <div className="flex justify-between items-center border-b border-[#333333] pb-2">
            <span className="font-bold text-white">Personalized DSA Roadmap</span>
            <span className="text-cyan-400 font-extrabold">14 / 20 Complete</span>
          </div>
          <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-teal to-[#0EA5E9] w-[70%]" />
          </div>
          <div className="relative h-28 w-full mt-2 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 30 40 Q 70 90, 100 100 T 170 50 T 240 100 T 310 40" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <path d="M 30 40 Q 70 90, 100 100" fill="none" stroke="#0D9488" strokeWidth="3" />
            </svg>
            <div className="absolute left-[5%] top-[15%] flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-[9px] shadow-sm">✓</div>
              <span className="text-[8px] font-bold text-[#A0A0A0] mt-1">Arrays</span>
            </div>
            <div className="absolute left-[26%] bottom-[5%] flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-teal text-cyan-400 flex items-center justify-center font-bold text-[9px] shadow-sm relative">
                <span className="absolute inset-0 rounded-full bg-cyan-500/10 animate-ping" />
                🔥
              </div>
              <span className="text-[8px] font-bold text-zinc-800 mt-1">Stacks</span>
            </div>
            <div className="absolute left-[50%] top-[20%] flex flex-col items-center opacity-60">
              <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#333333] text-zinc-400 flex items-center justify-center font-bold text-[9px] shadow-sm">
                <Lock className="w-2.5 h-2.5" />
              </div>
              <span className="text-[8px] font-bold text-zinc-400 mt-1">Trees</span>
            </div>
            <div className="absolute right-[10%] bottom-[5%] flex flex-col items-center opacity-60">
              <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#333333] text-zinc-400 flex items-center justify-center font-bold text-[9px] shadow-sm">
                <Lock className="w-2.5 h-2.5" />
              </div>
              <span className="text-[8px] font-bold text-zinc-400 mt-1">DP</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Streak Tracking",
      description: "Stay motivated with gamified daily challenge streaks and progress trackers that build long-term coding habits.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-4 font-sans text-xs">
          <div className="flex justify-between items-center">
            <h5 className="font-bold text-white">Consistency Tracker</h5>
            <span className="text-cyan-400 font-extrabold">🔥 14 Days Streak</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[8px] font-bold text-zinc-400">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
            {Array.from({ length: 14 }).map((_, idx) => {
              const day = idx + 1
              const completed = day < 13
              const active = day === 13
              return (
                <div
                  key={idx}
                  className={cn(
                    "h-6 rounded flex items-center justify-center font-mono font-bold border",
                    completed && "bg-cyan-500-light border-teal/10 text-cyan-400",
                    active && "bg-amber-50 border-amber-300 text-amber-700 animate-pulse",
                    !completed && !active && "bg-[#222222] border-[#333333] text-zinc-300"
                  )}
                >
                  {day}
                </div>
              )
            })}
          </div>
        </div>
      )
    },
    {
      title: "Simulated Interviews",
      description: "Practice real technical and HR questions under realistic, live recording session conditions.",
      visual: (
        <div className="w-full bg-[#0D1321] text-white rounded-2xl p-5 shadow-soft border border-white/5 max-w-sm space-y-3 font-mono text-[9px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-2 text-[7px] text-white/40">
            <span>LIVE INTERVIEW RUNTIME • AI Proctor</span>
            <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 animate-pulse font-bold">LIVE</span>
          </div>
          <div className="flex gap-3">
            <div className="w-16 h-20 bg-[#1A1A1A]/5 rounded border border-white/10 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
              <span className="text-lg">🧑‍💻</span>
              <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-0.5">
                {[1,2,3,2,1].map((v,i) => <div key={i} className="w-0.5 bg-cyan-500 rounded-full animate-pulse" style={{height: `${v*3}px`}} />)}
              </div>
            </div>
            <div className="flex-1 bg-[#1A1A1A]/5 p-3 rounded border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-cyan-400 font-bold uppercase text-[6px]">Question 1 of 3</span>
                <p className="text-white/90 text-[10px] font-sans font-semibold mt-1 leading-normal">
                  Explain how dynamic programming optimization differs from typical recursion.
                </p>
              </div>
              <div className="flex justify-end mt-1 text-[8px] text-white/50">
                <span>Timer: 08:34</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Pace & Eye Contact Analysis",
      description: "AI assesses non-verbal metrics such as your speaking pace (WPM), confidence, and camera eye alignment.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <h5 className="font-bold text-white">AI Speech & Video Analysis</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#222222] border border-[#333333] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <div>
                  <p className="text-[10px] font-bold text-white">Speaking Pace</p>
                  <p className="text-[8px] text-zinc-400">Target: 130-150 words/min</p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-cyan-400">140 WPM (Good)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#222222] border border-[#333333] rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <div>
                  <p className="text-[10px] font-bold text-white">Eye Alignment</p>
                  <p className="text-[8px] text-zinc-400">Eye contact with proctor</p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-indigo-600">92% Match</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  // Section 3: Connect subpoints and visual components
  const connectPoints: SubPoint[] = [
    {
      title: "Teammate Matching",
      description: "Browse peers matched to your hackathon teams by complementary skills, domains, and timeline availability.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <h5 className="font-bold text-white">Recommended Hackathon Partners</h5>
          <div className="space-y-2">
            <div className="p-3 bg-[#222222] border border-[#333333] rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold text-[9px]">PS</div>
                <div>
                  <p className="font-bold text-white">Priya Sharma</p>
                  <p className="text-[8px] text-zinc-400">VIT Vellore • Frontend & React</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500-light text-cyan-400 text-[8px] font-bold border border-teal/10">96% Match</span>
            </div>
            <div className="p-3 bg-[#222222] border border-[#333333] rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo text-white flex items-center justify-center font-bold text-[9px]">AM</div>
                <div>
                  <p className="font-bold text-white">Arjun Mehta</p>
                  <p className="text-[8px] text-zinc-400">BITS Pilani • Python & AI/ML</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-light text-indigo text-[8px] font-bold border border-indigo/10">91% Match</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Unified Calendar",
      description: "One dashboard calendar tracking internship applications, hackathon registry dates, and off-campus deadlines.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <div className="flex justify-between items-center text-[10px] font-bold text-white border-b border-[#333333] pb-2">
            <span>July 2026 Deadlines</span>
            <span className="text-cyan-400 font-extrabold">6 Deadlines Active</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[8px] text-zinc-400">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="font-bold">{d}</span>)}
            {Array.from({ length: 14 }).map((_, idx) => {
              const day = idx + 20
              const isDeadline = day === 22 || day === 25 || day === 28
              return (
                <div
                  key={idx}
                  className={cn(
                    "h-7 rounded flex flex-col items-center justify-center border font-mono font-bold",
                    isDeadline ? "bg-indigo-light border-indigo/10 text-indigo" : "bg-[#222222] border-[#333333] text-zinc-300"
                  )}
                >
                  {day}
                  {isDeadline && <span className="w-1 h-1 rounded-full bg-indigo mt-0.5" />}
                </div>
              )
            })}
          </div>
        </div>
      )
    },
    {
      title: "Smart Reminders",
      description: "Receive timely push and dashboard notifications 7 days, 3 days, and 24 hours before any deadlines expire.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <h5 className="font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            Deadline Alert Center
          </h5>
          <div className="space-y-2">
            <div className="p-3 bg-amber-50/50 border border-amber-100 text-amber-900 rounded-lg flex items-start gap-2.5 text-[10px]">
              <span className="text-amber-600 font-extrabold">⚠️</span>
              <div>
                <p className="font-bold text-white">Flipkart GRiD 6.0 Registration</p>
                <p className="text-[8px] text-[#A0A0A0] mt-0.5">Closes in 24 hours • Priority Action Required</p>
              </div>
            </div>
            <div className="p-3 bg-[#222222] border border-zinc-150 text-[#A0A0A0] rounded-lg flex items-start gap-2.5 text-[10px]">
              <span className="text-cyan-400 font-extrabold">🔔</span>
              <div>
                <p className="font-bold text-white">Google STEP Internship</p>
                <p className="text-[8px] text-[#A0A0A0] mt-0.5">Closes in 3 days • Ensure resume is updated</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Direct Invites & Collaboration",
      description: "Coordinate with other team leaders directly. Send invites and receive invitations to form your dream squad.",
      visual: (
        <div className="w-full bg-[#1A1A1A] rounded-2xl border border-[#333333] p-5 shadow-soft max-w-sm space-y-3 font-sans text-xs">
          <h5 className="font-bold text-white">Incoming Team Requests</h5>
          <div className="p-3 bg-[#222222] border border-[#333333] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo text-white flex items-center justify-center font-bold text-[9px]">SI</div>
              <div>
                <p className="font-bold text-white">Smart India Hackathon</p>
                <p className="text-[8px] text-zinc-400">From Priya Sharma (Leader)</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="px-2 py-1 bg-cyan-500 text-white rounded text-[8px] font-bold shadow-soft">Accept</button>
              <button className="px-2 py-1 bg-[#1A1A1A] border border-[#333333] text-[#A0A0A0] rounded text-[8px] font-bold">Decline</button>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="bg-[#1A1A1A]">
      {/* Section 1: Resume */}
      <FeatureSection
        label="Resume"
        headline="Get feedback that actually helps."
        description="Upload your resume and get structured, actionable feedback aligned with Indian startup and product company hiring standards. Know exactly what to fix and why."
        exploreHref="/dashboard/resume"
        subPoints={resumePoints}
        imageSide="right"
      />

      {/* Section 2: Practice */}
      <FeatureSection
        label="Practice"
        headline="Stop grinding. Start progressing."
        description="Follow a personalized week-by-week DSA roadmap and run AI mock interview simulations tailored to your target companies."
        exploreHref="/dashboard/dsa"
        subPoints={practicePoints}
        imageSide="left"
      />

      {/* Section 3: Connect */}
      <FeatureSection
        label="Connect"
        headline="Find your team and track opportunities."
        description="Assemble complementary teams for hackathons and manage all upcoming off-campus opportunities in a unified countdown calendar."
        exploreHref="/dashboard/teams"
        subPoints={connectPoints}
        imageSide="right"
      />
    </div>
  )
}
