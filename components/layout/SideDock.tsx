'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSection } from '@/lib/CameraDirector';
import { useLang } from '@/lib/i18n';

const SECTIONS = {
  fr: [
    { id: 'identity',   label: 'Identité' },
    { id: 'profile',    label: 'Profil' },
    { id: 'stack',      label: 'Stack' },
    { id: 'work',       label: 'Travaux' },
    { id: 'research',   label: 'Recherche' },
    { id: 'trajectory', label: 'Trajectoire' },
    { id: 'contact',    label: 'Contact' },
  ],
  en: [
    { id: 'identity',   label: 'Identity' },
    { id: 'profile',    label: 'Profile' },
    { id: 'stack',      label: 'Stack' },
    { id: 'work',       label: 'Work' },
    { id: 'research',   label: 'Research' },
    { id: 'trajectory', label: 'Trajectory' },
    { id: 'contact',    label: 'Contact' },
  ],
};

export default function SideDock() {
  const sectionIndex = useSection();
  const { lang } = useLang();
  const [showTop, setShowTop] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  // showTop : check au scroll natif (passive)
  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setShowTop(docH > 0 && window.scrollY / docH > 0.3);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3">
      <div className="font-mono text-[10px] tracking-widest text-ink-muted mb-1 select-none pointer-events-none">
        {String(sectionIndex + 1).padStart(2, '0')} / {String(SECTIONS[lang].length).padStart(2, '0')}
      </div>

      <div className="relative flex flex-col gap-2.5 py-3 px-2 rounded-full border border-line bg-depth-2/60 backdrop-blur-md">
        {SECTIONS[lang].map((s, i) => {
          const isActive = sectionIndex === i;
          const isHovered = hovered === i;
          return (
            <button
              key={s.id}
              onClick={() => goTo(s.id)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Go to ${s.label}`}
              className="group relative flex items-center justify-end h-3"
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: -16 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-full top-1/2 -translate-y-1/2 mr-1 whitespace-nowrap font-mono text-[10px] tracking-wider uppercase text-ink bg-depth-3 border border-line px-2.5 py-1 rounded-md"
                  >
                    {s.label}
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.span
                animate={{
                  width: isActive ? 22 : 6,
                  backgroundColor: isActive ? 'rgb(125,211,252)' : 'rgba(148,163,184,0.4)',
                  boxShadow: isActive ? '0 0 8px rgba(125,211,252,0.6)' : '0 0 0 rgba(0,0,0,0)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="h-[3px] rounded-full"
              />
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-2 w-10 h-10 rounded-full grid place-items-center border border-line bg-depth-2/70 backdrop-blur-md text-ink-muted hover:text-signal-primary hover:border-signal-primary/40 transition-colors"
            aria-label="Scroll to top"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
