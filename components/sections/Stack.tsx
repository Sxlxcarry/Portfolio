'use client';

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';
import { useLang } from '@/lib/i18n';
import { STACK } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

const LAYER_ICONS = [
  <svg key="L1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 17h16M4 7h16M12 7v10" />
    <circle cx="12" cy="7" r="3" />
    <circle cx="12" cy="17" r="3" />
  </svg>,
  <svg key="L2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l8 4v6c0 5-3.5 9-8 10s-8-5-8-10V7l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg key="L3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3h18v4H3zM5 7v14h14V7" />
    <path d="M8 12h2v6H8zM12 10h2v8h-2zM16 14h2v4h-2z" fill="currentColor" />
  </svg>,
  <svg key="L4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

  // explosion : à mid-scroll, les couches sont écartées au max
  const explosion = useTransform(scrollYProgress, [0.1, 0.55, 0.9], [0, 1, 0.7]);
  // rotation perspective : on tilt davantage au milieu
  const tilt = useTransform(scrollYProgress, [0.1, 0.55, 0.9], [8, 22, 16]);

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

      <div ref={ref} className="relative" style={{ perspective: '2400px' }}>
        {/* Background label */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-4 left-0 right-0 text-center"
          style={{ opacity: useTransform(scrollYProgress, [0.1, 0.5], [0, 0.04]) }}
        >
          <div className="font-display font-light italic text-ink select-none" style={{ fontSize: 'clamp(180px, 30vw, 380px)', lineHeight: 1 }}>
            OSI
          </div>
        </motion.div>

        {/* Vertical packet flow (data circulating between layers) */}
        <PacketColumn explosion={explosion} active={active} />

        {/* Layers grid */}
        <div className="relative grid grid-cols-1 gap-4 lg:gap-5">
          {t.layers.map((layer, i) => (
            <Layer
              key={layer.id}
              layer={layer}
              index={i}
              total={t.layers.length}
              icon={LAYER_ICONS[i]}
              explosion={explosion}
              tilt={tilt}
              active={active === i}
              anyActive={active !== null}
              onHover={() => setActive(i)}
              onLeave={() => setActive(null)}
            />
          ))}
        </div>

        {/* Bottom legend */}
        <div className="mt-12 flex items-center justify-between gap-6 flex-wrap">
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-primary shadow-[0_0_6px_rgba(125,211,252,0.8)]" />
            {lang === 'fr' ? 'Couche active' : 'Active layer'}
          </div>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink-muted">
            {lang === 'fr' ? '4 strates · scroll pour déployer' : '4 strata · scroll to expand'}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function PacketColumn({ explosion, active }: { explosion: MotionValue<number>; active: number | null }) {
  return (
    <motion.div
      aria-hidden
      style={{ opacity: useTransform(explosion, [0, 0.5, 1], [0, 0.6, 1]) }}
      className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px pointer-events-none"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(125,211,252,0.4), rgba(165,243,208,0.3), transparent)',
        }}
      />
      {/* Animated packets going down */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 2 === 0 ? 'rgb(125,211,252)' : 'rgb(165,243,208)',
            boxShadow: '0 0 8px currentColor',
          }}
          animate={{ top: ['0%', '100%'] }}
          transition={{
            duration: 3.5 + i * 0.4,
            delay: i * 0.6,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </motion.div>
  );
}

function Layer({
  layer,
  index,
  total,
  icon,
  explosion,
  tilt,
  active,
  anyActive,
  onHover,
  onLeave,
}: {
  layer: { id: string; title: string; subtitle: string; tools: string[] };
  index: number;
  total: number;
  icon: ReactNode;
  explosion: MotionValue<number>;
  tilt: MotionValue<number>;
  active: boolean;
  anyActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  // chaque couche s'écarte verticalement quand explosion → 1
  // L1 est en haut (offset négatif), L4 en bas
  const offset = index - (total - 1) / 2; // -1.5, -0.5, 0.5, 1.5
  const ty = useTransform(explosion, [0, 1], [0, offset * 60]);
  const rotateX = useTransform(tilt, (v) => v);

  // floute les autres couches quand une est active
  const dimOpacity = anyActive && !active ? 0.35 : 1;
  const dimBlur = anyActive && !active ? 2 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 14 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        y: ty,
        rotateX,
        opacity: dimOpacity,
        filter: `blur(${dimBlur}px)`,
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`group relative rounded-3xl border transition-[border-color,box-shadow,opacity,filter] duration-500 cursor-default ${
        active
          ? 'border-signal-primary/50 bg-depth-3/90 shadow-[0_24px_60px_rgba(125,211,252,0.18)]'
          : 'border-line bg-depth-2/80'
      } backdrop-blur-md`}
    >
      {/* Side connector (L1 top — L4 bottom hint) */}
      <span
        aria-hidden
        className={`absolute left-1/2 -translate-x-1/2 -top-2 w-2 h-2 rounded-full transition-colors ${
          active ? 'bg-signal-primary shadow-[0_0_8px_rgba(125,211,252,0.7)]' : 'bg-depth-4'
        }`}
        style={{ display: index === 0 ? 'none' : 'block' }}
      />

      {/* Glow on active */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{
          background:
            'radial-gradient(800px 200px at 50% 0%, rgba(125,211,252,0.10), transparent 60%)',
        }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative p-7 lg:p-9 grid grid-cols-1 lg:grid-cols-[auto_1fr_2fr] gap-6 lg:gap-10 items-center">
        {/* Index + ID */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="font-display text-5xl lg:text-7xl font-light text-signal-primary opacity-25 leading-none tracking-tightest">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="w-14 h-14 rounded-2xl grid place-items-center bg-gradient-to-br from-signal-primary/15 to-signal-mint/5 border border-signal-primary/25 text-signal-primary">
            {icon}
          </div>
        </div>

        {/* Title block */}
        <div>
          <div className="mono-label text-ink-muted text-[10px] mb-2">
            {layer.id} · {layer.subtitle.split('·')[0]?.trim()}
          </div>
          <h3 className="font-display text-3xl lg:text-4xl font-light tracking-tighter leading-tight">
            {layer.title}
          </h3>
          <div className="text-ink-muted text-sm mt-1.5">{layer.subtitle}</div>
        </div>

        {/* Tools — sliding reveal effect */}
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {layer.tools.map((tool, k) => (
            <motion.span
              key={tool}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 + k * 0.04 }}
              animate={{
                y: active ? -2 : 0,
                borderColor: active ? 'rgba(125,211,252,0.4)' : 'rgba(148,163,184,0.10)',
              }}
              className="font-mono text-[11px] tracking-wide px-3 py-1.5 rounded-md bg-depth-1 border text-ink-soft transition-colors"
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
          background:
            'linear-gradient(90deg, transparent, rgb(125,211,252), rgb(165,243,208), transparent)',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
