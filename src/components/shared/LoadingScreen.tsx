'use client'

import React, { useEffect, useState } from 'react'

/**
 * Lightweight CSS-only loading screen.
 * 
 * PERFORMANCE NOTE: The original Three.js/WebGL loading screen was loading
 * @react-three/fiber, @react-three/drei, and three.js just for the landing page
 * splash — adding hundreds of KB to the initial JS bundle and delaying LCP.
 * This pure CSS version achieves the same visual effect with ~0 JS overhead.
 */
export default function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      // Allow exit animation to play before unmounting
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white loading-screen-root"
      style={{
        opacity: isLoading ? 1 : 0,
        transform: isLoading ? 'translateY(0)' : 'translateY(-24px)',
        transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: isLoading ? 'auto' : 'none',
      }}
      aria-hidden="true"
      aria-label="Loading"
      role="status"
    >
      {/* Animated logo mark */}
      <div className="relative w-20 h-20 mb-8">
        {/* Rotating ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: '1.4s', animationTimingFunction: 'linear' }}
          viewBox="0 0 80 80"
          fill="none"
        >
          <circle
            cx="40" cy="40" r="34"
            stroke="#E2E8F0"
            strokeWidth="5"
          />
          <circle
            cx="40" cy="40" r="34"
            stroke="#0D9488"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="60 154"
            strokeDashoffset="0"
          />
        </svg>
        {/* Center mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
            <circle cx="16" cy="16" r="16" fill="#111111" />
            <rect x="8" y="8" width="4" height="16" rx="2" fill="white" />
            <rect x="8" y="20" width="16" height="4" rx="2" fill="white" />
            <circle cx="23" cy="9" r="3" fill="#0D9488" />
          </svg>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-xl font-extrabold tracking-tight text-[#111111] flex items-center gap-1">
          Launch<span className="text-[#0D9488]">Pad</span>
        </span>
        {/* Animated progress bar */}
        <div className="w-40 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] rounded-full loading-progress-bar"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest animate-pulse">
          Loading
        </p>
      </div>

      <style>{`
        @keyframes progress-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .loading-progress-bar {
          width: 0%;
          animation: progress-fill 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .loading-screen-root {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
