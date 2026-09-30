"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import {
  MathUtils,
  Object3D,
  SRGBColorSpace,
  Vector3,
  type Group,
  type InstancedMesh,
  type MeshBasicMaterial,
  type Texture,
} from "three";

/* ---------- Linha do tempo (0 → 1 = rolagem da seção inteira) ----------- */

/** Progresso de 0 a 1 dentro do trecho [start, end] da rolagem. */
export function segment(progress: number, start: number, end: number) {
  return MathUtils.clamp((progress - start) / (end - start), 0, 1);
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Janelas de cada tela: [entra, some]. A última fica até o fim.
export const SCREEN_WINDOWS: [number, number][] = [
  [0.22, 0.54],
  [0.54, 0.76],
  [0.76, 1.01],
];
const FADE = 0.04;
const LID_OPEN = [0.08, 0.3] as const;

/* ---------- Medidas do notebook (unidades da cena) ---------------------- */

const BASE = { w: 3.3, h: 0.09, d: 2.25 };
const LID = { w: 3.3, h: 2.15, t: 0.05 };
const SCREEN = { w: 2.98, h: 1.86 }; // 16:10
const HINGE = new Vector3(0, BASE.h, -BASE.d / 2 + 0.03);
const LID_CLOSED = Math.PI / 2;
const LID_OPENED = -0.3;

const ALUMINUM = { color: "#c9ccd3", metalness: 0.92, roughness: 0.3 };

/* ---------- Teclado: ~70 teclas numa única instancedMesh --------------- */

function Keyboard() {
  const ref = useRef<InstancedMesh>(null);
  const keys = useMemo(() => {
    const list: { x: number; z: number; w: number }[] = [];
    const cols = 14;
    const size = 0.172;
    const gap = 0.024;
    const startX = -((cols * (size + gap)) - gap) / 2 + size / 2;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < cols; col++) {
        list.push({ x: startX + col * (size + gap), z: -0.78 + row * (size + gap), w: size });
      }
    }
    // Barra de espaço
    list.push({ x: 0, z: -0.78 + 5 * (size + gap), w: 1.1 });
    return list;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new Object3D();
    keys.forEach((key, index) => {
      dummy.position.set(key.x, BASE.h + 0.006, key.z);
      dummy.scale.set(key.w, 1, 0.155);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [keys]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, keys.length]}>
      <boxGeometry args={[1, 0.012, 1]} />
      <meshStandardMaterial color="#141417" roughness={0.6} metalness={0.2} />
    </instancedMesh>
  );
}

/* ---------- Telas: prints dos projetos com recorte "cover" -------------- */

/** Recorta a imagem pra preencher 16:10 sem distorcer, ancorada em cima/esquerda. */
function coverTexture(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  const image = texture.image as { width: number; height: number } | undefined;
  if (!image?.width) return;
  const imageAspect = image.width / image.height;
  const screenAspect = SCREEN.w / SCREEN.h;
  if (imageAspect > screenAspect) {
    texture.repeat.set(screenAspect / imageAspect, 1);
    texture.offset.set(0, 0);
  } else {
    const repeatY = imageAspect / screenAspect;
    texture.repeat.set(1, repeatY);
    texture.offset.set(0, 1 - repeatY);
  }
}

