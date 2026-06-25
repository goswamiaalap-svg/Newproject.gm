'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-hero" />,
})

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10 overflow-hidden font-sans">
      {/* Left panel: 3D visuals & branding (hidden on small screens) */}
      <div className="relative hidden lg:flex lg:col-span-5 xl:col-span-6 bg-gradient-to-br from-[#3b82f6] via-[#818cf8] to-[#fdba74] items-center justify-center p-12 overflow-hidden">
        {/* Three.js Background */}
        <HeroScene density="light" />

        {/* Branding & Overlay Content */}
        <div className="relative z-10 max-w-lg w-full flex flex-col justify-between h-full">
          <div>
            <Link href="/" className="flex items-center gap-1 group">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[#111111]">
                LaunchPad
              </span>
              <span className="w-2 h-2 rounded-full bg-[#3B82F6] -mt-2 group-hover:scale-150 transition-transform" />
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="glass p-8 rounded-hero border border-white/50 shadow-glass backdrop-blur-md"
          >
            <span className="text-[#3B82F6] text-xs font-bold uppercase tracking-wider block mb-2">
              ✦ Built for Engineering Students
            </span>
            <h2 className="font-display text-2xl font-bold text-[#111111] mb-3">
              The Placement Prep Platform That Works
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Unlock AI resume screening, step-by-step DSA learning roadmaps, and custom mock interviews tailored to your dream companies.
            </p>
          </motion.div>

          <div className="text-[#111111]/40 text-xs font-semibold">
            © {new Date().getFullYear()} LaunchPad.
          </div>
        </div>
      </div>

      {/* Right panel: Form input container */}
      <div className="col-span-1 lg:col-span-5 xl:col-span-4 bg-bg-base flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative overflow-y-auto">
        <div className="lg:hidden absolute top-6 left-6">
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-display font-bold text-xl text-text-primary">
              Launch
            </span>
            <span className="text-teal font-display font-bold text-xl">Pad</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal -mt-2 group-hover:scale-150 transition-transform" />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
