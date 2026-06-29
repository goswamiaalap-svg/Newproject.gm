'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users2, MapPin, Search, Calendar, Award, UserCheck, MessageSquare, Plus, ChevronRight, Check } from 'lucide-react'
import { mockTeamMembers, mockHackathons } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [teamRequests, setTeamRequests] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'teammates' | 'my-team'>('teammates')

  const [dbTeamMembers, setDbTeamMembers] = useState<any[]>(mockTeamMembers)
  const [dbHackathons, setDbHackathons] = useState<any[]>(mockHackathons)

  const domainsList = ['all', 'Web Dev', 'AI/ML', 'Mobile Dev', 'Backend', 'DevOps', 'UI/UX']

  React.useEffect(() => {
    fetch('/api/teams')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.invitations)) {
          setTeamRequests(data.invitations.map((inv: any) => inv.teammateId))
        }
        if (data && Array.isArray(data.teammates) && data.teammates.length > 0) {
          setDbTeamMembers(data.teammates)
        }
        if (data && Array.isArray(data.hackathons) && data.hackathons.length > 0) {
          setDbHackathons(data.hackathons)
        }
      })
      .catch(console.error)
  }, [])

  const handleToggleRequest = (id: string) => {
    const isInvited = teamRequests.includes(id)
    if (isInvited) {
      setTeamRequests(teamRequests.filter((reqId) => reqId !== id))
    } else {
      setTeamRequests([...teamRequests, id])
    }

    fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teammateId: id, action: isInvited ? 'cancel' : 'invite' }),
    }).catch(console.error)
  }

  // Filter teammate cards
  const filteredTeammates = dbTeamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDomain = selectedDomain === 'all' || member.domains.includes(selectedDomain)
    
    return matchesSearch && matchesDomain
  })

  return (
    <div className="space-y-6">
      {/* Header Area Wrapper */}
      <div className="!bg-[#FAFAFA] p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mb-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-extrabold !text-[#0F172A]">
            Hackathon Team Finder
          </h1>
          <p className="!text-[#475569] text-sm mt-1">
            Form teams for Smart India Hackathon and other national contests. Connect with students matching your tech stack.
          </p>
        </div>

        {/* Active Hackathons Strip */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider !text-[#64748B]">
            Featured National Hackathons
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
            {dbHackathons.map((hack) => (
              <div
                key={hack.id}
                className="flex-shrink-0 w-80 !bg-white border !border-[#E2E8F0] rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border", hack.status.toLowerCase().includes('open') ? '!bg-[#DCFCE7] !text-[#166534] !border-[#BBF7D0]' : '!bg-[#FFEDD5] !text-[#9A3412] !border-[#FED7AA]')}>
                      {hack.status}
                    </span>
                    <span className="text-xs font-bold !text-[#475569]">{hack.prize}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold !text-[#0F172A] mt-2">
                    {hack.name}
                  </h4>
                </div>

                <div className="flex justify-between items-center text-[10px] !text-[#64748B] border-t border-[#E2E8F0] pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ends {new Date(hack.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                  </span>
                  <span>{hack.participants.toLocaleString()} joined</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Left Column: Filter and Grid (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search teammates by name, college, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-border-default rounded-btn text-xs focus:outline-none focus:border-teal text-text-primary shadow-sm"
              />
            </div>
            
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2.5 bg-white border border-border-default rounded-btn text-xs focus:outline-none focus:border-teal text-text-primary shadow-sm cursor-pointer"
            >
              {domainsList.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Domains' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTeammates.map((member) => {
              const isRequested = teamRequests.includes(member.id)
              
              return (
                <motion.div
                  key={member.id}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-border-default rounded-card p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between min-h-[200px]"
                >
                  <div className="space-y-3">
                    {/* Member Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo/5 border border-indigo/10 text-indigo flex items-center justify-center font-display font-bold text-sm">
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-text-primary flex items-center gap-1.5">
                          <span>{member.name}</span>
                          <span
                            className={cn(
                              'w-2 h-2 rounded-full',
                              member.availability === 'available' ? 'bg-green-500 animate-pulse' : 'bg-red-400'
                            )}
                            title={member.availability}
                          />
                        </h4>
                        <p className="text-[10px] text-text-muted flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{member.college} • {member.experience}</span>
                        </p>
                      </div>
                    </div>

                    {/* Domains list */}
                    <div className="flex flex-wrap gap-1">
                      {member.domains.map((dom: string) => (
                        <span
                          key={dom}
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo/5 text-indigo border border-indigo/10"
                        >
                          {dom}
                        </span>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {member.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="text-[9px] font-semibold px-2 py-0.5 rounded bg-bg-base text-text-secondary border border-border-subtle"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-border-subtle flex gap-2">
                    <button
                      onClick={() => handleToggleRequest(member.id)}
                      className={cn(
                        'flex-1 py-2 rounded-btn text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all',
                        isRequested
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-teal hover:bg-teal-600 text-white shadow-teal-glow'
                      )}
                    >
                      {isRequested ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Invite Sent</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Invite to Team</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${member.name.toLowerCase().replace(' ', '')}@college.edu`}
                      className="px-3 py-2 bg-white border border-border-default text-text-secondary hover:text-text-primary rounded-btn text-xs flex items-center justify-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Column: My Team / Dashboard Widgets (Col 3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-border-default rounded-card p-5 shadow-card space-y-4">
            <h3 className="font-display text-sm font-bold text-text-primary flex items-center gap-1.5 pb-3 border-b border-border-subtle">
              <Users2 className="w-4 h-4 text-teal" />
              <span>My Active Team</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-bg-base/50 rounded-btn border border-border-subtle">
                <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-display font-semibold text-xs">
                  ME
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">Demo User</p>
                  <p className="text-[9px] text-text-muted">Leader • You</p>
                </div>
              </div>

              {/* Display invite requests accepted */}
              {teamRequests.length > 0 ? (
                teamRequests.map((reqId) => {
                  const m = dbTeamMembers.find((member) => member.id === reqId)
                  if (!m) return null
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-2 bg-green-50/20 rounded-btn border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo/5 border border-indigo/10 text-indigo flex items-center justify-center font-display font-semibold text-xs">
                          {m.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-primary">{m.name}</p>
                          <p className="text-[9px] text-text-muted">Invitation Pending</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleRequest(m.id)}
                        className="text-[10px] text-red-500 hover:text-red-700 font-bold px-1"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-6 text-text-muted text-xs leading-normal">
                  <UserCheck className="w-6 h-6 mx-auto mb-2 text-text-muted opacity-60" />
                  <p>No teammates added. Invite classmates from the directory to build your squad.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
