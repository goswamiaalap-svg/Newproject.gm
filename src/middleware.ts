// =============================================================================
// Middleware — Clerk Authentication Guard
// Protects all /dashboard/* routes. Unauthenticated users are redirected to /sign-in.
// =============================================================================

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes are protected (require sign-in)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // If the request is for a protected route, enforce authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  // Run middleware on all routes except static files and Next.js internals
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
