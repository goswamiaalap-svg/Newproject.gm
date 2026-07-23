import { track } from '@vercel/analytics'

export function trackEvent(eventType: string, eventData: Record<string, any> = {}) {
  // 1. Log to Vercel Analytics
  try {
    track(eventType, eventData)
  } catch (e) {
    console.warn('Vercel Analytics tracking failed:', e)
  }

  // 2. Log to MongoDB userEvents collection
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventType, eventData }),
  }).catch((err) => console.error('Failed to log telemetry event to MongoDB:', err))
}
