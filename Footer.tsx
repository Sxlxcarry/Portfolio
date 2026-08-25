'use client';

import { useLang } from '@/lib/i18n';
import { FOOTER } from '@/lib/content';

export default function Footer() {
  const { lang } = useLang();
  const t = FOOTER[lang];

  return (
    <footer className="relative z-10 border-t border-line">
      <div className="container-x py-8 flex items-center justify-between gap-4 text-xs font-mono tracking-widest text-ink-muted">
        <span>{t.copy}</span>
        <span className="flex items-center gap-2">
          <span className="relative w-1.5 h-1.5 rounded-full bg-signal-mint">
            <span className="absolute inset-0 rounded-full bg-signal-mint animate-ping" />
          </span>
          {t.status}
        </span>
      </div>
    </footer>
  );
}
