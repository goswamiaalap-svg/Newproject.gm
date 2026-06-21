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
    <section className="relative bg-bg-subtle py-6 overflow-hidden border-y border-border-default">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg-subtle to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg-subtle to-transparent z-10 pointer-events-none" />

      <div className="flex w-max items-center animate-scroll-right">
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 mx-6 flex-shrink-0">
            <span className="text-text-secondary font-mono text-xs tracking-wide">
              {item}
            </span>
            <span className="text-text-muted font-mono text-xs select-none">·</span>
          </div>
        ))}
      </div>
    </section>
  )
}
