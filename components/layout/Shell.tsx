'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/hooks';

import Intro from './Intro';
import Header from './Header';
import Footer from './Footer';

// Background WebGL — chargé en lazy (côté client uniquement)
const SceneBackground = lazy(() => import('@/components/three/SceneBackground'));

// Sections
import Hero from '@/components/sections/Hero';
import Profile from '@/components/sections/Profile';
import Stack from '@/components/sections/Stack';
import Work from '@/components/sections/Work';
import Research from '@/components/sections/Research';
import Trajectory from '@/components/sections/Trajectory';
import Contact from '@/components/sections/Contact';

import GrainOverlay from '@/components/effects/GrainOverlay';
import ScrollProgress from '@/components/effects/ScrollProgress';
import CursorBeacon from '@/components/effects/CursorBeacon';

export default function Shell() {
  const reduceMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);

  // Lenis smooth scroll
  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [reduceMotion]);

  return (
    <>
      {/* Couche -3 : WebGL background scene (3D plans en profondeur) */}
      <Suspense fallback={null}>
        {introDone && <SceneBackground />}
      </Suspense>

      {/* Couche -2 : grille technique CSS (fallback + ajout au WebGL) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-20 tech-grid pointer-events-none opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%)',
        }}
      />

      {/* Couche -1 : grain noise overlay */}
      <GrainOverlay />

      {/* Vignette de bordure */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Cursor beacon (desktop) */}
      <CursorBeacon />

      {/* Intro cinématique */}
      <Intro onDone={() => setIntroDone(true)} />

      {/* Layer principale */}
      <Header />
      <ScrollProgress />

      <main className="relative z-10">
        <Hero />
        <Profile />
        <Stack />
        <Work />
        <Research />
        <Trajectory />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
