'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { TRAJECTORY } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Trajectory() {
  const { lang } = useLang();
  const t = TRAJECTORY[lang];

  return (
    <SectionShell id="trajectory">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        desc={t.desc}
      />

      <div className="relative max-w-4xl">
        <TimelineTrack />

        <div className="space-y-10">
          {t.items.map((item, i) => (
            <TimelineCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function TimelineCard({ item, index }: { item: { year: string; kind: string; role: string; org: string; bullets: string[] }; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-16"
    >
      {/* Node avec pulse */}
      <div className="absolute left-[18px] top-7">
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 rounded-full bg-depth-0 border-2 border-signal-primary shadow-[0_0_12px_rgba(125,211,252,0.5),inset_0_0_6px_rgba(125,211,252,0.6)]" />
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: index * 0.5 }}
            className="absolute inset-0 rounded-full bg-signal-primary"
          />
        </div>
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group relative rounded-2xl border border-line bg-gradient-to-b from-[rgba(14,19,30,0.6)] to-[rgba(7,10,17,0.4)] p-7 lg:p-8 backdrop-blur-md overflow-hidden cursor-default"
      >
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(600px circle at 0% 50%, rgba(125,211,252,0.06), transparent 60%)',
          }}
        />

        {/* Top shine */}
        <div
          className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.5), transparent)' }}
        />

        {/* Bottom accent — slide in on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1.5px] origin-left"
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, transparent, rgb(125,211,252), transparent)',
          }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="relative flex flex-wrap items-center gap-3 mb-5">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.12 + 0.3 }}
            className="mono-label text-signal-primary text-[10px] px-2.5 py-1 rounded-md bg-signal-primary/[0.08] border border-signal-primary/20"
          >
            {item.year} · {item.kind}
          </motion.span>
          <span className="font-mono text-xs text-ink-muted tracking-wider">{item.org}</span>
        </div>

        <h3 className="font-display text-2xl lg:text-3xl font-light tracking-tight leading-tight mb-5 group-hover:text-signal-primary transition-colors duration-300">
          {item.role}
        </h3>

        <ul className="space-y-3">
          {item.bullets.map((b, k) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 + 0.4 + k * 0.08 }}
              className="flex gap-3 text-ink-soft text-sm lg:text-[15px] leading-relaxed"
            >
              <motion.span
                className="mt-2 w-1.5 h-1.5 rounded-full bg-signal-primary shrink-0"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.12 + 0.5 + k * 0.08, type: 'spring', stiffness: 500 }}
              />
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

function TimelineTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 60%'],
  });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.4]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute left-[24px] top-0 bottom-0 w-px"
      style={{ background: 'linear-gradient(to bottom, rgba(125,211,252,0.15), transparent)' }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full"
        style={{
          height,
          opacity,
          background: 'linear-gradient(to bottom, rgb(125,211,252), rgba(165,243,208,0.4))',
          boxShadow: '0 0 8px rgba(125,211,252,0.4)',
        }}
      />
    </div>
  );
}
