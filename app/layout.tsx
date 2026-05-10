import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import { LangProvider } from '@/lib/i18n';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '800'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kylian Honorine — Network & Security Engineer',
  description:
    'Portfolio de Kylian Honorine — étudiant alternant en cybersécurité, infrastructure et administration réseau. Études de cas et recherche.',
  themeColor: '#04060a',
  openGraph: {
    title: 'Kylian Honorine — Network & Security Engineer',
    description: 'Portfolio · Cybersécurité · Infrastructure · Réseaux',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
