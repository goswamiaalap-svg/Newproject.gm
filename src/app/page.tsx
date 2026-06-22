'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import PhoneMockup from '@/components/landing/PhoneMockup'
import ImportantFeatures from '@/components/landing/ImportantFeatures'
import Features from '@/components/landing/Features'
import Stats from '@/components/landing/Stats'
import MoreFeaturesGrid from '@/components/landing/MoreFeaturesGrid'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import LoadingScreen from '@/components/shared/LoadingScreen'
import dynamic from 'next/dynamic'

const AmbientCanvas = dynamic(() => import('@/components/three/AmbientCanvas'), {
  ssr: false,
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      
      <main className="relative min-h-screen overflow-x-hidden bg-transparent" style={{ position: 'relative', zIndex: 1 }}>
        <AmbientCanvas />
        {/* Navigation */}
        <Navbar />

        {/* Hero Header Section */}
        <Hero />

        {/* Phone Mockup scroll-linked transitions */}
        <PhoneMockup />

        {/* New Important Features Section */}
        <ImportantFeatures />

        {/* Core Features alternating rows */}
        <section id="features">
          <Features />
        </section>

        {/* Infinite scrolling awards marquee strip */}
        <Stats />

        {/* More minimal feature list cards */}
        <MoreFeaturesGrid />

        {/* Testimonials infinite scrolling opposite-direction rows */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* FAQ Section */}
        <FAQ />

        {/* Ready When You Are call to action */}
        <FinalCTA />

        {/* Footer information block */}
        <Footer />
      </main>
    </>
  )
}
