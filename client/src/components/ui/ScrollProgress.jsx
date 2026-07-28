import React from 'react';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Thin gradient progress bar pinned under the navbar. Spring-smoothed so it
 * glides rather than jitters with the scroll wheel.
 */
export const ScrollProgress = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-[2.5px] origin-left bg-grad-brand print:hidden"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
