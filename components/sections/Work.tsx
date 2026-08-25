'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { WORK, type Project } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Work() {
  const { lang } = useLang();
  const t = WORK[lang];
  const [filter, setFilter] = useState<string>('*');

  const visible = filter === '*' ? t.projects : t.projects.filter((p) => p.type.includes(filter));

  return (
    <SectionShell id="work">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        desc={t.desc}
      />

      {/* Filter bar */}
      <div className="flex flex-wrap gap-1.5 mb-10 p-1.5 rounded-2xl border border-line bg-depth-1 w-fit">
        {t.filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`relative px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-colors ${
              filter === f.id ? 'text-depth-0' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {filter === f.id && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 bg-signal-primary rounded-xl"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </SectionShell>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      ry: (px - 0.5) * 6,
      rx: (0.5 - py) * 6,
      mx: px * 100,
      my: py * 100,
    });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });

  return (
    <motion.a
      ref={ref}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative block rounded-2xl overflow-hidden border border-line bg-gradient-to-b from-[rgba(14,19,30,0.8)] to-[rgba(7,10,17,0.6)] hover:border-line-strong transition-[border-color,transform] duration-300 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(400px circle at ${tilt.mx}% ${tilt.my}%, rgba(125,211,252,0.10), transparent 50%)`,
        }}
      />

      {/* Header / index + category */}
      <div className="relative px-5 pt-5 pb-3 flex items-center justify-between border-b border-line">
        <span className="font-mono text-xs text-signal-primary tracking-wider">{project.index}</span>
        <span className="mono-label text-ink-muted text-[10px]">{project.category}</span>
      </div>

      {/* Visual placeholder — abstract topology */}
      <div className="relative h-28 grid place-items-center bg-[radial-gradient(ellipse_at_30%_30%,_rgba(125,211,252,0.08),_transparent_60%)] bg-depth-1 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 tech-grid opacity-50"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
        <CardArt category={project.category} />
      </div>

      {/* Content */}
      <div className="relative p-5 lg:p-6">
        <h3 className="font-display text-xl font-normal tracking-tight leading-tight mb-2 transition-colors group-hover:text-signal-primary">
          {project.title}
        </h3>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">{project.summary}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] tracking-wide px-2 py-1 rounded-md bg-depth-1 border border-line text-ink-soft"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <span
        aria-hidden
        className="absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
        style={{
          background: 'linear-gradient(90deg, transparent, rgb(125,211,252), transparent)',
        }}
      />
    </motion.a>
  );
}

/** Petite illustration abstraite par catégorie */
function CardArt({ category }: { category: string }) {
  // Sélection visuelle légèrement différente par catégorie
  const c = category.toLowerCase();
  if (c.includes('observ') || c.includes('superv')) {
    return (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.4">
        <path d="M3 3h18v4H3zM5 7v14h14V7" />
        <path d="M8 12h2v6H8zM12 10h2v8h-2zM16 14h2v4h-2z" fill="#a5f3d0" stroke="none" />
      </svg>
    );
  }
  if (c.includes('séc') || c.includes('sec') || c.includes('offen')) {
    return (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.4">
        <path d="M12 2l8 4v6c0 6-4 10-8 10S4 18 4 12V6l8-4z" />
        <path d="M9 12h6v4H9z" fill="#a5f3d0" stroke="none" />
      </svg>
    );
  }
  if (c.includes('rés') || c.includes('net') || c.includes('smart')) {
    return (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.4">
        <path d="M4 17h16M4 7h16M12 7v10" />
        <circle cx="12" cy="7" r="3" fill="#a5f3d0" stroke="none" />
        <circle cx="12" cy="17" r="3" fill="#a5f3d0" stroke="none" />
      </svg>
    );
  }
  if (c.includes('iot')) {
    return (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.4">
        <path d="M4 12h6l2-3 2 6 2-3h4" />
        <circle cx="6" cy="18" r="2" fill="#a5f3d0" stroke="none" />
        <circle cx="18" cy="6" r="2" fill="#a5f3d0" stroke="none" />
      </svg>
    );
  }
  if (c.includes('ftth') || c.includes('fib')) {
    return (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.4">
        <path d="M4 12h16M4 6h16M4 18h16" />
        <circle cx="6" cy="6" r="2" fill="#a5f3d0" stroke="none" />
        <circle cx="18" cy="12" r="2" fill="#a5f3d0" stroke="none" />
        <circle cx="6" cy="18" r="2" fill="#a5f3d0" stroke="none" />
      </svg>
    );
  }
  if (c.includes('pol')) {
    return (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.4">
        <path d="M5 5h14v6H5z" />
        <path d="M9 11v8M15 11v8" stroke="#a5f3d0" />
      </svg>
    );
  }
  // Default app
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.4">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 12h8M12 8v8" stroke="#a5f3d0" />
    </svg>
  );
}
