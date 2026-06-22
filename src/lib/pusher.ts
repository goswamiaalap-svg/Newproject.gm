// =============================================================================
// Pusher Server Client — src/lib/pusher.ts
//
// Server-side Pusher instance used in API routes to emit events to connected clients.
// ONLY import this in server-side code (API routes, server components).
// Never import in 'use client' components.
//
// Env vars required:
//   PUSHER_APP_ID      — from Pusher Dashboard > App Keys
//   PUSHER_KEY         — from Pusher Dashboard > App Keys
//   PUSHER_SECRET      — from Pusher Dashboard > App Keys
//   PUSHER_CLUSTER     — e.g. "ap2"
// =============================================================================

import Pusher from 'pusher'

let _pusherServer: Pusher | null = null

/**
 * Returns a lazily-initialized Pusher server client.
 * Throws a clear error if environment variables are missing at runtime.
 */
export function getPusherServer(): Pusher {
  if (_pusherServer) return _pusherServer

  const appId = process.env.PUSHER_APP_ID
  const key = process.env.PUSHER_KEY || process.env.NEXT_PUBLIC_PUSHER_APP_KEY
  const secret = process.env.PUSHER_SECRET
  const cluster = process.env.PUSHER_CLUSTER || process.env.NEXT_PUBLIC_PUSHER_CLUSTER

  if (!appId || !key || !secret || !cluster) {
    throw new Error(
      'Missing Pusher environment variables. Set PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_APP_KEY/PUSHER_KEY, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_CLUSTER/PUSHER_CLUSTER in env'
    )
  }

  _pusherServer = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  })

  return _pusherServer
}

export * from './pusher-shared'
