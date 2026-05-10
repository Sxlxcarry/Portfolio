'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useLang } from '@/lib/i18n';
import { FOOTER, PROFILE, NAV } from '@/lib/content';

export default function Footer() {
  const { lang } = useLang();
  const t = FOOTER[lang];
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer ref={ref} className="relative z-10 mt-8 overflow-hidden">
      {/* Ambient glow top */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(125,211,252,0.4), transparent)' }}
      />

      {/* Grid pulse background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(125,211,252,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(125,211,252,.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      />

      <div className="container-x py-12">
        {/* Top row — links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-between items-start gap-8 mb-10"
        >
          {/* Brand */}
          <div>
            <div className="font-display font-light text-2xl tracking-tightest grad-text mb-1">
              {PROFILE.name}
            </div>
            <div className="mono-label text-ink-muted text-[10px]">
              {lang === 'fr' ? 'Réseau · Sécurité · Infrastructure' : 'Network · Security · Infrastructure'}
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV[lang].map((item, i) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                className="group relative font-mono text-xs text-ink-muted hover:text-signal-primary transition-colors"
              >
                {item.label}
                <span className="absolute -bottom-0.5 left-0 w-0 group-hover:w-full h-px bg-signal-primary transition-all duration-300 ease-out" />
              </motion.a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex gap-2.5">
            {[
              { href: PROFILE.github, label: 'GitHub', icon: <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.85 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.58 2.36 1.13 2.94.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.15 9.15 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z" />, fill: true },
              { href: PROFILE.linkedin, label: 'LinkedIn', icon: <><path d="M6 9h3v9H6zM7.5 6.5A1.5 1.5 0 107.5 3a1.5 1.5 0 000 3.5zM11 9h3v1.3c.42-.8 1.5-1.5 2.8-1.5 3 0 3.7 1.9 3.7 4.4V18h-3v-3.9c0-1-.02-2.3-1.4-2.3s-1.7 1.1-1.7 2.2V18h-3V9z" /></>, fill: true },
              { href: `mailto:${PROFILE.email}`, label: 'Email', icon: <><path d="M4 6h16v12H4z" /><path d="M4 7l8 6 8-6" /></>, fill: false },
            ].map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                whileHover={{ y: -2, scale: 1.05 }}
                className="w-9 h-9 rounded-lg grid place-items-center border border-line bg-depth-2 text-ink-muted hover:border-signal-primary hover:text-signal-primary hover:shadow-[0_0_12px_rgba(125,211,252,0.25)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={s.fill ? 'currentColor' : 'none'} stroke={s.fill ? 'none' : 'currentColor'} strokeWidth="1.6">
                  {s.icon}
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-px origin-left mb-6"
          style={{ background: 'linear-gradient(90deg, rgba(125,211,252,0.3), rgba(165,243,208,0.15), transparent)' }}
        />

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <span className="font-mono text-[11px] tracking-widest text-ink-muted">{t.copy}</span>
          <span className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-ink-muted">
            <span className="relative w-1.5 h-1.5 rounded-full bg-signal-mint">
              <span className="absolute inset-0 rounded-full bg-signal-mint animate-ping" />
            </span>
            {t.status}
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
