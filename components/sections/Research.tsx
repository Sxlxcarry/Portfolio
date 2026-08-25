'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { RESEARCH } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Research() {
  const { lang } = useLang();
  const t = RESEARCH[lang];

  return (
    <SectionShell id="research">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        desc={t.desc}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {t.items.map((item, i) => (
          <ResearchCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </SectionShell>
  );
}

function ResearchCard({
  item,
  index,
}: {
  item: {
    id: string;
    index: string;
    kind: string;
    title: string;
    summary: string;
    stack: string[];
    status: string;
    href: string;
  };
  index: number;
}) {
  const isPlanned = item.href === '#';
  const Wrapper = isPlanned ? 'div' : 'a';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Wrapper
        {...(!isPlanned ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
        className={`group relative block rounded-2xl border border-line bg-gradient-to-b from-[rgba(14,19,30,0.7)] to-[rgba(7,10,17,0.5)] p-6 lg:p-7 transition-colors ${
          isPlanned ? 'opacity-60 cursor-default' : 'hover:border-line-strong'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-xs text-signal-primary tracking-wider">{item.index}</span>
          <span className="mono-label text-[10px] px-2.5 py-1 rounded-md bg-signal-plum/[0.08] border border-signal-plum/20 text-signal-plum">
            {item.kind}
          </span>
        </div>

        <h3 className="font-display text-2xl lg:text-[26px] font-light tracking-tight leading-tight mb-3 transition-colors group-hover:text-signal-primary">
          {item.title}
        </h3>
        <p className="text-ink-muted text-sm leading-relaxed mb-5">{item.summary}</p>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {item.stack.map((s) => (
              <span
                key={s}
                className="font-mono text-[10px] tracking-wide px-2 py-1 rounded-md bg-depth-1 border border-line text-ink-soft"
              >
                {s}
              </span>
            ))}
          </div>
          <span className="mono-label text-[9px] text-ink-faint flex items-center gap-1.5 shrink-0">
            <span className="relative w-1.5 h-1.5 rounded-full bg-signal-mint">
              {!isPlanned && (
                <span className="absolute inset-0 rounded-full bg-signal-mint animate-ping" />
              )}
            </span>
            {item.status}
          </span>
        </div>
      </Wrapper>
    </motion.div>
  );
}
