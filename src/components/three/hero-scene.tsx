"use client";

import { Suspense, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { AdditiveBlending, MathUtils, type Group, type Mesh, type Points } from "three";

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";

/** Anel de partículas em espiral ao redor do núcleo. */
function ParticleRing({ count = 900 }: { count?: number }) {
  const pointsRef = useRef<Points>(null);
  const reduceMotion = useReducedMotion();

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    // Pseudo-aleatório determinístico: mesma nuvem a cada render, sem
    // chamar Math.random() durante a renderização.
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 2.3 + (rand() - 0.5) * 0.9;
      data[i * 3] = Math.cos(angle) * radius;
      data[i * 3 + 1] = (rand() - 0.5) * 0.35;
      data[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return data;
  }, [count]);

  useFrame((_, delta) => {
    if (reduceMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.12;
  });

  return (
    <points ref={pointsRef} rotation={[0.45, 0, 0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color={VIOLET}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Core() {
  const coreRef = useRef<Mesh>(null);
  const shellRef = useRef<Mesh>(null);
  const reduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (reduceMotion) return;
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.2;
    if (shellRef.current) {
      shellRef.current.rotation.x -= delta * 0.08;
      shellRef.current.rotation.y -= delta * 0.12;
    }
  });

  return (
    <Float speed={reduceMotion ? 0 : 1.4} rotationIntensity={reduceMotion ? 0 : 0.3} floatIntensity={reduceMotion ? 0 : 0.7}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.05, 96, 96]} />
        <MeshDistortMaterial
          color="#0891b2"
          emissive="#1e1b4b"
          emissiveIntensity={0.4}
          distort={reduceMotion ? 0 : 0.42}
          speed={reduceMotion ? 0 : 1.8}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      <mesh ref={shellRef} scale={1.65}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.22} />
      </mesh>
    </Float>
  );
}

/** Inclina a cena inteira na direção do mouse, com suavização. */
function PointerRig({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group>(null);
  const reduceMotion = useReducedMotion();

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group || reduceMotion) return;
    group.rotation.y = MathUtils.damp(group.rotation.y, state.pointer.x * 0.5, 3, delta);
    group.rotation.x = MathUtils.damp(group.rotation.x, -state.pointer.y * 0.35, 3, delta);
  });

  return <group ref={groupRef}>{children}</group>;
}

/**
 * Cena 3D decorativa do Hero. Só roda no cliente (WebGL não existe no
 * servidor) — por isso é importada com `next/dynamic({ ssr: false })` em
 * `hero.tsx`, nunca diretamente.
 */
export function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      // Fora da tela, para de renderizar (economiza bateria/GPU).
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      // Mouse em qualquer parte da página move a cena, não só em cima do canvas.
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={60} color={VIOLET} />
      <pointLight position={[4, -3, 1]} intensity={40} color="#f472b6" />
      <Suspense fallback={null}>
        <PointerRig>
          <Core />
          <ParticleRing />
        </PointerRig>
        <Sparkles count={50} scale={6} size={2} speed={0.3} color={CYAN} opacity={0.5} />
      </Suspense>
    </Canvas>
  );
}
