'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useSpring, animated } from '@react-spring/web'
import { FileText, Flame, Clock, CheckCircle2, ChevronRight, Award, Lock, Mic, Video, Activity, User, Home } from 'lucide-react'
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
      if (v < 0.25) {
        setActiveState(0) // Dashboard Home
      } else if (v < 0.50) {
        setActiveState(1) // Resume Reviewer
      } else if (v < 0.75) {
        setActiveState(2) // DSA Roadmap
      } else {
        setActiveState(3) // Mock Interview
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
        <div className="relative w-[280px] h-[560px] bg-white rounded-[44px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-slate-200 z-10 flex flex-col overflow-hidden">
          {/* Speaker / Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-white border-x border-b border-slate-200 rounded-b-2xl z-30 flex items-center justify-center shadow-sm">
            <div className="w-12 h-1 bg-slate-200 rounded-full" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative flex-1 bg-[#F8F9FF] rounded-[36px] overflow-hidden flex flex-col text-left px-4 pt-7 pb-14">
            <AnimatePresence mode="wait">
              {activeState === 0 && (
                <motion.div
                  key="dash-home"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5 flex flex-col h-full"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-border-default">
                    <span className="text-[10px] font-bold text-text-primary font-display">LaunchPad</span>
                    <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[8px] font-bold">PS</span>
                  </div>

                  {/* Dashboard card */}
                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft space-y-1.5">
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
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-2 bg-white border border-border-default rounded-card shadow-soft">
                      <span className="text-[7px] text-text-muted font-bold uppercase">Resume</span>
                      <p className="text-xs font-bold text-teal mt-0.5">78/100</p>
                    </div>
                    <div className="p-2 bg-white border border-border-default rounded-card shadow-soft">
                      <span className="text-[7px] text-text-muted font-bold uppercase">Streaks</span>
                      <p className="text-xs font-bold text-indigo mt-0.5">14 Days</p>
                    </div>
                  </div>

                  {/* Activity Graph */}
                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Activity</span>
                      <Activity className="w-3 h-3 text-teal" />
                    </div>
                    <div className="flex items-end gap-1 h-8">
                      {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-teal/10 rounded-t-sm relative overflow-hidden">
                          <div className="absolute bottom-0 w-full bg-teal rounded-t-sm" style={{ height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Tasks */}
                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft space-y-1.5">
                    <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Upcoming Tasks</span>
                    <div className="flex items-center gap-2 text-[8px]">
                      <div className="w-1 h-1 rounded-full bg-gold flex-shrink-0" />
                      <span className="text-text-primary font-medium">Complete Two Pointers module</span>
                    </div>
                    <div className="flex items-center gap-2 text-[8px]">
                      <div className="w-1 h-1 rounded-full bg-teal flex-shrink-0" />
                      <span className="text-text-primary font-medium">Update resume with project metrics</span>
                    </div>
                    <div className="flex items-center gap-2 text-[8px]">
                      <div className="w-1 h-1 rounded-full bg-indigo flex-shrink-0" />
                      <span className="text-text-primary font-medium">Practice mock interview</span>
                    </div>
                  </div>

                  <div className="p-2 bg-indigo/5 border border-indigo/10 rounded-card text-[8px] text-indigo font-medium text-center mt-auto">
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
                  className="space-y-2.5 flex flex-col h-full"
                >
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-teal-light text-teal font-bold w-fit">AI Resume Review</span>
                  <h5 className="text-xs font-bold text-text-primary">ATS compatibility report</h5>

                  <div className="flex items-center gap-3 p-2.5 bg-white border border-border-default rounded-card shadow-soft">
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

                  {/* Score Breakdown */}
                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft space-y-2">
                    <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Score Breakdown</span>
                    <div className="space-y-1.5">
                      <div>
                        <div className="flex justify-between text-[7px] font-medium text-text-secondary mb-0.5">
                          <span>ATS Compatibility</span>
                          <span>82%</span>
                        </div>
                        <div className="w-full h-1 bg-bg-subtle rounded-full overflow-hidden">
                          <div className="h-full bg-teal rounded-full w-[82%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[7px] font-medium text-text-secondary mb-0.5">
                          <span>Impact Metrics</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full h-1 bg-bg-subtle rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full w-[65%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions checklist */}
                  <div className="space-y-1.5 border-t border-border-default pt-2">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[9px] font-bold text-text-primary">Action Items</span>
                      <span className="text-[7px] text-text-muted">4 pending fixes</span>
                    </div>
                    <div className="p-1.5 bg-red-50/50 border border-red-100 rounded-md text-[7px] text-red-800 font-medium flex gap-1.5 items-start">
                      <span>🔴</span>
                      <span>Add quantified metrics (%, $, x) in your Tech Solutions project section.</span>
                    </div>
                    <div className="p-1.5 bg-amber-50/50 border border-amber-100 rounded-md text-[7px] text-amber-800 font-medium flex gap-1.5 items-start">
                      <span>🟡</span>
                      <span>Replace passive verb "worked on" with active verbs like "architected".</span>
                    </div>
                    <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-md text-[7px] text-indigo-800 font-medium flex gap-1.5 items-start">
                      <span>🔵</span>
                      <span>Include link to live deployment for Smart Attendance System.</span>
                    </div>
                  </div>

                  {/* Target Roles Match */}
                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft space-y-1.5">
                    <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Role Matching</span>
                    <div className="flex justify-between items-center text-[8px]">
                      <span className="text-text-primary font-medium">Software Engineer (SDE-1)</span>
                      <span className="text-teal font-bold bg-teal/5 px-1.5 py-0.5 rounded">84% Match</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px]">
                      <span className="text-text-primary font-medium">Full Stack Developer</span>
                      <span className="text-teal font-bold bg-teal/5 px-1.5 py-0.5 rounded">80% Match</span>
                    </div>
                  </div>

                  <button className="w-full py-1.5 bg-teal text-white rounded-btn text-[8px] font-bold mt-auto">
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
                  className="space-y-2.5 flex flex-col h-full"
                >
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-light text-indigo font-bold w-fit">DSA Learning Map</span>
                  <h5 className="text-xs font-bold text-text-primary">Algorithm Nodes</h5>

                  {/* Complex Vertical Timeline Mock */}
                  <div className="relative pl-4 border-l-2 border-slate-200 ml-1.5 space-y-3 mt-1 text-[9px]">
                    
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal border-2 border-white shadow-soft" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-text-primary text-[10px]">Arrays & Hashing</p>
                          <p className="text-text-muted mt-0.5">Mastered • 15/15 Solved</p>
                        </div>
                        <span className="bg-teal/10 text-teal px-1.5 py-0.5 rounded text-[7px] font-bold">100%</span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gold border-2 border-white shadow-soft animate-pulse" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-text-primary text-[10px]">Two Pointers</p>
                          <p className="text-gold font-semibold mt-0.5">In Progress • 4/8 Solved</p>
                        </div>
                        <span className="bg-gold/10 text-gold px-1.5 py-0.5 rounded text-[7px] font-bold">50%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5">
                        <div className="h-full bg-gold w-1/2 rounded-full" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-text-muted text-[10px]">Sliding Window</p>
                          <p className="text-slate-400 mt-0.5">Locked • Requires previous</p>
                        </div>
                        <Lock className="w-2.5 h-2.5 text-slate-400 mt-0.5" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-text-muted text-[10px]">Trees & Graphs</p>
                          <p className="text-slate-400 mt-0.5">Locked • Advanced</p>
                        </div>
                        <Lock className="w-2.5 h-2.5 text-slate-400 mt-0.5" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-text-muted text-[10px]">Dynamic Programming</p>
                          <p className="text-slate-400 mt-0.5">Locked • Expert</p>
                        </div>
                        <Lock className="w-2.5 h-2.5 text-slate-400 mt-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* AI Daily Goal */}
                  <div className="p-2 bg-indigo-50/50 border border-indigo-100/50 rounded-card text-[8px] text-text-secondary leading-normal flex items-start gap-1.5">
                    <span>💡</span>
                    <p>
                      Solve 2 more questions in <strong>Two Pointers</strong> to unlock the <strong>Sliding Window</strong> node.
                    </p>
                  </div>

                  {/* AI Recommendations */}
                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft space-y-1.5">
                    <div className="flex justify-between items-center text-[7px] text-text-muted font-bold uppercase tracking-wider">
                      <span>Recommended Problems</span>
                      <span className="text-indigo font-bold">Try Next</span>
                    </div>
                    <div className="space-y-1 text-[8px]">
                      <div className="flex items-center justify-between p-1 bg-slate-50 border border-slate-100 rounded-md">
                        <span className="font-medium text-text-primary">3Sum</span>
                        <span className="text-gold font-bold">Medium</span>
                      </div>
                      <div className="flex items-center justify-between p-1 bg-slate-50 border border-slate-100 rounded-md">
                        <span className="font-medium text-text-primary">Container With Most Water</span>
                        <span className="text-gold font-bold">Medium</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 bg-indigo/5 border border-indigo/10 rounded-card text-[8px] text-text-secondary text-center mt-auto">
                    Solved: <strong>120 / 200</strong> problems
                  </div>
                </motion.div>
              )}

              {activeState === 3 && (
                <motion.div
                  key="mock-interview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5 flex flex-col h-full"
                >
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold w-fit">Live Mock Interview</span>
                  <h5 className="text-xs font-bold text-text-primary">Behavioral Session</h5>
                  
                  {/* Video Call Mock */}
                  <div className="relative w-full h-28 bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center opacity-50">
                      <div className="w-16 h-16 rounded-full bg-indigo-200 blur-xl animate-pulse" />
                    </div>
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <div className="bg-black/50 backdrop-blur-md p-1.5 rounded-full">
                        <Mic className="w-3 h-3 text-white" />
                      </div>
                      <div className="bg-black/50 backdrop-blur-md p-1.5 rounded-full">
                        <Video className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-red-50 text-red-600 border border-red-100 text-[7px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                    </div>
                    <div className="absolute bottom-2 right-2 w-10 h-14 bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
                      <div className="w-full h-full bg-gradient-to-t from-teal-500/30 to-indigo-500/30" />
                    </div>
                  </div>

                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft space-y-1">
                    <span className="text-[8px] text-text-muted font-bold uppercase">AI Feedback</span>
                    <p className="text-[9px] text-text-primary leading-tight">
                      "Great STAR method usage! Try to speak a bit slower when explaining the technical constraints."
                    </p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="p-2 bg-white border border-border-default rounded-card shadow-soft text-center">
                      <span className="text-[7px] text-text-muted font-bold uppercase">Clarity</span>
                      <p className="text-[10px] font-bold text-teal mt-0.5">8/10</p>
                    </div>
                    <div className="p-2 bg-white border border-border-default rounded-card shadow-soft text-center">
                      <span className="text-[7px] text-text-muted font-bold uppercase">Structure</span>
                      <p className="text-[10px] font-bold text-indigo mt-0.5">9/10</p>
                    </div>
                    <div className="p-2 bg-white border border-border-default rounded-card shadow-soft text-center">
                      <span className="text-[7px] text-text-muted font-bold uppercase">Pace</span>
                      <p className="text-[10px] font-bold text-gold mt-0.5">6/10</p>
                    </div>
                  </div>

                  <div className="p-2 bg-purple-50 border border-purple-100 rounded-card text-[8px] text-purple-700 font-medium text-center">
                    📊 Session 3 of 5 completed
                  </div>

                  {/* Key Takeaways */}
                  <div className="p-2.5 bg-white border border-border-default rounded-card shadow-soft space-y-1.5">
                    <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider">Key Strengths</span>
                    <div className="space-y-1 text-[8px]">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <span className="text-purple-600 font-bold">✓</span>
                        <span>Structured response format (STAR method)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <span className="text-purple-600 font-bold">✓</span>
                        <span>Clear communication of technical constraints</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-1.5 bg-purple-600 text-white rounded-btn text-[8px] font-bold mt-auto">
                    End Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Dock Navigation */}
            <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200/50 px-5 py-3 flex justify-between items-center z-20">
              <div className="flex flex-col items-center gap-1 text-teal">
                <Home className="w-[14px] h-[14px]" />
                <span className="text-[6px] font-bold">Home</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <FileText className="w-[14px] h-[14px]" />
                <span className="text-[6px] font-medium">Resume</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <Activity className="w-[14px] h-[14px]" />
                <span className="text-[6px] font-medium">Prep</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <User className="w-[14px] h-[14px]" />
                <span className="text-[6px] font-medium">Profile</span>
              </div>
            </div>
          </div>

          {/* Home indicator bar */}
          <div className="w-24 h-1 bg-slate-300 rounded-full mx-auto my-1.5" />
        </div>
      </div>
    </section>
  )
}
