// =============================================================================
// Sign Up Page — /sign-up
// Uses Clerk's prebuilt <SignUp /> component with appearance customization
// matching LaunchPad's dark bg-base and teal accent theme.
// After sign-up, Clerk fires a webhook (user.created) → /api/webhooks/clerk
// which saves the user to MongoDB. Clerk then redirects to /dashboard.
// =============================================================================

import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
          Create account
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          Start your structured SDE preparation today
        </p>
      </div>

      <SignUp
        routing="path"
        path="/sign-up"
        appearance={{
          elements: {
            // Outer card — match existing card style
            card: 'bg-white border border-border-default rounded-card shadow-card',
            // Hide Clerk's default headers since we have our own above
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            // Social buttons
            socialButtonsBlockButton:
              'border border-border-default text-text-primary hover:bg-bg-subtle transition-colors rounded-btn text-sm font-medium',
            socialButtonsBlockButtonText: 'text-text-primary font-medium',
            // Divider
            dividerLine: 'bg-border-default',
            dividerText: 'text-text-muted text-xs',
            // Form labels
            formFieldLabel: 'text-xs font-semibold uppercase tracking-wider text-text-secondary',
            // Inputs
            formFieldInput:
              'w-full px-4 py-2.5 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors',
            // Primary submit button — matches the gradient style used across the app
            formButtonPrimary:
              'w-full py-3 bg-gradient-to-r from-teal to-teal-600 text-white font-semibold rounded-btn hover:opacity-90 active:scale-[0.99] transition-all text-sm shadow-sm',
            // Footer links
            footerActionLink: 'text-teal hover:underline font-semibold',
            footerActionText: 'text-text-secondary text-sm',
            // Error messages
            formFieldErrorText: 'text-red-500 text-xs mt-1',
          },
          layout: {
            socialButtonsPlacement: 'bottom',
          },
        }}
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
      />
    </div>
  )
}

