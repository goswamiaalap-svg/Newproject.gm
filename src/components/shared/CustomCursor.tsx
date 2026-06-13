'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const rafId = useRef<number>(0);
  const isVisible = useRef(false);

  const animate = useCallback(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Lerp the ring toward the mouse position
    const lerpFactor = 0.15;
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

    dot.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%) scale(${isHovering.current ? 1.5 : 1})`;

    if (isHovering.current) {
      ring.style.backgroundColor = 'rgba(13, 148, 136, 0.2)';
      ring.style.borderColor = 'rgba(13, 148, 136, 0.6)';
    } else {
      ring.style.backgroundColor = 'transparent';
      ring.style.borderColor = 'rgba(13, 148, 136, 0.4)';
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Hide on touch/mobile devices
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Add class to html for CSS cursor hiding
    document.documentElement.classList.add('custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      if (dot) dot.style.opacity = '0';
      if (ring) ring.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      if (dot) dot.style.opacity = '1';
      if (ring) ring.style.opacity = '1';
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor-hover]')
      ) {
        isHovering.current = true;
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor-hover]')
      ) {
        isHovering.current = false;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove('custom-cursor');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  // Don't render on touch devices or reduced motion (SSR-safe: always render, hide via effect)
  return (
    <>
      {/* Small filled dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-50 pointer-events-none"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#0D9488',
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden="true"
      />
      {/* Large ghost ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-50 pointer-events-none"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(13, 148, 136, 0.4)',
          backgroundColor: 'transparent',
          opacity: 0,
          willChange: 'transform',
          transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, opacity 0.3s ease',
        }}
        aria-hidden="true"
      />
    </>
  );
}
