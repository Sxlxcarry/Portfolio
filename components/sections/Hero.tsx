'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { HERO } from '@/lib/content';
import LiveConsole from './hero/LiveConsole';
import { useReducedMotion } from '@/lib/hooks';

const HANDSHAKE_FR = [
  { from: 'CLIENT', to: 'SERVER', flag: 'SYN', delay: 2.2 },
  { from: 'SERVER', to: 'CLIENT', flag: 'SYN-ACK', delay: 2.7 },
  { from: 'CLIENT', to: 'SERVER', flag: 'ACK', delay: 3.1 },
  { from: '', to: '', flag: 'CONNECTION ESTABLISHED', delay: 3.5 },
];

export default function Hero() {
  const { lang } = useLang();
  const t = HERO[lang];
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yConsole = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  // Handshake state
  const [handshakeStep, setHandshakeStep] = useState(-1);

  useEffect(() => {
    if (reduceMotion) {
      setHandshakeStep(3);
      return;
    }
    const timers = HANDSHAKE_FR.map((_, i) =>
      setTimeout(() => setHandshakeStep(i), HANDSHAKE_FR[i].delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [reduceMotion]);

  return (
    <section
      id="identity"
      ref={ref}
      className="relative min-h-screen flex items-center pt-32 pb-24"
      style={{ perspective: '1800px' }}
    >
      {/* Handshake background trace */}
      <HandshakeBackground step={handshakeStep} />

      <div className="container-x relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-16 items-center">
          {/* LEFT — texte */}
          <motion.div style={{ y: yText, opacity }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              className="inline-flex items-center gap-2.5 mono-label text-signal-primary px-3.5 py-2 rounded-full bg-signal-primary/[0.06] border border-signal-primary/20"
            >
              <span className="relative w-1.5 h-1.5 rounded-full bg-signal-primary">
                <span className="absolute inset-0 rounded-full bg-signal-primary animate-ping" />
              </span>
              {t.eyebrow}
            </motion.div>

            <h1
              className="mt-8 font-display font-light tracking-tightest leading-[0.96] text-balance"
              style={{ fontSize: 'clamp(46px, 7vw, 96px)' }}
            >
              {[t.titleA, t.titleB, t.titleC].map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{
                      duration: 0.95,
                      delay: 2.1 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {i === 1 ? <em className="serif-italic shimmer-text bg-clip-text text-transparent">{line}</em> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.5 }}
              className="mt-8 max-w-xl text-ink-soft text-base lg:text-lg leading-relaxed text-balance"
            >
              {t.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.7 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a
                href="#work"
                className="group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-medium border border-signal-primary/40 bg-gradient-to-b from-signal-primary/15 to-signal-primary/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(125,211,252,0.35)]"
              >
                <span className="relative z-10">{t.cta1}</span>
                <svg className="relative z-10 transition-transform group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-signal-primary/20 to-transparent" />
              </a>

              <a
                href="/CV.html"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-medium border border-line-strong bg-depth-2 transition-all hover:-translate-y-0.5 hover:border-signal-primary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                {t.cta2}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1, delay: 3.0 }}
              className="mt-12 mono-label text-ink-faint flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-signal-mint shadow-[0_0_8px_rgba(165,243,208,0.8)] glow-pulse" />
              {handshakeStep >= 3 ? 'NODE ONLINE · CONNECTION ESTABLISHED' : t.statusLine}
            </motion.div>
          </motion.div>

          {/* RIGHT — Live console card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.1, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: yConsole, opacity, transformStyle: 'preserve-3d' }}
          >
            <LiveConsole />
          </motion.div>
        </div>
      </div>

      {/* Handshake log — coin bas gauche */}
      <HandshakeLog step={handshakeStep} />

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 3.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 mono-label text-ink-muted text-[10px] flex flex-col items-center gap-2 z-10"
      >
        <span>SCROLL</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-signal-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}

function HandshakeBackground({ step }: { step: number }) {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Two endpoints */}
      <g>
        <motion.circle
          cx="200" cy="400" r="6"
          fill="rgb(125,211,252)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: step >= 0 ? 1 : 0, scale: step >= 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(125,211,252,0.8))' }}
        />
        <motion.circle
          cx="1000" cy="400" r="6"
          fill="rgb(165,243,208)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: step >= 0 ? 1 : 0, scale: step >= 0 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ filter: 'drop-shadow(0 0 6px rgba(165,243,208,0.8))' }}
        />
      </g>

      {/* Three travelling packets, one per step */}
      {[0, 1, 2].map((i) => {
        const isLeftToRight = i % 2 === 0;
        const x1 = isLeftToRight ? 200 : 1000;
        const x2 = isLeftToRight ? 1000 : 200;
        const yOffset = (i - 1) * 22;

        return step >= i ? (
          <g key={i}>
            <motion.line
              x1={x1} y1={400 + yOffset} x2={x2} y2={400 + yOffset}
              stroke="rgba(125,211,252,0.12)"
              strokeWidth="1"
              strokeDasharray="3 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.circle
              r="4"
              fill={isLeftToRight ? 'rgb(125,211,252)' : 'rgb(165,243,208)'}
              initial={{ cx: x1, cy: 400 + yOffset, opacity: 0 }}
              animate={{ cx: x2, cy: 400 + yOffset, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
            />
          </g>
        ) : null;
      })}
    </svg>
  );
}

function HandshakeLog({ step }: { step: number }) {
  return (
    <div className="absolute bottom-12 left-8 hidden xl:block z-10 pointer-events-none">
      <div className="flex flex-col gap-1 font-mono text-[10px] tracking-wider">
        {HANDSHAKE_FR.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: step >= i ? 1 : 0,
              x: step >= i ? 0 : -10,
            }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            {p.from && (
              <>
                <span className="text-ink-faint">{p.from}</span>
                <span className="text-signal-primary">→</span>
                <span className="text-ink-faint">{p.to}</span>
                <span className="text-ink-muted">::</span>
              </>
            )}
            <span
              className={p.flag === 'CONNECTION ESTABLISHED' ? 'text-signal-mint' : 'text-signal-primary'}
            >
              [{p.flag}]
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
