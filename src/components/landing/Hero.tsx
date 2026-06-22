'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'

/* ── Word-by-word animated headline ── */
function AnimatedHeadline({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(' ')
  return (
    <span className={className} style={{ display: 'block', ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 40, rotateX: -20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.65,
            delay: 0.4 + i * 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export default function Hero() {
  const avatars = [
    { text: 'PS', bg: 'bg-teal-100 text-teal-700' },
    { text: 'AM', bg: 'bg-indigo-100 text-indigo-700' },
    { text: 'SR', bg: 'bg-amber-100 text-amber-700' },
    { text: 'RK', bg: 'bg-teal-200 text-teal-800' },
    { text: 'KN', bg: 'bg-indigo-200 text-indigo-800' },
  ]

  return (
    <section
      id="hero"
      className="relative w-full flex items-center justify-center overflow-hidden bg-bg-base"
      style={{ minHeight: '100vh' }}
    >
      {/* ── Light animated mesh background (z-0) ── */}
      <div className="absolute inset-0 z-0 hero-animated-mesh" />

      {/* ── Light radial vignette overlay (z-10) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background:
            'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(3,0,20,0.8) 100%)',
        }}
      />

      {/* ── Content (z-20) — everything visible above the canvas ── */}
      <div
        className="relative w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center"
        style={{ zIndex: 20, paddingTop: '5rem', paddingBottom: '6rem' }}
      >

        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal/10 backdrop-blur-md text-teal-700 text-xs font-bold border border-teal/20 shadow-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          AI-Powered Career Platform for Engineers
        </motion.div>

        {/* Headline */}
        <h1
          className="font-display font-extrabold text-5xl md:text-7xl lg:text-[80px] leading-[1.05] tracking-tight mb-6"
          style={{ perspective: '600px' }}
        >
          <AnimatedHeadline text="Your Career Platform." className="text-text-primary" />
          <AnimatedHeadline
            text="Built for Every Engineer."
            className="text-transparent"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #0D9488 0%, #3B82F6 50%, #6366F1 100%)',
            } as React.CSSProperties}
          />
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-sans"
        >
          Resume reviews, DSA roadmaps, mock interviews, team-finding — everything you need from campus to career.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.15 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-10"
        >
          <Link
            href="/sign-up"
            className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-display font-bold text-sm bg-teal text-white shadow-soft hover:bg-teal-600 hover:shadow-medium transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />
            Get Started Free →
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-sm text-text-secondary border border-border-default bg-white shadow-sm hover:border-teal/50 hover:text-teal transition-all duration-300"
          >
            See Features
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex -space-x-2.5">
            {avatars.map((av, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full border-2 border-white ${av.bg} flex items-center justify-center font-display font-bold text-[10px] shadow-sm`}
              >
                {av.text}
              </div>
            ))}
          </div>
          <p className="text-text-muted text-xs font-medium font-sans">
            <span className="text-gold font-bold">4.8 ★</span>&nbsp; <span className="text-text-secondary">Trusted by 200+ students at JKLU and growing</span>
          </p>
        </motion.div>
      </div>

      {/* ── Scroll indicator (z-20) ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-2"
        style={{ zIndex: 20 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest font-sans">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-border-default flex items-start justify-center pt-1.5 bg-white/50 backdrop-blur-sm">
          <motion.div
            className="w-1 h-2 rounded-full bg-teal"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
