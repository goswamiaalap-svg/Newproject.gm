// =============================================================================
// Sign In Page — /sign-in
// Uses Clerk's prebuilt <SignIn /> component with appearance customization
// matching LaunchPad's dark bg-base and teal accent theme.
// The catch-all route [[...sign-in]] is not needed since Clerk is configured
// with NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in in .env.
// =============================================================================

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
          Welcome back
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          Enter your details to access your dashboard
        </p>
      </div>

      <SignIn
        routing="path"
        path="/sign-in"
        appearance={{
          elements: {
            // Outer card — match the dark bg-base card style
            card: 'bg-white border border-border-default rounded-card shadow-card',
            // Header area
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
              'w-full px-4 py-3 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors',
            // Primary submit button
            formButtonPrimary:
              'w-full py-3 bg-gradient-to-r from-teal to-teal-600 text-white font-semibold rounded-btn hover:opacity-90 active:scale-[0.99] transition-all text-sm shadow-sm',
            // Footer links
            footerActionLink: 'text-teal hover:underline font-semibold',
            footerActionText: 'text-text-secondary text-sm',
            // Error messages
            formFieldErrorText: 'text-red-500 text-xs mt-1',
            identityPreviewText: 'text-text-primary text-sm',
            identityPreviewEditButton: 'text-teal text-xs font-semibold',
          },
          layout: {
            socialButtonsPlacement: 'bottom',
          },
        }}
        signUpUrl="/sign-up"
        forceRedirectUrl="/dashboard"
      />
    </div>
  )
}

