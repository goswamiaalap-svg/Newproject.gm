'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, rgb(150,184,156), rgb(176,169,219))',
        transformOrigin: '0%',
      }}
      aria-hidden="true"
    />
  );
}
