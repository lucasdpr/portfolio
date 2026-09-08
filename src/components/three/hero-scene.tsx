"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import type { Mesh } from "three";

function AnimatedShape() {
  const meshRef = useRef<Mesh>(null);
  const reduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (reduceMotion || !meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.22;
  });

  return (
    <Float
      speed={reduceMotion ? 0 : 1.4}
      rotationIntensity={reduceMotion ? 0 : 0.4}
      floatIntensity={reduceMotion ? 0 : 0.8}
    >
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <MeshDistortMaterial
          color="#22d3ee"
          distort={reduceMotion ? 0 : 0.35}
          speed={reduceMotion ? 0 : 1.4}
          roughness={0.2}
          metalness={0.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/**
 * Cena 3D decorativa do Hero. Só roda no cliente (WebGL não existe no
 * servidor) — por isso é importada com `next/dynamic({ ssr: false })` em
 * `hero.tsx`, nunca diretamente.
 */
export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[-4, -2, -4]} intensity={0.5} color="#ffffff" />
      <Suspense fallback={null}>
        <AnimatedShape />
        <Sparkles count={60} scale={5} size={2} speed={0.3} color="#22d3ee" opacity={0.5} />
      </Suspense>
    </Canvas>
  );
}
