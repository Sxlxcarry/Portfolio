'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { NAV, PROFILE } from '@/lib/content';
import Search from '@/components/effects/Search';

export default function Header() {
  const { lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('identity');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = document.querySelectorAll('section[id]');
      let current = 'identity';
      sections.forEach((s) => {
        const top = (s as HTMLElement).offsetTop - 200;
        if (window.scrollY >= top) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 4.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(7,10,17,0.7)] backdrop-blur-xl backdrop-saturate-150 border-b border-line'
          : 'bg-transparent'
      }`}
    >
      <div className="container-x flex items-center justify-between gap-4 py-4">
        {/* Brand */}
        <a href="#identity" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-line-strong grid place-items-center bg-gradient-to-br from-signal-primary/10 to-signal-mint/5">
            <span
              aria-hidden
              className="absolute inset-[-50%] animate-spin-slow"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 70%, rgba(125,211,252,0.4), transparent)',
              }}
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="relative z-10 text-signal-primary"
            >
              <path d="M12 3l8 4v6c0 5-3.5 9-8 10s-8-5-8-10V7l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="mono-label text-ink-muted text-[9px]">SECURITY ENGINEER</span>
            <span className="text-sm font-semibold tracking-wide">{PROFILE.name}</span>
          </div>
        </a>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV[lang].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                active === item.id ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {item.label}
              {active === item.id && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute left-3 right-3 bottom-1 h-px bg-signal-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Right tools */}
        <div className="flex items-center gap-3">
          <Search />

          <button
            onClick={toggle}
            className="relative w-16 h-8 rounded-full border border-line bg-depth-2 flex items-center px-1 transition-colors hover:border-line-strong"
            aria-label="Switch language"
          >
            <motion.span
              className="absolute w-6 h-6 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #7dd3fc, #38bdf8)',
                boxShadow: '0 0 12px rgba(125,211,252,0.5)',
              }}
              animate={{ left: lang === 'fr' ? 4 : 36 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            <span className="w-full flex justify-between px-2 font-mono text-[10px] font-bold tracking-wider text-ink-soft">
              <span className={lang === 'fr' ? 'opacity-100' : 'opacity-40'}>FR</span>
              <span className={lang === 'en' ? 'opacity-100' : 'opacity-40'}>EN</span>
            </span>
          </button>

          {/* Mobile menu */}
          <button
            className="lg:hidden w-10 h-10 grid place-items-center rounded-lg border border-line bg-depth-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full inset-x-4 mt-2 p-3 rounded-xl bg-depth-2 backdrop-blur-xl border border-line"
        >
          {NAV[lang].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm text-ink-muted hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
}
