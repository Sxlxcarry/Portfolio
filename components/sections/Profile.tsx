'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, lazy, Suspense } from 'react';
import { useLang } from '@/lib/i18n';
import { PROFILE_SECTION } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';
import { useIsMobile, useReducedMotion } from '@/lib/hooks';

const IcoAvatar = lazy(() => import('@/components/three/IcoAvatar'));

export default function Profile() {
  const { lang } = useLang();
  const t = PROFILE_SECTION[lang];
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <SectionShell id="profile">
      <div ref={ref}>
        <SectionTitle
          chapter={t.chapter}
          label={t.label}
          title={t.title}
          titleEm={t.titleEm}
          titleEnd={t.titleEnd}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
          {/* LEFT — Avatar 3D */}
          <motion.div style={{ y: y1 }} className="relative">
            <div className="relative">
              {!isMobile && !reduceMotion && (
                <Suspense fallback={<div className="aspect-square" />}>
                  <IcoAvatar />
                </Suspense>
              )}
              {/* Identity tag overlay */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 mono-label text-ink-muted text-[10px] flex items-center gap-2 pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-signal-mint shadow-[0_0_4px_rgba(165,243,208,0.8)] glow-pulse" />
                IDENTITY · 0x4B59
              </div>
            </div>
          </motion.div>

          {/* RIGHT — paragraphs + chips */}
          <motion.div style={{ y: y2 }} className="space-y-6">
            <div className="relative p-8 lg:p-10 rounded-3xl border border-line bg-gradient-to-b from-[rgba(14,19,30,0.6)] to-[rgba(7,10,17,0.4)] backdrop-blur-md overflow-hidden">
              <div
                className="absolute top-0 left-12 right-12 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgb(125,211,252,0.4), transparent)',
                }}
              />

              {t.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 0.12}>
                  <p
                    className={`text-base lg:text-lg leading-relaxed text-ink-soft ${
                      i > 0 ? 'mt-6' : ''
                    }`}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="p-7 rounded-3xl border border-line bg-depth-2/60 backdrop-blur-md">
                <div className="mono-label text-ink-muted mb-5">EXPERTISE</div>
                <div className="flex flex-wrap gap-2">
                  {t.chips.map((chip, i) => (
                    <motion.span
                      key={chip}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="font-mono text-xs tracking-wide px-3 py-2 rounded-lg bg-depth-3 border border-line text-ink-soft hover:text-signal-primary hover:border-signal-primary transition-colors"
                    >
                      {chip}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="p-7 rounded-3xl border border-line bg-depth-2/60 backdrop-blur-md">
                <div className="mono-label text-ink-muted mb-3">METHOD</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: lang === 'fr' ? 'Cartographier' : 'Map', n: '01' },
                    { label: lang === 'fr' ? 'Sécuriser' : 'Secure', n: '02' },
                    { label: lang === 'fr' ? 'Mesurer' : 'Measure', n: '03' },
                  ].map((s) => (
                    <div key={s.n} className="py-2">
                      <div className="font-display text-2xl font-light text-signal-primary">{s.n}</div>
                      <div className="mono-label text-ink-muted text-[9px] mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
