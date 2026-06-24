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
    <section className="bg-[#0B0F19] py-24 md:py-32 border-t border-[#1E293B] relative overflow-hidden text-white">
      {/* Abstract background shapes */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <span className="text-teal-400 text-[10px] font-extrabold uppercase tracking-widest block mb-3">
            The LaunchPad Difference
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            Stop tool-hopping. <br className="hidden sm:inline" />
            Start outcome-focus prep.
          </h2>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            Unlike fragmented dashboards that present a menu of disjointed features, LaunchPad aligns everything to a single, structured destination.
          </p>
        </div>

        {/* Table Structure */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="border border-[#1E293B] rounded-2xl overflow-hidden bg-[#0F172A]/40 backdrop-blur-md shadow-2xl"
        >
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#1E293B] bg-[#0F172A]/80 font-bold text-xs uppercase tracking-wider text-slate-400">
            <div className="p-6 md:p-8">Traditional Guidance</div>
            <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-[#1E293B] text-teal-400">
              The LaunchPad Experience
            </div>
          </div>

          {/* Body Rows */}
          {rows.map((row, idx) => (
            <motion.div
              key={idx}
              variants={rowVariants}
              className="grid grid-cols-1 md:grid-cols-2 border-b border-[#1E293B] last:border-b-0 hover:bg-[#1E293B]/20 transition-colors"
            >
              {/* Left Column (Problem) */}
              <div className="p-6 md:p-8 flex items-start gap-4 text-slate-300 text-xs sm:text-sm">
                <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-400 mt-0.5 border border-red-500/20">
                  <X className="w-3 h-3" />
                </div>
                <span className="leading-relaxed">{row.problem}</span>
              </div>

              {/* Right Column (Solution) */}
              <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-[#1E293B] flex items-start gap-4 text-slate-100 text-xs sm:text-sm bg-teal-500/[0.02]">
                <div className="w-5 h-5 rounded-full bg-teal-400/10 flex items-center justify-center flex-shrink-0 text-teal-400 mt-0.5 border border-teal-400/20 shadow-teal-glow-sm">
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
          className="mt-16 text-center bg-[#0F172A] border border-[#1E293B] p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto shadow-xl"
        >
          <div className="text-left max-w-lg">
            <h4 className="font-bold text-sm text-slate-200">Ready to benchmark your placement readiness?</h4>
            <p className="text-slate-400 text-xs mt-1 leading-normal">
              Join hundreds of engineering students already moving systematically towards their target salary outcomes.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="w-full md:w-auto px-6 py-3 bg-teal hover:bg-teal-600 text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 shadow-teal-glow hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
