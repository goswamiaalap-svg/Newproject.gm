'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Sign Up',
    description: 'Create your free account in under 30 seconds. No credit card needed.',
    icon: '🚀',
  },
  {
    number: '02',
    title: 'Set Your Goals',
    description: 'Tell us your target companies, timeline, and current skill level.',
    icon: '🎯',
  },
  {
    number: '03',
    title: 'Get Your Plan',
    description: 'AI generates a personalized roadmap with daily tasks and milestones.',
    icon: '📋',
  },
  {
    number: '04',
    title: 'Crack It',
    description: 'Practice, build, prepare — and land your dream placement.',
    icon: '🏆',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-bg-subtle relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-light text-indigo text-sm font-medium mb-4">
            ✦ How It Works
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-text-primary">
            Four Steps to Your{' '}
            <span className="text-gradient-indigo">Dream Placement</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-teal via-indigo to-teal origin-left rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.15,
                  type: 'spring',
                  stiffness: 80,
                  damping: 20,
                }}
                className="relative text-center"
              >
                {/* Number Circle */}
                <div className="relative mx-auto mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-teal flex items-center justify-center text-white font-display font-bold text-lg mx-auto shadow-teal-glow">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="text-3xl mb-3">{step.icon}</div>

                {/* Title */}
                <h3 className="font-display font-bold text-text-primary text-lg mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
