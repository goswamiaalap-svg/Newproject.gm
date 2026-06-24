'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Route, GraduationCap, Trophy, Share2, Mic, Building2 } from 'lucide-react'

const moreFeatures = [
  { name: 'Personalised Learning Path', desc: 'Custom weekly timeline of SDE milestones built for your schedule.', icon: Route },
  { name: 'Admission Readiness Score', desc: 'Check your profile strength for global MS/MBA applications.', icon: GraduationCap },
  { name: 'Competition Discovery Feed', desc: 'Live dashboard of national hackathons, coding rounds and events.', icon: Trophy },
  { name: 'Alumni Connect Network', desc: 'Direct channels to seniors placed at top product companies.', icon: Share2 },
  { name: 'Soft Skills Trainer', desc: 'AI evaluations on logic explanation and interview talking pace.', icon: Mic },
  { name: 'Company-Specific Prep Hub', desc: 'Practice previous interview sheets from Google, Amazon and TCS.', icon: Building2 },
]

export default function MoreFeaturesGrid() {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  }

  return (
    <section className="bg-bg-base flex flex-col items-center">
      <div className="text-center px-6 max-w-2xl mx-auto mb-14">
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-muted border border-border-default px-3 py-1.5 rounded-full">
          And that&apos;s not all
        </span>
        <h2 className="font-serif font-medium text-3xl md:text-[40px] text-text-primary tracking-tight leading-tight mt-5">
          Every part of your career journey.
        </h2>
        <p className="text-text-secondary text-sm md:text-base mt-3">
          LaunchPad covers the whole placement prep journey, end to end.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="max-w-7xl mx-auto px-6 md:px-8 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {moreFeatures.map((feat, idx) => {
          const accentClasses = [
            'bg-sage-light text-sage',
            'bg-lavender-light text-lavender',
            'bg-butter-light text-butter',
            'bg-blush-light text-blush',
            'bg-sky-light text-sky',
            'bg-sage-light text-sage',
          ]
          const accent = accentClasses[idx % accentClasses.length]
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-bg-card rounded-card p-6 border border-border-default hover:border-border-default relative group"
            >
              <div className={`w-9 h-9 rounded-btn ${accent} flex items-center justify-center mb-4`}>
                <feat.icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
              </div>
              <h4 className="font-serif text-base text-text-primary">
                {feat.name}
              </h4>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
