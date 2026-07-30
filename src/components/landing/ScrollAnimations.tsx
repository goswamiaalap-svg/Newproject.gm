'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollAnimations() {
  useEffect(() => {
    // 6. PERFORMANCE & ACCESSIBILITY: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // 1. HERO TEXT CROSSFADE & BADGE SCALE
      const heroEl = document.querySelector('#hero')
      const heroHeading = heroEl?.querySelector('h1')
      const heroVisual = heroEl?.querySelector('.hero-card-enter')?.parentElement

      if (heroEl && heroHeading) {
        // Prepare secondary text span for crossfade if not present
        if (!heroHeading.querySelector('.hero-headline-two')) {
          const originalHTML = heroHeading.innerHTML
          heroHeading.innerHTML = `
            <div className="relative inline-block w-full">
              <div className="hero-headline-one">${originalHTML}</div>
              <div className="hero-headline-two absolute inset-0 opacity-0 pointer-events-none text-[#3B82F6]">
                Supercharge Your Dream Career <i className="font-serif italic font-normal tracking-normal text-[#111111]">With AI</i>
              </div>
            </div>
          `
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroEl,
            start: 'top top',
            end: '+=800',
            scrub: 1,
            pin: true,
            pinSpacing: true,
          },
        })

        // Crossfade text
        tl.to('.hero-headline-one', {
          opacity: 0,
          y: -30,
          duration: 1,
          ease: 'power2.inOut',
        }, 0)
        .to('.hero-headline-two', {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.inOut',
        }, 0.2)

        // Scale hero visual badge/card from 0.8 to 1.1 in sync with scroll progress
        if (heroVisual) {
          gsap.fromTo(
            heroVisual,
            { scale: 0.8, transformOrigin: 'center center' },
            {
              scale: 1.1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: heroEl,
                start: 'top top',
                end: '+=800',
                scrub: true,
              },
            }
          )
        }
      }

      // 2. INFINITE HORIZONTAL MARQUEE
      const statsSection = document.querySelector('section:has(.font-display)')
      if (statsSection && !document.querySelector('.infinite-marquee-wrapper')) {
        const marqueeContainer = document.createElement('div')
        marqueeContainer.className = 'infinite-marquee-wrapper w-full overflow-hidden bg-slate-900 text-white py-4 my-8 relative flex select-none'
        
        const items = ['★ Resume ATS Screening', '★ AI Speech Evaluator', '★ DSA Roadmap Nodes', '★ Peer Teammate Matching', '★ 100% Placement Focused']
        const itemHTML = items.map(item => `<span className="mx-8 font-mono text-xs uppercase tracking-widest text-slate-300 font-bold whitespace-nowrap">${item}</span>`).join('')
        
        marqueeContainer.innerHTML = `
          <div className="marquee-track flex whitespace-nowrap will-change-transform">
            <div className="marquee-content flex">${itemHTML}</div>
            <div className="marquee-content flex">${itemHTML}</div>
          </div>
        `
        statsSection.after(marqueeContainer)

        const track = marqueeContainer.querySelector('.marquee-track')
        if (track) {
          const marqueeTween = gsap.to(track, {
            xPercent: -50,
            repeat: -1,
            duration: 20,
            ease: 'linear',
          })

          marqueeContainer.addEventListener('mouseenter', () => marqueeTween.pause())
          marqueeContainer.addEventListener('mouseleave', () => marqueeTween.play())
        }
      }

      // 3. PINNED MULTI-STEP SCROLL SECTION
      const featureSections = document.querySelectorAll('#features > section')
      featureSections.forEach((sec) => {
        const subPoints = sec.querySelectorAll('.space-y-6 > div')
        if (subPoints.length > 1) {
          ScrollTrigger.create({
            trigger: sec,
            start: 'top 20%',
            end: 'bottom 80%',
            scrub: true,
            onUpdate: (self) => {
              const progress = self.progress
              const stepIndex = Math.min(
                Math.floor(progress * subPoints.length),
                subPoints.length - 1
              )

              subPoints.forEach((pt, i) => {
                const el = pt as HTMLElement
                if (i === stepIndex) {
                  gsap.to(el, { opacity: 1, x: 10, duration: 0.3, overwrite: 'auto' })
                } else {
                  gsap.to(el, { opacity: 0.5, x: 0, duration: 0.3, overwrite: 'auto' })
                }
              })
            },
          })
        }
      })

      // 4. VIDEO REVEAL ON SCROLL & MEDIA PLAYBACK
      const mediaElements = document.querySelectorAll('video, img')
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const target = entry.target as HTMLMediaElement
            if (entry.isIntersecting) {
              if (target.tagName === 'VIDEO') {
                target.play().catch(() => {})
              }
              gsap.to(target, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
            } else {
              if (target.tagName === 'VIDEO') {
                target.pause()
              }
            }
          })
        },
        { threshold: 0.25 }
      )

      mediaElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          gsap.set(el, { willChange: 'transform, opacity' })
          observer.observe(el)
        }
      })

      // 5. PARALLAX IMAGE GALLERY & CARDS
      const cards = document.querySelectorAll('#testimonials .grid > div')
      cards.forEach((card, idx) => {
        const speed = idx % 2 === 0 ? -40 : 40
        gsap.to(card, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })

      // Refresh ScrollTrigger to measure layout accurately
      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [])

  return null
}
