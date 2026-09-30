"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { AdditiveBlending, MathUtils, Vector3, type Group, type ShaderMaterial } from "three";

/* ---------- Formas: cada uma vira um array com `count` pontos ---------- */

type Shapes = [Float32Array, Float32Array, Float32Array];

/** Pseudo-aleatório determinístico (mesma nuvem a cada carregamento). */
function makeRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

/** Galáxia de 3 braços, levemente inclinada pra frente. */
function sampleGalaxy(count: number) {
  const rand = makeRandom(11);
  const data = new Float32Array(count * 3);
  const tilt = 0.85;
  for (let i = 0; i < count; i++) {
    // Mais pontos perto do centro (núcleo) e braços largos que afinam.
    const radius = Math.pow(rand(), 1.3) * 2.1;
    const branch = ((i % 3) / 3) * Math.PI * 2;
    const angle = branch + radius * 1.35;
    const jitter = () => Math.pow(rand(), 2.5) * (rand() < 0.5 ? 1 : -1) * 0.55 * (0.35 + radius * 0.5);
    const x = Math.cos(angle) * radius + jitter();
    const y = jitter() * 0.4;
    const z = Math.sin(angle) * radius + jitter();
    data[i * 3] = x;
    data[i * 3 + 1] = y * Math.cos(tilt) - z * Math.sin(tilt);
    data[i * 3 + 2] = y * Math.sin(tilt) + z * Math.cos(tilt);
  }
  return data;
}

/**
 * Desenha o texto num canvas 2D escondido e sorteia pontos dentro das
 * letras — assim as partículas "formam" a palavra com a fonte do site.
 */
