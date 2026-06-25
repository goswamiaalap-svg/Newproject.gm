'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Team', href: '#testimonials' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center"
    >
      <div className={cn(
        'w-full max-w-7xl px-4 mt-4 transition-all duration-500',
      )}>
        <div className={cn(
          "w-full bg-white rounded-full flex items-center justify-between h-16 px-8 transition-all duration-300",
          scrolled ? "shadow-lg border border-gray-100" : "shadow-md border border-gray-50"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="font-heading font-800 text-2xl tracking-tight transition-colors duration-300 text-[#111111]">
              LaunchPad
            </span>
          </Link>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-sm font-semibold transition-colors duration-300 relative py-1 text-[#444444] hover:text-[#111111]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/sign-in"
              className="px-6 py-2.5 bg-white border border-[#3B82F6] text-[#3B82F6] text-sm font-semibold rounded-full hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-[#111111]"
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                'w-6 h-0.5 bg-current transition-all duration-300',
                mobileOpen && 'rotate-45 translate-y-2'
              )}
            />
            <span
              className={cn(
                'w-6 h-0.5 bg-current transition-all duration-300',
                mobileOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'w-6 h-0.5 bg-current transition-all duration-300',
                mobileOpen && '-rotate-45 -translate-y-2'
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full max-w-7xl px-4 mt-2"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#444444] font-semibold py-2 hover:text-[#111111] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3 bg-white border border-[#3B82F6] text-[#3B82F6] font-semibold rounded-full text-center text-sm transition-colors hover:bg-blue-50"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
