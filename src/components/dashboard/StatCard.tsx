'use client'

import React from 'react'
import { motion, useInView, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

function Counter({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })
  const springValue = useSpring(0, { bounce: 0, duration: 1500 })
  const displayValue = useTransform(springValue, (current) => Math.round(current))

  React.useEffect(() => {
    if (inView) {
      springValue.set(value)
    }
  }, [inView, springValue, value])

  return <motion.span ref={ref}>{displayValue}</motion.span>
}

interface StatCardProps {
  title: string
  value: string | number
  suffix?: string
  subtext?: string
  icon?: React.ReactNode
  accentColor?: 'teal' | 'indigo' | 'gold'
  type?: 'default' | 'progress' | 'streak'
  progressValue?: number // For progress type
}

export default function StatCard({
  title,
  value,
  suffix = '',
  subtext,
  icon,
  accentColor = 'teal',
  type = 'default',
  progressValue = 0,
}: StatCardProps) {
  const accentClasses = {
    teal: '!border-t-[#0D9488] hover:shadow-[0_8px_30px_rgba(13,148,136,0.12)]',
    indigo: '!border-t-[#6366F1] hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)]',
    gold: '!border-t-[#F59E0B] hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]',
  }

  const badgeClasses = {
    teal: '!bg-[#F0FDFA] !text-[#0F766E]',
    indigo: '!bg-[#EEF2FF] !text-[#4338CA]',
    gold: '!bg-[#FFFBEB] !text-[#B45309]',
  }

  const progressClasses = {
    teal: '!bg-[#0D9488]',
    indigo: '!bg-[#6366F1]',
    gold: '!bg-[#F59E0B]',
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative overflow-hidden border-t-4 rounded-2xl p-6 transition-all duration-300',
        '!bg-white !border-x-[#E2E8F0] !border-b-[#E2E8F0] shadow-sm',
        accentClasses[accentColor]
      )}
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider !text-[#64748B]">
            {title}
          </p>
          <h3 className="font-display text-3xl font-bold mt-2 !text-[#0F172A]">
            {typeof value === 'number' ? <Counter value={value} /> : value}
            {suffix}
          </h3>
          {subtext && (
            <p className="text-sm mt-2 font-medium flex items-center gap-1 !text-[#475569]">
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'p-3.5 rounded-xl text-xl flex items-center justify-center',
              badgeClasses[accentColor]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {type === 'progress' && (
        <div className="mt-6">
          <div className="flex justify-between text-xs font-medium mb-2 !text-[#64748B]">
            <span>Progress</span>
            <span>{progressValue}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden !bg-[#F1F5F9]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn(
                'h-full rounded-full',
                progressClasses[accentColor]
              )}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
