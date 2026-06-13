'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulating auth flow
    setTimeout(() => {
      if (email.trim() && password.length >= 6) {
        // Successful login mock
        localStorage.setItem('launchpad_user', JSON.stringify({ email, name: 'Demo User' }))
        router.push('/dashboard')
      } else {
        setError('Please enter a valid email and a password of at least 6 characters.')
        setIsLoading(false)
      }
    }, 1200)
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem('launchpad_user', JSON.stringify({ email: 'priya@jklu.edu.in', name: 'Priya Sharma' }))
      router.push('/dashboard')
    }, 800)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
          Welcome back
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          Enter your details to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-btn text-xs font-medium border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
            College Email ID
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. name@jklu.edu.in"
            className="w-full px-4 py-3 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Password
            </label>
            <a href="#" className="text-xs text-indigo hover:text-indigo-600 font-medium">
              Forgot password?
            </a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-teal to-teal-600 text-white font-semibold rounded-btn hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Demo Account Access Button */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-default"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-bg-base px-2 text-text-muted">Or try with</span>
        </div>
      </div>

      <button
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="w-full py-3 bg-white border border-indigo/20 text-indigo hover:bg-indigo-50 font-semibold rounded-btn transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <span>⚡</span>
        <span>1-Click Demo Login</span>
      </button>

      <p className="text-center text-text-secondary text-sm mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-teal hover:underline font-semibold">
          Create account
        </Link>
      </p>
    </div>
  )
}
