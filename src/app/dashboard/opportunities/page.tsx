'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Calendar, List, CalendarCheck, Check, Clock, ChevronLeft, ChevronRight, ShieldAlert, ExternalLink, Search, Plus, X } from 'lucide-react'
import { mockOpportunities } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner' // standard react-sonner styling or simple custom toast
import { trackEvent } from '@/lib/events'

export default function OpportunitiesPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [filterType, setFilterType] = useState<'all' | 'internship' | 'hackathon' | 'open-source' | 'fellowship'>('all')
  const [opportunities, setOpportunities] = useState(mockOpportunities)
  const [remindedList, setRemindedList] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  // New States
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null)
  const [editingNotes, setEditingNotes] = useState('')
  const [isSavingNotes, setIsSavingNotes] = useState(false)

  // Add Form States
  const [newOppTitle, setNewOppTitle] = useState('')
  const [newOppCompany, setNewOppCompany] = useState('')
  const [newOppType, setNewOppType] = useState<'internship' | 'hackathon' | 'open-source' | 'fellowship'>('internship')
  const [newOppDeadline, setNewOppDeadline] = useState('')
  const [newOppApplyUrl, setNewOppApplyUrl] = useState('')
  const [newOppLogo, setNewOppLogo] = useState('💼')
  const [newOppNotes, setNewOppNotes] = useState('')

  React.useEffect(() => {
    setMounted(true)
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
              notes: match ? (match.notes || '') : '',
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

  const handleSaveNotes = async () => {
    if (!selectedOpp) return
    setIsSavingNotes(true)
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: selectedOpp.id,
          field: 'notes',
          value: editingNotes,
        })
      })
      if (res.ok) {
        setOpportunities(prev => prev.map(o => o.id === selectedOpp.id ? { ...o, notes: editingNotes } : o))
        toast('Notes saved successfully!', { icon: '📝' })
      } else {
        toast('Failed to save notes', { icon: '❌' })
      }
    } catch (err) {
      console.error(err)
      toast('Error saving notes', { icon: '❌' })
    } finally {
      setIsSavingNotes(false)
    }
  }

  const handleAddOpportunity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOppTitle || !newOppCompany || !newOppDeadline) {
      toast('Please fill in all required fields.', { icon: '⚠️' })
      return
    }
    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newOppTitle,
          company: newOppCompany,
          type: newOppType,
          deadline: newOppDeadline,
          applyUrl: newOppApplyUrl,
          logo: newOppLogo,
          notes: newOppNotes,
        })
      })
      if (res.ok) {
        const data = await res.json()
        const createdOpp = {
          ...data.opportunity,
          deadline: new Date(data.opportunity.deadline),
          applied: false,
          notes: newOppNotes,
        }
        setOpportunities((prev) => [createdOpp, ...prev])
        toast('Opportunity added successfully!', { icon: '🎉' })
        trackEvent('Opportunity saved', { title: newOppTitle, company: newOppCompany, type: newOppType });
        
        // Reset form
        setNewOppTitle('')
        setNewOppCompany('')
        setNewOppType('internship')
        setNewOppDeadline('')
        setNewOppApplyUrl('')
        setNewOppLogo('💼')
        setNewOppNotes('')
        setShowAddModal(false)
      } else {
        const errData = await res.json()
        toast(errData.error || 'Failed to create opportunity.', { icon: '❌' })
      }
    } catch (err) {
      console.error(err)
      toast('Server error creating opportunity.', { icon: '❌' })
    }
  }

  const getDaysLeft = (date: Date) => {
    const diffTime = date.getTime() - new Date().getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter list by category and search query
  const filteredOpps = opportunities.filter((opp) => {
    const matchesType = filterType === 'all' || opp.type === filterType
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
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
                  onClick={() => {
                    setSelectedOpp(opp)
                    setEditingNotes(opp.notes || '')
                  }}
                  className="!bg-white border !border-[#E2E8F0] !border-l-4 !border-l-[#F59E0B] rounded-xl p-4 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:border-teal/40 transition-colors"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] !text-[#64748B] font-bold uppercase tracking-wider">{opp.company}</span>
                    <h4 className="font-display text-sm font-bold !text-[#0F172A] truncate max-w-[150px] mt-0.5">
                      {opp.title}
                    </h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-[9px] px-2 py-0.5 rounded-full !bg-[#FEF3C7] !text-[#B45309] border !border-[#FDE68A] font-bold block animate-pulse">
                      {mounted ? (daysLeft > 0 ? `${daysLeft} Days Left` : 'Closing Today') : '...'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-1.5">
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

        {/* Search & Add Action */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-border-default rounded-lg focus:outline-none focus:border-teal"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-teal hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-teal-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom</span>
          </button>
        </div>
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
                  {/* Left info - Clickable to open Detail Drawer */}
                  <div
                    onClick={() => {
                      setSelectedOpp(opp)
                      setEditingNotes(opp.notes || '')
                    }}
                    className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer group"
                  >
                    <span className="text-3xl flex-shrink-0 bg-bg-base p-2 rounded-btn border border-border-subtle group-hover:border-teal transition-colors">
                      {opp.logo}
                    </span>
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
                      <h4 className={cn('font-display text-base font-bold text-text-primary mt-1.5 truncate group-hover:text-teal transition-colors', opp.applied && 'line-through')}>
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
                        {mounted ? opp.deadline.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                      </p>
                      <span className={cn('text-[9px] font-bold mt-1 inline-block', (mounted && daysLeft < 7) ? 'text-gold' : 'text-text-muted')}>
                        {mounted ? (daysLeft > 0 ? `${daysLeft} days remaining` : 'Closing today') : 'Loading...'}
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
                          onClick={() => {
                            setSelectedOpp(opp)
                            setEditingNotes(opp.notes || '')
                          }}
                          className={cn(
                            'text-[8px] font-bold px-1 py-0.5 rounded truncate border leading-tight cursor-pointer hover:opacity-80 transition-all',
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

      {/* Modals Container */}
      <AnimatePresence>
        {/* ===== ADD CUSTOM OPPORTUNITY MODAL ===== */}
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-border-default rounded-card w-full max-w-lg p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="p-2 bg-teal/5 text-teal rounded-lg">
                  <Plus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">
                    Add Custom Opportunity
                  </h3>
                  <p className="text-text-muted text-xs">
                    Manually track an off-campus job, internship, or hackathon.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddOpportunity} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stripe, Razorpay"
                      value={newOppCompany}
                      onChange={(e) => setNewOppCompany(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Role / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SDE Intern"
                      value={newOppTitle}
                      onChange={(e) => setNewOppTitle(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Type *
                    </label>
                    <select
                      value={newOppType}
                      onChange={(e) => setNewOppType(e.target.value as any)}
                      className="w-full text-xs px-2 py-2 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal"
                    >
                      <option value="internship">Internship</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="open-source">Open Source</option>
                      <option value="fellowship">Fellowship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Deadline *
                    </label>
                    <input
                      type="date"
                      required
                      value={newOppDeadline}
                      onChange={(e) => setNewOppDeadline(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                      Logo (Emoji)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={newOppLogo}
                      onChange={(e) => setNewOppLogo(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-bg-base/40 border border-border-default rounded-lg text-center focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                    Application / Apply URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://company.com/careers/apply"
                    value={newOppApplyUrl}
                    onChange={(e) => setNewOppApplyUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">
                    Preparation Notes
                  </label>
                  <textarea
                    placeholder="Reference contacts, questions to prepare, portfolio links, etc."
                    value={newOppNotes}
                    onChange={(e) => setNewOppNotes(e.target.value)}
                    className="w-full h-24 text-xs p-3 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 border border-border-default rounded-lg text-xs font-bold text-text-secondary hover:bg-bg-subtle transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-teal hover:bg-teal-600 text-white rounded-lg text-xs font-bold shadow-teal-glow transition-all"
                  >
                    Create Tracker
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* ===== OPPORTUNITY DETAIL & NOTES MODAL ===== */}
        {selectedOpp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-border-default rounded-card w-full max-w-lg p-6 shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedOpp(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Info */}
              <div className="flex items-start gap-4 mb-6 border-b border-border-subtle pb-4">
                <span className="text-4xl p-2.5 bg-bg-base border border-border-subtle rounded-xl flex-shrink-0">
                  {selectedOpp.logo}
                </span>
                <div className="min-w-0">
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal/5 text-teal border border-teal/10 uppercase tracking-wider mb-1.5">
                    {selectedOpp.type}
                  </span>
                  <h3 className="font-display text-xl font-bold text-text-primary leading-snug">
                    {selectedOpp.title}
                  </h3>
                  <p className="text-text-muted text-xs font-medium mt-0.5">{selectedOpp.company}</p>
                </div>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-bg-subtle/50 p-3 rounded-lg border border-border-subtle/50 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-teal flex-shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Deadline</span>
                    <span className="text-xs font-bold text-text-secondary">
                      {mounted ? selectedOpp.deadline.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '...'}
                    </span>
                  </div>
                </div>

                <div className="bg-bg-subtle/50 p-3 rounded-lg border border-border-subtle/50 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-teal flex-shrink-0" />
                  <div>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Time Left</span>
                    <span className={cn(
                      'text-xs font-bold block',
                      getDaysLeft(selectedOpp.deadline) < 7 ? 'text-gold font-extrabold animate-pulse' : 'text-text-secondary'
                    )}>
                      {mounted ? (
                        getDaysLeft(selectedOpp.deadline) > 0 ? `${getDaysLeft(selectedOpp.deadline)} Days Remaining` : 'Closing Today'
                      ) : '...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1">
                    <span>📝 Preparation Notes</span>
                  </h4>
                  {isSavingNotes && (
                    <span className="text-[9px] text-teal font-semibold animate-pulse">Saving changes...</span>
                  )}
                </div>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  onBlur={handleSaveNotes}
                  placeholder="Type preparation notes here (e.g. key skills to highlight, recruiter contacts, questions prepared). Changes auto-save when you click away."
                  className="w-full h-32 p-3 bg-bg-base/30 border border-border-default rounded-lg focus:outline-none focus:border-teal resize-none text-xs"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex gap-2 justify-between pt-4 border-t border-border-subtle items-center">
                <div>
                  <button
                    onClick={() => {
                      handleToggleApply(selectedOpp.id)
                      setSelectedOpp((prev: any) => prev ? { ...prev, applied: !prev.applied } : null)
                    }}
                    className={cn(
                      'px-4 py-2.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1',
                      selectedOpp.applied
                        ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                        : 'bg-teal hover:bg-teal-600 border-teal text-white shadow-teal-glow'
                    )}
                  >
                    {selectedOpp.applied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </>
                    ) : (
                      'Mark Applied'
                    )}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="px-4 py-2.5 border border-border-default rounded-lg text-xs font-bold text-text-secondary hover:bg-bg-subtle transition-colors"
                  >
                    Close
                  </button>

                  <a
                    href={selectedOpp.applyUrl || 'https://example.com/apply-placeholder'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-indigo hover:bg-indigo-600 border-indigo text-white rounded-lg text-xs font-bold shadow-indigo-glow flex items-center gap-1.5"
                  >
                    <span>Apply Official</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
