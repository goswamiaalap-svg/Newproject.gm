'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Telescope, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/shared/ThemeToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Team', href: '#testimonials' },
    { label: 'Docs', href: '#' },
  ]

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b',
        scrolled
          ? 'bg-bg-base/85 backdrop-blur-xl border-border-default'
          : 'bg-bg-base border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border-default bg-bg-card text-text-primary">
            <Telescope className="w-[15px] h-[15px]" strokeWidth={1.75} />
          </span>
          <span className="font-serif text-lg text-text-primary tracking-tight">
            Launch<span className="italic text-lavender">Pad</span>
          </span>
        </Link>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="font-mono text-[12.5px] text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: theme toggle + auth buttons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/sign-in"
            className="hidden md:inline-block font-mono text-[12.5px] text-text-secondary hover:text-text-primary px-3 py-2.5 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="hidden md:flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-text-primary text-bg-base font-mono text-[12.5px] font-medium hover:opacity-85 transition-opacity duration-200"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-text-primary"
            aria-label="Toggle menu"
          >
            <span className={cn('w-5 h-[1.5px] bg-current transition-all duration-300', mobileOpen && 'rotate-45 translate-y-[6.5px]')} />
            <span className={cn('w-5 h-[1.5px] bg-current transition-all duration-300', mobileOpen && 'opacity-0')} />
            <span className={cn('w-5 h-[1.5px] bg-current transition-all duration-300', mobileOpen && '-rotate-45 -translate-y-[6.5px]')} />
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
            className="md:hidden bg-bg-base border-t border-border-default"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-mono text-sm text-text-primary py-2 hover:text-lavender transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border-default">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-2.5 font-mono text-sm text-text-secondary border border-border-default rounded-full"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-2.5 bg-text-primary text-bg-base font-mono text-sm font-medium rounded-full text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
