'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, Settings, HelpCircle, LogOut } from 'lucide-react'

export default function DashboardNavbar() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [userName, setUserName] = useState('Demo Student')

  useEffect(() => {
    const userStr = localStorage.getItem('launchpad_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.name) setUserName(user.name)
      } catch (e) {}
    }
  }, [])

  const notifications = [
    { id: 1, text: 'Flipkart GRiD 6.0 deadline tomorrow!', type: 'warning' },
    { id: 2, text: 'AI evaluated your resume: Score improved to 78.', type: 'success' },
    { id: 3, text: 'Arjun Mehta requested to join your SIH Team.', type: 'info' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('launchpad_user')
    router.push('/')
  }

  return (
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
          className="p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-base rounded-full transition-colors"
          title="Account Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 border-l border-border-default pl-4">
          <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-display font-bold text-xs shadow-sm">
            {userName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-text-primary leading-tight">{userName}</p>
            <p className="text-[10px] text-text-muted">Student</p>
          </div>
        </div>
      </div>
    </header>
  )
}
