'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion, useIsMobile } from '@/lib/hooks';

/**
 * SceneBackground — couches de "réseau" superposées en profondeur.
 * 3 plans WebGL (loin, moyen, proche) avec :
 *   - Layer LOIN : grille technique étendue
 *   - Layer MID  : graphe nodes/edges (Network constellation)
 *   - Layer NEAR : paquets flottants (point cloud)
 * La caméra recule légèrement et tilte au scroll → sensation de traversée.
 */

function ScrollDriver({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    // Range typique : 0 → ~5000px scroll
    const t = Math.min(1, scrollY.current / 4500);
    // Caméra recule + descend
    const targetZ = 8 + t * 6;
    const targetY = -t * 3;
    const targetRotX = -t * 0.18;
    camera.position.z += (targetZ - camera.position.z) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.rotation.x += (targetRotX - camera.rotation.x) * 0.06;
  });
  return null;
}

function GridLayer({ z, color, opacity }: { z: number; color: string; opacity: number }) {
  const ref = useRef<THREE.GridHelper>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z = z + Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
  });
  return (
    <gridHelper
      ref={ref}
      args={[60, 30, color, color]}
      rotation={[Math.PI / 2.2, 0, 0]}
      position={[0, 0, z]}
    >
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </gridHelper>
  );
}

function NetworkConstellation({ count = 60 }: { count?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const nodes = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 28,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 6
        )
      );
    }
    return arr;
  }, [count]);

  // edges : chaque nœud connecté à ses 2 plus proches
  const edges = useMemo(() => {
    const lines: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    nodes.forEach((n, i) => {
      const sorted = nodes
        .map((m, j) => ({ j, d: i === j ? Infinity : n.distanceTo(m) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      sorted.forEach(({ j }) => {
        if (!lines.some((l) => (l.a === nodes[i] && l.b === nodes[j]) || (l.a === nodes[j] && l.b === nodes[i]))) {
          lines.push({ a: nodes[i], b: nodes[j] });
        }
      });
    });
    return lines;
  }, [nodes]);

  // Géométrie groupée pour les edges
  const lineGeo = useMemo(() => {
    const positions: number[] = [];
    edges.forEach((e) => {
      positions.push(e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [edges]);

  // Particules (paquets) qui voyagent sur les arêtes
  const packetCount = 18;
  const packetMesh = useRef<THREE.InstancedMesh>(null!);
  const packetState = useRef(
    Array.from({ length: packetCount }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.25,
    }))
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.04;
    }
    if (packetMesh.current && edges.length > 0) {
      const dummy = new THREE.Object3D();
      packetState.current.forEach((p, i) => {
        p.t += delta * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = Math.floor(Math.random() * edges.length);
          p.speed = 0.15 + Math.random() * 0.25;
        }
        const e = edges[p.edge];
        dummy.position.lerpVectors(e.a, e.b, p.t);
        dummy.scale.setScalar(0.06);
        dummy.updateMatrix();
        packetMesh.current.setMatrixAt(i, dummy.matrix);
      });
      packetMesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#7dd3fc" transparent opacity={0.18} />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#cbe7ff" />
        </mesh>
      ))}

      {/* Packets */}
      <instancedMesh ref={packetMesh} args={[undefined, undefined, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#a5f3d0" />
      </instancedMesh>
    </group>
  );
}

function ParticleField({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 + 6; // près de la caméra
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#7dd3fc"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function SceneBackground() {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const scrollY = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!mounted || reduceMotion || isMobile) return null;

  return (
    <div className="fixed inset-0 -z-30 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ScrollDriver scrollY={scrollY} />

        {/* Couche LOIN — grille très étendue */}
        <GridLayer z={-12} color="#1a4060" opacity={0.4} />

        {/* Couche MID — graphe réseau */}
        <group position={[0, 0, -4]}>
          <NetworkConstellation count={50} />
        </group>

        {/* Couche NEAR — particules */}
        <ParticleField count={150} />

        {/* Lumière ambiante */}
        <ambientLight intensity={0.4} />
      </Canvas>
    </div>
  );
}
