'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Dynamically import heavy Three.js scene — no SSR
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-[#0A0A0A]" />,
})

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
    { text: 'PS', bg: 'bg-teal' },
    { text: 'AM', bg: 'bg-indigo' },
    { text: 'SR', bg: 'bg-gold' },
    { text: 'RK', bg: 'bg-teal-600' },
    { text: 'KN', bg: 'bg-indigo-600' },
  ]

  return (
    <section
      id="hero"
      className="relative w-full flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
      style={{ minHeight: '100vh' }}
    >
      {/* ── 3D WebGL background canvas (z-0) ── */}
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-[#0A0A0A]" />}>
        <HeroScene />
      </Suspense>

      {/* ── Dark radial vignette overlay (z-10) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 10,
          background:
            'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 20%, rgba(10,10,10,0.8) 100%)',
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
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-bold border border-white/15 shadow-lg mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          AI-Powered Career Platform for Engineers
        </motion.div>

        {/* Headline */}
        <h1
          className="font-display font-extrabold text-5xl md:text-7xl lg:text-[80px] leading-[1.05] tracking-tight mb-6"
          style={{ perspective: '600px' }}
        >
          <AnimatedHeadline text="Your Career Platform." className="text-white" />
          <AnimatedHeadline
            text="Built for Every Engineer."
            className="text-transparent"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #818CF8 100%)',
            } as React.CSSProperties}
          />
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="text-white/55 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-sans"
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
            className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-full font-display font-bold text-sm bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 pointer-events-none" />
            Get Started Free →
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-sm text-white/65 border border-white/15 hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300"
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
                className={`w-8 h-8 rounded-full border-2 border-[#06070A] ${av.bg} text-white flex items-center justify-center font-display font-bold text-[10px]`}
              >
                {av.text}
              </div>
            ))}
          </div>
          <p className="text-white/45 text-xs font-medium font-sans">
            <span className="text-white font-bold">4.8 ★</span>&nbsp; Trusted by 200+ students at JKLU and growing
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
        <span className="text-white/25 text-[10px] font-bold uppercase tracking-widest font-sans">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <motion.div
            className="w-1 h-2 rounded-full bg-cyan-400"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* ── Wave divider to white section (z-20) ── */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full translate-y-[2px]"
          fill="#111111"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  )
}
