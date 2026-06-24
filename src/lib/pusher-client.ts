// =============================================================================
// Pusher Client Singleton — src/lib/pusher-client.ts
//
// Client-side Pusher instance used in React components to subscribe to events.
// ONLY import this in 'use client' components.
//
// Uses lazy initialization to prevent instantiating multiple Pusher connections
// across hot reloads or multiple component renders.
// =============================================================================

import PusherClient from 'pusher-js'

let _pusherClient: PusherClient | null = null

export function getPusherClient(): PusherClient {
  if (_pusherClient) return _pusherClient

  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

  if (!key || !cluster) {
    console.error('Missing NEXT_PUBLIC_PUSHER_APP_KEY or NEXT_PUBLIC_PUSHER_CLUSTER')
    // Return a dummy object in dev if keys are missing to prevent hard crashes
    return new PusherClient('dummy', { cluster: 'dummy' })
  }

  _pusherClient = new PusherClient(key, {
    cluster,
  })

  return _pusherClient
}
