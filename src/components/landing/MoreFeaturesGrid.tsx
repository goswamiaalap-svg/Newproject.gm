'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Route, GraduationCap, Trophy, Share2, Mic, Building2 } from 'lucide-react'

const moreFeatures = [
  {
    name: 'Personalised Learning Path',
    desc: 'Custom weekly timeline of SDE milestones built for your schedule.',
    icon: Route,
  },
  {
    name: 'Admission Readiness Score',
    desc: 'Check your profile strength for global MS/MBA applications.',
    icon: GraduationCap,
  },
  {
    name: 'Competition Discovery Feed',
    desc: 'Live dashboard of national hackathons, coding rounds and events.',
    icon: Trophy,
  },
  {
    name: 'Alumni Connect Network',
    desc: 'Direct channels to seniors placed at top product companies.',
    icon: Share2,
  },
  {
    name: 'Soft Skills Trainer',
    desc: 'AI evaluations on logic explanation and interview talking pace.',
    icon: Mic,
  },
  {
    name: 'Company-Specific Prep Hub',
    desc: 'Practice previous interview sheets from Google, Amazon and TCS.',
    icon: Building2,
  },
]

export default function MoreFeaturesGrid() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <section className="py-32 bg-transparent flex flex-col items-center">
      {/* Title */}
      <div className="text-center px-6 max-w-2xl mx-auto mb-16">
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary tracking-tight leading-tight">
          And that&apos;s not all.
        </h2>
        <p className="text-text-secondary text-base md:text-lg mt-4 font-sans font-medium">
          LaunchPad covers every part of your career journey.
        </p>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {moreFeatures.map((feat, idx) => {
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="glass rounded-card p-6 border border-border-default shadow-soft hover:shadow-medium transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top hover border (3px) */}
              <span className="absolute top-0 left-0 w-full h-[3px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-btn bg-teal-light text-teal flex items-center justify-center">
                  <feat.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-text-primary">
                    {feat.name}
                  </h4>
                  <p className="text-text-secondary text-xs mt-2 leading-relaxed font-sans font-medium">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
