import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
  return (
    <div className="w-full flex h-screen items-center justify-center">
      <AuthenticateWithRedirectCallback />
    </div>
  )
}
