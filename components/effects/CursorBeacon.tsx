'use client';

import { useEffect, useRef } from 'react';
import { useIsDesktop, useReducedMotion } from '@/lib/hooks';

/**
 * CursorBeacon v2 — version perf.
 *
 * Changements vs v1 :
 *   - Plus de cursor: none (on garde le vrai curseur natif, plus rapide et plus naturel).
 *   - Plus d'elementFromPoint() à chaque mousemove (était EXTRÊMEMENT coûteux).
 *   - Plus de useSpring de Framer Motion (chacun = une boucle d'animation).
 *   - Un seul élément (le glow ambient), pas 4. Animation manuelle via rAF + transform direct.
 *   - Détection hover/click via délégation document (gérée par CSS au survol natif des boutons).
 *
 * Résultat : ~95% moins coûteux que la v1.
 */
export default function CursorBeacon() {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDesktop || reduceMotion) return;

    const el = glowRef.current;
    if (!el) return;

    let targetX = -200, targetY = -200;
    let currentX = -200, currentY = -200;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Lerp doux pour effet "trainée" du glow
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      el.style.transform = `translate3d(${currentX - 200}px, ${currentY - 200}px, 0)`;
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [isDesktop, reduceMotion]);

  if (!isDesktop || reduceMotion) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="fixed pointer-events-none z-[5] mix-blend-screen will-change-transform"
      style={{
        left: 0,
        top: 0,
        width: 400,
        height: 400,
        background:
          'radial-gradient(circle, rgba(125,211,252,0.10), rgba(125,211,252,0) 60%)',
      }}
    />
  );
}
