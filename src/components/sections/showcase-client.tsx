"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Counter } from "@/components/ui/counter";
import { easeInOut, lerp, segment } from "@/lib/scroll";

type Hotspot = { x: number; y: number; label: string };

type ShowcaseScreen = {
  title: string;
  text: string;
  imageSrc: string;
  hotspots: Hotspot[];
};

type Stat = { value: number; suffix: string; label: string };

/* ---------- Linha do tempo (0 → 1 = rolagem do trecho fixo) ---------- */

// 0.00–0.10  título "OMS." + app pequeno e inclinado embaixo
// 0.10–0.32  o app endireita e cresce até ocupar a tela inteira (entrada)
// 0.32–0.93  dentro do app: telas trocam, marcadores e legendas
// 0.93–1.00  o app encolhe um pouco (saída)
const ENTER: [number, number] = [0.08, 0.32];
const EXIT: [number, number] = [0.93, 1];
const INSIDE_START = ENTER[1];

/** Janela [início, fim] de cada tela dentro do app. */
function screenWindow(index: number, total: number): [number, number] {
  const span = (EXIT[0] - INSIDE_START) / total;
  return [INSIDE_START + index * span, INSIDE_START + (index + 1) * span];
}

// Opacidade/posição calculadas por função (não keyframes): o motion não
// consegue mandar isso pra ScrollTimeline nativa, que erra curvas com
// pontos intermediários.

/* ---------- Tela cheia vs. celular em pé ------------------------------- */

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

/** Tela em pé (celular): lá a imagem recortada "passeia" de lado. */
function usePortrait() {
  return useSyncExternalStore(
    subscribeResize,
    () => window.innerWidth / window.innerHeight < 1.1,
    () => false,
  );
}

/* ---------- Peças ------------------------------------------------------ */

function Screen({
  screen,
  index,
  total,
  progress,
  portrait,
}: {
  screen: ShowcaseScreen;
  index: number;
  total: number;
  progress: MotionValue<number>;
  portrait: boolean;
}) {
  const [start, end] = screenWindow(index, total);
  // A primeira já está lá desde o começo; as outras entram com uma cortina.
  const clipPath = useTransform(progress, (v) => {
    if (index === 0) return "inset(0% 0% 0% 0%)";
    const t = easeInOut(segment(v, start - 0.03, start + 0.03));
    return `inset(${(1 - t) * 100}% 0% 0% 0%)`;
  });
  const scale = useTransform(progress, (v) => {
    const out = index < total - 1 ? easeInOut(segment(v, end - 0.03, end + 0.03)) : 0;
    return 1 - out * 0.06;
  });
  // No celular a imagem é recortada (tela em pé): passeia da esquerda pra direita.
  const objectPosition = useTransform(progress, (v) => {
    const t = segment(v, Math.max(INSIDE_START, start), end);
    return `${portrait ? t * 100 : 0}% 0%`;
  });

  return (
    <motion.div style={{ clipPath, scale }} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ objectPosition }} className="absolute inset-0">
        <Image
          src={screen.imageSrc}
          alt={`OMS: ${screen.title}`}
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "inherit" }}
          priority={index === 0}
        />
      </motion.div>
      {!portrait && <Hotspots screen={screen} index={index} total={total} progress={progress} />}
    </motion.div>
  );
}

