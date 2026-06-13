'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { FileText, Flame, Clock, CheckCircle2, ChevronRight, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Floating Glass Card with React Spring ─────────────────────── */
function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const floatSpring = useSpring({
    from: { y: 0 },
    to: async (next) => {
      while (true) {
        await next({ y: -15, config: { duration: 2500 + delay * 600 } })
        await next({ y: 0, config: { duration: 2500 + delay * 600 } })
      }
    },
  })

  return (
    <animated.div
      style={{ transform: floatSpring.y.to((y) => `translateY(${y}px)`) }}
      className={cn(
        'absolute bg-white rounded-card p-4 shadow-medium border border-border-default z-20 max-w-[200px]',
        className
      )}
    >
      {children}
    </animated.div>
  )
}

export default function PhoneMockup() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll position of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Map scroll progress to screen state indexes (0, 1, 2)
  const [activeState, setActiveState] = useState(0)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      if (v < 0.35) {
        setActiveState(0) // Dashboard Home
      } else if (v < 0.65) {
        setActiveState(1) // Resume Reviewer
      } else {
        setActiveState(2) // DSA Roadmap
      }
    })
  }, [scrollYProgress])

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-white flex flex-col items-center overflow-hidden"
    >
      {/* Title Header */}
      <div className="text-center px-6 max-w-2xl mx-auto mb-16 relative z-10">
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary tracking-tight leading-tight">
          Everything in one place.
        </h2>
        <p className="text-text-secondary text-base md:text-lg mt-4 font-sans font-medium">
          Your resume, your roadmap, your interviews — all guided by AI.
        </p>
      </div>

      {/* Main Center Container */}
      <div className="relative w-full max-w-md md:max-w-2xl min-h-[580px] flex items-center justify-center px-6 mt-8">
        
        {/* Floating Cards (React Spring) */}
        <FloatingCard className="-left-4 top-[10%] md:left-[5%]" delay={0}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal/5 flex items-center justify-center text-teal">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide">Resume Score</p>
              <p className="font-display text-sm font-extrabold text-text-primary mt-0.5">78/100</p>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard className="-right-4 top-[15%] md:right-[5%]" delay={1}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo/5 flex items-center justify-center text-indigo">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide">DSA Streak</p>
              <p className="font-display text-sm font-extrabold text-text-primary mt-0.5">🔥 14 Days</p>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard className="-left-4 bottom-[20%] md:left-[2%]" delay={2}>
          <div>
            <p className="text-[9px] text-text-muted font-bold uppercase tracking-wide mb-1">Deadlines This Week</p>
            <div className="flex gap-1">
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-gold-light text-gold border border-gold/10 font-bold">Amazon</span>
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-indigo-light text-indigo border border-indigo/10 font-bold">GSoC</span>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard className="-right-4 bottom-[25%] md:right-[2%]" delay={3}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal fill-teal/5" />
            <span className="text-[10px] font-bold text-text-secondary">AI Interview Ready</span>
          </div>
        </FloatingCard>

        {/* CSS iPhone Frame Mockup */}
        <div className="relative w-[280px] h-[560px] bg-slate-900 rounded-[44px] p-3 shadow-medium border-4 border-slate-800 z-10 flex flex-col overflow-hidden">
          {/* Speaker / Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-900 rounded-b-2xl z-30 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative flex-1 bg-[#F8F9FF] rounded-[36px] overflow-hidden flex flex-col text-left p-4 pt-8">
            <AnimatePresence mode="wait">
              {activeState === 0 && (
                <motion.div
                  key="dash-home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 flex flex-col h-full justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-border-default">
                      <span className="text-[10px] font-bold text-text-primary font-display">LaunchPad</span>
                      <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[8px] font-bold">PS</span>
                    </div>

                    {/* Dashboard card */}
                    <div className="p-3 bg-white border border-border-default rounded-card shadow-soft space-y-2">
                      <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Overall Progress</span>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-text-primary">42% Complete</span>
                        <span className="text-[9px] text-teal font-bold">14/20 topics</span>
                      </div>
                      <div className="w-full h-1 bg-bg-subtle rounded-full overflow-hidden">
                        <div className="h-full bg-teal w-[42%]" />
                      </div>
                    </div>

                    {/* Stats mini */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft">
                        <span className="text-[7px] text-text-muted font-bold uppercase">Resume</span>
                        <p className="text-xs font-bold text-teal mt-0.5">78/100</p>
                      </div>
                      <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft">
                        <span className="text-[7px] text-text-muted font-bold uppercase">Streaks</span>
                        <p className="text-xs font-bold text-indigo mt-0.5">14 Days</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-indigo/5 border border-indigo/10 rounded-card text-[9px] text-indigo font-medium text-center">
                    ⚡ 3 opportunities closing this week!
                  </div>
                </motion.div>
              )}

              {activeState === 1 && (
                <motion.div
                  key="resume-review"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 flex flex-col h-full justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-light text-teal font-bold">AI Resume Review</span>
                    <h5 className="text-xs font-bold text-text-primary">ATS compatibility report</h5>

                    <div className="flex items-center gap-3 p-3 bg-white border border-border-default rounded-card shadow-soft">
                      <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="20" cy="20" r="16" stroke="#EEF2FF" strokeWidth="3.5" fill="none" />
                          <circle cx="20" cy="20" r="16" stroke="#0D9488" strokeWidth="3.5" fill="none" strokeDasharray={2*Math.PI*16} strokeDashoffset={2*Math.PI*16*0.22} />
                        </svg>
                        <span className="absolute text-[8px] font-bold text-text-primary">78</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold text-text-primary truncate">Excellent Foundation!</p>
                        <p className="text-[7px] text-text-muted leading-tight mt-0.5">Ready for SDE-1 applications.</p>
                      </div>
                    </div>

                    {/* Suggestions checklist */}
                    <div className="space-y-1.5">
                      <div className="p-2 bg-red-50/50 border border-red-100 rounded text-[7px] text-red-800">
                        🔴 Add quantified metrics in projects section.
                      </div>
                      <div className="p-2 bg-amber-50/50 border border-amber-100 rounded text-[7px] text-amber-800">
                        🟡 Replace passive verbs with developed/implemented.
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-teal text-white rounded-btn text-[8px] font-bold">
                    Re-upload Resume
                  </button>
                </motion.div>
              )}

              {activeState === 2 && (
                <motion.div
                  key="dsa-map"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 flex flex-col h-full justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-light text-indigo font-bold">DSA Learning Map</span>
                    <h5 className="text-xs font-bold text-text-primary">Algorithm Nodes</h5>

                    {/* Simple Vertical Timeline Mock */}
                    <div className="relative pl-4 border-l border-slate-200 ml-1.5 space-y-3 mt-4 text-[8px]">
                      <div className="relative">
                        <div className="absolute -left-[20px] top-0.5 w-2.5 h-2.5 rounded-full bg-teal border border-white" />
                        <p className="font-bold text-text-primary">Arrays & Hashing</p>
                        <p className="text-text-muted">Completed (10/10)</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[20px] top-0.5 w-2.5 h-2.5 rounded-full bg-gold border border-white animate-pulse" />
                        <p className="font-bold text-text-primary">Linked Lists</p>
                        <p className="text-text-muted">In Progress (4/8)</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[20px] top-0.5 w-2.5 h-2.5 rounded-full bg-slate-200 border border-white" />
                        <p className="font-bold text-text-muted">Trees & Graphs</p>
                        <p className="text-text-muted">Locked</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-indigo/5 border border-indigo/10 rounded-card text-[8px] text-text-secondary text-center">
                    Solved: <strong>120 / 200</strong> problems
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Home indicator bar */}
          <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto my-1.5" />
        </div>
      </div>
    </section>
  )
}
