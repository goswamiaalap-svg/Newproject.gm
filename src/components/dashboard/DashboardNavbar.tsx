'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings, HelpCircle, X, UserCheck, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function DashboardNavbar() {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [showNotifications, setShowNotifications] = useState(false)
  const [userName, setUserName] = useState('Student')
  const [userYear, setUserYear] = useState('')
  const [collegeName, setCollegeName] = useState('')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  
  // Modal Edit States
  const [editName, setEditName] = useState('')
  const [editYear, setEditYear] = useState('')
  const [editCollegeName, setEditCollegeName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        if (data.name) setUserName(data.name)
        if (data.year) setUserYear(data.year)
        if (data.collegeName) setCollegeName(data.collegeName)
      } else if (user) {
        setUserName(user.fullName || user.firstName || 'Student')
      }
    } catch (e) {
      console.error('Error fetching profile:', e)
      if (user) {
        setUserName(user.fullName || user.firstName || 'Student')
      }
    }
  }

  useEffect(() => {
    if (isLoaded && user) {
      setUserName(user.fullName || user.firstName || 'Student')
      fetchProfile()
    }

    const handleProfileUpdate = () => {
      fetchProfile()
    }

    window.addEventListener('profile-updated', handleProfileUpdate)
    return () => window.removeEventListener('profile-updated', handleProfileUpdate)
  }, [isLoaded, user])

  const openModal = () => {
    setEditName(userName)
    setEditYear(userYear || '3rd Year')
    setEditCollegeName(collegeName)
    setIsProfileModalOpen(true)
  }

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          year: editYear,
          collegeName: editCollegeName,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setUserName(data.name)
        setUserYear(data.year)
        setCollegeName(data.collegeName)
        
        // Notify other components (Sidebar, Projects page, etc.)
        window.dispatchEvent(new Event('profile-updated'))
        setIsProfileModalOpen(false)
      }
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const notifications = [
    { id: 1, text: 'Flipkart GRiD 6.0 deadline tomorrow!', type: 'warning' },
    { id: 2, text: 'AI evaluated your resume: Score improved to 78.', type: 'success' },
    { id: 3, text: 'Arjun Mehta requested to join your SIH Team.', type: 'info' },
  ]

  return (
    <>
      <header className="bg-white border-b border-border-default h-16 flex items-center justify-between px-6 sticky top-0 z-20">
        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems, topics, teammates..."
              className="w-full pl-9 pr-4 py-2 bg-bg-base/70 border border-border-subtle rounded-btn text-xs focus:outline-none focus:border-teal focus:bg-white text-text-primary transition-all"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Help */}
          <button
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-base rounded-full transition-colors hidden sm:block"
            title="Help & Documentation"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-base rounded-full transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-border-default rounded-btn shadow-lg py-2 z-30">
                <div className="px-4 py-2 border-b border-border-subtle flex justify-between items-center">
                  <span className="font-semibold text-xs text-text-primary">Notifications</span>
                  <span className="text-[10px] text-teal cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 border-b border-border-subtle hover:bg-bg-base/50 transition-colors text-xs text-text-secondary cursor-pointer"
                    >
                      <p className="leading-snug">{notif.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={openModal}
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-base rounded-full transition-colors"
            title="Account Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile Avatar */}
          <div 
            onClick={openModal}
            className="flex items-center gap-2 border-l border-border-default pl-4 cursor-pointer hover:opacity-85 transition-opacity"
            title="Edit Profile"
          >
            <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-display font-bold text-xs shadow-sm overflow-hidden flex-shrink-0">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.split(' ').map((n) => n[0]).join('')
              )}
            </div>
            <div className="hidden lg:block text-left max-w-[120px]">
              <p className="text-xs font-semibold text-text-primary leading-tight truncate">{userName}</p>
              {userYear ? (
                <p className="text-[10px] text-text-muted leading-none mt-0.5 truncate">{userYear}</p>
              ) : (
                <span className="text-[9px] text-teal font-extrabold uppercase mt-0.5 block animate-pulse">Complete Profile</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Edit Glassmorphic Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-border-default rounded-card w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-scaleIn">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-subtle text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6 border-b border-border-subtle pb-3">
              <div className="w-10 h-10 rounded-full bg-teal/5 flex items-center justify-center text-teal shadow-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-text-primary">
                  Profile Settings
                </h3>
                <p className="text-text-muted text-xs">
                  Update your display name, college details, and academic year.
                </p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5">
                  Email Address (Clerk Account)
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.primaryEmailAddress?.emailAddress || ''}
                  className="w-full text-xs px-3 py-2.5 bg-bg-base border border-border-subtle rounded-lg text-text-muted cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alap Goswami"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal text-text-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5">
                    Academic Year *
                  </label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    className="w-full text-xs px-2 py-2.5 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal text-text-primary font-medium"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1.5">
                    College Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IIT Bombay"
                    value={editCollegeName}
                    onChange={(e) => setEditCollegeName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-bg-base/40 border border-border-default rounded-lg focus:outline-none focus:border-teal text-text-primary font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 justify-end pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2.5 border border-border-default rounded-lg text-xs font-bold text-text-secondary hover:bg-bg-subtle transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !editName}
                  className="px-5 py-2.5 bg-teal hover:bg-teal-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-teal-glow transition-all flex items-center gap-1.5"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
