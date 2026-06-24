import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// Editorial serif used for large display headlines (with italic accents)
export const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

// Monospace used for nav labels, UI chrome, badges, terminal/dashboard widgets
export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
})

// Kept for backwards-compatibility with imports expecting `syne`
export const syne = serif
