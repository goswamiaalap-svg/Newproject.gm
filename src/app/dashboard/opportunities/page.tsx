'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  BellOff,
  Calendar,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  List,
  ShieldAlert,
} from 'lucide-react'
import { toast } from 'sonner'
import { applyToOpportunity, getOpportunities, toggleReminder } from '@/services/opportunityService'
import { cn } from '@/lib/utils'
import type { Opportunity, OpportunityType } from '@/types/opportunity'

const opportunityTypes: Array<'all' | OpportunityType> = ['all', 'internship', 'hackathon', 'open-source', 'fellowship']

function getDaysLeft(deadline: string) {
  const diffTime = new Date(deadline).getTime() - new Date().getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function formatDeadline(deadline: string) {
  return new Date(deadline).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function mergeOpportunityState(previous: Opportunity[], next: Opportunity[]) {
  const previousById = new Map(previous.map((item) => [item.id, item]))

  return next.map((item) => {
    const current = previousById.get(item.id)

    if (!current) {
      return item
    }

    return {
      ...item,
      applied: current.applied,
      reminderEnabled: current.reminderEnabled,
    }
  })
}

export default function OpportunitiesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [filterType, setFilterType] = useState<'all' | OpportunityType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadOpportunities() {
      setLoading(true)
      setError(null)

      try {
        const data = await getOpportunities(searchQuery.trim(), filterType)

        if (!active) {
          return
        }

        setOpportunities((current) => mergeOpportunityState(current, data))
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Failed to load opportunities')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadOpportunities()

    return () => {
      active = false
    }
  }, [filterType, reloadKey, searchQuery])

  const topDeadlines = useMemo(
    () =>
      [...opportunities]
        .filter((item) => !item.applied)
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 3),
    [opportunities]
  )

  const calendarMonthLabel = useMemo(() => {
    if (opportunities.length === 0) {
      return 'July 2026'
    }

    const earliestDeadline = [...opportunities].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )[0]

    return new Date(earliestDeadline.deadline).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }, [opportunities])

  const calendarGrid = useMemo(() => {
    if (opportunities.length === 0) {
      return {
        daysInMonth: 31,
        startDayOffset: 3,
        year: 2026,
        month: 6,
        cells: Array.from({ length: 31 }, (_, index) => index + 1),
      }
    }

    const visibleMonth = new Date(
      [...opportunities].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0].deadline
    )
    const year = visibleMonth.getFullYear()
    const month = visibleMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startDayOffset = new Date(year, month, 1).getDay()
    const cells = Array.from({ length: daysInMonth }, (_, index) => index + 1)

    return { daysInMonth, startDayOffset, year, month, cells }
  }, [opportunities])

  const getDeadlinesForDay = (day: number) => {
    if (opportunities.length === 0) {
      return []
    }

    return opportunities.filter((item) => {
      const deadline = new Date(item.deadline)
      return deadline.getFullYear() === calendarGrid.year && deadline.getMonth() === calendarGrid.month && deadline.getDate() === day
    })
  }

  const handleToggleApply = async (id: string) => {
    const currentOpportunity = opportunities.find((item) => item.id === id)

    try {
      await applyToOpportunity(id)

      setOpportunities((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                applied: !item.applied,
              }
            : item
        )
      )

      const opportunityTitle = currentOpportunity?.title ?? 'opportunity'
      toast(currentOpportunity?.applied ? `Removed applied state for ${opportunityTitle}` : `Applied to ${opportunityTitle}!`, {
        icon: '✅',
      })
    } catch {
      toast.error('Failed to update application status')
    }
  }

  const handleToggleReminder = async (id: string, title: string) => {
    const currentOpportunity = opportunities.find((item) => item.id === id)

    try {
      await toggleReminder(id)

      setOpportunities((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                reminderEnabled: !item.reminderEnabled,
              }
            : item
        )
      )

      if (currentOpportunity?.reminderEnabled) {
        toast(`Removed reminder for ${title}`, { icon: '🔕' })
      } else {
        toast(`Reminder set! We will email you 24h before the ${title} deadline.`, { icon: '🔔' })
      }
    } catch {
      toast.error('Failed to update reminder')
    }
  }

  const filteredOpps = opportunities

  const renderLoadingState = () => (
    <div className="bg-white border border-border-default rounded-card p-6 shadow-card">
      <div className="animate-pulse space-y-4">
        <div className="h-5 w-48 rounded bg-bg-base" />
        <div className="h-4 w-72 rounded bg-bg-base" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="h-20 rounded-card bg-bg-base" />
          <div className="h-20 rounded-card bg-bg-base" />
          <div className="h-20 rounded-card bg-bg-base" />
        </div>
        <div className="h-12 rounded-btn bg-bg-base" />
        <div className="space-y-3">
          <div className="h-24 rounded-card bg-bg-base" />
          <div className="h-24 rounded-card bg-bg-base" />
          <div className="h-24 rounded-card bg-bg-base" />
        </div>
      </div>
    </div>
  )

  const renderErrorState = () => (
    <div className="bg-white border border-border-default rounded-card p-6 shadow-card flex items-start gap-4">
      <div className="p-2 rounded-btn bg-red-50 text-red-600 border border-red-100">
        <ShieldAlert className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-base font-bold text-text-primary">Could not load opportunities</h3>
        <p className="text-sm text-text-secondary mt-1">{error}</p>
        <button
          onClick={() => setReloadKey((current) => current + 1)}
          className="mt-4 px-4 py-2 rounded-btn text-xs font-bold border bg-text-primary text-white border-text-primary"
        >
          Retry
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-text-primary">Opportunity Tracker</h1>
          <p className="text-text-secondary text-sm mt-1">
            Never miss SDE internships, open-source programs, and campus hackathons.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white border border-border-default p-1 rounded-btn shadow-sm self-start sm:self-center">
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded-btn transition-colors',
              viewMode === 'list' ? 'bg-teal/5 text-teal' : 'text-text-muted hover:text-text-secondary'
            )}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'p-2 rounded-btn transition-colors',
              viewMode === 'calendar' ? 'bg-teal/5 text-teal' : 'text-text-muted hover:text-text-secondary'
            )}
            title="Calendar View"
          >
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">🔥 Nearest Active Deadlines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topDeadlines.map((opp) => {
            const daysLeft = getDaysLeft(opp.deadline)

            return (
              <div
                key={opp.id}
                className="bg-white border border-border-default border-l-4 border-l-gold rounded-card p-4 shadow-card flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{opp.company}</span>
                  <h4 className="font-display text-sm font-bold text-text-primary truncate max-w-[150px] mt-0.5">
                    {opp.title}
                  </h4>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold-light text-gold border border-gold/20 font-bold block animate-pulse">
                    {daysLeft > 1 ? `${daysLeft} Days Left` : daysLeft === 1 ? '1 Day Left' : daysLeft === 0 ? 'Closing Today' : 'Expired'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-border-subtle pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by title or company"
            aria-label="Search opportunities"
            className="w-full sm:max-w-sm bg-white border border-border-default rounded-btn px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted shadow-sm focus:outline-none focus:border-teal/40"
          />

          <div className="flex flex-wrap gap-1.5">
            {opportunityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border transition-all',
                  filterType === type
                    ? 'bg-text-primary text-white border-text-primary shadow-sm'
                    : 'bg-white text-text-secondary border-border-default hover:bg-bg-subtle'
                )}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <AnimatePresence mode="wait">
          {filteredOpps.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-border-default rounded-card p-6 shadow-card"
            >
              <p className="text-sm text-text-secondary">No opportunities match your search.</p>
            </motion.div>
          ) : viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {filteredOpps.map((opp) => {
                const hasReminder = opp.reminderEnabled
                const daysLeft = getDaysLeft(opp.deadline)

                return (
                  <div
                    key={opp.id}
                    className={cn(
                      'bg-white border border-border-default rounded-card p-4 shadow-card hover:shadow-card-hover transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
                      opp.applied && 'opacity-65 bg-bg-base/30'
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="text-3xl flex-shrink-0 bg-bg-base p-2 rounded-btn border border-border-subtle">{opp.company.slice(0, 1)}</span>
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

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-border-subtle">
                      <div className="flex flex-col text-left sm:text-right">
                        <span className="text-[9px] text-text-muted uppercase">Deadline</span>
                        <p className="text-xs font-bold text-text-secondary mt-0.5">{formatDeadline(opp.deadline)}</p>
                        <span className={cn('text-[9px] font-bold mt-1 inline-block', daysLeft < 7 ? 'text-gold' : 'text-text-muted')}>
                          {daysLeft > 1 ? `${daysLeft} days remaining` : daysLeft === 1 ? '1 day remaining' : daysLeft === 0 ? 'Closing today' : 'Expired'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={opp.applyUrl}
                          className="px-4 py-2.5 rounded-btn text-xs font-bold border transition-colors flex items-center gap-1 bg-white border-border-default text-text-secondary hover:text-text-primary"
                        >
                          Apply Now
                        </a>

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
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-base font-bold text-text-primary flex items-center gap-1.5">
                  <CalendarCheck className="w-5 h-5 text-teal" />
                  <span>{calendarMonthLabel}</span>
                </h3>
                <div className="flex gap-1">
                  <button className="p-1 border border-border-default rounded hover:bg-bg-base text-text-muted">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1 border border-border-default rounded hover:bg-bg-base text-text-muted">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-border-default rounded-btn overflow-hidden border border-border-default text-xs">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-bg-base text-center py-2 font-bold text-[10px] text-text-muted uppercase">
                    {day}
                  </div>
                ))}

                {Array.from({ length: calendarGrid.startDayOffset }).map((_, index) => (
                  <div key={`empty-${index}`} className="bg-white min-h-[90px]" />
                ))}

                {calendarGrid.cells.map((day) => {
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
                            {opp.company}
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
      )}
    </div>
  )
}