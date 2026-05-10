'use client';

import { useState, FormEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import { CONTACT, PROFILE } from '@/lib/content';
import SectionShell from '@/components/ui/SectionShell';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const { lang } = useLang();
  const t = CONTACT[lang];
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const data = new FormData(e.currentTarget);
      const res = await fetch(t.formspree, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('sent');
        e.currentTarget.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const statusText =
    status === 'sending' ? t.sending : status === 'sent' ? t.sent : status === 'error' ? t.error : '';
  const statusColor =
    status === 'sent'
      ? 'text-signal-mint'
      : status === 'error'
      ? 'text-signal-coral'
      : 'text-ink-muted';

  return (
    <SectionShell id="contact">
      <SectionTitle
        chapter={t.chapter}
        label={t.label}
        title={t.title}
        titleEm={t.titleEm}
        desc={t.desc}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Form */}
        <Reveal>
          <div className="relative p-7 lg:p-9 rounded-3xl border border-line bg-gradient-to-b from-[rgba(14,19,30,0.6)] to-[rgba(7,10,17,0.4)] backdrop-blur-md">
            <form onSubmit={onSubmit} className="flex flex-col gap-3.5" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <Field name="name" placeholder={t.fields.name} required />
                <Field name="email" type="email" placeholder={t.fields.email} required />
              </div>
              <Field name="subject" placeholder={t.fields.subject} required />
              <Field name="message" placeholder={t.fields.message} required textarea />

              <div className="flex items-center gap-4 flex-wrap mt-1">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-medium border border-signal-primary/40 bg-gradient-to-b from-signal-primary/15 to-signal-primary/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(125,211,252,0.35)] disabled:opacity-60"
                >
                  <span className="relative z-10">{t.fields.send}</span>
                  <svg
                    className="relative z-10 transition-transform group-hover:translate-x-1"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-signal-primary/20 to-transparent" />
                </button>

                {statusText && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mono-label text-[11px] ${statusColor}`}
                  >
                    {statusText}
                  </motion.span>
                )}
              </div>
            </form>
          </div>
        </Reveal>

        {/* Side */}
        <Reveal delay={0.2}>
          <div className="p-7 lg:p-9 rounded-3xl border border-line bg-depth-2/60 backdrop-blur-md">
            <div className="mono-label text-ink-muted mb-4">{t.side.label}</div>
            <p className="text-ink-soft text-sm leading-relaxed mb-7">{t.side.desc}</p>

            <div className="space-y-2.5">
              <Coord label="EMAIL" val={PROFILE.email} />
              <Coord label="LOC" val={PROFILE.location} />
              <Coord label="STATUS" val={lang === 'fr' ? 'Disponible · 2026' : 'Available · 2026'} />
            </div>

            <div className="mt-7 flex gap-2.5">
              <IconLink href={PROFILE.github} label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.85 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.58 2.36 1.13 2.94.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.15 9.15 0 015 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z" />
                </svg>
              </IconLink>
              <IconLink href={PROFILE.linkedin} label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 9h3v9H6zM7.5 6.5A1.5 1.5 0 107.5 3a1.5 1.5 0 000 3.5zM11 9h3v1.3c.42-.8 1.5-1.5 2.8-1.5 3 0 3.7 1.9 3.7 4.4V18h-3v-3.9c0-1-.02-2.3-1.4-2.3s-1.7 1.1-1.7 2.2V18h-3V9z" />
                </svg>
              </IconLink>
              <IconLink
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE.email}`}
                label="Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </IconLink>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

function Field({
  name,
  type = 'text',
  placeholder,
  required,
  textarea,
}: {
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const cls =
    'w-full px-4 py-3.5 rounded-xl bg-depth-1 border border-line text-ink text-sm transition-all placeholder:text-ink-faint focus:border-signal-primary focus:bg-depth-2 focus:ring-2 focus:ring-signal-primary/15';
  return textarea ? (
    <textarea name={name} required={required} placeholder={placeholder} className={`${cls} min-h-[140px] resize-y`} />
  ) : (
    <input name={name} type={type} required={required} placeholder={placeholder} className={cls} />
  );
}

function Coord({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-depth-1 border border-line">
      <span className="mono-label text-ink-muted text-[10px] mr-auto">{label}</span>
      <span className="font-mono text-xs text-signal-primary truncate">{val}</span>
    </div>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="w-11 h-11 rounded-xl grid place-items-center border border-line bg-depth-2 hover:border-signal-primary hover:text-signal-primary hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(125,211,252,0.3)] transition-all"
    >
      {children}
    </a>
  );
}
