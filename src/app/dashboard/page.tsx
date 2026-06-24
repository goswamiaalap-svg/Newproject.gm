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
  Target,
  Compass,
  Route,
} from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { mockDashboardStats, mockOpportunities } from '@/lib/mock-data'
import { getGreeting } from '@/lib/utils'

export default function DashboardPage() {
  const [userName, setUserName] = useState('Student')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activeTarget, setActiveTarget] = useState<any | null>(null)
  const greeting = getGreeting()

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setDashboardData(data)
          if (data.userName) setUserName(data.userName)
        }
      })
      .catch(console.error)

    fetch('/api/career-target')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setActiveTarget(data)
        }
      })
      .catch(console.error)
  }, [])

  // Sequential Quick Action Buttons
  const quickActions = [
    { label: 'Step 1: Define Target', icon: Compass, href: '/dashboard/path', color: 'bg-white text-text-primary border border-border-default hover:border-teal' },
    { label: 'Step 2: Upload Resume', icon: Upload, href: '/dashboard/resume', color: 'bg-white text-text-primary border border-border-default hover:border-teal' },
    { label: 'Step 3: Setup Roadmap', icon: Route, href: '/dashboard/roadmap', color: 'bg-teal text-white shadow-teal-glow hover:bg-teal-600' },
    { label: 'Step 4: Mock Interview', icon: Video, href: '/dashboard/interview', color: 'bg-white text-text-primary border border-border-default' },
  ]

  // Filter top 3 upcoming deadlines
  const upcomingDeadlines = mockOpportunities
    .filter((o) => !o.applied)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Conditional Hero Banner */}
      {activeTarget ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-hero bg-gradient-hero p-8 text-[#0F172A] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-border-default"
        >
          <div className="relative z-10 max-w-xl">
            <span className="text-teal text-[10px] font-bold uppercase tracking-widest block mb-2 opacity-80 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> Target Career: {activeTarget.targetTitle}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight !text-[#0F172A]">
              {greeting}, {userName}!
            </h1>
            <p className="text-[#475569] text-sm mt-3 leading-relaxed max-w-lg">
              {!activeTarget.gapAnalysis ? (
                "Step 2: Upload or scan your resume to measure how well you align with the skills, projects, and milestones required for this career target."
              ) : (
                `Your target readiness score is at ${activeTarget.readinessScore || 0}%. You have ${activeTarget.gapAnalysis?.missingSkills?.length || 0} skill gaps left to bridge to reach peak readiness.`
              )}
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Small circular progress ring */}
            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0 bg-white/40 rounded-full p-2">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#E2E8F0" strokeWidth="5" fill="transparent" />
                <circle
                  cx="40" cy="40" r="32"
                  stroke="#0D9488" strokeWidth="5" fill="transparent"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={2 * Math.PI * 32 * (1 - (activeTarget.readinessScore || 0) / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xs font-extrabold text-text-primary">{activeTarget.readinessScore || 0}%</span>
                <span className="text-[7px] text-text-muted font-bold uppercase">Ready</span>
              </div>
            </div>

            <Link
              href={!activeTarget.gapAnalysis ? "/dashboard/resume" : "/dashboard/roadmap"}
              className="px-5 py-2.5 bg-teal text-white text-xs font-semibold rounded-btn hover:scale-[1.03] transition-all flex items-center gap-1.5 shadow-teal-glow"
            >
              <span>
                {!activeTarget.gapAnalysis ? "Run Resume Gap Analysis" : "Continue Prep Roadmap"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-hero bg-gradient-hero p-8 text-[#0F172A] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm border border-border-default"
        >
          <div className="relative z-10 max-w-xl">
            <span className="text-indigo text-[10px] font-bold uppercase tracking-widest block mb-2 opacity-80 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Setup Career Outcome Target
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight !text-[#0F172A]">
              Let's find your path, {userName}!
            </h1>
            <p className="text-[#475569] text-sm mt-3 leading-relaxed max-w-lg">
              LaunchPad guides you through a sequential flow to a specific career goal. Set your Target Outcome to begin custom resume gap reviews and roadmaps.
            </p>
          </div>
          <div className="relative z-10 flex gap-3">
            <Link
              href="/dashboard/path"
              className="px-5 py-2.5 bg-teal text-white text-xs font-semibold rounded-btn hover:scale-[1.03] transition-all flex items-center gap-1.5 shadow-teal-glow"
            >
              <span>Define Your Path ✦</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Target Readiness"
          value={activeTarget ? activeTarget.readinessScore : 0}
          suffix="%"
          subtext={activeTarget ? activeTarget.targetTitle : "Define career target first"}
          icon={<Target className="w-5 h-5" />}
          accentColor="teal"
        />
        <StatCard
          title="DSA Streak"
          value={dashboardData ? dashboardData.dsaStreak : 0}
          suffix={dashboardData ? " Days" : "-"}
          subtext={dashboardData?.dsaStreak > 0 ? "🔥 Keep it up!" : "Start solving today"}
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
          value={dashboardData ? dashboardData.problemsSolved : 0}
          subtext={`Out of ${dashboardData?.totalProblems || 200} target`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          accentColor="teal"
          type="progress"
          progressValue={dashboardData ? Math.round((dashboardData.problemsSolved / dashboardData.totalProblems) * 100) : 0}
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
