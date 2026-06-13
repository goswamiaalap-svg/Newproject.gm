'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText,
  Flame,
  Clock,
  CheckCircle2,
  Upload,
  Code2,
  Video,
  Users2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { mockDashboardStats, mockOpportunities } from '@/lib/mock-data'
import { getGreeting } from '@/lib/utils'

export default function DashboardPage() {
  const [userName, setUserName] = useState('Demo Student')
  const greeting = getGreeting()

  useEffect(() => {
    const userStr = localStorage.getItem('launchpad_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.name) setUserName(user.name)
      } catch (e) {}
    }
  }, [])

  // Quick Action Buttons
  const quickActions = [
    { label: 'Upload Resume', icon: Upload, href: '/dashboard/resume', color: 'bg-teal text-white shadow-teal-glow' },
    { label: 'Solve DSA Problems', icon: Code2, href: '/dashboard/dsa', color: 'bg-indigo text-white shadow-indigo-glow' },
    { label: 'Start Mock Interview', icon: Video, href: '/dashboard/interview', color: 'bg-white text-text-primary border border-border-default' },
    { label: 'Find Hackathon Team', icon: Users2, href: '/dashboard/teams', color: 'bg-white text-text-primary border border-border-default' },
  ]

  // Filter top 3 upcoming deadlines
  const upcomingDeadlines = mockOpportunities
    .filter((o) => !o.applied)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-hero bg-gradient-hero p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg"
      >
        <div className="relative z-10 max-w-lg">
          <span className="text-teal text-xs font-semibold uppercase tracking-wider block mb-1">
            ✦ Welcome Back
          </span>
          <h1 className="font-display text-3xl font-bold">
            {greeting}, {userName}!
          </h1>
          <p className="text-white/60 text-sm mt-2 leading-relaxed">
            Your ATS resume compatibility score is at 78%. You are in the top 15% of your batch at JKLU. Keep up the streak!
          </p>
        </div>
        <div className="relative z-10 flex gap-3">
          <Link
            href="/dashboard/roadmap"
            className="px-5 py-2.5 bg-teal text-white text-xs font-semibold rounded-btn hover:scale-[1.03] transition-all flex items-center gap-1.5"
          >
            <span>Resume Prep Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Resume Score"
          value={`${mockDashboardStats.resumeScore}/100`}
          subtext="ATS compatible format"
          icon={<FileText className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          title="DSA Streak"
          value={`${mockDashboardStats.dsaStreak} Days`}
          subtext="🔥 14 days active"
          icon={<Flame className="w-5 h-5" />}
          accentColor="indigo"
        />
        <StatCard
          title="Upcoming Deadlines"
          value={mockDashboardStats.upcomingDeadlines}
          subtext="Internships/Hackathons"
          icon={<Clock className="w-5 h-5" />}
          accentColor="gold"
        />
        <StatCard
          title="DSA Solved"
          value={mockDashboardStats.problemsSolved}
          subtext="Out of 200 target"
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="teal"
          type="progress"
          progressValue={Math.round((mockDashboardStats.problemsSolved / 200) * 100)}
        />
      </div>

      {/* Quick Action Buttons Row */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className={`flex flex-col items-center justify-center p-5 rounded-card text-center hover:scale-[1.02] transition-transform shadow-sm ${action.color}`}
            >
              <action.icon className="w-6 h-6 mb-2.5" />
              <span className="text-xs font-bold leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Timeline, Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column: Recent Activity (Col span 6) */}
        <div className="lg:col-span-6 space-y-6">
          <ActivityFeed />
        </div>

        {/* Right Column: Deadlines & mini chart (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Deadlines Widget */}
          <div className="bg-white border border-border-default rounded-card p-5 shadow-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-sm font-bold text-text-primary">
                Immediate Deadlines
              </h3>
              <Link
                href="/dashboard/opportunities"
                className="text-[10px] text-teal font-semibold hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map((opp) => (
                <div
                  key={opp.id}
                  className="flex items-center justify-between p-3 bg-bg-base/50 rounded-btn border border-border-subtle"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl flex-shrink-0">{opp.logo}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {opp.title}
                      </p>
                      <p className="text-[10px] text-text-muted">{opp.company}</p>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold-light text-gold border border-gold/20 font-bold flex-shrink-0">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly DSA Solve Performance */}
          <div className="bg-white border border-border-default rounded-card p-5 shadow-card">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-display text-sm font-bold text-text-primary">
                  Weekly Solving Pace
                </h3>
                <p className="text-[10px] text-text-muted mt-0.5">Average 16.5 solved/day</p>
              </div>
              <TrendingUp className="w-4 h-4 text-teal" />
            </div>

            {/* Simple CSS-based bar chart */}
            <div className="flex items-end justify-between gap-2 h-24 mt-6 px-2">
              {mockDashboardStats.weeklyProgress.map((val, idx) => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                const max = Math.max(...mockDashboardStats.weeklyProgress)
                const pct = (val / max) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="relative group w-full flex justify-center">
                      {/* Tooltip */}
                      <span className="absolute -top-6 scale-0 transition-transform group-hover:scale-100 bg-text-primary text-white text-[9px] px-1 py-0.5 rounded font-mono">
                        {val}
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                        className="w-2 rounded-t-full bg-gradient-to-t from-teal to-[#0EA5E9]"
                      />
                    </div>
                    <span className="text-[9px] font-medium text-text-muted font-mono">
                      {days[idx]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
