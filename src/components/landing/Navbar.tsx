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

  const [showAnnouncement, setShowAnnouncement] = useState(true)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0A0A0A]/85 backdrop-blur-2xl shadow-soft border-b border-[#222222]'
          : 'bg-transparent'
      )}
    >
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border-b border-cyan-500/20 py-2.5 px-4 text-center relative flex items-center justify-center z-50">
          <p className="text-xs text-cyan-400 font-medium select-none pr-8">
            LaunchPad MVP is live — Join 200+ students already using it{' '}
            <Link href="/sign-up" className="text-white underline font-bold hover:text-cyan-300 transition-colors">
              Get started free →
            </Link>
          </p>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-4 text-cyan-400 hover:text-white transition-colors text-xs font-bold leading-none p-1 focus:outline-none"
            aria-label="Dismiss announcement"
          >
            ✕
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-heading font-800 text-xl transition-colors duration-300 text-white">
            Launch<span className="text-cyan-400">Pad</span>
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 ml-1 mb-1 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-sm font-medium transition-colors duration-300 relative py-1 group/item text-white/80 hover:text-white"
            >
              <span>{link.label}</span>
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left bg-cyan-400" />
            </Link>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/sign-in"
            className="text-sm font-semibold transition-colors duration-300 text-white/80 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-white text-xs font-bold rounded-full hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 text-white"
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
            className="md:hidden bg-[#0A0A0A] border-t border-[#222222] shadow-soft"
          >
            <div className="px-8 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-white/90 font-medium py-2 hover:text-cyan-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-[#222222]">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white/70 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-white font-bold rounded-full text-center text-xs shadow-[0_0_20px_rgba(34,211,238,0.2)]"
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
