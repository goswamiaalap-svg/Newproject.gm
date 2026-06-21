'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Copy, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'

function AnimatedHeadline({ words }: { words: { text: string; className?: string }[] }) {
  return (
    <>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`inline-block mr-[0.28em] ${word.className ?? ''}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          {word.text}
        </motion.span>
      ))}
    </>
  )
}

function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="w-full h-7">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.8} />
    </svg>
  )
}

const metrics = [
  { label: 'Resumes scored this week', value: '+38%', trend: 'up' as const },
  { label: 'Avg. interview prep time', value: '-52%', trend: 'down' as const },
  { label: 'DSA streak completion', value: '+21%', trend: 'up' as const },
  { label: 'Project match quality', value: '+8%', trend: 'up' as const },
]

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText('npx launchpad-cli init')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section id="hero" className="hero-section relative w-full dot-bg overflow-hidden">
      {/* very soft pastel wash, barely visible, theme aware via low opacity */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-lavender/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full bg-sage/10 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-32 md:pt-36 pb-20 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:block absolute top-0 right-8 font-serif italic text-text-muted text-sm"
        >
          quietly, from your dashboard
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-7">
            <h1 className="font-serif font-medium text-[40px] sm:text-5xl md:text-[64px] leading-[1.12] tracking-tight text-text-primary mb-6">
              <span className="block">
                <AnimatedHeadline words={[{ text: 'Built' }, { text: 'for' }, { text: 'calm,' }]} />
              </span>
              <span className="block">
                <AnimatedHeadline words={[{ text: 'high' }, { text: 'performing' }]} />
              </span>
              <span className="block">
                <AnimatedHeadline words={[
                  { text: 'AI', className: 'italic text-lavender' },
                  { text: 'native', className: 'italic text-lavender' },
                  { text: 'students.' },
                ]} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-text-secondary text-base md:text-lg max-w-md leading-relaxed mb-9"
            >
              LaunchPad gives engineering students the visibility and tooling to make the most out of their placement prep — without the noise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.62 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <button
                onClick={handleCopy}
                className="group flex items-center justify-between gap-4 px-5 py-3 bg-bg-card border border-border-default text-text-primary rounded-btn font-mono text-sm w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <span className="text-sage">$</span>
                  npx launchpad-cli init
                </span>
                <span className="flex items-center justify-center w-6 h-6 rounded-md border border-border-default group-hover:bg-bg-subtle transition-colors">
                  {copied ? <span className="text-[10px]">✓</span> : <Copy className="w-3.5 h-3.5" />}
                </span>
              </button>

              <Link
                href="/sign-up"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-text-primary text-bg-base rounded-btn font-medium text-sm hover:opacity-85 transition-opacity duration-200"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Right column: minimal pastel dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:mt-2"
          >
            <div className="rounded-2xl border border-border-default bg-bg-card shadow-soft overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle">
                <div className="flex items-center gap-2 font-mono text-[10.5px] text-text-secondary uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                  Career Progress
                </div>
                <span className="font-mono text-[10.5px] text-text-muted uppercase tracking-wider">This Week</span>
              </div>

              <div className="m-4 rounded-xl bg-lavender-light px-5 py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10.5px] text-text-secondary uppercase tracking-wider">Tasks / Week</span>
                  <span className="font-mono text-[10.5px] text-sage">+38%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-4xl text-text-primary">13</span>
                  <div className="w-28">
                    <Sparkline color="rgb(var(--c-lavender))" points="0,18 14,16 28,20 42,10 56,14 70,4 84,8 100,2" />
                  </div>
                </div>
              </div>

              <div className="px-5">
                {metrics.map((m, idx) => (
                  <div key={idx} className={`flex items-center justify-between py-3 ${idx !== metrics.length - 1 ? 'border-b border-dashed border-border-subtle' : ''}`}>
                    <span className="text-sm text-text-secondary">{m.label}</span>
                    <span className={`flex items-center gap-1 font-mono text-xs font-medium ${m.trend === 'up' ? 'text-sage' : 'text-blush'}`}>
                      {m.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 border-t border-border-subtle">
                {[
                  { label: 'Prep Freq', value: '4x/wk', bg: 'bg-sage-light', color: 'rgb(var(--c-sage))' },
                  { label: 'Streak', value: '14 days', bg: 'bg-sky-light', color: 'rgb(var(--c-sky))' },
                  { label: 'Readiness', value: '94%', bg: 'bg-butter-light', color: 'rgb(var(--c-butter))' },
                ].map((s, idx) => (
                  <div key={idx} className={`px-4 py-4 ${idx !== 0 ? 'border-l border-border-subtle' : ''}`}>
                    <p className="font-mono text-[9.5px] text-text-muted uppercase tracking-wider mb-1.5">{s.label}</p>
                    <p className="font-serif text-lg text-text-primary mb-2">{s.value}</p>
                    <Sparkline color={s.color} points="0,20 16,18 32,22 48,12 64,16 80,6 100,10" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
