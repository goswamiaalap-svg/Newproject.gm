'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="relative py-24 md:py-28 bg-bg-base">
      <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex font-mono text-[10.5px] uppercase tracking-wider text-text-muted border border-border-default px-3 py-1.5 rounded-full mb-6"
        >
          Ready when you are
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-medium text-3xl md:text-5xl text-text-primary tracking-tight leading-tight mb-5"
        >
          Your career deserves{' '}
          <span className="italic text-lavender">more than luck.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-text-secondary text-base max-w-md mx-auto mb-9"
        >
          Join 200+ students already using LaunchPad to land their dream roles. Start free, upgrade when you&apos;re ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/sign-up"
            className="flex items-center gap-2 px-7 h-11 bg-text-primary text-bg-base font-medium text-sm rounded-full hover:opacity-85 transition-opacity duration-200"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
