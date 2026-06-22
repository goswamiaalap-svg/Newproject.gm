'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How does the AI Resume Reviewer work?',
    answer: 'Our AI analyzes your resume against thousands of successful tech profiles. It checks for ATS compatibility, keyword gaps, and impact language, providing specific, actionable feedback to improve your score instantly.',
  },
  {
    question: 'Is the platform really free for students?',
    answer: 'Yes! Our core features including the DSA roadmap, resume scanner, and basic project ideas are completely free for verified students. We believe in accessible education for everyone.',
  },
  {
    question: 'Can I practice interviews for specific companies like Google or Amazon?',
    answer: 'Absolutely. Our Mock Interview feature lets you select your target company and role. The AI will tailor its technical and behavioral questions based on that company\'s known interview patterns.',
  },
  {
    question: 'How do you generate project ideas?',
    answer: 'We analyze current industry trends and your existing skill set to suggest projects that bridge your knowledge gaps while standing out to recruiters. We also provide architecture hints and suggested tech stacks.',
  },
  {
    question: 'How does the Team Finder match me with teammates?',
    answer: 'The Team Finder algorithm considers your skills, available time, target domains (like Web Dev or AI/ML), and timezone. It suggests peers whose skills complement yours for hackathons and projects.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border bg-bg-subtle border-border-default shadow-soft text-text-secondary inline-block mb-4"
          >
            Got Questions?
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-3xl md:text-5xl text-text-primary tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "border rounded-2xl overflow-hidden transition-colors duration-300",
                  isOpen ? "glass border-teal shadow-medium" : "bg-surface-card/50 border-border-default shadow-soft hover:border-border-subtle"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="font-display font-bold text-text-primary pr-4">{faq.question}</span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 shrink-0",
                    isOpen ? "bg-teal text-white rotate-180" : "bg-surface-elevated border border-border-default text-text-secondary"
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-2 text-text-secondary font-sans text-sm leading-relaxed border-t border-border-subtle mx-6 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
