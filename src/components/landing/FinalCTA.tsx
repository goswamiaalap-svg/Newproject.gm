'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-[#0B0F19] border-t border-[#1E293B] text-white">
      {/* Soft ambient teal/blue glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-teal-400 font-bold text-sm uppercase tracking-widest mb-4 font-sans"
        >
          Ready to Launch?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-6"
        >
          Your career deserves{' '}
          <span className="text-gradient-teal">more than luck.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 font-sans font-medium"
        >
          Join 200+ students already using LaunchPad to land their dream roles. Start free, upgrade when you&apos;re ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/sign-up"
            className="group relative inline-flex items-center gap-2 px-12 h-14 bg-gradient-to-r from-teal to-[#0EA5E9] text-white font-display font-bold text-sm rounded-full shadow-[0_0_30px_rgba(13,148,136,0.35)] hover:shadow-[0_0_40px_rgba(13,148,136,0.55)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            Get Started — It&apos;s Free
          </Link>
          <Link
            href="/sign-in"
            className="text-slate-400 hover:text-white text-sm font-semibold transition-colors font-sans"
          >
            Already have an account? Sign in →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
