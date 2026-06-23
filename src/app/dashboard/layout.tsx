// =============================================================================
// Dashboard Layout
// Uses Clerk's useAuth() to verify the user is authenticated.
// The middleware.ts already blocks unauthenticated access, but this adds
// a graceful loading state while Clerk hydrates on the client.
// =============================================================================

'use client'

import React from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  // While Clerk is initializing, show a loading spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal/30 border-t-teal rounded-full animate-spin" />
          <p className="text-xs text-text-secondary font-medium">Checking authorization...</p>
        </div>
      </div>
    )
  }

  // If Clerk has loaded and the user is not signed in, redirect to /sign-in
  // (Middleware handles this too, but this is a client-side safety net)
  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  return (
    <div className="dashboard-theme min-h-screen bg-bg-base flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <DashboardNavbar />

        {/* Page Content */}
        <main className="flex-1 p-6 pb-24 md:pb-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

