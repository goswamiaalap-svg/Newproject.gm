'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [college, setCollege] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [year, setYear] = useState('3rd Year')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    setTimeout(() => {
      if (name.trim() && college.trim() && email.trim() && password.length >= 6) {
        localStorage.setItem(
          'launchpad_user',
          JSON.stringify({ name, college, email, year })
        )
        router.push('/dashboard')
      } else {
        setError('Please fill out all fields. Password must be at least 6 characters.')
        setIsLoading(false)
      }
    }, 1200)
  }

  const handleDemoSignUp = () => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem(
        'launchpad_user',
        JSON.stringify({
          name: 'Priya Sharma',
          college: 'JKLU, Jaipur',
          email: 'priya@jklu.edu.in',
          year: '3rd Year',
        })
      )
      router.push('/dashboard')
    }, 800)
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">
          Create account
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          Start your structured SDE preparation today
        </p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-3.5">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-btn text-xs font-medium border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full px-4 py-2.5 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
            College Name
          </label>
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="e.g. JKLU, Jaipur"
            className="w-full px-4 py-2.5 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors"
            required
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Year of Study
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors cursor-pointer"
              disabled={isLoading}
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
              Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu"
              className="w-full px-4 py-2.5 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            className="w-full px-4 py-2.5 bg-white border border-border-default rounded-btn text-sm focus:outline-none focus:border-teal text-text-primary transition-colors"
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
            'Create Account'
          )}
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-default"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-bg-base px-2 text-text-muted">Or try with</span>
        </div>
      </div>

      <button
        onClick={handleDemoSignUp}
        disabled={isLoading}
        className="w-full py-3 bg-white border border-indigo/20 text-indigo hover:bg-indigo-50 font-semibold rounded-btn transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <span>⚡</span>
        <span>1-Click Demo Signup</span>
      </button>

      <p className="text-center text-text-secondary text-sm mt-6">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-teal hover:underline font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  )
}
