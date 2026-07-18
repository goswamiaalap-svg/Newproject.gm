'use client'

import React from 'react'
import { motion } from 'framer-motion'

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`skeleton rounded-xl ${className ?? ''}`} />
  )
}

export function RoadmapSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <Shimmer className="h-4 w-32" />
        <Shimmer className="h-8 w-72" />
        <Shimmer className="h-4 w-56" />
      </div>

      {/* Progress bar card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="space-y-1.5">
            <Shimmer className="h-4 w-48" />
            <Shimmer className="h-3 w-32" />
          </div>
          <Shimmer className="h-8 w-12" />
        </div>
        <Shimmer className="h-2.5 w-full" />
      </div>

      {/* Timeline items */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="pl-12 md:pl-16 relative"
        >
          <Shimmer className="absolute left-0 top-0 w-9 h-9 md:w-11 md:h-11 rounded-full" />
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Shimmer className="h-3 w-16" />
                <Shimmer className="h-5 w-64" />
                <Shimmer className="h-3 w-48" />
                <Shimmer className="h-6 w-44 rounded-full mt-1" />
              </div>
              <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function WizardSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="bg-white border border-slate-100 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.06)] p-8 space-y-6">
        <div className="space-y-2">
          <Shimmer className="h-4 w-32" />
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map(i => (
              <React.Fragment key={i}>
                <Shimmer className="w-9 h-9 rounded-full flex-shrink-0" />
                {i < 3 && <Shimmer className="flex-1 h-0.5" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="space-y-3 min-h-[280px]">
          <Shimmer className="h-7 w-72" />
          <Shimmer className="h-4 w-56" />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[0, 1, 2, 3, 4, 5].map(i => <Shimmer key={i} className="h-10" />)}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <Shimmer className="h-9 w-20" />
          <Shimmer className="h-9 w-40" />
        </div>
      </div>
    </div>
  )
}

export function PanelSkeleton({ lines = 4 }: { lines?: number }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-2">
        <Shimmer className="w-7 h-7 rounded-xl" />
        <Shimmer className="h-4 w-32" />
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} className={`h-3 ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} />
      ))}
    </div>
  )
}
