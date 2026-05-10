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

function SplitWords({ text, baseDelay = 0, className = '' }: { text: string; baseDelay?: number; className?: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
          <motion.span
            className={`inline-block ${className}`}
            initial={{ y: '115%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.85,
              delay: baseDelay + i * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

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
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      className={`mb-16 ${align === 'split' ? 'flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8' : ''}`}
    >
      <div className="max-w-3xl">
        {/* Chapter label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mono-label text-ink-muted flex items-center gap-3 mb-5"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block w-6 h-px bg-signal-primary origin-left"
          />
          {chapter} — {label}
        </motion.div>

        {/* Title with word stagger */}
        <h2
          className="font-display font-light tracking-tightest leading-[1.04] text-balance"
          style={{ fontSize: 'clamp(36px, 5.4vw, 72px)' }}
        >
          {inView && (
            <>
              <SplitWords text={title} baseDelay={0.15} />
              {' '}
              <span className="inline-block overflow-hidden mr-[0.25em]">
                <motion.em
                  className="inline-block serif-italic grad-text shimmer-text"
                  initial={{ y: '115%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.15 + title.split(' ').length * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {titleEm}
                </motion.em>
              </span>
              {titleEnd && (
                <SplitWords
                  text={titleEnd}
                  baseDelay={0.15 + (title.split(' ').length + 1) * 0.07}
                />
              )}
            </>
          )}
        </h2>
      </div>

      {desc && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-ink-muted text-sm max-w-md leading-relaxed"
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}
