'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  type ProgressStats,
  type CompanyReadiness,
  type SmartInsight,
  type Achievement,
  ACHIEVEMENTS,
  getCompanyReadiness,
  getSmartInsights,
  COMPANIES,
} from './roadmapData'
import {
  CheckCircle2,
  Clock,
  Flame,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Zap,
  Lock,
  Trophy,
  Calendar,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react'

// ─── Stat Tile ─────────────────────────────────────────────────────────────────

function StatTile({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string
  icon: React.ElementType; color: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] transition-shadow"
    >
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', color)}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-2xl font-bold text-text-primary tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-text-secondary mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-text-muted mt-1">{sub}</p>}
    </motion.div>
  )
}

// ─── Progress Dashboard ────────────────────────────────────────────────────────

export function ProgressDashboard({ stats }: { stats: ProgressStats }) {
  const weeklyPct = stats.weeklyGoalHours > 0
    ? Math.min(100, Math.round((stats.weeklyStudiedHours / stats.weeklyGoalHours) * 100))
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-text-muted" />
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Progress Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatTile label="Tasks Done" value={stats.completedTasks} sub={`of ${stats.totalTasks} total`} icon={CheckCircle2} color="bg-teal-50 text-teal" />
        <StatTile label="Day Streak" value={`${stats.currentStreak}🔥`} sub="Keep it going!" icon={Flame} color="bg-amber-50 text-amber-500" />
        <StatTile label="Study Hours" value={`${stats.totalStudyHours}h`} sub="Total invested" icon={Clock} color="bg-indigo-50 text-indigo-500" />
      </div>

      {/* Weekly goal bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-muted" />
            <p className="text-xs font-bold text-text-secondary">This Week's Goal</p>
          </div>
          <span className="text-sm font-bold text-text-primary">{stats.weeklyStudiedHours}h <span className="font-normal text-text-muted">/ {stats.weeklyGoalHours}h</span></span>
        </div>
        <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
          <motion.div
            className={cn('h-full rounded-full', weeklyPct >= 100 ? 'bg-gradient-to-r from-teal to-teal-400' : 'bg-gradient-to-r from-indigo-400 to-indigo-500')}
            initial={{ width: 0 }}
            animate={{ width: `${weeklyPct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-text-muted mt-2">
          {weeklyPct >= 100 ? '🎉 Weekly goal crushed!' : `${100 - weeklyPct}% remaining to hit your goal`}
        </p>
      </div>
    </div>
  )
}

// ─── Company Readiness ────────────────────────────────────────────────────────

export function CompanyReadinessPanel({ targetCompany }: { targetCompany: string }) {
  const readiness = getCompanyReadiness(targetCompany)
  const companyInfo = COMPANIES.find(c => c.id === targetCompany)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-text-muted" />
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Company Readiness</h2>
      </div>

      <div className="space-y-3">
        {readiness.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ backgroundColor: `${item.color}18` }}>
                {item.logo}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">{item.company}</p>
                <p className="text-[10px] text-text-muted">{item.readinessPct >= 80 ? 'Strong contender' : item.readinessPct >= 50 ? 'Getting closer' : 'Needs preparation'}</p>
              </div>
              <span className="text-lg font-bold" style={{ color: item.color }}>{item.readinessPct}%</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${item.readinessPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: 'easeOut' }}
              />
            </div>

            {/* Skill gaps */}
            {item.skillGaps.length > 0 && (
              <div className="mt-3">
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Skill Gaps</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.skillGaps.map((gap, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-md font-medium">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Smart Insights ────────────────────────────────────────────────────────────

export function SmartInsightsPanel() {
  const insights = getSmartInsights()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-text-muted" />
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Smart Insights</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Strongest */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-teal" />
            </div>
            <p className="text-xs font-bold text-text-secondary">Strongest Skills</p>
          </div>
          <div className="space-y-2">
            {insights.strongestSkills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
                <span className="text-xs text-text-secondary">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weakest */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-xs font-bold text-text-secondary">Needs Work</p>
          </div>
          <div className="space-y-2">
            {insights.weakestSkills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                <span className="text-xs text-text-secondary">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-xs font-bold text-text-secondary">AI Recommendations</p>
          </div>
          <div className="space-y-2.5">
            {insights.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2.5 p-2.5 bg-amber-50/50 rounded-xl border border-amber-100/60"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-text-secondary leading-relaxed">{rec}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <p className="text-xs font-bold text-text-secondary">This Week's Focus Areas</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {insights.focusAreas.map((area, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold"
              >
                {area}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Achievements / Motivation Layer ──────────────────────────────────────────

export function AchievementsPanel() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-text-muted" />
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-widest">Achievements</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            whileHover={!ach.locked ? { y: -3 } : {}}
            className={cn(
              'relative bg-white border rounded-2xl p-4 text-center transition-all duration-300',
              ach.locked
                ? 'border-slate-100 opacity-50 grayscale'
                : 'border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
            )}
          >
            {ach.locked && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
                <Lock className="w-5 h-5 text-slate-300" />
              </div>
            )}
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${ach.color}18` }}
            >
              {ach.icon}
            </div>
            <p className="text-xs font-bold text-text-primary">{ach.title}</p>
            <p className="text-[10px] text-text-muted mt-0.5 leading-tight">{ach.description}</p>
            {!ach.locked && ach.unlockedAt && (
              <p className="text-[9px] font-semibold mt-1.5" style={{ color: ach.color }}>✓ Unlocked {ach.unlockedAt}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Motivational banner */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-5 text-white"
      >
        {/* Decorative circles */}
        <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -right-2 -bottom-4 w-16 h-16 rounded-full bg-white/8" />
        <div className="absolute left-1/2 -top-8 w-32 h-32 rounded-full bg-teal-400/20" />

        <p className="text-sm font-bold relative z-10">You're doing great! 🚀</p>
        <p className="text-xs text-teal-100 mt-1 relative z-10 leading-relaxed">
          Every task you complete brings you closer to your dream company.
          Stay consistent — 3 more days to unlock the <strong className="text-white">Unstoppable</strong> badge!
        </p>
      </motion.div>
    </div>
  )
}
