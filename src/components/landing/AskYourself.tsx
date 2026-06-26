'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function AskYourself() {
  const questions = [
    {
      num: '01',
      text: 'How much faster could you grow if you stopped wondering what to do next?',
      desc: 'Having a clear daily sequence cuts down decision fatigue and turns intent into immediate, execution-focused learning.',
    },
    {
      num: '02',
      text: 'What if you knew exactly what gaps separate you from your dream target company?',
      desc: 'Instead of blind applications, pinpoint missing skills and project mismatches compared against real hiring benchmarks.',
    },
    {
      num: '03',
      text: 'Are you reaching your full potential, or just following generic placement advice?',
      desc: 'Standard roadmaps ignore your unique strengths. A customized outcome target prepares you for exactly what your future employers seek.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  }

  return (
    <section className="bg-white py-24 md:py-32 relative overflow-hidden border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest block mb-3">
            Ask Yourself
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-[#111111]">
            Three questions for <br className="hidden sm:inline" />
            your engineering career.
          </h2>
        </div>

        {/* Questions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start"
        >
          {questions.map((q, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col space-y-4 md:space-y-5 p-2"
            >
              {/* Bold Number */}
              <span className="font-display font-black text-6xl md:text-7xl text-cyan-500/20 select-none block leading-none">
                {q.num}
              </span>
              
              {/* Question Text */}
              <h3 className="font-display font-extrabold text-base md:text-lg text-[#111111] leading-snug">
                {q.text}
              </h3>

              {/* Description */}
              <p className="text-[#666666] font-sans font-medium text-xs sm:text-sm leading-relaxed">
                {q.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
