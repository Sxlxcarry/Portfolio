'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Lang } from './content';

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void };

const LangContext = createContext<Ctx>({
  lang: 'fr',
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored === 'fr' || stored === 'en') setLang(stored);
    else {
      const browser = navigator.language.toLowerCase();
      if (browser.startsWith('en')) setLang('en');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang((p) => (p === 'fr' ? 'en' : 'fr'));

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
