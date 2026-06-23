'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Testimonial {
  quote: string
  name: string
  role: string
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      quote: "The AI resume reviewer caught formatting issues and weak action verbs I'd completely missed. My callback rate doubled in weeks, and I landed my dream SDE role.",
      name: "Ananya Singh",
      role: "VIT Vellore • Placed at Microsoft"
    },
    {
      quote: "Met teammates with matching skills for the hackathon in less than 24 hours. We ended up winning 2nd place in the Smart India Hackathon finals!",
      name: "Arjun Mehta",
      role: "BITS Pilani • Hackathon Winner"
    },
    {
      quote: "The personalized DSA roadmap took the anxiety out of coding practice. Streak tracking kept me consistent for 90 days straight.",
      name: "Rahul Verma",
      role: "JKLU Jaipur • Placed at Infosys"
    }
  ]

  return (
    <section className="bg-white py-24 sm:py-32 border-b border-zinc-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Heading & Label */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-teal">
              Trusted by students
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-zinc-950 tracking-tight leading-none">
              Real success from campuses across India.
            </h2>
            <p className="text-zinc-500 font-sans text-base leading-relaxed max-w-sm pt-2">
              See how engineering students are leveraging AI screening, mock interviews, and peer matching to land competitive roles.
            </p>
          </div>

          {/* Right Column: Spacious Testimonial Quotes Stack */}
          <div className="lg:col-span-7 space-y-16">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="space-y-4 border-l-2 border-teal pl-6"
              >
                <p className="font-sans font-medium text-lg sm:text-xl md:text-2xl text-zinc-900 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="pt-2">
                  <span className="font-display font-bold text-sm sm:text-base text-zinc-950 block">
                    {t.name}
                  </span>
                  <span className="text-zinc-500 text-xs sm:text-sm font-sans font-medium">
                    {t.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
