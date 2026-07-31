// Server Component — NO 'use client' directive
// All child components that are 'use client' still SSR their initial HTML shell.
// Only client-interactive islands (Hero form, Navbar scroll, etc.) hydrate on the client.
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Stats from '@/components/landing/Stats'
import Testimonials from '@/components/landing/Testimonials'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import LandingPageClient from '@/components/landing/LandingPageClient'
import dynamic from 'next/dynamic'

// Load ambient canvas only on client (WebGL) — deferred, no SSR
const AmbientCanvas = dynamic(
  () => import('@/components/three/AmbientCanvas'),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      {/* Loading screen — client-only, manages its own state */}
      <LandingPageClient />

      <main className="relative min-h-screen overflow-x-hidden bg-[#F5F5F3]" style={{ position: 'relative', zIndex: 1 }}>
        {/* Navigation */}
        <Navbar />

        {/* Hero Header Section */}
        <Hero />

        {/* Animated Stat Section */}
        <Stats />

        {/* Core Features alternating rows */}
        <section id="features">
          <Features />
        </section>

        {/* Testimonials section */}
        <section id="testimonials">
          <Testimonials />
        </section>

        {/* Ready When You Are call to action */}
        <FinalCTA />

        {/* Footer information block */}
        <Footer />
      </main>
    </>
  )
}
