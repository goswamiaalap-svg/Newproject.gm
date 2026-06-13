'use client'

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import PhoneMockup from '@/components/landing/PhoneMockup'
import Features from '@/components/landing/Features'
import Stats from '@/components/landing/Stats'
import MoreFeaturesGrid from '@/components/landing/MoreFeaturesGrid'
import Testimonials from '@/components/landing/Testimonials'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white" style={{ position: 'relative', zIndex: 1 }}>
      {/* Navigation */}
      <Navbar />

      {/* Hero Header Section */}
      <Hero />

      {/* Phone Mockup scroll-linked transitions */}
      <PhoneMockup />

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

      {/* Ready When You Are call to action */}
      <FinalCTA />

      {/* Footer information block */}
      <Footer />
    </main>
  )
}
