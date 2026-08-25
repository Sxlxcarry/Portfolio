'use client';

import { ReactNode } from 'react';

export default function SectionShell({
  id,
  children,
  className = '',
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative py-32 lg:py-40 ${className}`}
      style={{ perspective: '1500px' }}
    >
      <div className="container-x relative">{children}</div>
    </section>
  );
}
