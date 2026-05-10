'use client';

export default function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none noise-overlay opacity-30 mix-blend-overlay"
    />
  );
}
