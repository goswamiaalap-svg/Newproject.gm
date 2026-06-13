'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
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

  const handleLogout = () => {
    localStorage.removeItem('launchpad_user')
    router.push('/')
  }

  const [userName, setUserName] = React.useState('Demo Student')
  const [userYear, setUserYear] = React.useState('3rd Year')

  React.useEffect(() => {
    const userStr = localStorage.getItem('launchpad_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.name) setUserName(user.name)
        if (user.year) setUserYear(user.year)
      } catch (e) {}
    }
  }, [])

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
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center font-display font-bold text-sm shadow-sm">
              {userName.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">{userName}</p>
              <p className="text-[10px] text-text-muted">{userYear}</p>
            </div>
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
        {/* Mobile Extra Menu button pointing to opportunities */}
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
    </>
  )
}
