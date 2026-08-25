'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

type Props = {
  chapter: string;
  label: string;
  title: string;
  titleEm: string;
  titleEnd?: string;
  desc?: string;
  align?: 'left' | 'split';
  children?: ReactNode;
};

export default function SectionTitle({
  chapter,
  label,
  title,
  titleEm,
  titleEnd,
  desc,
  align = 'split',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className={`mb-16 ${align === 'split' ? 'flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8' : ''}`}>
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mono-label text-ink-muted flex items-center gap-3 mb-5"
        >
          <span className="inline-block w-6 h-px bg-signal-primary" />
          {chapter} — {label}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0)' } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-light tracking-tightest leading-[1.04] text-balance"
          style={{ fontSize: 'clamp(36px, 5.4vw, 72px)' }}
        >
          {title}{' '}
          <em className="serif-italic grad-text">{titleEm}</em>
          {titleEnd ? <> {titleEnd}</> : null}
        </motion.h2>
      </div>

      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-ink-muted text-sm max-w-md leading-relaxed"
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}