function Screens({ urls, progress }: { urls: string[]; progress: MotionValue<number> }) {
  const textures = useTexture(urls, (loaded) => {
    (Array.isArray(loaded) ? loaded : [loaded]).forEach(coverTexture);
  });
  const materials = useRef<(MeshBasicMaterial | null)[]>([]);

  useFrame(() => {
    const p = progress.get();
    materials.current.forEach((material, index) => {
      if (!material) return;
      const [start, end] = SCREEN_WINDOWS[index] ?? [2, 2];
      const fadeIn = index === 0 ? segment(p, start, start + 0.08) : segment(p, start - FADE / 2, start + FADE / 2);
      const fadeOut = 1 - segment(p, end - FADE / 2, end + FADE / 2);
      material.opacity = Math.min(fadeIn, fadeOut);
    });
  });

  return (
    <>
      {textures.map((texture, index) => (
        <mesh key={urls[index]} position={[0, LID.h / 2 + 0.02, 0.002 + index * 0.0006]}>
          <planeGeometry args={[SCREEN.w, SCREEN.h]} />
          <meshBasicMaterial
            ref={(material) => {
              materials.current[index] = material;
            }}
            map={texture}
            toneMapped={false}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </>
  );
}

/* ---------- Notebook + câmera guiados pela rolagem ---------------------- */

function Laptop({ urls, progress, reduceMotion }: { urls: string[]; progress: MotionValue<number>; reduceMotion: boolean }) {
  const rootRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);
  const lookAt = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const p = progress.get();
    const open = easeInOut(segment(p, LID_OPEN[0], LID_OPEN[1]));
    const zoom = easeInOut(segment(p, 0.24, 0.4));
    const { camera, size } = state;
    const aspect = size.width / size.height;
    // Distância mínima pra o notebook inteiro caber na largura (celular em pé).
    const fit = 3.9 / (2 * Math.tan(MathUtils.degToRad(17.5)) * aspect);

    if (lidRef.current) lidRef.current.rotation.x = MathUtils.lerp(LID_CLOSED, LID_OPENED, open);

    if (rootRef.current) {
      const float = reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      rootRef.current.rotation.y = MathUtils.lerp(-0.75, 0, easeInOut(segment(p, 0, 0.3)));
      rootRef.current.position.y = float;
      rootRef.current.scale.setScalar(MathUtils.lerp(0.88, 1, easeInOut(segment(p, 0, 0.25))));
    }

    // Câmera: de cima e longe (fechado) → de frente (aberto) → perto da tela.
    const distance = MathUtils.lerp(Math.max(6.4, fit * 1.15), Math.max(4.1, fit), zoom);
    const height = MathUtils.lerp(3.2, 1.2, easeInOut(segment(p, 0.05, 0.4)));
    target.set(0, height, distance);
    camera.position.x = MathUtils.damp(camera.position.x, target.x, 6, delta);
    camera.position.y = MathUtils.damp(camera.position.y, target.y, 6, delta);
    camera.position.z = MathUtils.damp(camera.position.z, target.z, 6, delta);
    lookAt.set(0, MathUtils.lerp(0.4, 0.86, open), 0);
    camera.lookAt(lookAt);
  });

  return (
    <group ref={rootRef}>
      {/* Base */}
      <RoundedBox args={[BASE.w, BASE.h, BASE.d]} radius={0.04} smoothness={4} position={[0, BASE.h / 2, 0]}>
        <meshStandardMaterial {...ALUMINUM} />
      </RoundedBox>
      {/* Poço do teclado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BASE.h + 0.0005, -0.38]}>
        <planeGeometry args={[2.86, 1.08]} />
        <meshStandardMaterial color="#1b1c20" roughness={0.8} />
      </mesh>
      <Keyboard />
      {/* Trackpad */}
      <RoundedBox args={[1.35, 0.004, 0.82]} radius={0.002} position={[0, BASE.h + 0.001, 0.6]}>
        <meshStandardMaterial color="#b9bcc3" metalness={0.7} roughness={0.25} />
      </RoundedBox>

      {/* Tampa: gira em torno da dobradiça */}
      <group ref={lidRef} position={HINGE} rotation={[LID_CLOSED, 0, 0]}>
        <RoundedBox args={[LID.w, LID.h, LID.t]} radius={0.04} smoothness={4} position={[0, LID.h / 2, -LID.t / 2]}>
          <meshStandardMaterial {...ALUMINUM} />
        </RoundedBox>
        {/* Moldura preta da tela */}
        <mesh position={[0, LID.h / 2, 0.001]}>
          <planeGeometry args={[LID.w - 0.08, LID.h - 0.08]} />
          <meshBasicMaterial color="#050506" />
        </mesh>
        <Suspense fallback={null}>
          <Screens urls={urls} progress={progress} />
        </Suspense>
      </group>

      <mesh position={[0, BASE.h, HINGE.z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 2.6, 24]} />
        <meshStandardMaterial color="#2a2b30" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
}

type LaptopSceneProps = {
  urls: string[];
  progress: MotionValue<number>;
  active: boolean;
  reduceMotion: boolean;
};

/**
 * Notebook 3D feito só com geometria (sem modelo externo pra baixar): a
 * tampa abre e as telas trocam conforme a rolagem da seção. `active`
 * desliga o loop de renderização quando a seção sai da tela.
 */
export function LaptopScene({ urls, progress, active, reduceMotion }: LaptopSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 3.2, 7], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 6, 4]} intensity={1.6} />
      <Laptop urls={urls} progress={progress} reduceMotion={reduceMotion} />
      <ContactShadows position={[0, -0.005, 0]} opacity={0.55} scale={9} blur={2.6} far={2} resolution={512} />
      {/* Reflexos do alumínio gerados aqui mesmo — nenhuma imagem HDR baixada */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -3]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#22d3ee" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#a78bfa" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="circle" intensity={1.5} position={[0, 2, 6]} scale={3} />
      </Environment>
    </Canvas>
  );
}
