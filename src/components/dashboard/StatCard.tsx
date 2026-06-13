'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  accentColor?: 'teal' | 'indigo' | 'gold'
  type?: 'default' | 'progress' | 'streak'
  progressValue?: number // For progress type
}

export default function StatCard({
  title,
  value,
  subtext,
  icon,
  accentColor = 'teal',
  type = 'default',
  progressValue = 0,
}: StatCardProps) {
  const accentClasses = {
    teal: 'border-t-teal hover:shadow-teal-glow/10',
    indigo: 'border-t-indigo hover:shadow-indigo-glow/10',
    gold: 'border-t-gold hover:shadow-gold/10',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-white border border-border-default border-t-4 rounded-card p-5 shadow-card hover:shadow-card-hover transition-all',
        accentClasses[accentColor]
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-text-muted text-xs font-semibold uppercase tracking-wider">
            {title}
          </p>
          <h3 className="font-display text-2xl font-bold text-text-primary mt-2">
            {value}
          </h3>
          {subtext && (
            <p className="text-text-secondary text-xs mt-1.5 font-medium flex items-center gap-1">
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'p-2.5 rounded-btn text-lg',
              accentColor === 'teal' && 'bg-teal/5 text-teal',
              accentColor === 'indigo' && 'bg-indigo/5 text-indigo',
              accentColor === 'gold' && 'bg-gold/5 text-gold'
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {type === 'progress' && (
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-text-secondary mb-1">
            <span>Progress</span>
            <span>{progressValue}%</span>
          </div>
          <div className="w-full h-1.5 bg-bg-subtle rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full',
                accentColor === 'teal' && 'bg-teal',
                accentColor === 'indigo' && 'bg-indigo',
                accentColor === 'gold' && 'bg-gold'
              )}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
