// =============================================================================
// Middleware — Clerk Authentication Guard (Defensive & Scoped)
// Protects all /dashboard/* routes. Unauthenticated users are redirected to /sign-in.
// Matcher is restricted to `/dashboard(.*)` to prevent site-wide crashes when
// env variables are not yet loaded.
// =============================================================================

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which routes are protected (require sign-in)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default function middleware(req: NextRequest, event: any) {
  // Check if Clerk environment variables are set. If not, bypass authentication checks
  // to prevent the entire site from crashing (e.g. during initial deployments).
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY

  if (!publishableKey || !secretKey) {
    console.warn(
      '[Clerk Middleware Warning] Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_SECRET_KEY. Bypassing auth check.'
    )
    return NextResponse.next()
  }

  // Delegate request to Clerk's official middleware
  return clerkMiddleware((auth, reqInstance) => {
    if (isProtectedRoute(reqInstance)) {
      auth().protect()
    }
  })(req, event)
}

export const config = {
  // Only trigger middleware for /dashboard routes to isolate auth scope
  // and prevent public/landing/static assets from being affected.
  matcher: ['/dashboard(.*)'],
}
