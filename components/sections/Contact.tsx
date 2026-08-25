'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { CONTACT, PROFILE } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const { lang } = useLang();
  const t = CONTACT[lang];
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    try {
      const res = await fetch(t.formspree, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <SectionShell id="contact">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        desc={t.desc}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={onSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-line bg-depth-2 p-6 lg:p-7"
        >
          <Field name="name" type="text" label={t.fields.name} required />
          <Field name="email" type="email" label={t.fields.email} required />
          <div className="sm:col-span-2">
            <Field name="subject" type="text" label={t.fields.subject} required />
          </div>
          <div className="sm:col-span-2">
            <label className="mono-label text-ink-muted text-[10px] block mb-2">
              {t.fields.message}
            </label>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full rounded-xl border border-line bg-depth-1 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal-primary/50 transition-colors resize-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-medium border border-signal-primary/40 bg-gradient-to-b from-signal-primary/15 to-signal-primary/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(125,211,252,0.35)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {status === 'sending' ? t.sending : t.fields.send}
            </button>

            {status === 'sent' && (
              <span className="text-signal-mint text-sm">{t.sent}</span>
            )}
            {status === 'error' && (
              <span className="text-signal-coral text-sm">{t.error}</span>
            )}
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-line bg-depth-2 p-6 lg:p-7"
        >
          <div className="mono-label text-ink-muted text-[10px] mb-4">{t.side.label}</div>
          <p className="text-ink-muted text-sm leading-relaxed mb-6">{t.side.desc}</p>

          <div className="space-y-3">
            <ContactLink href={`mailto:${PROFILE.email}`} label={PROFILE.email} />
            <ContactLink href={PROFILE.github} label="GitHub" />
            <ContactLink href={PROFILE.linkedin} label="LinkedIn" />
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

function Field({
  name,
  type,
  label,
  required,
}: {
  name: string;
  type: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mono-label text-ink-muted text-[10px] block mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-depth-1 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-signal-primary/50 transition-colors"
      />
    </div>
  );
}

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-line bg-depth-1 text-sm text-ink-soft transition-colors hover:border-signal-primary/40 hover:text-ink"
    >
      <span className="truncate">{label}</span>
      <svg
        className="shrink-0 transition-transform group-hover:translate-x-1"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </a>
  );
}
