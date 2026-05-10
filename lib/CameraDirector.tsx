'use client';

/**
 * CameraDirector v2 — version performante.
 *
 * CHANGEMENTS PERFO vs v1 :
 *   - Plus AUCUN setState dans la boucle d'animation. Tout passe par des refs.
 *   - Les consommateurs (SceneBackground, SideDock) lisent la valeur à la frame
 *     via getCameraState(), sans re-render.
 *   - Pour les UI qui ont besoin de réagir (ex: dock highlight), on expose un
 *     useSection() séparé qui re-render UNIQUEMENT quand la section change
 *     (~7 fois sur toute la page, pas 60 fois par seconde).
 */

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react';

export type Shot = {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  fov: number;
  density?: number;
  mood?: number;
};

export const SHOTS: Shot[] = [
  { id: 'hero-establishing',  position: [0, 0, 8],     rotation: [-0.05, 0, 0],     fov: 60, density: 1,   mood: 1 },
  { id: 'profile-dive',       position: [-1.2, -2, 6.5], rotation: [-0.18, 0.12, 0],  fov: 55, density: 0.85, mood: 1 },
  { id: 'stack-ascending',    position: [0, -4.5, 9],   rotation: [0.18, 0, 0],      fov: 65, density: 0.7, mood: 1 },
  { id: 'work-survey',        position: [3, -6, 11],    rotation: [-0.06, -0.18, 0], fov: 58, density: 0.9, mood: 1 },
  { id: 'research-lab',       position: [-2, -8, 7.5],  rotation: [-0.1, 0.22, -0.04], fov: 70, density: 1.1, mood: 2 },
  { id: 'trajectory-pullout', position: [0, -10, 13],   rotation: [-0.04, 0, 0],     fov: 50, density: 0.6, mood: 0 },
  { id: 'contact-final',      position: [0, -12, 5],    rotation: [-0.12, 0, 0],     fov: 38, density: 0.5, mood: 1 },
];

const SECTION_IDS = ['identity', 'profile', 'stack', 'work', 'research', 'trajectory', 'contact'];

export type CameraState = {
  progress: number;
  sectionIndex: number;
  sectionProgress: number;
  current: Shot;
  velocity: number;
};

const defaultState: CameraState = {
  progress: 0,
  sectionIndex: 0,
  sectionProgress: 0,
  current: SHOTS[0],
  velocity: 0,
};

// Container ref-based partagé. Les consommateurs lisent via .current
type DirectorContext = {
  stateRef: React.MutableRefObject<CameraState>;
  // setSectionIndex appelé uniquement quand la section CHANGE (rare)
  subscribeSection: (cb: (i: number) => void) => () => void;
};

