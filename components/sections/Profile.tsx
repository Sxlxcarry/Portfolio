'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { PROFILE_SECTION } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

export default function Profile() {
  const { lang } = useLang();
  const t = PROFILE_SECTION[lang];

  return (
    <SectionShell id="profile">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        titleEnd={t.titleEnd}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
        <div className="space-y-6">
          {t.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-ink-soft text-base lg:text-lg leading-relaxed text-balance"
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-line bg-depth-2 p-6 lg:p-7"
        >
          <div className="mono-label text-ink-muted text-[10px] mb-4">Domaines · Outils</div>
          <div className="flex flex-wrap gap-2">
            {t.chips.map((chip, i) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="font-mono text-[11px] tracking-wide px-3 py-1.5 rounded-md bg-depth-1 border border-line text-ink-soft"
              >
                {chip}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
