'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView, useAnimation, useIsPresent } from 'framer-motion'

function Counter({ from, to, duration = 2, suffix = '' }: { from: number, to: number, duration?: number, suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (inView) {
      let startTime: number
      let animationFrame: number

      const animate = (time: number) => {
        if (!startTime) startTime = time
        const progress = Math.min((time - startTime) / (duration * 1000), 1)
        
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const current = from + (to - from) * easeOut
        
        // Format based on the to value (e.g. decimals if needed)
        const formatted = to % 1 !== 0 ? current.toFixed(1) : Math.floor(current)
        
        setValue(Number(formatted))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [inView, from, to, duration])

  return (
    <span ref={ref}>
      {value}{suffix}
    </span>
  )
}

export default function Stats() {
  const stats = [
    { label: 'Engineering Graduates', value: 1.5, suffix: 'M+' },
    { label: 'Outside IITs/NITs', value: 85, suffix: '%' },
    { label: 'AI Features Built', value: 12, suffix: '' },
    { label: 'Active Students', value: 200, suffix: '+' },
  ]

  return (
    <section className="relative bg-bg-subtle py-24 border-y border-border-default overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x-0 md:divide-x divide-border-default">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-4xl md:text-5xl font-display font-extrabold text-teal">
                <Counter from={0} to={stat.value} duration={2.5} suffix={stat.suffix} />
              </div>
              <p className="text-text-secondary font-medium text-sm md:text-base tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
