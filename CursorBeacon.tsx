'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsDesktop, useReducedMotion } from '@/lib/hooks';

export default function CursorBeacon() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    if (!isDesktop || reduceMotion) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isDesktop, reduceMotion]);

  if (!isDesktop || reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed pointer-events-none z-[5] mix-blend-screen"
      animate={{ x: pos.x - 200, y: pos.y - 200 }}
      transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
      style={{
        width: 400,
        height: 400,
        background:
          'radial-gradient(circle, rgba(125,211,252,0.10), rgba(125,211,252,0) 60%)',
      }}
    />
  );
}
