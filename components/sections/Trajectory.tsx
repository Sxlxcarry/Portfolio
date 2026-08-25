'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
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
        {/* Timeline track */}
        <TimelineTrack count={t.items.length} />

        <div className="space-y-10">
          {t.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-16"
            >
              {/* Node */}
              <div className="absolute left-[18px] top-2 w-4 h-4 rounded-full bg-depth-0 border-2 border-signal-primary shadow-[0_0_12px_rgba(125,211,252,0.5),inset_0_0_6px_rgba(125,211,252,0.6)]" />

              <div className="rounded-2xl border border-line bg-gradient-to-b from-[rgba(14,19,30,0.6)] to-[rgba(7,10,17,0.4)] p-7 lg:p-8 backdrop-blur-md hover:border-line-strong transition-colors">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="mono-label text-signal-primary text-[10px] px-2.5 py-1 rounded-md bg-signal-primary/[0.08] border border-signal-primary/20">
                    {item.year} · {item.kind}
                  </span>
                  <span className="font-mono text-xs text-ink-muted tracking-wider">{item.org}</span>
                </div>

                <h3 className="font-display text-2xl lg:text-3xl font-light tracking-tight leading-tight mb-4">
                  {item.role}
                </h3>

                <ul className="space-y-2.5 text-ink-soft text-sm lg:text-[15px] leading-relaxed">
                  {item.bullets.map((b, k) => (
                    <li key={k} className="flex gap-3">
                      <span className="mt-2 w-1 h-1 rounded-full bg-signal-primary shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function TimelineTrack({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 60%'],
  });
  const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute left-[24px] top-0 bottom-0 w-px"
      style={{
        background: 'linear-gradient(to bottom, rgba(125,211,252,0.2), transparent)',
      }}
    >
      <motion.div
        className="absolute top-0 left-0 w-full"
        style={{
          height,
          background: 'linear-gradient(to bottom, rgb(125,211,252), rgba(125,211,252,0.2))',
        }}
      />
    </div>
  );
}
