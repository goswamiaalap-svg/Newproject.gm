export function trackEvent(eventType: string, eventData: Record<string, any> = {}) {
  // 1. Log to Vercel Analytics if available
  try {
    import('@vercel/analytics')
      .then((mod) => {
        if (mod && typeof mod.track === 'function') {
          mod.track(eventType, eventData)
        }
      })
      .catch(() => {
        // Analytics package optional in build environment
      })
  } catch (e) {
    // Ignore analytics errors silently
  }

  // 2. Log to MongoDB userEvents collection
  if (typeof window !== 'undefined') {
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, eventData }),
    }).catch((err) => console.error('Failed to log telemetry event to MongoDB:', err))
  }
}
