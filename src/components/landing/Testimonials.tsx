'use client'

import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

const row1Testimonials = [
  { rating: 5, title: 'Callback rate doubled', body: 'The AI resume reviewer caught issues I never noticed in my formatting. Companies actually call me back now.', name: 'Ananya Singh', college: 'VIT, Vellore', date: 'June 2026' },
  { rating: 5, title: 'Got placed at Infosys!', body: 'LaunchPad structured my placement prep and kept me focused. The roadmap tool is absolutely incredible.', name: 'Rahul Verma', college: 'JKLU, Jaipur', date: 'May 2026' },
  { rating: 5, title: 'Found my dream hackathon squad', body: 'Met teammates with perfect matching skills. We ended up winning 2nd place at Smart India Hackathon!', name: 'Ishita Gupta', college: 'BITS Pilani', date: 'April 2026' },
  { rating: 4, title: 'Best DSA helper out there', body: 'Curated list of 200 problems. Kept me on track for 3 months straight. Streak tracking is super addictive.', name: 'Vikram Patel', college: 'NIT Surat', date: 'June 2026' },
]

const row2Testimonials = [
  { rating: 5, title: 'Confidence boosted completely', body: 'Real-time mock interviews with AI feedback gave me the exact talking prep I needed for HR rounds.', name: 'Karthik Menon', college: 'SRM, Chennai', date: 'May 2026' },
  { rating: 5, title: 'Tailored project suggestions', body: 'The generator gave me standout project suggestions mapped to my exact year and skills. Interviewers loved it.', name: 'Meera Iyer', college: 'COEP, Pune', date: 'March 2026' },
  { rating: 5, title: 'TCS Digital offer achieved', body: 'From zero preparation to a solid offer in under 4 months. LaunchPad is a must for non-IIT candidates.', name: 'Aakash Jain', college: 'IIIT, Lucknow', date: 'April 2026' },
  { rating: 4, title: 'Personalized prep timelines', body: 'Generated a week-by-week learning plan that fitted perfectly into my final semester schedule. Love it.', name: 'Divya Reddy', college: 'Manipal Univ', date: 'June 2026' },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-text-muted opacity-30'}`} />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof row1Testimonials[0] }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(13,148,136,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="flex-shrink-0 w-80 bg-white rounded-card p-5 shadow-soft border border-border-default flex flex-col justify-between h-48 select-none cursor-default"
    >
      <div className="space-y-2.5">
        <div className="flex justify-between items-center">
          <StarRating rating={t.rating} />
          <span className="text-[9px] text-text-muted font-bold font-mono">{t.date}</span>
        </div>
        <h5 className="font-display font-bold text-xs text-text-primary">{t.title}</h5>
        <p className="text-text-secondary text-[11px] leading-relaxed font-sans font-medium line-clamp-3">
          &ldquo;{t.body}&rdquo;
        </p>
      </div>
      <div className="border-t border-border-subtle pt-2 text-[10px]">
        <span className="font-bold text-text-primary block">{t.name}</span>
        <span className="text-text-muted">{t.college}</span>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-32 bg-bg-subtle flex flex-col items-center overflow-hidden">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center px-6 max-w-2xl mx-auto mb-20"
      >
        <h2 className="font-display font-extrabold text-4xl md:text-5xl text-text-primary tracking-tight leading-tight">
          Loved by students everywhere.
        </h2>
      </motion.div>

      {/* Two scrolling rows */}
      <div className="w-full space-y-6 relative">
        {/* Row 1: Leftward */}
        <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max gap-6 animate-scroll-left hover:[animation-play-state:paused]">
            {[...row1Testimonials, ...row1Testimonials].map((t, idx) => (
              <TestimonialCard key={`r1-${idx}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2: Rightward */}
        <div className="flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max gap-6 animate-scroll-right hover:[animation-play-state:paused]">
            {[...row2Testimonials, ...row2Testimonials].map((t, idx) => (
              <TestimonialCard key={`r2-${idx}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