const CameraContext = createContext<DirectorContext | null>(null);

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpShot(a: Shot, b: Shot, t: number, out: Shot): void {
  // mutation in-place pour éviter les allocations (ramasse-miettes = saccade)
  out.position[0] = lerp(a.position[0], b.position[0], t);
  out.position[1] = lerp(a.position[1], b.position[1], t);
  out.position[2] = lerp(a.position[2], b.position[2], t);
  out.rotation[0] = lerp(a.rotation[0], b.rotation[0], t);
  out.rotation[1] = lerp(a.rotation[1], b.rotation[1], t);
  out.rotation[2] = lerp(a.rotation[2], b.rotation[2], t);
  out.fov = lerp(a.fov, b.fov, t);
  out.density = lerp(a.density ?? 1, b.density ?? 1, t);
  out.mood = lerp(a.mood ?? 1, b.mood ?? 1, t);
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function CameraDirectorProvider({ children }: { children: ReactNode }) {
  const stateRef = useRef<CameraState>({
    ...defaultState,
    current: {
      id: 'live',
      position: [...SHOTS[0].position] as [number, number, number],
      rotation: [...SHOTS[0].rotation] as [number, number, number],
      fov: SHOTS[0].fov,
      density: SHOTS[0].density,
      mood: SHOTS[0].mood,
    },
  });

  // Listeners pour les changements de section (re-render UI dock/header uniquement)
  const sectionListeners = useRef<Set<(i: number) => void>>(new Set());
  const lastSectionIndex = useRef(0);
  const lastY = useRef(0);
  const lastT = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    let mounted = true;
    let rafId = 0;

    function update() {
      if (!mounted) return;

      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docH > 0 ? Math.min(1, y / docH) : 0;
      const probe = y + window.innerHeight * 0.4;

      // Section actuelle
      let sectionIndex = 0;
      let sectionStart = 0;
      let sectionEnd = window.innerHeight;
      for (let i = 0; i < SECTION_IDS.length; i++) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (!el) continue;
        const top = el.offsetTop;
        const next = SECTION_IDS[i + 1] ? document.getElementById(SECTION_IDS[i + 1])?.offsetTop : undefined;
        const bottom = next ?? top + el.offsetHeight;
        if (probe >= top && probe < bottom) {
          sectionIndex = i;
          sectionStart = top;
          sectionEnd = bottom;
          break;
        }
        if (probe >= bottom) sectionIndex = i + 1;
      }
      sectionIndex = Math.min(sectionIndex, SHOTS.length - 1);

      const span = Math.max(1, sectionEnd - sectionStart);
      const sectionProgress = Math.max(0, Math.min(1, (probe - sectionStart) / span));
      const eased = easeInOutCubic(sectionProgress);

      const a = SHOTS[sectionIndex];
      const b = SHOTS[Math.min(sectionIndex + 1, SHOTS.length - 1)];
      lerpShot(a, b, eased, stateRef.current.current);

      // Velocity
      const now = performance.now();
      const dt = Math.max(1, now - lastT.current);
      const dy = y - lastY.current;
      const velocity = Math.abs(dy / dt);
      lastY.current = y;
      lastT.current = now;

      stateRef.current.progress = progress;
      stateRef.current.sectionIndex = sectionIndex;
      stateRef.current.sectionProgress = sectionProgress;
      stateRef.current.velocity = velocity;

      // Notifier UNIQUEMENT au changement de section
      if (sectionIndex !== lastSectionIndex.current) {
        lastSectionIndex.current = sectionIndex;
        sectionListeners.current.forEach((cb) => cb(sectionIndex));
      }

      rafId = requestAnimationFrame(update);
    }

    rafId = requestAnimationFrame(update);
    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  const subscribeSection = useCallback((cb: (i: number) => void) => {
    sectionListeners.current.add(cb);
    return () => {
      sectionListeners.current.delete(cb);
    };
  }, []);

  return (
    <CameraContext.Provider value={{ stateRef, subscribeSection }}>
      {children}
    </CameraContext.Provider>
  );
}

/** Pour les boucles useFrame — lit la state SANS re-render. */
export function useCameraStateRef(): React.MutableRefObject<CameraState> {
  const ctx = useContext(CameraContext);
  if (!ctx) throw new Error('useCameraStateRef must be used within CameraDirectorProvider');
  return ctx.stateRef;
}

/** Pour l'UI qui doit savoir quand on change de section (dock, transitions). */
export function useSection(): number {
  const ctx = useContext(CameraContext);
  const [section, setSection] = useState(0);

  useEffect(() => {
    if (!ctx) return;
    return ctx.subscribeSection(setSection);
  }, [ctx]);

  return section;
}

/** Pour le ScrollProgress — lit le progress en temps réel via une boucle interne légère. */
export function useScrollProgressFromDirector(): React.MutableRefObject<number> {
  const ctx = useContext(CameraContext);
  const ref = useRef(0);

  useEffect(() => {
    if (!ctx) return;
    let rafId = 0;
    const tick = () => {
      ref.current = ctx.stateRef.current.progress;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ctx]);

  return ref;
}
