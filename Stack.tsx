'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { STACK } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

const LAYER_ICONS = [
  // Network
  <svg key="L1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 17h16M4 7h16M12 7v10" />
    <circle cx="12" cy="7" r="3" />
    <circle cx="12" cy="17" r="3" />
  </svg>,
  // Security
  <svg key="L2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l8 4v6c0 5-3.5 9-8 10s-8-5-8-10V7l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  // Observability
  <svg key="L3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3h18v4H3zM5 7v14h14V7" />
    <path d="M8 12h2v6H8zM12 10h2v8h-2zM16 14h2v4h-2z" fill="currentColor" />
  </svg>,
  // Platform
  <svg key="L4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 9l-3 3 3 3M15 9l3 3-3 3M14 7l-4 10" />
  </svg>,
];

export default function Stack() {
  const { lang } = useLang();
  const t = STACK[lang];
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Plus on scroll, plus les couches s'écartent en Z (effet "expansion")
  const layerSpread = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <SectionShell id="stack">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        titleEnd={t.titleEnd}
        desc={t.desc}
      />

      {/* Stack of 3D layers */}
      <div ref={ref} className="relative" style={{ perspective: '2000px' }}>
        {/* Connector lines */}
        <svg
          aria-hidden
          className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
          width="2"
          height="100%"
          style={{ height: '100%' }}
        >
          <line
            x1="1"
            y1="0"
            x2="1"
            y2="100%"
            stroke="rgba(125,211,252,0.2)"
            strokeDasharray="4 6"
          />
        </svg>

        <div className="space-y-6 lg:space-y-7 relative">
          {t.layers.map((layer, i) => (
            <Layer
              key={layer.id}
              layer={layer}
              index={i}
              total={t.layers.length}
              icon={LAYER_ICONS[i]}
              spread={layerSpread}
              active={active === i}
              onHover={() => setActive(i)}
              onLeave={() => setActive(null)}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function Layer({
  layer,
  index,
  total,
  icon,
  spread,
  active,
  onHover,
  onLeave,
}: {
  layer: { id: string; title: string; subtitle: string; tools: string[] };
  index: number;
  total: number;
  icon: React.ReactNode;
  spread: any;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Effet : les couches "loin" sont plus pâles
  const depth = 1 - index * 0.1;

  // Translate Z dynamique au scroll : plus on scroll, plus elles sortent du plan
  const tz = useTransform(spread, [0, 1], [0, -index * 30]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ z: tz, transformStyle: 'preserve-3d' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group relative rounded-3xl border transition-all duration-500 cursor-default overflow-hidden ${
        active ? 'border-signal-primary/40 bg-depth-3' : 'border-line bg-depth-2'
      }`}
    >
      {/* Glow effect on active */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background:
            'radial-gradient(800px 200px at 50% 0%, rgba(125,211,252,0.08), transparent 60%)',
        }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-[auto_1fr_2fr] gap-6 lg:gap-10 items-center">
        {/* Index + ID */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="font-display text-5xl lg:text-6xl font-light text-signal-primary opacity-30 leading-none tracking-tightest">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="w-12 h-12 rounded-xl grid place-items-center bg-gradient-to-br from-signal-primary/15 to-signal-mint/5 border border-signal-primary/25 text-signal-primary">
            {icon}
          </div>
        </div>

        {/* Title block */}
        <div>
          <div className="mono-label text-ink-muted text-[10px] mb-2">{layer.id} · LAYER</div>
          <h3 className="font-display text-3xl lg:text-4xl font-light tracking-tighter leading-tight">
            {layer.title}
          </h3>
          <div className="text-ink-muted text-sm mt-1.5">{layer.subtitle}</div>
        </div>

        {/* Tools */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {layer.tools.map((tool, k) => (
            <motion.span
              key={tool}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: k * 0.04 }}
              className="font-mono text-[11px] tracking-wide px-3 py-1.5 rounded-md bg-depth-1 border border-line text-ink-soft transition-colors group-hover:border-line-strong"
            >
              {tool}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] origin-left"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, transparent, rgb(125,211,252), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
