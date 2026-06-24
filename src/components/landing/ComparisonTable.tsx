'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ComparisonTable() {
  const rows = [
    {
      problem: 'Generic checklists and 12+ fragmented tools with no unified target',
      solution: 'One single sequential flow centered around your target outcome (Job, Gig, Research, Solo)',
    },
    {
      problem: 'Manual resume reviews that lack role-specific context or target metrics',
      solution: 'AI-powered ATS & readiness scans benchmarked directly against your specific career target',
    },
    {
      problem: 'Static study guides requiring you to figure out what skills you lack',
      solution: 'Dynamic prep roadmap pre-populated directly with your resume skill gaps and portfolio actions',
    },
    {
      problem: 'Uncertainty about which portfolio projects actually get you noticed',
      solution: 'AI-recommended standout projects tailored to your target company tier and missing skills',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <section className="bg-[#F5F5F3] py-24 md:py-32 border-t border-gray-200 relative overflow-hidden text-[#111111]">
      {/* Abstract background shapes */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-[#3B82F6] text-[10px] font-extrabold uppercase tracking-widest block mb-3">
            The LaunchPad Difference
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            Stop tool-hopping. <br className="hidden sm:inline" />
            Start outcome-focus prep.
          </h2>
          <p className="text-[#444444] text-sm mt-4 leading-relaxed">
            Unlike fragmented dashboards that present a menu of disjointed features, LaunchPad aligns everything to a single, structured destination.
          </p>
        </div>

        {/* Table Structure */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl"
        >
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200 bg-gray-50 font-bold text-xs uppercase tracking-wider text-gray-500">
            <div className="p-6 md:p-8">Traditional Guidance</div>
            <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200 text-[#3B82F6]">
              The LaunchPad Experience
            </div>
          </div>

          {/* Body Rows */}
          {rows.map((row, idx) => (
            <motion.div
              key={idx}
              variants={rowVariants}
              className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              {/* Left Column (Problem) */}
              <div className="p-6 md:p-8 flex items-start gap-4 text-gray-600 text-xs sm:text-sm">
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500 mt-0.5 border border-red-100">
                  <X className="w-3 h-3" />
                </div>
                <span className="leading-relaxed">{row.problem}</span>
              </div>

              {/* Right Column (Solution) */}
              <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-200 flex items-start gap-4 text-[#111111] text-xs sm:text-sm bg-blue-50/30">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 mt-0.5 border border-blue-200">
                  <Check className="w-3 h-3" />
                </div>
                <span className="leading-relaxed font-medium">{row.solution}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Result Callout & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center bg-white border border-gray-200 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-sm"
        >
          <div className="text-left max-w-lg">
            <h4 className="font-bold text-sm text-[#111111]">Ready to benchmark your placement readiness?</h4>
            <p className="text-[#666666] text-xs mt-1 leading-normal">
              Join hundreds of engineering students already moving systematically towards their target salary outcomes.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="w-full md:w-auto px-6 py-3 bg-[#3B82F6] text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
