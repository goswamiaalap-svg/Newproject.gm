import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        heading: ['var(--font-serif)', 'serif'],
        display: ['var(--font-serif)', 'serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        // ── Theme-aware surface tokens (swap via CSS variables, see globals.css) ──
        'bg-base': 'rgb(var(--c-bg-base) / <alpha-value>)',
        'bg-subtle': 'rgb(var(--c-bg-subtle) / <alpha-value>)',
        'bg-card': 'rgb(var(--c-bg-card) / <alpha-value>)',
        'bg-raised': 'rgb(var(--c-bg-raised) / <alpha-value>)',
        'ink': 'rgb(var(--c-ink) / <alpha-value>)',
        'text-primary': 'rgb(var(--c-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--c-text-secondary) / <alpha-value>)',
        'text-muted': 'rgb(var(--c-text-muted) / <alpha-value>)',
        'border-default': 'rgb(var(--c-border-default) / <alpha-value>)',
        'border-subtle': 'rgb(var(--c-border-subtle) / <alpha-value>)',

        // ── Pastel accent family (slightly desaturate automatically in dark via var) ──
        'lavender': {
          DEFAULT: 'rgb(var(--c-lavender) / <alpha-value>)',
          light: 'rgb(var(--c-lavender-light) / <alpha-value>)',
        },
        'sage': {
          DEFAULT: 'rgb(var(--c-sage) / <alpha-value>)',
          light: 'rgb(var(--c-sage-light) / <alpha-value>)',
        },
        'blush': {
          DEFAULT: 'rgb(var(--c-blush) / <alpha-value>)',
          light: 'rgb(var(--c-blush-light) / <alpha-value>)',
        },
        'butter': {
          DEFAULT: 'rgb(var(--c-butter) / <alpha-value>)',
          light: 'rgb(var(--c-butter-light) / <alpha-value>)',
        },
        'sky': {
          DEFAULT: 'rgb(var(--c-sky) / <alpha-value>)',
          light: 'rgb(var(--c-sky-light) / <alpha-value>)',
        },

        // Legacy aliases kept so existing component classes keep working
        teal: { DEFAULT: 'rgb(var(--c-sage) / <alpha-value>)', light: 'rgb(var(--c-sage-light) / <alpha-value>)', glow: 'rgba(168,196,180,0.18)' },
        indigo: {
          DEFAULT: 'rgb(var(--c-lavender) / <alpha-value>)',
          light: 'rgb(var(--c-lavender-light) / <alpha-value>)',
          glow: 'rgba(180,176,219,0.18)',
          400: 'rgb(var(--c-lavender) / <alpha-value>)',
          500: 'rgb(var(--c-lavender) / <alpha-value>)',
        },
        gold: { DEFAULT: 'rgb(var(--c-butter) / <alpha-value>)', light: 'rgb(var(--c-butter-light) / <alpha-value>)' },
        mint: { DEFAULT: 'rgb(var(--c-sage) / <alpha-value>)', light: 'rgb(var(--c-sage-light) / <alpha-value>)' },
      },
      borderRadius: {
        'card': '18px',
        'btn': '12px',
        'hero': '24px',
      },
      boxShadow: {
        'soft': '0 2px 16px rgb(var(--c-ink) / 0.04)',
        'medium': '0 8px 32px rgb(var(--c-ink) / 0.07)',
        'card': '0 1px 2px rgb(var(--c-ink) / 0.03), 0 1px 3px rgb(var(--c-ink) / 0.04)',
        'card-hover': '0 4px 10px rgb(var(--c-ink) / 0.05), 0 14px 30px rgb(var(--c-ink) / 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'fade-up': 'fade-up 0.6s ease-out',
        'scroll-left': 'scroll-left 32s linear infinite',
        'scroll-right': 'scroll-right 32s linear infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
