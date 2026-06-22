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
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        scrolled
          ? 'bg-[#030014]/85 border-white/5 backdrop-blur-2xl shadow-soft'
          : 'bg-[#030014]/20 border-transparent backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className={cn(
            "font-heading font-800 text-xl transition-colors duration-300",
            scrolled ? "text-white" : "text-white"
          )}>
            Launch<span className="text-teal transition-colors duration-300">Pad</span>
            <span className="inline-block w-2 h-2 rounded-full bg-teal ml-1 mb-1 animate-pulse" />
          </span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-300 relative py-1 group/item",
                scrolled ? "text-text-primary hover:text-teal" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <span>{link.label}</span>
              {/* Animated underline */}
              <span className={cn(
                "absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left",
                "bg-teal"
              )} />
            </Link>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/sign-in"
            className={cn(
              "text-sm font-semibold transition-colors duration-300",
              "text-text-secondary hover:text-text-primary"
            )}
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-gradient-to-r from-teal to-[#0EA5E9] text-white text-xs font-bold rounded-full hover:shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 text-text-primary"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030014]/95 border-t border-white/10 shadow-soft"
          >
            <div className="px-8 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-text-primary font-medium py-2 hover:text-teal transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-text-secondary hover:text-text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3 bg-gradient-to-r from-teal to-[#0EA5E9] text-white font-bold rounded-full text-center text-xs shadow-soft"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
