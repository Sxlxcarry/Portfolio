'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-px origin-left"
    >
      <div className="h-full w-full bg-gradient-to-r from-signal-primary via-signal-mint to-signal-plum opacity-80" />
    </motion.div>
  );
}
