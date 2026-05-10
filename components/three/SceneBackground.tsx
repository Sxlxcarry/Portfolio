'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion, useIsMobile } from '@/lib/hooks';
import { useCameraStateRef } from '@/lib/CameraDirector';

/**
 * SceneBackground v3 — performance-first.
 * - Lit l'état caméra via useCameraStateRef (zéro re-render).
 * - Compte de nœuds réduit (35 au lieu de 50), packets réduits (12 au lieu de 18).
 * - Toutes les couleurs sont précalculées (pas d'allocation de Color par frame).
 * - Pas de lerp() Color en frame critique : on switch en saut doux toutes 5 frames.
 */

const COLOR_PRIMARY = new THREE.Color(0x7dd3fc);
const COLOR_MINT    = new THREE.Color(0xa5f3d0);
const COLOR_CORAL   = new THREE.Color(0xfb7185);
const COLOR_PLUM    = new THREE.Color(0xc4b5fd);

function CinematicCameraDriver({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const stateRef = useCameraStateRef();

  useFrame(() => {
    const { current } = stateRef.current;
    const mx = mouse.current.x;
    const my = mouse.current.y;

    const targetX = current.position[0] + mx * 0.11;
    const targetY = current.position[1] - my * 0.07;
    const targetZ = current.position[2];

    const targetRotX = current.rotation[0] - my * 0.04;
    const targetRotY = current.rotation[1] + mx * 0.04;
    const targetRotZ = current.rotation[2];

    const ease = 0.06;
    camera.position.x += (targetX - camera.position.x) * ease;
    camera.position.y += (targetY - camera.position.y) * ease;
    camera.position.z += (targetZ - camera.position.z) * ease;
    camera.rotation.x += (targetRotX - camera.rotation.x) * ease;
    camera.rotation.y += (targetRotY - camera.rotation.y) * ease;
    camera.rotation.z += (targetRotZ - camera.rotation.z) * ease;

    if ('fov' in camera) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov += (current.fov - cam.fov) * ease;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

function NetworkConstellation({
  count = 35,
  mouse,
}: {
  count?: number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const stateRef = useCameraStateRef();
  const frameCount = useRef(0);

  // Précalcul nodes/edges (jamais recalculé)
  const { nodes, edges, lineGeo } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 28,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 6
        )
      );
    }
    const edges: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    nodes.forEach((n, i) => {
      const sorted = nodes
        .map((m, j) => ({ j, d: i === j ? Infinity : n.distanceTo(m) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      sorted.forEach(({ j }) => {
        if (
          !edges.some(
            (l) => (l.a === nodes[i] && l.b === nodes[j]) || (l.a === nodes[j] && l.b === nodes[i])
          )
        ) {
          edges.push({ a: nodes[i], b: nodes[j] });
        }
      });
    });
    const positions: number[] = [];
    edges.forEach((e) => {
      positions.push(e.a.x, e.a.y, e.a.z, e.b.x, e.b.y, e.b.z);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return { nodes, edges, lineGeo };
  }, [count]);

  // Géométries partagées (une seule allocation pour TOUS les nodes)
  const nodeGeometry = useMemo(() => new THREE.SphereGeometry(0.06, 6, 6), []);
  const packetGeometry = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);

  const packetCount = 12;
  const packetMesh = useRef<THREE.InstancedMesh>(null!);
  const packetState = useRef(
    Array.from({ length: packetCount }, () => ({
      edge: Math.floor(Math.random() * Math.max(1, edges.length)),
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.25,
    }))
  );

  // Object3D dummy partagé (pas alloué en frame)
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lineMat = useRef<THREE.LineBasicMaterial>(null!);
  const packetMat = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame((state, delta) => {
    frameCount.current++;

    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.05) * 0.04 + mouse.current.x * 0.06;
      groupRef.current.rotation.x = mouse.current.y * 0.04;
    }

    if (packetMesh.current && edges.length > 0) {
      packetState.current.forEach((p, i) => {
        p.t += delta * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = Math.floor(Math.random() * edges.length);
          p.speed = 0.15 + Math.random() * 0.25;
        }
        const e = edges[p.edge];
        if (!e) return;
        dummy.position.lerpVectors(e.a, e.b, p.t);
        dummy.scale.setScalar(0.06);
        dummy.updateMatrix();
        packetMesh.current.setMatrixAt(i, dummy.matrix);
      });
      packetMesh.current.instanceMatrix.needsUpdate = true;
    }

    // Mood shift : on update les couleurs SEULEMENT toutes 12 frames (~5fps)
    if (frameCount.current % 12 === 0) {
      const mood = stateRef.current.current.mood ?? 1;
      const targetLine = mood >= 1.5 ? COLOR_CORAL : mood < 0.5 ? COLOR_PLUM : COLOR_PRIMARY;
      const targetPkt  = mood >= 1.5 ? COLOR_CORAL : COLOR_MINT;
      if (lineMat.current) lineMat.current.color.lerp(targetLine, 0.1);
      if (packetMat.current) packetMat.current.color.lerp(targetPkt, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial ref={lineMat} color="#7dd3fc" transparent opacity={0.18} />
      </lineSegments>

      {nodes.map((n, i) => (
        <mesh key={i} position={n} geometry={nodeGeometry}>
          <meshBasicMaterial color="#cbe7ff" />
        </mesh>
      ))}

      <instancedMesh ref={packetMesh} args={[packetGeometry, undefined, packetCount]}>
        <meshBasicMaterial ref={packetMat} color="#a5f3d0" />
      </instancedMesh>
    </group>
  );
}

function ParticleField({ count = 100 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 + 6;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      // Rotation lente uniquement (moins coûteux)
      ref.current.rotation.y = state.clock.elapsedTime * 0.012;
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

function LightBeam() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.4;
      ref.current.position.y = -3 + Math.sin(state.clock.elapsedTime * 0.1) * 2;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -8]}>
      <planeGeometry args={[2, 40]} />
      <meshBasicMaterial color="#7dd3fc" transparent opacity={0.04} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

export default function SceneBackground() {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    let rafScheduled = false;
    let nextX = 0, nextY = 0;
    const onMove = (e: MouseEvent) => {
      nextX = (e.clientX / window.innerWidth - 0.5) * 2;
      nextY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(() => {
          mouse.current.x = nextX;
          mouse.current.y = nextY;
          rafScheduled = false;
        });
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!mounted || reduceMotion || isMobile) return null;

  return (
    <div className="fixed inset-0 -z-30 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false, depth: false }}
        dpr={[1, 1.25]}
        frameloop="always"
      >
        <CinematicCameraDriver mouse={mouse} />
        <LightBeam />
        <group position={[0, 0, -4]}>
          <NetworkConstellation count={35} mouse={mouse} />
        </group>
        <ParticleField count={100} />
      </Canvas>
    </div>
  );
}
