'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * IcoAvatar v3 — "Core" géométrique multicouches.
 *
 * Visuel :
 *   - Icosaèdre wireframe niveau 1 (42 sommets, 80 triangles) — la couche principale
 *   - Dodécaèdre wireframe imbriqué légèrement plus grand, contre-rotation
 *   - Halo radial (1 plane sprite) qui pulse
 *   - 3 orbites en perspective avec dot lumineux
 *   - 60 particules constellation
 *
 * Perf :
 *   - frameloop="never" quand pas visible (IntersectionObserver) → 0 GPU ailleurs
 *   - antialias off, dpr 1.25, no depth/stencil
 *   - Toutes géométries précalculées via useMemo
 *   - Materiaux additifs pour un glow gratuit (pas besoin de post-process)
 *   - Pas de useState dans la frame loop
 */

function CoreShape({ mouseRef }: { mouseRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const icoRef = useRef<THREE.LineSegments>(null!);
  const dodecaRef = useRef<THREE.LineSegments>(null!);

  useFrame((_, delta) => {
    // Rotations légères, continues. Très peu de calcul.
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.18 + mouseRef.current.y * 0.004;
      icoRef.current.rotation.y += delta * 0.25 + mouseRef.current.x * 0.004;
    }
    if (dodecaRef.current) {
      // Contre-rotation pour effet "double mouvement"
      dodecaRef.current.rotation.x -= delta * 0.10;
      dodecaRef.current.rotation.y -= delta * 0.13;
      dodecaRef.current.rotation.z += delta * 0.05;
    }
  });

  // Geometries : niveau 1 = riche visuellement mais reste léger
  const icoWire = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.3, 1);
    return new THREE.WireframeGeometry(ico);
  }, []);
  const dodecaWire = useMemo(() => {
    const dodeca = new THREE.DodecahedronGeometry(1.6, 0);
    return new THREE.WireframeGeometry(dodeca);
  }, []);

  return (
    <group>
      {/* Halo central additif — un seul plane sprite */}
      <mesh>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Icosaèdre principal */}
      <lineSegments ref={icoRef} geometry={icoWire}>
        <lineBasicMaterial color="#7dd3fc" transparent opacity={0.95} />
      </lineSegments>

      {/* Dodécaèdre extérieur, contre-rotation, plus pâle */}
      <lineSegments ref={dodecaRef} geometry={dodecaWire}>
        <lineBasicMaterial color="#a5f3d0" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

function GlowSprite() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      // Pulse doux 4s
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
      ref.current.scale.set(s, s, 1);
    }
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial
        color="#7dd3fc"
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        map={useGlowTexture()}
      />
    </mesh>
  );
}

/** Texture de glow radial générée en CPU une seule fois */
function useGlowTexture(): THREE.Texture {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(125,211,252,0.9)');
    grad.addColorStop(0.4, 'rgba(125,211,252,0.3)');
    grad.addColorStop(1, 'rgba(125,211,252,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

function Orbit({ radius, speed, color, tilt }: { radius: number; speed: number; color: string; tilt: number }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
      ref.current.rotation.z = tilt;
    }
  });

  const ringGeo = useMemo(
    () => new THREE.RingGeometry(radius - 0.004, radius + 0.004, 64),
    [radius]
  );
  const dotGeo = useMemo(() => new THREE.SphereGeometry(0.06, 10, 10), []);

  return (
    <group ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]} geometry={ringGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[radius, 0, 0]} geometry={dotGeo}>
        <meshBasicMaterial color={color} transparent />
      </mesh>
      {/* Petit halo additif autour du dot */}
      <mesh position={[radius, 0, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Constellation() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const COUNT = 60;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.6 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.045;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={60} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a5f3d0" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export default function IcoAvatar() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => setIsVisible(entries[0].isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);

    let rafScheduled = false;
    let nextX = 0, nextY = 0;
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      // Influence souris seulement quand elle est proche du container
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      nextX = Math.max(-2, Math.min(2, dx * 2));
      nextY = Math.max(-2, Math.min(2, dy * 2));
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(() => {
          mouseRef.current.x = nextX;
          mouseRef.current.y = nextY;
          rafScheduled = false;
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  if (!mounted) return <div className="w-full aspect-square max-w-md mx-auto" />;

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-md mx-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, alpha: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.25]}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <GlowSprite />
        <Constellation />
        <CoreShape mouseRef={mouseRef} />
        <Orbit radius={2} speed={0.4} color="#7dd3fc" tilt={0.3} />
        <Orbit radius={2.4} speed={-0.3} color="#a5f3d0" tilt={-0.5} />
        <Orbit radius={2.85} speed={0.2} color="#c4b5fd" tilt={1} />
      </Canvas>

      {/* Overlay corner brackets pour donner du contexte HUD */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t border-l border-signal-primary/30 pointer-events-none" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t border-r border-signal-primary/30 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b border-l border-signal-primary/30 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b border-r border-signal-primary/30 pointer-events-none" />
    </div>
  );
}
