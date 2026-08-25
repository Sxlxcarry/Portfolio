'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { HERO } from '@/lib/content';
import LiveConsole from './hero/LiveConsole';

export default function Hero() {
  const { lang } = useLang();
  const t = HERO[lang];
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Parallaxe interne au hero
  const yText = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yConsole = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);

  return (
    <section
      id="identity"
      ref={ref}
      className="relative min-h-screen flex items-center pt-32 pb-24"
      style={{ perspective: '1800px' }}
    >
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-16 items-center">
          {/* LEFT — texte */}
          <motion.div style={{ y: yText, opacity }}>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.0 }}
              className="inline-flex items-center gap-2.5 mono-label text-signal-primary px-3.5 py-2 rounded-full bg-signal-primary/[0.06] border border-signal-primary/20"
            >
              <span className="relative w-1.5 h-1.5 rounded-full bg-signal-primary">
                <span className="absolute inset-0 rounded-full bg-signal-primary animate-ping" />
              </span>
              {t.eyebrow}
            </motion.div>

            {/* Big title */}
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
                      delay: 3.1 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {i === 1 ? <em className="serif-italic grad-text">{line}</em> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Lead */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 3.6 }}
              className="mt-8 max-w-xl text-ink-soft text-base lg:text-lg leading-relaxed text-balance"
            >
              {t.intro}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 3.8 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a
                href="#work"
                className="group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-medium border border-signal-primary/40 bg-gradient-to-b from-signal-primary/15 to-signal-primary/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(125,211,252,0.35)]"
              >
                <span className="relative z-10">{t.cta1}</span>
                <svg
                  className="relative z-10 transition-transform group-hover:translate-x-1"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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

            {/* Status mono line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 1, delay: 4.2 }}
              className="mt-12 mono-label text-ink-faint flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-signal-mint shadow-[0_0_8px_rgba(165,243,208,0.8)]" />
              {t.statusLine}
            </motion.div>
          </motion.div>

          {/* RIGHT — Live console card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.1, delay: 3.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: yConsole, opacity, transformStyle: 'preserve-3d' }}
          >
            <LiveConsole />
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1, delay: 4.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 mono-label text-ink-muted text-[10px] flex flex-col items-center gap-2"
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
