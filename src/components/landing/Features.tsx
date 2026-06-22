'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Flame, Code, Calendar, Users, Briefcase, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureRowProps {
  badgeText: string
  badgeColor: 'teal' | 'indigo' | 'purple' | 'gold'
  heading: string
  bodyText: string
  isLeftText: boolean
  pills?: string[]
  children: React.ReactNode
  customPadding?: string
  noMockupWrapper?: boolean
}

/* ── Tilt card wrapper ──────────────────────────────────── */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      className={cn('relative overflow-hidden', className)}
      style={style}
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      {/* Main tilt */}
      <motion.div
        variants={{
          rest:  { rotateY: 0,   rotateX: 0,   scale: 1,    z: 0 },
          hover: { rotateY: 6,   rotateX: -4,  scale: 1.025, z: 30 },
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
      >
        {children}
      </motion.div>

      {/* Shine sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[24px]"
        style={{
          background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
        variants={{
          rest:  { backgroundPosition: '-100% 0', opacity: 0 },
          hover: { backgroundPosition:  '200% 0', opacity: 1 },
        }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

function FeatureRow({
  badgeText,
  badgeColor,
  heading,
  bodyText,
  isLeftText,
  pills = [],
  children,
  customPadding,
  noMockupWrapper = false,
}: FeatureRowProps) {
  const badgeClasses = {
    teal:   'bg-teal-light text-teal border-teal/10',
    indigo: 'bg-indigo-light text-indigo border-indigo/10',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    gold:   'bg-gold-light text-gold border-gold/10',
  }

  const textPanel = (
    <motion.div
      initial={{ opacity: 0, x: isLeftText ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center space-y-5"
    >
      <div>
        <span className={cn(
          'text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border',
          badgeClasses[badgeColor]
        )}>
          {badgeText}
        </span>
      </div>
      <h3 className="font-display font-extrabold text-3xl md:text-4xl text-text-primary tracking-tight leading-tight">
        {heading}
      </h3>
      <p className="text-text-secondary text-sm md:text-base leading-relaxed font-sans font-medium">
        {bodyText}
      </p>

      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {pills.map((pill, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              className="text-[10px] font-bold px-3 py-1.5 bg-bg-subtle text-text-secondary rounded-full border border-border-default shadow-soft"
            >
              {pill}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  )

  const mockupPanel = (
    <motion.div
      initial={{ opacity: 0, x: isLeftText ? 50 : -50, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-stretch justify-center w-full h-full"
    >
      {noMockupWrapper ? (
        <TiltCard className="w-full h-full">
          <div className="shadow-medium rounded-[24px]">{children}</div>
        </TiltCard>
      ) : (
        <TiltCard className="w-full bg-bg-subtle rounded-[24px] border border-border-default shadow-soft relative overflow-hidden flex items-center justify-center p-6 md:p-8 min-h-[360px] md:min-h-[420px]">
          {children}
        </TiltCard>
      )}
    </motion.div>
  )

  return (
    <div className={cn(
      'max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 feature-row items-center',
      customPadding ? customPadding : 'py-[60px]'
    )}>
      {isLeftText ? (
        <>{textPanel}{mockupPanel}</>
      ) : (
        <>{mockupPanel}{textPanel}</>
      )}
    </div>
  )
}

export default function Features() {
  return (
    <div className="bg-transparent">
      {/* Row 1: Resume */}
      <FeatureRow
        badgeText="Resume Reviewer"
        badgeColor="teal"
        heading="Get feedback that actually helps."
        bodyText="Upload your resume and get structured, actionable feedback aligned with Indian startup and product company hiring standards. Know exactly what to fix and why."
        isLeftText={true}
        pills={['ATS Score', 'Impact Language', 'Keyword Gaps']}
      >
        <div className="w-full glass rounded-card border border-border-default p-6 shadow-medium space-y-4 max-w-sm">
          <div className="flex items-center gap-4 border-b border-border-subtle pb-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                <circle cx="24" cy="24" r="20" stroke="#0D9488" strokeWidth="4" fill="none" strokeDasharray={2*Math.PI*20} strokeDashoffset={2*Math.PI*20*0.22} />
              </svg>
              <span className="absolute text-[11px] font-bold text-text-primary">78</span>
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">Resume Score Report</p>
              <p className="text-[10px] text-text-muted font-sans font-medium">ATS Readability Check</p>
            </div>
          </div>

          <div className="space-y-2 text-[10px] font-sans font-semibold text-text-secondary">
            <div className="flex justify-between">
              <span>ATS Compatibility</span>
              <span className="text-teal">82%</span>
            </div>
            <div className="w-full h-1.5 bg-bg-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal"
                initial={{ width: 0 }}
                whileInView={{ width: '82%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <div className="flex justify-between">
              <span>Quantified Achievements</span>
              <span className="text-gold">65%</span>
            </div>
            <div className="w-full h-1.5 bg-bg-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gold"
                initial={{ width: 0 }}
                whileInView={{ width: '65%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle space-y-1.5 font-sans">
            <div className="p-2.5 bg-red-50 text-red-700 rounded text-[9px] flex gap-1.5 items-start leading-relaxed font-semibold">
              <span>🔴</span>
              <span>Missing metrics: add project percentages and margins.</span>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded text-[9px] flex gap-1.5 items-start leading-relaxed font-semibold">
              <span>🟡</span>
              <span>Weak verbs: replace &quot;worked on&quot; with &quot;architected&quot;.</span>
            </div>
          </div>
        </div>
      </FeatureRow>

      {/* Row 2: DSA Roadmap */}
      <FeatureRow
        badgeText="DSA Roadmap"
        badgeColor="indigo"
        heading="Stop grinding. Start progressing."
        bodyText="A structured, topic-by-topic DSA learning path with daily streaks, progress tracking, and weak-area identification. Know exactly where you are and what to do next."
        isLeftText={false}
        pills={['🔥 14 Days Streak', '234 problems solved']}
        customPadding="py-20"
        noMockupWrapper={true}
      >
        <div className="w-full h-full min-h-[480px] glass rounded-3xl p-8 relative overflow-hidden border border-border-default shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-heading font-700 text-lg text-text-primary tracking-tight">DSA Roadmap</span>
              <span className="text-[#0D9488] font-semibold text-sm">14 / 20 Complete</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full mb-8">
              <motion.div
                className="h-2 bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '70%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>

            <div className="relative h-48 w-full mt-4 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 40 50 Q 80 120, 110 130 T 180 60 T 250 140 T 320 50 T 380 90" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                <path d="M 40 50 Q 80 120, 110 130" fill="none" stroke="#0D9488" strokeWidth="4" />
                <path d="M 110 130 Q 145 140, 180 60" fill="none" stroke="#F59E0B" strokeWidth="4" strokeDasharray="6,6" />
              </svg>

              {/* Nodes */}
              {[
                { left: '5%',  top: '10%',   bg: 'bg-[#0D9488]',   text: '✓',  label: 'Arrays', opacity: '' },
                { left: '22%', bottom: '10%', bg: 'bg-[#0B0F19]',        text: '🔥', label: 'Linked Lists', opacity: '', pulse: true, border: 'border-[#F59E0B]' },
                { left: '40%', top: '15%',   bg: 'bg-[#0B0F19]',        lock: true, label: 'Stacks', opacity: 'opacity-60' },
                { left: '58%', bottom: '15%', bg: 'bg-[#0B0F19]',        lock: true, label: 'Trees',  opacity: 'opacity-60' },
                { left: '75%', top: '10%',   bg: 'bg-[#0B0F19]',        lock: true, label: 'Graphs', opacity: 'opacity-60' },
                { right: '5%', top: '40%',   bg: 'bg-[#0B0F19]',        lock: true, label: 'DP',     opacity: 'opacity-60' },
              ].map((node, i) => (
                <div
                  key={i}
                  className={`absolute flex flex-col items-center ${node.opacity}`}
                  style={{ left: node.left, right: (node as any).right, top: node.top, bottom: (node as any).bottom }}
                >
                  <div className={`relative w-8 h-8 rounded-full ${node.bg} flex items-center justify-center font-display font-extrabold ${node.lock ? 'border border-border-default text-text-muted shadow-soft' : `border-2 ${(node as any).border || 'border-white'} text-white shadow-soft`}`}>
                    {(node as any).pulse && <span className="absolute inset-0 w-full h-full rounded-full bg-[#F59E0B]/20 animate-ping" />}
                    {node.lock ? <Lock className="w-3.5 h-3.5" /> : node.text}
                  </div>
                  <span className="text-[9px] font-bold text-text-secondary mt-1">{node.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 mt-8 font-sans">
            <span className="bg-[#E6FAF8] text-[#0D9488] text-xs font-semibold px-4 py-2 rounded-full border border-[#0D9488]/10 shadow-soft">🔥 14 Days Streak</span>
            <span className="bg-[#EEF2FF] text-[#6366F1] text-xs font-semibold px-4 py-2 rounded-full border border-[#6366F1]/10 shadow-soft">234 Problems Solved</span>
            <span className="bg-[#FEF3C7] text-[#D97706] text-xs font-semibold px-4 py-2 rounded-full border border-[#FBBF24]/10 shadow-soft">⚡ 3 Topics In Progress</span>
          </div>
        </div>
      </FeatureRow>

      {/* Row 3: Mock Interview */}
      <FeatureRow
        badgeText="Mock Interview"
        badgeColor="purple"
        heading="Practice like it's the real thing."
        bodyText="AI-driven technical and HR interview rounds with detailed performance feedback. Personalised by your target company — startup, mid-size, or FAANG."
        isLeftText={true}
        pills={['Simulated Webcam', 'Live Timer', 'Score Accordion']}
      >
        <div className="relative w-full max-w-md h-[280px] flex items-center justify-center">
          {/* Main Mockup Card */}
          <div className="w-full max-w-sm glass text-text-primary rounded-card p-6 border border-border-default shadow-medium space-y-4 font-mono text-[10px] relative z-10">
            <div className="flex justify-between items-center border-b border-border-subtle pb-2 text-[8px] text-text-muted">
              <span>LIVE RECORDING SESSION • SDE Round</span>
              <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 animate-pulse font-bold border border-red-100">LIVE</span>
            </div>
            
            <div className="flex gap-4">
              {/* Fake Webcam frame */}
              <div className="w-20 h-24 bg-bg-subtle rounded border border-border-default flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center animate-pulse text-teal-600">
                  <span className="text-xl">🧑‍💻</span>
                </div>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-0.5">
                   {[1,2,3,4,3,2].map((v,i) => <div key={i} className="w-0.5 bg-teal-500 rounded-full animate-pulse" style={{height: `${v*4}px`}} />)}
                </div>
              </div>

              <div className="flex-1 bg-bg-subtle p-4 rounded border border-border-default space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-teal font-bold uppercase text-[7px]">Question 1 of 3</span>
                  <p className="text-text-primary text-xs font-semibold leading-relaxed font-sans mt-1">
                    Explain the difference between a process and a thread. When would you use one over the other?
                  </p>
                </div>
                <div className="flex justify-end items-center mt-2">
                  <span className="text-[10px] font-bold text-text-muted font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    Timer: 12:45
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating AI Analytics Elements */}
          <div className="absolute -left-4 top-4 glass border border-border-default rounded-card p-3 shadow-medium flex flex-col items-center z-20 space-y-1">
             <span className="text-[7px] font-bold text-text-muted uppercase tracking-wider">Confidence Score</span>
             <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                  <circle cx="20" cy="20" r="16" stroke="#6366F1" strokeWidth="4" fill="none" strokeDasharray={2*Math.PI*16} strokeDashoffset={2*Math.PI*16*0.08} />
                </svg>
                <span className="absolute text-[10px] font-extrabold text-indigo">92%</span>
             </div>
          </div>

          <div className="absolute -right-6 bottom-8 glass border border-border-default rounded-lg p-2 shadow-medium flex items-center gap-2 z-20">
             <span className="w-5 h-5 rounded bg-green-100 text-green-600 flex items-center justify-center text-[10px]">👁️</span>
             <div>
                <p className="text-[9px] font-bold text-text-primary">Eye Contact</p>
                <p className="text-[7px] text-text-muted font-semibold">Perfect alignment</p>
             </div>
          </div>

          <div className="absolute left-6 -bottom-4 bg-[#0D9488] text-white rounded-lg p-2.5 shadow-medium flex items-center gap-2 z-20 border border-teal-600">
             <span className="text-[10px] font-mono">Pace:</span>
             <span className="text-[10px] font-bold">140 WPM (Good)</span>
          </div>
        </div>
      </FeatureRow>

      {/* Row 4: Projects */}
      <FeatureRow
        badgeText="Project Ideas"
        badgeColor="gold"
        heading="Build projects that stand out."
        bodyText="Get high-impact project ideas based on your skills and target companies — with tech stack, complexity level, and exactly why it'll stand out in your resume."
        isLeftText={false}
        pills={['Tech Stack Chips', 'Complexity Badges', 'Standout Tips']}
      >
        <div className="relative w-full max-w-xs h-48 flex items-center justify-center font-sans">
          <div className="absolute top-0 w-64 glass border border-border-default rounded-card p-5 shadow-medium rotate-[-4deg] z-10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-gold-light text-gold border border-gold/10">ADVANCED</span>
              <span className="text-[8px] text-text-muted font-semibold">AI / ML</span>
            </div>
            <h5 className="font-display font-bold text-xs text-text-primary">Smart Attendance face recognition</h5>
            <p className="text-[9px] text-text-secondary leading-normal font-medium">
              Attendance management system with liveness detection to prevent proxy uploads.
            </p>
          </div>
          <div className="absolute top-4 w-64 glass border border-border-subtle rounded-card p-5 shadow-soft rotate-[2deg] opacity-75 space-y-2">
            <h5 className="font-display font-bold text-xs text-text-primary">AI Study Group Matcher</h5>
            <p className="text-[9px] text-text-secondary font-medium">ML-powered matching partners based on schedules.</p>
          </div>
        </div>
      </FeatureRow>

      {/* Row 5: Teams */}
      <FeatureRow
        badgeText="Team Finder"
        badgeColor="teal"
        heading="Find your perfect team."
        bodyText="Match with complementary teammates for upcoming hackathons by skills, availability, and domain. No more going solo or scrambling last minute."
        isLeftText={true}
        pills={['Classmate Directory', 'Invite Manager', 'Availability Dot']}
      >
        <div className="w-full max-w-sm space-y-2.5 font-sans text-xs">
          {[
            { init: 'PS', bg: 'bg-teal', name: 'Priya Sharma', meta: 'VIT Vellore • Web Dev' },
            { init: 'AM', bg: 'bg-indigo', name: 'Arjun Mehta', meta: 'BITS Pilani • AI/ML' },
          ].map((m, i) => (
            <div key={i} className="p-3 glass border border-border-default rounded-card shadow-soft flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full ${m.bg} text-white flex items-center justify-center font-display font-bold text-[10px]`}>
                  {m.init}
                </div>
                <div>
                  <p className="font-bold text-text-primary flex items-center gap-1.5">
                    <span>{m.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </p>
                  <p className="text-[8px] text-text-muted font-medium">{m.meta}</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 bg-teal text-white text-[9px] font-bold rounded-full shadow-soft hover:shadow-medium transition-all">Invite</button>
            </div>
          ))}
        </div>
      </FeatureRow>

      {/* Row 6: Opportunities */}
      <FeatureRow
        badgeText="Opportunity Tracker"
        badgeColor="indigo"
        heading="Never miss a deadline again."
        bodyText="One unified calendar for internships, hackathons, fellowships, and off-campus opportunities. Smart reminders 7, 3, and 1 day before each deadline."
        isLeftText={false}
        pills={['Calendar Grid', 'Reminders Toggle', 'Countdown Badges']}
      >
        <div className="w-full glass rounded-card border border-border-default p-5 shadow-medium max-w-sm space-y-3 font-sans">
          <div className="flex justify-between items-center text-[10px] font-bold text-text-primary border-b border-border-subtle pb-2">
            <span>July 2026 Deadlines</span>
            <span className="text-indigo">6 Deadlines</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[8px] text-center text-text-secondary">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className="font-bold text-text-muted">{d}</span>
            ))}
            {Array.from({ length: 14 }).map((_, idx) => {
              const day = idx + 20
              const hasDeadline = day === 22 || day === 25 || day === 28
              return (
                <div
                  key={idx}
                  className={cn(
                    'h-8 flex flex-col items-center justify-between p-1 rounded border border-transparent',
                    hasDeadline && 'bg-indigo-light border-indigo/10'
                  )}
                >
                  <span className={cn('font-bold', hasDeadline && 'text-indigo')}>{day}</span>
                  {hasDeadline && <span className="w-1.5 h-1.5 rounded-full bg-indigo" />}
                </div>
              )
            })}
          </div>
        </div>
      </FeatureRow>
    </div>
  )
}
