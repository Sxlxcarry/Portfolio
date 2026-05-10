'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n';

const PLACEHOLDER = {
  fr: 'Rechercher…',
  en: 'Search…',
};
const SHORTCUT_HINT = '⌘K';

let lastHighlights: HTMLElement[] = [];

function clearHighlights() {
  lastHighlights.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
    parent.normalize();
  });
  lastHighlights = [];
}

function* textNodesUnder(el: Element): Generator<Text> {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const node = n as Text;
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest('script,style,svg,nav,header,button')) return NodeFilter.FILTER_REJECT;
      // Évite re-highlight ce qui l'est déjà
      if (parent.tagName === 'MARK' && parent.classList.contains('search-hl')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let node;
  while ((node = walker.nextNode())) yield node as Text;
}

function highlightQuery(q: string): HTMLElement | null {
  clearHighlights();
  if (!q || q.length < 2) return null;

  const root = document.querySelector('main');
  if (!root) return null;

  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safe, 'gi');
  let firstMark: HTMLElement | null = null;
  let count = 0;

  for (const tn of textNodesUnder(root)) {
    const txt = tn.nodeValue || '';
    let m: RegExpExecArray | null;
    let lastIndex = 0;
    const frag = document.createDocumentFragment();
    let matched = false;

    while ((m = regex.exec(txt))) {
      matched = true;
      const before = txt.slice(lastIndex, m.index);
      const hit = txt.slice(m.index, m.index + m[0].length);
      if (before) frag.appendChild(document.createTextNode(before));
      const mark = document.createElement('mark');
      mark.className = 'search-hl';
      mark.textContent = hit;
      frag.appendChild(mark);
      lastHighlights.push(mark);
      if (!firstMark) firstMark = mark;
      lastIndex = m.index + m[0].length;
      count++;
    }
    if (matched && tn.parentNode) {
      const after = txt.slice(lastIndex);
      if (after) frag.appendChild(document.createTextNode(after));
      tn.parentNode.replaceChild(frag, tn);
    }
  }

  return firstMark;
}

export default function Search() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [count, setCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
        setQ('');
        clearHighlights();
        setCount(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Run highlight on input change (debounced)
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      const first = highlightQuery(q.trim());
      setCount(lastHighlights.length);
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 220);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  // Cleanup highlights when modal closes
  useEffect(() => {
    if (!open) {
      clearHighlights();
      setQ('');
      setCount(null);
    }
  }, [open]);

  return (
    <>
      {/* Trigger button (compact) */}
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="hidden md:inline-flex items-center gap-2.5 h-8 px-3 rounded-lg border border-line bg-depth-2 hover:border-line-strong transition-colors text-ink-muted hover:text-ink"
        aria-label="Search"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <span className="text-xs font-medium">{PLACEHOLDER[lang]}</span>
        <span className="hidden lg:inline-block font-mono text-[10px] tracking-wider px-1.5 py-0.5 rounded border border-line text-ink-faint">
          {SHORTCUT_HINT}
        </span>
      </button>

      {/* Mobile compact icon */}
      <button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="md:hidden w-9 h-9 grid place-items-center rounded-lg border border-line bg-depth-2 text-ink-muted"
        aria-label="Search"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      {/* Search modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-depth-0/70 backdrop-blur-md"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[18vh] left-1/2 -translate-x-1/2 z-[81] w-[min(560px,90vw)]"
              role="dialog"
              aria-modal="true"
              aria-label="Search"
            >
              <div className="rounded-2xl border border-line-strong bg-gradient-to-b from-[rgba(14,19,30,0.95)] to-[rgba(7,10,17,0.95)] backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-signal-primary shrink-0"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={PLACEHOLDER[lang]}
                    className="flex-1 bg-transparent text-ink text-base placeholder:text-ink-faint outline-none border-none"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {q && (
                    <span className="font-mono text-[10px] tracking-wider text-ink-muted px-2 py-1 rounded border border-line shrink-0">
                      {count ?? 0} {lang === 'fr' ? 'résultats' : 'results'}
                    </span>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="text-ink-muted hover:text-ink transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Footer hint */}
                <div className="px-5 py-3 flex items-center justify-between font-mono text-[10px] tracking-wider text-ink-faint">
                  <span>
                    {lang === 'fr'
                      ? 'Tapez pour explorer le contenu de la page'
                      : 'Type to explore the page content'}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>
                      <kbd className="px-1.5 py-0.5 rounded border border-line bg-depth-1">esc</kbd>{' '}
                      {lang === 'fr' ? 'fermer' : 'close'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
