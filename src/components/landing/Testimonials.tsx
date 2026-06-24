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
    <section className="bg-[#F5F5F3] py-24 md:py-32 border-b border-gray-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-[#3B82F6] text-[10px] font-extrabold uppercase tracking-widest block mb-3">
            Student Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-[#111111]">
            Real success from <br className="hidden sm:inline" />
            campuses across India.
          </h2>
          <p className="text-[#666666] text-sm mt-4 leading-relaxed">
            See how engineering students are leveraging AI screening, mock interviews, and peer matching to land competitive roles.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-85px' }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
              <div className="space-y-2">
                {/* Large quote icon */}
                <span className="text-[#3B82F6] font-serif text-5xl leading-none block select-none -mb-2">“</span>
                <p className="font-sans font-medium text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                  {t.quote}
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-100">
                <span className="font-display font-bold text-xs sm:text-sm text-[#111111] block">
                  {t.name}
                </span>
                <span className="text-[#666666] text-[10px] sm:text-xs font-sans font-medium mt-0.5 block">
                  {t.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
