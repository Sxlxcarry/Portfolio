'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { RESEARCH } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

function GlitchText({ text, active }: { text: string; active: boolean }) {
  return (
    <span className="relative inline-block">
      <span className={active ? 'animate-glitch-base' : ''}>{text}</span>
      {active && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 animate-glitch-r text-signal-coral"
            style={{ clipPath: 'polygon(0 15%, 100% 15%, 100% 40%, 0 40%)' }}
          >
            {text}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 animate-glitch-b text-signal-primary"
            style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)' }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
}

export default function Research() {
  const { lang } = useLang();
  const t = RESEARCH[lang];

  return (
    <SectionShell id="research">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        desc={t.desc}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {t.items.map((item, i) => {
          const isPlaceholder = item.href === '#';
          return (
            <ResearchCard key={item.id} item={item} index={i} isPlaceholder={isPlaceholder} />
          );
        })}
      </div>
    </SectionShell>
  );
}

function ResearchCard({
  item,
  index,
  isPlaceholder,
}: {
  item: { id: string; index: string; kind: string; title: string; summary: string; stack: string[]; href: string };
  index: number;
  isPlaceholder: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={isPlaceholder ? undefined : item.href}
      target={isPlaceholder ? undefined : '_blank'}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => !isPlaceholder && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative block rounded-2xl overflow-hidden p-7 border transition-all duration-300 ${
        isPlaceholder
          ? 'opacity-50 cursor-default border-line bg-depth-2/40'
          : 'border-signal-coral/20 bg-gradient-to-b from-[rgba(20,8,16,0.7)] to-[rgba(14,8,18,0.5)] hover:border-signal-coral/50 hover:shadow-[0_16px_48px_rgba(251,113,133,0.18)] cursor-pointer'
      }`}
      style={{ transform: hovered ? 'translateY(-4px)' : 'translateY(0)' }}
    >
      {/* Top accent */}
      <motion.span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: isPlaceholder
            ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
            : 'linear-gradient(90deg, transparent, rgb(251,113,133), transparent)',
          transformOrigin: 'left',
        }}
      />

      {/* Glow radial */}
      {!isPlaceholder && (
        <motion.span
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-[inherit]"
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle at 80% 20%, rgba(251,113,133,0.12), transparent 60%)',
          }}
        />
      )}

      {/* Header */}
      <div className="relative flex items-center justify-between mb-5">
        <span
          className={`mono-label text-[10px] px-2.5 py-1 rounded-md border ${
            isPlaceholder
              ? 'text-ink-muted border-line bg-depth-1'
              : 'text-signal-coral border-signal-coral/30 bg-signal-coral/[0.08]'
          }`}
        >
          {item.kind}
        </span>
        <span className="font-mono text-xs text-ink-muted tracking-wider">{item.index}</span>
      </div>

      {/* Icon */}
      <div
        className={`relative w-14 h-14 rounded-xl mb-5 grid place-items-center border ${
          isPlaceholder
            ? 'border-line bg-depth-1'
            : 'border-signal-coral/25 bg-gradient-to-br from-signal-coral/15 to-signal-coral/5'
        }`}
      >
        {isPlaceholder ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-muted">
            <circle cx="12" cy="12" r="9" strokeDasharray="4 3" />
            <path d="M12 8v4l3 3" />
          </svg>
        ) : (
          <motion.svg
            width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.5"
            animate={hovered ? { rotate: [0, -3, 3, -2, 0] } : {}}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            <path d="M12 9l3 3-3 3M9 12h6" stroke="#7dd3fc" />
          </motion.svg>
        )}
      </div>

      {/* Glitch title */}
      <h3
        className={`font-display text-xl font-normal tracking-tight leading-tight mb-3 ${
          isPlaceholder ? 'text-ink-muted' : 'text-ink'
        }`}
      >
        <GlitchText text={item.title} active={hovered && !isPlaceholder} />
      </h3>

      <p className="text-ink-muted text-sm leading-relaxed mb-4">{item.summary}</p>

      {item.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.stack.map((s, k) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.4 + k * 0.05 }}
              className="font-mono text-[10px] tracking-wide px-2 py-1 rounded-md bg-depth-1 border border-line text-ink-soft"
            >
              {s}
            </motion.span>
          ))}
        </div>
      )}
    </motion.a>
  );
}
