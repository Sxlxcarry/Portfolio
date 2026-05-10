'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/lib/hooks';
import { CameraDirectorProvider } from '@/lib/CameraDirector';

import Intro from './Intro';
import Header from './Header';
import Footer from './Footer';
import SideDock from './SideDock';

const SceneBackground = lazy(() => import('@/components/three/SceneBackground'));

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
  const [scene3DReady, setScene3DReady] = useState(false);

  // Lenis smooth scroll
  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1.05,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [reduceMotion]);

  // Différer le boot Three.js : on n'allume la scène qu'une fois
  // l'intro finie ET que le navigateur est libre (idle).
  useEffect(() => {
    if (!introDone || reduceMotion) return;
    if (typeof window === 'undefined') return;

    const idleCb = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (idleCb) {
      const id = idleCb(() => setScene3DReady(true), { timeout: 1500 });
      return () => {
        const cancel = (window as Window & {
          cancelIdleCallback?: (id: number) => void;
        }).cancelIdleCallback;
        cancel?.(id);
      };
    } else {
      // Fallback : timeout de 400ms après l'intro
      const t = setTimeout(() => setScene3DReady(true), 400);
      return () => clearTimeout(t);
    }
  }, [introDone, reduceMotion]);

  return (
    <CameraDirectorProvider>
      {/* WebGL background — chargé en idle après l'intro */}
      <Suspense fallback={null}>{scene3DReady && <SceneBackground />}</Suspense>

      <div
        aria-hidden
        className="fixed inset-0 -z-20 tech-grid pointer-events-none opacity-40"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 90%)',
        }}
      />

      <GrainOverlay />
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <Letterbox introDone={introDone} />
      <CursorBeacon />
      <Intro onDone={() => setIntroDone(true)} />

      <Header />
      <ScrollProgress />
      <SideDock />

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
    </CameraDirectorProvider>
  );
}

function Letterbox({ introDone }: { introDone: boolean }) {
  if (!introDone) return null;
  return (
    <>
      <div aria-hidden className="fixed top-0 left-0 right-0 h-3 bg-gradient-to-b from-depth-0 to-transparent pointer-events-none z-30" />
      <div aria-hidden className="fixed bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-depth-0 to-transparent pointer-events-none z-30" />
    </>
  );
}