function sampleText(text: string, count: number, fontFamily: string, width: number, seed: number) {
  const rand = makeRandom(seed);
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  const data = new Float32Array(count * 3);
  if (!ctx) return data;

  let fontSize = 320;
  ctx.font = `800 ${fontSize}px ${fontFamily}`;
  const measured = ctx.measureText(text).width;
  if (measured > 960) fontSize = Math.floor((fontSize * 960) / measured);
  ctx.font = `800 ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const filled: number[] = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  if (filled.length === 0) return data;

  // Encaixa a largura real do texto em `width` unidades da cena.
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < filled.length; i += 2) {
    minX = Math.min(minX, filled[i]);
    maxX = Math.max(maxX, filled[i]);
    minY = Math.min(minY, filled[i + 1]);
    maxY = Math.max(maxY, filled[i + 1]);
  }
  const scale = width / Math.max(1, maxX - minX);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  for (let i = 0; i < count; i++) {
    const pick = Math.floor(rand() * (filled.length / 2)) * 2;
    data[i * 3] = (filled[pick] - centerX + (rand() - 0.5) * 2) * scale;
    data[i * 3 + 1] = -(filled[pick + 1] - centerY + (rand() - 0.5) * 2) * scale;
    data[i * 3 + 2] = (rand() - 0.5) * 0.25;
  }
  return data;
}

/* ---------- Shader: mistura entre formas + mouse que empurra ---------- */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform vec3 uMouse;
  uniform float uMouseStrength;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute vec3 aShape0;
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute float aRandom;
  varying vec3 vColor;
  varying float vAlpha;

  vec3 pick(float i) {
    if (i < 0.5) return aShape0;
    if (i < 1.5) return aShape1;
    return aShape2;
  }

  void main() {
    float from = mod(floor(uMorph), 3.0);
    float to = mod(from + 1.0, 3.0);
    // Cada partícula sai num tempo levemente diferente (efeito "enxame").
    float t = clamp(fract(uMorph) * 1.6 - aRandom * 0.6, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(pick(from), pick(to), t);

    // No meio da troca, as partículas se espalham um pouco.
    vec3 dir = normalize(vec3(aRandom - 0.5, fract(aRandom * 7.13) - 0.5, fract(aRandom * 3.71) - 0.5) + 0.0001);
    pos += dir * sin(t * 3.14159) * 0.6;

    // Respiração leve.
    pos += 0.02 * vec3(sin(uTime * 0.9 + aRandom * 40.0), cos(uTime * 0.7 + aRandom * 30.0), 0.0);

    // O mouse empurra as partículas por perto.
    vec2 away = pos.xy - uMouse.xy;
    float dist = length(away);
    pos.xy += normalize(away + 0.0001) * smoothstep(0.8, 0.0, dist) * 0.45 * uMouseStrength;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRandom * 0.9) / -mvPosition.z;

    // Degradê ciano → violeta → rosa (as cores do site) ao longo da forma.
    vec3 cyan = vec3(0.133, 0.827, 0.933);
    vec3 violet = vec3(0.655, 0.545, 0.980);
    vec3 pink = vec3(0.957, 0.447, 0.714);
    float g = clamp(pos.x * 0.22 + 0.5 + pos.y * 0.08, 0.0, 1.0);
    vColor = g < 0.5 ? mix(cyan, violet, g * 2.0) : mix(violet, pink, (g - 0.5) * 2.0);
    vAlpha = 0.55 + aRandom * 0.45;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

const HOLD = 3.2; // segundos parado em cada forma
const MORPH = 1.6; // segundos de transição

function Particles({ shapes, count }: { shapes: Shapes; count: number }) {
  const groupRef = useRef<Group>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const reduceMotion = useReducedMotion();
  const mouse = useMemo(() => new Vector3(), []);
  const ray = useMemo(() => new Vector3(), []);
  // Antes do primeiro movimento, o three acha que o ponteiro está no centro
  // — o que abriria um "buraco" no meio da forma. Só liga o empurrão depois
  // de um movimento de mouse de verdade (toque não conta).
  const hasMouse = useRef(false);

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      if (event.pointerType === "mouse") hasMouse.current = true;
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  const randoms = useMemo(() => {
    const rand = makeRandom(5);
    return Float32Array.from({ length: count }, () => rand());
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uMouse: { value: new Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    const group = groupRef.current;
    if (!material || !group) return;
    const time = state.clock.elapsedTime;
    const u = material.uniforms;

    // Recuo da câmera pra forma mais larga (~5 unidades) sempre caber no canvas.
    const aspect = state.size.width / state.size.height;
    const fitZ = Math.max(6, 5 / (2 * Math.tan(MathUtils.degToRad(22.5)) * aspect));
    state.camera.position.z = MathUtils.damp(state.camera.position.z, fitZ, 4, delta);
    u.uTime.value = time;
    u.uPixelRatio.value = state.gl.getPixelRatio();

    if (reduceMotion) {
      u.uMorph.value = 1; // fica parado no "</>"
    } else {
      const cycle = HOLD + MORPH;
      const index = Math.floor(time / cycle);
      const local = time % cycle;
      u.uMorph.value = index + Math.max(0, (local - HOLD) / MORPH);
    }

    // Mouse → ponto no plano z=0 da cena, no espaço local do grupo.
    ray.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera).sub(state.camera.position).normalize();
    const distance = -state.camera.position.z / ray.z;
    mouse.copy(state.camera.position).addScaledVector(ray, distance);
    group.worldToLocal(mouse);
    u.uMouse.value.lerp(mouse, 0.2);
    const inside = hasMouse.current && Math.abs(state.pointer.x) < 1 && Math.abs(state.pointer.y) < 1;
    u.uMouseStrength.value = MathUtils.damp(u.uMouseStrength.value, inside && !reduceMotion ? 1 : 0, 4, delta);

    // Inclinação suave seguindo o mouse (pouca, pra não entortar o texto).
    if (!reduceMotion && hasMouse.current) {
      group.rotation.y = MathUtils.damp(group.rotation.y, state.pointer.x * 0.25, 3, delta);
      group.rotation.x = MathUtils.damp(group.rotation.x, -state.pointer.y * 0.15, 3, delta);
    }
  });

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          {/* `position` é exigido pelo three; o shader usa aShape0..2 */}
          <bufferAttribute attach="attributes-position" args={[shapes[0], 3]} />
          <bufferAttribute attach="attributes-aShape0" args={[shapes[0], 3]} />
          <bufferAttribute attach="attributes-aShape1" args={[shapes[1], 3]} />
          <bufferAttribute attach="attributes-aShape2" args={[shapes[2], 3]} />
          <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

/**
 * Hero: milhares de partículas que se reorganizam entre uma galáxia, o
 * símbolo "</>" e o nome — e fogem do mouse. Só roda no cliente (WebGL),
 * importado via `next/dynamic({ ssr: false })` em `hero.tsx`.
 */
export function HeroScene({ active = true, name }: { active?: boolean; name: string }) {
  const [shapes, setShapes] = useState<Shapes | null>(null);
  const count = useMemo(() => (window.innerWidth < 768 ? 4000 : 9000), []);

  useEffect(() => {
    let cancelled = false;
    // Espera a fonte do site carregar pra desenhar as letras com ela.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const fontFamily = getComputedStyle(document.body).fontFamily || "sans-serif";
      setShapes([
        sampleGalaxy(count),
        sampleText("</>", count, fontFamily, 4.0, 21),
        sampleText(name, count, fontFamily, 4.4, 37),
      ]);
    });
    return () => {
      cancelled = true;
    };
  }, [count, name]);

  return (
    <Canvas
      // Fora da tela, para de renderizar (economiza bateria/GPU).
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: false, alpha: true }}
      // Mouse em qualquer parte da página conta, não só em cima do canvas.
      eventSource={document.body}
      eventPrefix="client"
    >
      {shapes && <Particles shapes={shapes} count={count} />}
    </Canvas>
  );
}
