'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function Stats() {
  const items = [
    '1.5M+ Engineering Graduates',
    '85% Outside IITs',
    '12 AI Features',
    'MVP by 30 June',
    '200+ Students',
    'Zero Guidance for Tier 2/3',
    'Built by Students, for Students',
  ]

  const marqueeItems = [...items, ...items]

  return (
    <section className="relative bg-[#06070A] py-8 overflow-hidden border-y border-white/5">
      {/* Scan-line glow sweep */}
      <motion.div
        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-teal/20 to-transparent pointer-events-none z-10"
        animate={{ x: ['-20vw', '120vw'] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'linear', repeatDelay: 3 }}
      />

      {/* Ambient left/right fade masks */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#06070A] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#06070A] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max items-center animate-scroll-right">
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 mx-6 flex-shrink-0">
            <span className="text-white/80 font-display font-bold text-sm md:text-base tracking-wide uppercase">
              {item}
            </span>
            <span className="text-teal font-display font-bold text-base select-none animate-pulse">✦</span>
          </div>
        ))}
      </div>
    </section>
  )
}
