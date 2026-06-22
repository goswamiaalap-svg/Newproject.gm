'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BrainCircuit, Users, Globe2, Target, FileCheck, TerminalSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    title: 'AI Mentorship',
    desc: 'Get 24/7 personalized guidance on your code, resume, and career choices from our advanced AI mentor trained on tech industry standards.',
    icon: BrainCircuit,
    color: 'teal',
  },
  {
    title: 'Peer-to-Peer Mock Interviews',
    desc: 'Connect with peers preparing for similar roles. Practice your technical and behavioral skills in a realistic interview environment.',
    icon: Users,
    color: 'indigo',
  },
  {
    title: 'Global University Network',
    desc: 'Join a community of students from top universities worldwide. Collaborate, share resources, and expand your professional network.',
    icon: Globe2,
    color: 'purple',
  },
  {
    title: 'Targeted Skill Development',
    desc: 'Identify your weak areas through AI analysis and receive customized roadmaps to master the exact skills needed for your dream job.',
    icon: Target,
    color: 'gold',
  },
  {
    title: 'ATS-Optimized Resume Builder',
    desc: 'Generate industry-standard resumes that bypass Applicant Tracking Systems. Receive instant feedback and actionable improvements.',
    icon: FileCheck,
    color: 'teal',
  },
  {
    title: 'Live Technical Assessments',
    desc: 'Practice coding in real-time with an AI interviewer. Experience live execution, syntax highlighting, and immediate code review.',
    icon: TerminalSquare,
    color: 'indigo',
  },
]

export default function ImportantFeatures() {
  const badgeClasses: Record<string, string> = {
    teal: 'bg-teal-light text-teal border-teal/10',
    indigo: 'bg-indigo-light text-indigo border-indigo/10',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    gold: 'bg-gold-light text-gold border-gold/10',
  }

  const borderClasses: Record<string, string> = {
    teal: 'group-hover:border-teal/50',
    indigo: 'group-hover:border-indigo/50',
    purple: 'group-hover:border-purple-500/50',
    gold: 'group-hover:border-gold/50',
  }

  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border-default to-transparent" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border bg-surface-card border-border-default shadow-soft text-text-secondary inline-block mb-4"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl md:text-5xl text-text-primary tracking-tight leading-tight"
          >
            Built for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-indigo">success</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-text-secondary font-medium font-sans max-w-xl mx-auto leading-relaxed"
          >
            Everything you need to accelerate your career, from resume building to interview prep, all in one intelligent platform.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className={cn(
                "relative h-full glass rounded-3xl p-8 border border-border-default shadow-soft transition-all duration-300 hover:shadow-medium overflow-hidden",
                borderClasses[feat.color]
              )}>
                {/* Hover gradient background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent to-black/[0.02]" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border",
                    badgeClasses[feat.color]
                  )}>
                    <feat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-text-primary mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-text-secondary font-sans text-sm leading-relaxed flex-grow">
                    {feat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
