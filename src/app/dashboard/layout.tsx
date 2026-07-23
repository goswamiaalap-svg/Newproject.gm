// =============================================================================
// Dashboard Server Layout
// Exports metadata to exclude all dashboard pages (/dashboard/*) from indexing.
// Renders the client-side DashboardClientLayout.
// =============================================================================

import React from 'react'
import type { Metadata } from 'next'
import DashboardClientLayout from './DashboardClientLayout'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>
}