function HotspotMarker({ hotspot, order, start, end, progress }: { hotspot: Hotspot; order: number; start: number; end: number; progress: MotionValue<number> }) {
  const appearAt = Math.max(start, INSIDE_START) + 0.03 + order * 0.035;
  const opacity = useTransform(progress, (v) => Math.min(segment(v, appearAt, appearAt + 0.025), 1 - segment(v, end - 0.03, end - 0.005)));
  const labelX = useTransform(progress, (v) => (1 - segment(v, appearAt, appearAt + 0.03)) * (hotspot.x > 60 ? 12 : -12));
  const alignRight = hotspot.x > 60;

  return (
    <motion.div
      style={{ opacity, left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
        <span className="relative h-3 w-3 rounded-full border-2 border-white bg-accent shadow-[0_0_20px_var(--accent)]" />
      </span>
      <motion.span
        style={{ x: labelX }}
        className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-accent/50 bg-black/85 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_var(--accent)] backdrop-blur-md ${
          alignRight ? "right-8" : "left-8"
        }`}
      >
        {hotspot.label}
      </motion.span>
    </motion.div>
  );
}

/**
 * Os marcadores ficam numa camada do tamanho exato em que a imagem é
 * desenhada (object-cover ancorado no topo/esquerda), pra apontarem pro
 * lugar certo mesmo quando a proporção da tela corta um pedaço da imagem.
 */
function Hotspots({ screen, index, total, progress }: { screen: ShowcaseScreen; index: number; total: number; progress: MotionValue<number> }) {
  const [start, end] = screenWindow(index, total);
  return (
    <div className="absolute left-0 top-0" style={{ width: "max(100%, calc(100svh * 1.6))", height: "max(100%, calc(100vw / 1.6))" }}>
      {screen.hotspots.map((hotspot, order) => (
        <HotspotMarker key={hotspot.label} hotspot={hotspot} order={order} start={start} end={end} progress={progress} />
      ))}
    </div>
  );
}

function Caption({ screen, index, total, progress }: { screen: ShowcaseScreen; index: number; total: number; progress: MotionValue<number> }) {
  const [start, end] = screenWindow(index, total);
  const from = Math.max(start, INSIDE_START - 0.02);
  const isLast = index === total - 1;
  const opacity = useTransform(progress, (v) =>
    Math.min(segment(v, from, from + 0.04), 1 - segment(v, isLast ? EXIT[0] : end - 0.04, isLast ? EXIT[0] + 0.03 : end)),
  );
  const y = useTransform(progress, (v) => 28 * (1 - segment(v, from, from + 0.04)));

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 px-6 sm:px-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h3 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">{screen.title}</h3>
      <p className="mt-3 max-w-lg text-base text-white/70 sm:text-lg">{screen.text}</p>
    </motion.div>
  );
}

function ProgressBar({ index, total, progress }: { index: number; total: number; progress: MotionValue<number> }) {
  const [start, end] = screenWindow(index, total);
  const scaleX = useTransform(progress, (v) => segment(v, start, end));
  return (
    <span className="h-1 w-10 overflow-hidden rounded-full bg-white/20">
      <motion.span style={{ scaleX }} className="block h-full origin-left rounded-full bg-white" />
    </span>
  );
}

/* ---------- Seção ------------------------------------------------------ */

type ShowcaseClientProps = {
  name: string;
  tagline: string;
  screens: ShowcaseScreen[];
  stats: Stat[];
};

/**
 * "Entrar no aplicativo": a tela da OMS começa pequena e inclinada sob o
 * título, endireita e cresce até ocupar a tela inteira; lá dentro, as
 * telas trocam com marcadores nas partes reais da interface. Tudo guiado
 * pela rolagem (o trecho fica preso na tela por 5 alturas de viewport).
 */
export function ShowcaseClient({ name, tagline, screens, stats }: ShowcaseClientProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const portrait = usePortrait();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const total = screens.length;

  // Tamanho do "app": de um cartão (metade da largura; quase toda no
  // celular) até a tela inteira.
  const cardWidth = portrait ? 86 : 52; // vw
  const enter = useTransform(scrollYProgress, (v) => easeInOut(segment(v, ENTER[0], ENTER[1])));
  const exit = useTransform(scrollYProgress, (v) => easeInOut(segment(v, EXIT[0], EXIT[1])));
  const width = useTransform(enter, (t) => `${lerp(cardWidth, 100, t)}vw`);
  const height = useTransform(enter, (t) => `calc(${lerp(cardWidth / 1.6, 0, t)}vw + ${lerp(0, 100, t)}svh)`);
  const frameY = useTransform(enter, (t) => `calc(-50% + ${lerp(portrait ? 14 : 20, 0, t)}svh)`);
  const rotateX = useTransform(enter, (t) => (reduceMotion ? 0 : lerp(32, 0, Math.min(1, t * 1.6))));
  const radius = useTransform([enter, exit] as MotionValue<number>[], ([t, out]: number[]) => `${Math.max(lerp(20, 0, t), lerp(0, 28, out))}px`);
  const frameScale = useTransform(exit, (t) => lerp(1, 0.86, t));

  // O título passa "através" da câmera: cresce, desfoca e some.
  const titleOpacity = useTransform(scrollYProgress, (v) => 1 - segment(v, 0.1, 0.2));
  const titleScale = useTransform(scrollYProgress, (v) => (reduceMotion ? 1 : lerp(1, 1.6, easeInOut(segment(v, 0.08, 0.22)))));
  const titleBlur = useTransform(scrollYProgress, (v) => `blur(${reduceMotion ? 0 : segment(v, 0.1, 0.2) * 12}px)`);

  // Escurecimento na base pra legenda ler bem em cima do print.
  const shadeOpacity = useTransform(scrollYProgress, (v) => Math.min(segment(v, ENTER[1] - 0.06, ENTER[1]), 1 - segment(v, EXIT[0], EXIT[0] + 0.03)));

  return (
    <section id="destaque" aria-label={`${name} em destaque`} className="relative border-t border-border">
      <div ref={trackRef} className="relative h-[500vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent/20 via-accent-2/15 to-transparent blur-[120px]" />

          <motion.div
            style={{ opacity: titleOpacity, scale: titleScale, filter: titleBlur }}
            className="pointer-events-none absolute inset-x-0 top-[11vh] z-20 px-4 text-center"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Projeto principal</p>
            <h2 className="mt-3 text-7xl font-bold tracking-tighter text-foreground sm:text-9xl lg:text-[10rem] lg:leading-none">
              <span className="text-gradient">{name}.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-xl font-medium text-foreground/80 sm:text-2xl">{tagline}</p>
          </motion.div>

          <motion.div
            style={{
              width,
              height,
              x: "-50%",
              y: frameY,
              rotateX,
              transformPerspective: 1400,
              scale: frameScale,
              borderRadius: radius,
            }}
            className="absolute left-1/2 top-1/2 z-10 overflow-hidden bg-black shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          >
            {screens.map((screen, index) => (
              <Screen key={screen.title} screen={screen} index={index} total={total} progress={scrollYProgress} portrait={portrait} />
            ))}

            <motion.div
              aria-hidden="true"
              style={{ opacity: shadeOpacity }}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[42%] bg-gradient-to-t from-black via-black/75 to-transparent"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-10 z-30 h-48 sm:bottom-12 sm:h-56">
              {screens.map((screen, index) => (
                <Caption key={screen.title} screen={screen} index={index} total={total} progress={scrollYProgress} />
              ))}
            </div>

            <motion.div style={{ opacity: shadeOpacity }} className="absolute bottom-6 right-6 z-30 hidden gap-2 sm:flex" aria-hidden="true">
              {screens.map((screen, index) => (
                <ProgressBar key={screen.title} index={index} total={total} progress={scrollYProgress} />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Números grandes, estilo página de produto */}
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-12 px-4 py-24 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse">
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
            <p className="text-gradient text-6xl font-bold tracking-tighter tabular-nums sm:text-7xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
