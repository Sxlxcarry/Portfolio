'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { INTRO, PROFILE } from '@/lib/content';
import { useReducedMotion } from '@/lib/hooks';

export default function Intro({ onDone }: { onDone: () => void }) {
  const { lang } = useLang();
  const t = INTRO[lang];
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'init' | 'reveal' | 'fade' | 'gone'>('init');

  useEffect(() => {
    if (reduceMotion) {
      setPhase('gone');
      onDone();
      return;
    }
    const t1 = setTimeout(() => setPhase('reveal'), 400);
    const t2 = setTimeout(() => setPhase('fade'), 2200);
    const t3 = setTimeout(() => {
      setPhase('gone');
      onDone();
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduceMotion, onDone]);

  if (phase === 'gone') return null;

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'fade' ? 0 : 1 }}
          transition={{ duration: 0.8, ease: [0.65, 0.05, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-depth-0"
          aria-hidden
        >
          {/* Grille qui se révèle */}
          <motion.div
            initial={{ scale: 1.8, opacity: 0, filter: 'blur(8px)' }}
            animate={{
              scale: phase === 'init' ? 1.8 : 1,
              opacity: phase === 'init' ? 0 : 0.5,
              filter: phase === 'init' ? 'blur(8px)' : 'blur(0px)',
            }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(125,211,252,.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,.10) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage:
                'radial-gradient(ellipse 60% 60% at center, black 20%, transparent 70%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 60% 60% at center, black 20%, transparent 70%)',
            }}
          />

          <div className="relative z-10 text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase === 'init' ? 0 : 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mono-label text-ink-muted"
            >
              {t.init}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{
                opacity: phase === 'init' ? 0 : 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-display font-light italic text-5xl md:text-7xl tracking-tightest leading-none grad-text"
            >
              {PROFILE.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: phase === 'init' ? 0 : 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-3 text-xs tracking-[0.4em] uppercase text-ink-soft font-medium"
            >
              {t.role}
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === 'init' ? 0 : 1 }}
              transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto mt-7 h-px w-60 max-w-[60vw] origin-center"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgb(125,211,252), transparent)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
