'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/lib/i18n';
import { WORK, type Project } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Work() {
  const { lang } = useLang();
  const t = WORK[lang];
  const [filter, setFilter] = useState<string>('*');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = filter === '*' ? t.projects : t.projects.filter((p) => p.type.includes(filter));

  // Lock body scroll when modal open
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [openIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? null : (i + 1) % visible.length));
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, visible.length]);

  return (
    <SectionShell id="work">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        desc={t.desc}
      />

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

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={() => setOpenIndex(i)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Cinematic modal */}
      <AnimatePresence>
        {openIndex !== null && (
          <ProjectModal
            project={visible[openIndex]}
            index={openIndex}
            total={visible.length}
            onClose={() => setOpenIndex(null)}
            onPrev={() => setOpenIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length))}
            onNext={() => setOpenIndex((i) => (i === null ? null : (i + 1) % visible.length))}
          />
        )}
      </AnimatePresence>
    </SectionShell>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [scanProgress, setScanProgress] = useState(-1);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ ry: (px - 0.5) * 6, rx: (0.5 - py) * 6, mx: px * 100, my: py * 100 });
  };
  const onLeave = () => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
    setScanProgress(-1);
  };
  const onEnter = () => setScanProgress(0);

  // Scan line animation when hovered
  useEffect(() => {
    if (scanProgress < 0) return;
    let raf: number;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / 800);
      setScanProgress(t);
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [scanProgress >= 0]);

  return (
    <motion.button
      ref={ref}
      onClick={onOpen}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={onEnter}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative block text-left rounded-2xl overflow-hidden border border-line bg-gradient-to-b from-[rgba(14,19,30,0.8)] to-[rgba(7,10,17,0.6)] hover:border-line-strong transition-[border-color,transform] duration-300 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)] focus:outline-none focus:ring-2 focus:ring-signal-primary/40"
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(400px circle at ${tilt.mx}% ${tilt.my}%, rgba(125,211,252,0.10), transparent 50%)`,
        }}
      />

      {/* Scan line */}
      {scanProgress >= 0 && scanProgress < 1 && (
        <div
          aria-hidden
          className="absolute left-0 right-0 h-px pointer-events-none z-10"
          style={{
            top: `${scanProgress * 100}%`,
            background: 'linear-gradient(90deg, transparent, rgb(125,211,252) 50%, transparent)',
            boxShadow: '0 0 12px rgba(125,211,252,0.7)',
          }}
        />
      )}

      <div className="relative px-5 pt-5 pb-3 flex items-center justify-between border-b border-line">
        <span className="font-mono text-xs text-signal-primary tracking-wider">{project.index}</span>
        <span className="mono-label text-ink-muted text-[10px]">{project.category}</span>
      </div>

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

      <div className="relative p-5 lg:p-6">
        <h3 className="font-display text-xl font-normal tracking-tight leading-tight mb-2 transition-colors group-hover:text-signal-primary">
          {project.title}
        </h3>
        <p className="text-ink-muted text-sm leading-relaxed mb-4">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="font-mono text-[10px] tracking-wide px-2 py-1 rounded-md bg-depth-1 border border-line text-ink-soft">
              {s}
            </span>
          ))}
        </div>
      </div>

      <span
        aria-hidden
        className="absolute left-0 bottom-0 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"
        style={{ background: 'linear-gradient(90deg, transparent, rgb(125,211,252), transparent)' }}
      />
    </motion.button>
  );
}

function ProjectModal({
  project, index, total, onClose, onPrev, onNext,
}: {
  project: Project; index: number; total: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 z-[90] bg-depth-0/90 backdrop-blur-xl"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[91] flex items-center justify-center p-6 pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        <div className="pointer-events-auto w-full max-w-5xl max-h-[88vh] overflow-y-auto rounded-3xl border border-line-strong bg-gradient-to-b from-[rgba(14,19,30,0.96)] to-[rgba(7,10,17,0.96)] backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.7)]">
          {/* Top bar */}
          <div className="flex items-center justify-between px-7 py-4 border-b border-line sticky top-0 bg-depth-2/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-signal-primary tracking-wider">{project.index}</span>
              <span className="mono-label text-ink-muted text-[10px]">{project.category}</span>
              <span className="font-mono text-[10px] text-ink-faint">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onPrev} aria-label="Previous" className="w-9 h-9 rounded-lg border border-line bg-depth-2 hover:border-signal-primary hover:text-signal-primary text-ink-muted grid place-items-center transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={onNext} aria-label="Next" className="w-9 h-9 rounded-lg border border-line bg-depth-2 hover:border-signal-primary hover:text-signal-primary text-ink-muted grid place-items-center transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-lg border border-line bg-depth-2 hover:border-signal-coral hover:text-signal-coral text-ink-muted grid place-items-center transition-colors ml-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          {/* Cinematic header */}
          <div className="relative h-44 lg:h-60 grid place-items-center bg-[radial-gradient(ellipse_at_50%_30%,_rgba(125,211,252,0.10),_transparent_60%)] bg-depth-1 overflow-hidden border-b border-line">
            <div
              aria-hidden
              className="absolute inset-0 tech-grid opacity-50"
              style={{
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
              }}
            />
            <CardArt category={project.category} large />
            {/* Scan lines effect */}
            <motion.div
              className="absolute left-0 right-0 h-[2px]"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.4) 50%, transparent)',
                boxShadow: '0 0 12px rgba(125,211,252,0.5)',
              }}
            />
          </div>

          {/* Body */}
          <div className="p-8 lg:p-10">
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display font-light tracking-tighter text-balance"
              style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', lineHeight: 1.05 }}
            >
              {project.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-ink-soft text-base lg:text-lg leading-relaxed max-w-3xl"
            >
              {project.summary}
            </motion.p>

            {/* Meta blocks */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-5 rounded-2xl border border-line bg-depth-1"
              >
                <div className="mono-label text-ink-muted mb-3 text-[10px]">STACK TECHNIQUE</div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span key={s} className="font-mono text-xs tracking-wide px-2.5 py-1.5 rounded-md bg-depth-2 border border-line text-ink-soft">
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="p-5 rounded-2xl border border-line bg-depth-1"
              >
                <div className="mono-label text-ink-muted mb-3 text-[10px]">DOSSIER TECHNIQUE</div>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-signal-primary/40 bg-signal-primary/[0.06] text-signal-primary hover:bg-signal-primary/[0.12] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                  <span className="font-mono text-xs tracking-wider">OPEN PDF</span>
                </a>
              </motion.div>
            </div>

            {/* Footer hint */}
            <div className="mt-10 pt-6 border-t border-line flex items-center justify-between flex-wrap gap-3 mono-label text-ink-faint text-[10px]">
              <span>Use ← → to navigate · ESC to close</span>
              <span className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-signal-mint glow-pulse" />
                MODULE LOADED
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function CardArt({ category, large = false }: { category: string; large?: boolean }) {
  const c = category.toLowerCase();
  const size = large ? 100 : 56;
  const stroke = '#7dd3fc';
  const accent = '#a5f3d0';

  if (c.includes('observ') || c.includes('superv')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M3 3h18v4H3zM5 7v14h14V7" />
        <path d="M8 12h2v6H8zM12 10h2v8h-2zM16 14h2v4h-2z" fill={accent} stroke="none" />
      </svg>
    );
  }
  if (c.includes('séc') || c.includes('sec') || c.includes('offen')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M12 2l8 4v6c0 6-4 10-8 10S4 18 4 12V6l8-4z" />
        <path d="M9 12h6v4H9z" fill={accent} stroke="none" />
      </svg>
    );
  }
  if (c.includes('rés') || c.includes('net') || c.includes('smart')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M4 17h16M4 7h16M12 7v10" />
        <circle cx="12" cy="7" r="3" fill={accent} stroke="none" />
        <circle cx="12" cy="17" r="3" fill={accent} stroke="none" />
      </svg>
    );
  }
  if (c.includes('iot')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M4 12h6l2-3 2 6 2-3h4" />
        <circle cx="6" cy="18" r="2" fill={accent} stroke="none" />
        <circle cx="18" cy="6" r="2" fill={accent} stroke="none" />
      </svg>
    );
  }
  if (c.includes('ftth') || c.includes('fib')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M4 12h16M4 6h16M4 18h16" />
        <circle cx="6" cy="6" r="2" fill={accent} stroke="none" />
        <circle cx="18" cy="12" r="2" fill={accent} stroke="none" />
        <circle cx="6" cy="18" r="2" fill={accent} stroke="none" />
      </svg>
    );
  }
  if (c.includes('pol')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M5 5h14v6H5z" />
        <path d="M9 11v8M15 11v8" stroke={accent} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 12h8M12 8v8" stroke={accent} />
    </svg>
  );
}
