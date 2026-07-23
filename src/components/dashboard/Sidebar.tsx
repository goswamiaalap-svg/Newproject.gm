'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUser, useClerk } from '@clerk/nextjs'
import {
  LayoutDashboard,
  FileText,
  Map,
  Video,
  Code2,
  Users2,
  BellRing,
  Route,
  LogOut,
  Sparkles,
  Edit2,
  X,
  Loader2,
  UserCheck
} from 'lucide-react'

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Define Your Path ✦', icon: Sparkles, href: '/dashboard/path' },
  { label: 'Resume Reviewer', icon: FileText, href: '/dashboard/resume' },
  { label: 'DSA Tracker', icon: Map, href: '/dashboard/dsa' },
  { label: 'Mock Interview', icon: Video, href: '/dashboard/interview' },
  { label: 'Project Ideas', icon: Code2, href: '/dashboard/projects' },
  { label: 'Team Finder', icon: Users2, href: '/dashboard/teams' },
  { label: 'Opportunities', icon: BellRing, href: '/dashboard/opportunities' },
  { label: 'Learning Path', icon: Route, href: '/dashboard/roadmap' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

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
        // Fallback to clerk user
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

  const handleLogout = async () => {
    localStorage.removeItem('launchpad_user')
    await signOut()
    router.push('/')
  }

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
        
        // Notify other components (Navbar, Projects page, etc.)
        window.dispatchEvent(new Event('profile-updated'))
        setIsProfileModalOpen(false)
      }
    } catch (err) {
      console.error('Error saving profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border-default h-screen fixed left-0 top-0 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border-subtle">
          <Link href="/dashboard" className="flex items-center gap-1 group">
            <span className="font-display font-bold text-xl text-text-primary">
              Launch
            </span>
            <span className="text-teal font-display font-bold text-xl">Pad</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal -mt-2 group-hover:scale-150 transition-transform" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {sidebarItems.map((item, idx) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={idx}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-btn text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-teal/5 text-teal shadow-[inset_4px_0_0_0_#0D9488]'
                    : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                )}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-teal' : 'text-text-muted group-hover:text-text-secondary'
                  )}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border-subtle bg-bg-base/30 space-y-2">
          <div 
            onClick={openModal}
            className="flex items-center gap-3 px-2 py-1.5 hover:bg-bg-subtle/50 rounded-btn cursor-pointer transition-colors group relative"
            title="Edit Profile"
          >
            <div className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center font-display font-bold text-sm shadow-sm overflow-hidden flex-shrink-0">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.split(' ').map((n) => n[0]).join('')
              )}
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-xs font-semibold text-text-primary truncate">{userName}</p>
              {userYear ? (
                <p className="text-[10px] text-text-muted truncate">{userYear}</p>
              ) : (
                <span className="text-[9px] text-teal font-extrabold uppercase animate-pulse">Complete Profile</span>
              )}
            </div>
            <Edit2 className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-btn transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-default h-16 flex items-center justify-around px-2 z-40 shadow-lg">
        {sidebarItems.slice(0, 5).map((item, idx) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={idx}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors',
                isActive ? 'text-teal' : 'text-text-muted hover:text-text-secondary'
              )}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
        <Link
          href="/dashboard/opportunities"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-colors',
            pathname === '/dashboard/opportunities' || pathname === '/dashboard/roadmap' || pathname === '/dashboard/teams'
              ? 'text-teal'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          <BellRing className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </Link>
      </nav>

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
