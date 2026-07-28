'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from '@/components/shared/LoadingScreen'

/**
 * Thin client-only component that manages the loading state.
 * Extracted from page.tsx so the main page can be a Server Component,
 * improving FCP and LCP by serving initial HTML from the server.
 */
export default function LandingPageClient() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return <LoadingScreen isLoading={isLoading} />
}
