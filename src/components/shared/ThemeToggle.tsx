'use client'

import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  const isDark = theme === 'dark'

  // Avoid hydration mismatch — render an inert placeholder until mounted
  if (!mounted) {
    return <div className="w-[58px] h-8 rounded-full border border-border-default bg-bg-subtle" />
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className="relative w-[58px] h-8 rounded-full border border-border-default bg-bg-subtle px-1 flex items-center transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
    >
      {/* Track icons */}
      <Sun className="absolute left-[7px] w-3.5 h-3.5 text-butter pointer-events-none" strokeWidth={2} />
      <Moon className="absolute right-[7px] w-3.5 h-3.5 text-lavender pointer-events-none" strokeWidth={2} />

      {/* Sliding dial knob */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="relative z-10 w-6 h-6 rounded-full bg-bg-card shadow-soft border border-border-default flex items-center justify-center"
        style={{ marginLeft: isDark ? 'calc(100% - 24px)' : '0px' }}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-lavender" strokeWidth={2.25} />
        ) : (
          <Sun className="w-3 h-3 text-butter" strokeWidth={2.25} />
        )}
      </motion.span>
    </button>
  )
}
