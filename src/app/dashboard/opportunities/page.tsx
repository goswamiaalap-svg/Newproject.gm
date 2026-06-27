'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Calendar, List, CalendarCheck, Check, Clock, ChevronLeft, ChevronRight, ShieldAlert, ExternalLink } from 'lucide-react'
import { mockOpportunities } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner' // standard react-sonner styling or simple custom toast

export default function OpportunitiesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [filterType, setFilterType] = useState<'all' | 'internship' | 'hackathon' | 'open-source' | 'fellowship'>('all')
  const [opportunities, setOpportunities] = useState(mockOpportunities)
  const [remindedList, setRemindedList] = useState<string[]>([])

  React.useEffect(() => {
    fetch('/api/opportunities')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.opportunities)) {
          const fetchedOpps = data.opportunities.map((opp: any) => ({
            ...opp,
            deadline: new Date(opp.deadline),
          }))
          const states = Array.isArray(data.states) ? data.states : []

          setOpportunities(fetchedOpps.map((opp: any) => {
            const match = states.find((item: any) => item.opportunityId === opp.id)
            return {
              ...opp,
              applied: match ? match.applied : false,
            }
          }))

          const remindedIds = states.filter((item: any) => item.reminded).map((item: any) => item.opportunityId)
          setRemindedList(remindedIds)
        }
      })
      .catch(console.error)
  }, [])

  const handleToggleApply = (id: string) => {
    let nextValue = false
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          nextValue = !opp.applied
          toast(nextValue ? `Applied to ${opp.title}!` : `Removed applied state for ${opp.title}`, {
            icon: '✅',
          })
          return { ...opp, applied: nextValue }
        }
        return opp
      })
    )

    fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: id, field: 'applied', value: nextValue }),
    }).catch(console.error)
  }

  const handleToggleReminder = (id: string, title: string) => {
    let nextValue = false
    if (remindedList.includes(id)) {
      setRemindedList(remindedList.filter((rId) => rId !== id))
      toast(`Removed reminder for ${title}`, { icon: '🔕' })
      nextValue = false
    } else {
      setRemindedList([...remindedList, id])
      toast(`Reminder set! We will email you 24h before the ${title} deadline.`, { icon: '🔔' })
      nextValue = true
    }

    fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ opportunityId: id, field: 'reminded', value: nextValue }),
    }).catch(console.error)
  }

  const getDaysLeft = (date: Date) => {
    const diffTime = date.getTime() - new Date().getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter list
  const filteredOpps = opportunities.filter((opp) => {
    if (filterType === 'all') return true
    return opp.type === filterType
  })

  // Sort by deadline to get top 3 nearest
  const topDeadlines = [...opportunities]
    .filter((o) => !o.applied)
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 3)

  // Calendar generation helpers for current month (July 2026 as reference in mockup)
  const daysInMonth = 31
  const startDayOffset = 3 // Wed is 1st of July
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const gridCells = [
    ...Array(startDayOffset).fill(null),
    ...calendarDays,
  ]

  const getDeadlinesForDay = (day: number) => {
    // Check against mock deadlines in July 2024/2026. Let's match by index/day
    // amazon: 10th Aug, GSoC: 25th July, Flipkart: 5th Aug, Microsoft: 15th Sep, MLH: 28th July, Codeforces: 22nd July
    return opportunities.filter((opp) => {
      const d = opp.deadline.getDate()
      const m = opp.deadline.getMonth()
      // July is month index 6 (0-indexed)
      return d === day && m === 6
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Area Wrapper */}
      <div className="!bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6">
        {/* Header and Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold !text-[#0F172A]">
              Opportunity Tracker
            </h1>
            <p className="!text-[#475569] text-sm mt-1">
              Never miss SDE internships, open-source programs, and campus hackathons.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 !bg-white border !border-[#E2E8F0] p-1 rounded-lg shadow-sm self-start sm:self-center">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'list' ? '!bg-[#F0FDFA] !text-[#0F766E]' : '!text-[#64748B] hover:!text-[#0F172A]'
              )}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'p-2 rounded-md transition-colors',
                viewMode === 'calendar' ? '!bg-[#F0FDFA] !text-[#0F766E]' : '!text-[#64748B] hover:!text-[#0F172A]'
              )}
              title="Calendar View"
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top 3 Nearest Deadlines Row */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider !text-[#64748B]">
            🔥 Nearest Active Deadlines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topDeadlines.map((opp) => {
              const daysLeft = getDaysLeft(opp.deadline)
              return (
                <div
                  key={opp.id}
                  className="!bg-white border !border-[#E2E8F0] !border-l-4 !border-l-[#F59E0B] rounded-xl p-4 shadow-sm flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] !text-[#64748B] font-bold uppercase tracking-wider">{opp.company}</span>
                    <h4 className="font-display text-sm font-bold !text-[#0F172A] truncate max-w-[150px] mt-0.5">
                      {opp.title}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[9px] px-2 py-0.5 rounded-full !bg-[#FEF3C7] !text-[#B45309] border !border-[#FDE68A] font-bold block animate-pulse">
                      {daysLeft > 0 ? `${daysLeft} Days Left` : 'Closing Today'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-1.5 border-b border-border-subtle pb-3">
        {(['all', 'internship', 'hackathon', 'open-source', 'fellowship'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-all',
              filterType === t
                ? 'bg-text-primary text-white border-text-primary shadow-sm'
                : 'bg-white text-text-secondary border-border-default hover:bg-bg-subtle'
            )}
          >
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Main View Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {filteredOpps.map((opp) => {
              const hasReminder = remindedList.includes(opp.id)
              const daysLeft = getDaysLeft(opp.deadline)
              
              return (
                <div
                  key={opp.id}
                  className={cn(
                    'bg-white border border-border-default rounded-card p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
                    opp.applied && 'opacity-65 bg-bg-base/30'
                  )}
                >
                  {/* Left info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-3xl flex-shrink-0 bg-bg-base p-2 rounded-btn border border-border-subtle">{opp.logo}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal/5 text-teal border border-teal/10 uppercase tracking-wider">
                          {opp.type}
                        </span>
                        {opp.applied && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 uppercase tracking-wider flex items-center gap-0.5">
                            <Check className="w-3 h-3" />
                            <span>Applied</span>
                          </span>
                        )}
                      </div>
                      <h4 className={cn('font-display text-base font-bold text-text-primary mt-1.5 truncate', opp.applied && 'line-through')}>
                        {opp.title}
                      </h4>
                      <p className="text-[10px] text-text-muted">{opp.company}</p>
                    </div>
                  </div>

                  {/* Right tools / deadlines */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                    <div className="flex flex-col text-left sm:text-right">
                      <span className="text-[9px] text-text-muted uppercase">Deadline</span>
                      <p className="text-xs font-bold text-text-secondary mt-0.5">
                        {opp.deadline.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <span className={cn('text-[9px] font-bold mt-1 inline-block', daysLeft < 7 ? 'text-gold' : 'text-text-muted')}>
                        {daysLeft > 0 ? `${daysLeft} days remaining` : 'Closing today'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Reminder Icon */}
                      <button
                        onClick={() => handleToggleReminder(opp.id, opp.title)}
                        className={cn(
                          'p-2.5 rounded-btn border transition-colors',
                          hasReminder
                            ? 'bg-indigo/5 border-indigo/20 text-indigo'
                            : 'bg-white border-border-default text-text-muted hover:text-text-primary'
                        )}
                        title={hasReminder ? 'Reminder Active' : 'Set Reminder'}
                      >
                        {hasReminder ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      </button>

                      {/* Apply Now Button */}
                      <a
                        href={opp.applyUrl || 'https://example.com/apply-placeholder'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'px-4 py-2.5 rounded-btn text-xs font-bold border transition-colors flex items-center gap-1',
                          'bg-indigo hover:bg-indigo-600 border-indigo text-white shadow-indigo-glow'
                        )}
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      {/* Applied Checkbox */}
                      <button
                        onClick={() => handleToggleApply(opp.id)}
                        className={cn(
                          'px-4 py-2.5 rounded-btn text-xs font-bold border transition-colors flex items-center gap-1',
                          opp.applied
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : 'bg-teal hover:bg-teal-600 border-teal text-white shadow-teal-glow'
                        )}
                      >
                        {opp.applied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </>
                        ) : (
                          'Mark Applied'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-border-default rounded-card p-6 shadow-card"
          >
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-base font-bold text-text-primary flex items-center gap-1.5">
                <CalendarCheck className="w-5 h-5 text-teal" />
                <span>July 2026</span>
              </h3>
              <div className="flex gap-1">
                <button className="p-1 border border-border-default rounded hover:bg-bg-base text-text-muted"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 border border-border-default rounded hover:bg-bg-base text-text-muted"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-border-default rounded-btn overflow-hidden border border-border-default text-xs">
              {/* Day Titles */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="bg-bg-base text-center py-2 font-bold text-[10px] text-text-muted uppercase">
                  {d}
                </div>
              ))}

              {/* Grid Cells */}
              {gridCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="bg-white min-h-[90px]" />
                }

                const deadlines = getDeadlinesForDay(day)

                return (
                  <div
                    key={`day-${day}`}
                    className="bg-white min-h-[90px] p-2 hover:bg-bg-base/30 transition-colors flex flex-col justify-between"
                  >
                    <span className="font-bold text-[10px] text-text-secondary">{day}</span>
                    <div className="space-y-1 mt-1">
                      {deadlines.map((opp) => (
                        <div
                          key={opp.id}
                          className={cn(
                            'text-[8px] font-bold px-1 py-0.5 rounded truncate border leading-tight',
                            opp.type === 'internship' && 'bg-teal/5 text-teal border-teal/10',
                            opp.type === 'hackathon' && 'bg-gold-light text-gold border-gold/10',
                            opp.type === 'open-source' && 'bg-indigo/5 text-indigo border-indigo/10',
                            opp.type === 'fellowship' && 'bg-red-50 text-red-600 border-red-100'
                          )}
                          title={`${opp.company}: ${opp.title}`}
                        >
                          {opp.logo} {opp.company.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
