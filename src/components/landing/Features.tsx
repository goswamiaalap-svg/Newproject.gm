'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureRowProps {
  badgeText: string
  badgeColor: 'sage' | 'lavender' | 'butter'
  heading: string
  bodyText: string
  isLeftText: boolean
  pills?: string[]
  children: React.ReactNode
  customPadding?: string
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
}: FeatureRowProps) {
  const badgeClasses = {
    sage:     'bg-sage-light text-sage border-sage/15',
    lavender: 'bg-lavender-light text-lavender border-lavender/15',
    butter:   'bg-butter-light text-butter border-butter/15',
  }

  const textPanel = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center space-y-5"
    >
      <div>
        <span className={cn(
          'text-[10.5px] font-mono font-medium uppercase tracking-wider px-3.5 py-1.5 rounded-full border',
          badgeClasses[badgeColor]
        )}>
          {badgeText}
        </span>
      </div>
      <h3 className="font-serif font-medium text-2xl md:text-[34px] text-text-primary tracking-tight leading-tight">
        {heading}
      </h3>
      <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-md">
        {bodyText}
      </p>

      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {pills.map((pill, idx) => (
            <span
              key={idx}
              className="text-[10.5px] font-mono px-3 py-1.5 bg-bg-card text-text-secondary rounded-full border border-border-default"
            >
              {pill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )

  const mockupPanel = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-stretch justify-center w-full h-full"
    >
      <div className="w-full bg-bg-subtle rounded-card border border-border-default flex items-center justify-center p-6 md:p-8 min-h-[340px] md:min-h-[400px]">
        {children}
      </div>
    </motion.div>
  )

  return (
    <div className={cn(
      'max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 feature-row items-center',
      customPadding ? customPadding : 'py-[52px]'
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
    <div className="bg-bg-base">
      {/* Section intro */}
      <div className="max-w-3xl mx-auto px-6 text-center pb-6">
        <span className="inline-block font-mono text-[10.5px] uppercase tracking-wider text-text-muted border border-border-default px-3 py-1.5 rounded-full mb-5">
          What you get
        </span>
        <h2 className="font-serif font-medium text-3xl md:text-[44px] text-text-primary tracking-tight leading-tight">
          A quiet set of tools that do a lot.
        </h2>
      </div>

      {/* Row 1: Resume */}
      <FeatureRow
        badgeText="Resume Reviewer"
        badgeColor="sage"
        heading="Get feedback that actually helps."
        bodyText="Upload your resume and get structured, actionable feedback aligned with Indian startup and product company hiring standards."
        isLeftText={true}
        pills={['ATS Score', 'Impact Language', 'Keyword Gaps']}
      >
        <div className="w-full bg-bg-card rounded-card border border-border-default p-6 space-y-4 max-w-sm">
          <div className="flex items-center gap-4 border-b border-border-subtle pb-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="rgb(var(--c-border-default))" strokeWidth="4" fill="none" />
                <circle cx="24" cy="24" r="20" stroke="rgb(var(--c-sage))" strokeWidth="4" fill="none" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * 0.22} strokeLinecap="round" />
              </svg>
              <span className="absolute text-[11px] font-medium text-text-primary">78</span>
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">Resume Score Report</p>
              <p className="text-[10px] text-text-muted">ATS Readability Check</p>
            </div>
          </div>

          <div className="space-y-2 text-[10px] font-medium text-text-secondary">
            <div className="flex justify-between">
              <span>ATS Compatibility</span>
              <span className="text-sage">82%</span>
            </div>
            <div className="w-full h-1.5 bg-bg-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-sage"
                initial={{ width: 0 }}
                whileInView={{ width: '82%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <div className="flex justify-between">
              <span>Quantified Achievements</span>
              <span className="text-butter">65%</span>
            </div>
            <div className="w-full h-1.5 bg-bg-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-butter"
                initial={{ width: 0 }}
                whileInView={{ width: '65%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.35 }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle space-y-1.5">
            <div className="p-2.5 bg-blush-light text-blush rounded text-[9px] flex gap-1.5 items-start leading-relaxed">
              <span>Missing metrics: add project percentages and margins.</span>
            </div>
            <div className="p-2.5 bg-butter-light text-butter rounded text-[9px] flex gap-1.5 items-start leading-relaxed">
              <span>Weak verbs: replace &quot;worked on&quot; with &quot;architected&quot;.</span>
            </div>
          </div>
        </div>
      </FeatureRow>

      {/* Row 2: DSA Roadmap */}
      <FeatureRow
        badgeText="DSA Roadmap"
        badgeColor="lavender"
        heading="Stop grinding. Start progressing."
        bodyText="A structured, topic-by-topic DSA learning path with daily streaks, progress tracking, and weak-area identification."
        isLeftText={false}
        pills={['14 Day Streak', '234 Problems Solved']}
        customPadding="py-16"
      >
        <div className="w-full h-full min-h-[400px] bg-bg-card rounded-card p-7 relative border border-border-default flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-lg text-text-primary tracking-tight">DSA Roadmap</span>
              <span className="text-sage font-mono text-xs">14 / 20</span>
            </div>
            <div className="w-full h-1.5 bg-bg-subtle rounded-full mb-8">
              <motion.div
                className="h-1.5 bg-lavender rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '70%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              />
            </div>

            <div className="relative h-40 w-full mt-4 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 160">
                <path d="M 40 50 Q 80 120, 110 130 T 180 60 T 250 140 T 320 50 T 380 90" fill="none" stroke="rgb(var(--c-border-default))" strokeWidth="3" />
                <path d="M 40 50 Q 80 120, 110 130" fill="none" stroke="rgb(var(--c-sage))" strokeWidth="3" />
              </svg>

              {[
                { left: '5%',  top: '10%',   state: 'done',  label: 'Arrays' },
                { left: '22%', bottom: '10%', state: 'active', label: 'Linked Lists' },
                { left: '40%', top: '15%',   state: 'locked', label: 'Stacks' },
                { left: '58%', bottom: '15%', state: 'locked', label: 'Trees' },
                { left: '75%', top: '10%',   state: 'locked', label: 'Graphs' },
                { right: '5%', top: '40%',   state: 'locked', label: 'DP' },
              ].map((node, i) => (
                <div
                  key={i}
                  className={cn('absolute flex flex-col items-center', node.state === 'locked' && 'opacity-50')}
                  style={{ left: node.left, right: (node as any).right, top: node.top, bottom: (node as any).bottom }}
                >
                  <div className={cn(
                    'relative w-7 h-7 rounded-full flex items-center justify-center text-[10px]',
                    node.state === 'done' && 'bg-sage text-white',
                    node.state === 'active' && 'bg-bg-card border-2 border-butter text-butter',
                    node.state === 'locked' && 'bg-bg-card border border-border-default text-text-muted'
                  )}>
                    {node.state === 'done' && '✓'}
                    {node.state === 'locked' && <Lock className="w-3 h-3" />}
                  </div>
                  <span className="text-[8.5px] text-text-muted mt-1">{node.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <span className="bg-sage-light text-sage text-[10.5px] font-mono px-3.5 py-1.5 rounded-full border border-sage/15">14 Day Streak</span>
            <span className="bg-lavender-light text-lavender text-[10.5px] font-mono px-3.5 py-1.5 rounded-full border border-lavender/15">234 Solved</span>
            <span className="bg-butter-light text-butter text-[10.5px] font-mono px-3.5 py-1.5 rounded-full border border-butter/15">3 In Progress</span>
          </div>
        </div>
      </FeatureRow>

      {/* Row 3: Mock Interview */}
      <FeatureRow
        badgeText="Mock Interview"
        badgeColor="lavender"
        heading="Practice like it's the real thing."
        bodyText="AI-driven technical and HR interview rounds with detailed performance feedback, personalised by your target company."
        isLeftText={true}
        pills={['Simulated Webcam', 'Live Timer', 'Score Accordion']}
      >
        <div className="w-full max-w-sm bg-ink text-bg-base rounded-card p-6 border border-border-default space-y-4 font-mono text-[10px]">
          <div className="flex justify-between items-center border-b border-white/10 pb-2 text-[8px] text-white/40">
            <span>RECORDING SESSION • SDE Round</span>
            <span className="px-2 py-0.5 rounded bg-blush/20 text-blush">LIVE</span>
          </div>
          <div className="bg-white/5 p-4 rounded border border-white/10 space-y-1.5">
            <span className="text-sage uppercase text-[7px]">Question 1 of 3</span>
            <p className="text-white/85 text-xs leading-relaxed">
              Explain the difference between a process and a thread. When would you use one over the other?
            </p>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-1 items-end h-5">
              {[1, 2, 4, 3, 2, 1, 3, 5, 2, 1].map((v, i) => (
                <div key={i} className="w-0.5 rounded bg-sage" style={{ height: `${v * 15}%`, opacity: 0.7 }} />
              ))}
            </div>
            <span className="text-xs text-white/50">12:45</span>
          </div>
        </div>
      </FeatureRow>

      {/* Row 4: Projects */}
      <FeatureRow
        badgeText="Project Ideas"
        badgeColor="butter"
        heading="Build projects that stand out."
        bodyText="Get high-impact project ideas based on your skills and target companies — with tech stack and complexity level."
        isLeftText={false}
        pills={['Tech Stack Chips', 'Complexity Badges', 'Standout Tips']}
      >
        <div className="relative w-full max-w-xs h-44 flex items-center justify-center">
          <div className="absolute top-0 w-64 bg-bg-card border border-border-default rounded-card p-5 rotate-[-3deg] z-10 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[8px] px-2 py-0.5 rounded bg-butter-light text-butter border border-butter/15">ADVANCED</span>
              <span className="text-[8px] text-text-muted">AI / ML</span>
            </div>
            <h5 className="font-serif text-sm text-text-primary">Smart Attendance face recognition</h5>
            <p className="text-[9px] text-text-secondary leading-normal">
              Attendance system with liveness detection to prevent proxy uploads.
            </p>
          </div>
          <div className="absolute top-4 w-64 bg-bg-card border border-border-subtle rounded-card p-5 rotate-[2deg] opacity-70 space-y-2">
            <h5 className="font-serif text-sm text-text-primary">AI Study Group Matcher</h5>
            <p className="text-[9px] text-text-secondary">ML-powered matching by schedules.</p>
          </div>
        </div>
      </FeatureRow>

      {/* Row 5: Teams */}
      <FeatureRow
        badgeText="Team Finder"
        badgeColor="sage"
        heading="Find your perfect team."
        bodyText="Match with complementary teammates for upcoming hackathons by skills, availability, and domain."
        isLeftText={true}
        pills={['Classmate Directory', 'Invite Manager', 'Availability Dot']}
      >
        <div className="w-full max-w-sm space-y-2.5 text-xs">
          {[
            { init: 'PS', bg: 'bg-sage', name: 'Priya Sharma', meta: 'VIT Vellore • Web Dev' },
            { init: 'AM', bg: 'bg-lavender', name: 'Arjun Mehta', meta: 'BITS Pilani • AI/ML' },
          ].map((m, i) => (
            <div key={i} className="p-3 bg-bg-card border border-border-default rounded-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full ${m.bg} text-white flex items-center justify-center font-serif text-[10px]`}>
                  {m.init}
                </div>
                <div>
                  <p className="font-medium text-text-primary flex items-center gap-1.5">
                    <span>{m.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                  </p>
                  <p className="text-[8px] text-text-muted">{m.meta}</p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 bg-bg-subtle text-text-primary text-[9px] font-mono rounded-full border border-border-default">Invite</button>
            </div>
          ))}
        </div>
      </FeatureRow>

      {/* Row 6: Opportunities */}
      <FeatureRow
        badgeText="Opportunity Tracker"
        badgeColor="lavender"
        heading="Never miss a deadline again."
        bodyText="One unified calendar for internships, hackathons, fellowships, and off-campus opportunities."
        isLeftText={false}
        pills={['Calendar Grid', 'Reminders Toggle', 'Countdown Badges']}
      >
        <div className="w-full bg-bg-card rounded-card border border-border-default p-5 max-w-sm space-y-3">
          <div className="flex justify-between items-center text-[10px] font-medium text-text-primary border-b border-border-subtle pb-2">
            <span>July 2026 Deadlines</span>
            <span className="text-lavender">6 Deadlines</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[8px] text-center text-text-secondary">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} className="font-medium text-text-muted">{d}</span>
            ))}
            {Array.from({ length: 14 }).map((_, idx) => {
              const day = idx + 20
              const hasDeadline = day === 22 || day === 25 || day === 28
              return (
                <div
                  key={idx}
                  className={cn(
                    'h-8 flex flex-col items-center justify-between p-1 rounded border border-transparent',
                    hasDeadline && 'bg-lavender-light border-lavender/15'
                  )}
                >
                  <span className={cn(hasDeadline && 'text-lavender font-medium')}>{day}</span>
                  {hasDeadline && <span className="w-1.5 h-1.5 rounded-full bg-lavender" />}
                </div>
              )
            })}
          </div>
        </div>
      </FeatureRow>
    </div>
  )
}
