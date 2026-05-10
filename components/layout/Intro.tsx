'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { PROFILE } from '@/lib/content';
import { useReducedMotion } from '@/lib/hooks';

/**
 * Intro v3 — version compacte (2.0s total).
 *
 * Timeline :
 *   0.0s  → boot lines apparaissent (4 lignes en cascade rapide)
 *   1.0s  → boot disparaît, "ALL SYSTEMS ONLINE" + nom apparaissent
 *   1.7s  → fade out
 *   2.0s  → gone, hero démarre
 */

const BOOT_LINES_FR = [
  { text: 'kernel · ready',           color: 'mint' },
  { text: 'eth0 · UP (1 Gbps)',       color: 'mint' },
  { text: 'firewall · active',        color: 'mint' },
  { text: 'monitoring · online',      color: 'primary' },
];
const BOOT_LINES_EN = BOOT_LINES_FR;

export default function Intro({ onDone }: { onDone: () => void }) {
  const { lang } = useLang();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'boot' | 'reveal' | 'fade' | 'gone'>('boot');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const bootLines = lang === 'fr' ? BOOT_LINES_FR : BOOT_LINES_EN;

  useEffect(() => {
    if (reduceMotion) {
      setPhase('gone');
      onDone();
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    // 4 lignes en cascade très rapide : 0, 120, 240, 360 ms
    bootLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), i * 120));
    });

    timers.push(setTimeout(() => setPhase('reveal'), 1000));
    timers.push(setTimeout(() => setPhase('fade'), 1700));
    timers.push(setTimeout(() => { setPhase('gone'); onDone(); }, 2000));

    return () => timers.forEach(clearTimeout);
  }, [reduceMotion, onDone, bootLines]);

  if (phase === 'gone') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'fade' ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.65, 0.05, 0.36, 1] }}
        className="fixed inset-0 z-[100] bg-depth-0 overflow-hidden"
        aria-hidden
      >
        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(125,211,252,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,.08) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 70% 70% at center, black 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at center, black 20%, transparent 75%)',
          }}
        />

        {/* Boot phase */}
        <AnimatePresence>
          {phase === 'boot' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 grid place-items-center"
            >
              <div className="text-center">
                {/* Logo / mark animé */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-14 h-14 mx-auto mb-5 rounded-xl border border-signal-primary/40 grid place-items-center bg-gradient-to-br from-signal-primary/20 to-signal-mint/5 overflow-hidden"
                >
                  <span
                    aria-hidden
                    className="absolute inset-[-50%]"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent 70%, rgba(125,211,252,0.5), transparent)',
                      animation: 'spin 1.5s linear infinite',
                    }}
                  />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.6" className="relative z-10">
                    <path d="M12 3l8 4v6c0 5-3.5 9-8 10s-8-5-8-10V7l8-4z" />
                    <path d="M9 12l2 2 4-4" stroke="#a5f3d0" />
                  </svg>
                </motion.div>

                {/* Boot lines */}
                <div className="font-mono text-[11px] md:text-xs space-y-1 text-left mx-auto inline-block">
                  {bootLines.slice(0, visibleLines).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex items-center gap-2 tracking-wider ${
                        line.color === 'mint' ? 'text-signal-mint' : 'text-signal-primary'
                      }`}
                    >
                      <span>✓</span>
                      <span>{line.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reveal phase — nom */}
        <AnimatePresence>
          {(phase === 'reveal' || phase === 'fade') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 grid place-items-center"
            >
              <div className="text-center px-4">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mono-label text-signal-mint text-[10px] mb-5 tracking-[0.4em]"
                >
                  ✓ &nbsp; ALL SYSTEMS ONLINE
                </motion.div>

                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-light italic text-5xl md:text-7xl lg:text-8xl tracking-tightest leading-none grad-text"
                  >
                    {PROFILE.name}
                  </motion.h1>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-3 text-xs tracking-[0.4em] uppercase text-ink-soft font-medium"
                >
                  {lang === 'fr' ? 'Réseau · Sécurité · Infrastructure' : 'Network · Security · Infrastructure'}
                </motion.div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mx-auto mt-6 h-px w-56 max-w-[60vw] origin-center"
                  style={{ background: 'linear-gradient(90deg, transparent, rgb(125,211,252), transparent)' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
