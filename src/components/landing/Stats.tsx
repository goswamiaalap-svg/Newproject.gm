'use client'

import React, { useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  suffix: string
  decimals?: number
}

function AnimatedNumber({ value, suffix, decimals = 0 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals))

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo curve for premium feel
      })
      return controls.stop
    }
  }, [inView, count, value])

  return (
    <span className="font-display font-extrabold text-6xl sm:text-7xl md:text-8xl tracking-tight text-zinc-950 flex items-baseline justify-center md:justify-start">
      <motion.span ref={ref}>{rounded}</motion.span>
      <span className="text-teal ml-1">{suffix}</span>
    </span>
  )
}

export default function Stats() {
  const stats = [
    { value: 1.5, suffix: 'M+', label: 'Engineering graduates in India', decimals: 1 },
    { value: 200, suffix: '+', label: 'Students already using LaunchPad', decimals: 0 },
    { value: 78, suffix: '%', label: 'Average ATS resume score improvement', decimals: 0 },
  ]

  return (
    <section className="bg-white border-y border-zinc-100 py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 items-start text-center md:text-left">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col space-y-3 sm:space-y-4"
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              <p className="text-zinc-500 font-sans font-medium text-sm sm:text-base md:text-lg max-w-xs md:max-w-none mx-auto md:mx-0 leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
