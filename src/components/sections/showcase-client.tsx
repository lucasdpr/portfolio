"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { SCREEN_WINDOWS, segment } from "@/components/three/laptop-scene";

const LaptopScene = dynamic(() => import("@/components/three/laptop-scene").then((mod) => mod.LaptopScene), {
  ssr: false,
});

type ShowcaseScreen = {
  title: string;
  text: string;
  imageSrc: string;
};

function Caption({ screen, index, total, progress }: { screen: ShowcaseScreen; index: number; total: number; progress: MotionValue<number> }) {
  const [start, end] = SCREEN_WINDOWS[index];
  const isLast = index === total - 1;
  // Transformações por função (não por keyframes): o motion não consegue
  // mandá-las pra ScrollTimeline nativa, que calcula errado curvas com
  // pontos intermediários — o título ficava "preso" meio visível.
  const opacity = useTransform(progress, (v) =>
    isLast ? segment(v, start, start + 0.05) : Math.min(segment(v, start, start + 0.05), 1 - segment(v, end - 0.05, end)),
  );
  const y = useTransform(progress, (v) => 24 * (1 - segment(v, start, start + 0.05)) - (isLast ? 0 : 24 * segment(v, end - 0.05, end)));

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </p>
      <h3 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{screen.title}</h3>
      <p className="mt-3 max-w-xl text-base text-muted sm:text-lg">{screen.text}</p>
    </motion.div>
  );
}

function ProgressBar({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const [start, end] = SCREEN_WINDOWS[index];
  const scaleX = useTransform(progress, [start, Math.min(end, 1)], [0, 1]);
  return (
    <span className="h-1 w-8 overflow-hidden rounded-full bg-border">
      <motion.span style={{ scaleX }} className="block h-full origin-left rounded-full bg-foreground" />
    </span>
  );
}

/**
 * Seção "presa" na tela (sticky) por 5 alturas de viewport: a rolagem
 * dirige a cena 3D (tampa abrindo, câmera, troca de telas) e as legendas.
 */
type ShowcaseClientProps = {
  name: string;
  tagline: string;
  screens: ShowcaseScreen[];
};

export function ShowcaseClient({ name, tagline, screens }: ShowcaseClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const active = useInView(sectionRef, { margin: "25% 0px 25% 0px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  const titleOpacity = useTransform(scrollYProgress, (v) => 1 - segment(v, 0.1, 0.18));
  const titleY = useTransform(scrollYProgress, [0, 0.18], [0, -80]);
  const titleScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.9]);
  const glowOpacity = useTransform(scrollYProgress, (v) => segment(v, 0.15, 0.35));

  return (
    <section ref={sectionRef} id="destaque" aria-label={`${name} em destaque`} className="relative h-[500vh] border-t border-border">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Brilho atrás da tela quando ela acende */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-[38%] h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent/25 via-accent-2/20 to-transparent blur-[120px]"
        />

        <div className="absolute inset-0">
          <LaptopScene urls={screens.map((screen) => screen.imageSrc)} progress={scrollYProgress} active={active} reduceMotion={reduceMotion} />
        </div>

        <motion.div
          style={{ opacity: titleOpacity, y: titleY, scale: titleScale }}
          className="pointer-events-none absolute inset-x-0 top-[14vh] px-4 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">Apresentando</p>
          <h2 className="mt-4 text-7xl font-bold tracking-tighter text-foreground sm:text-9xl lg:text-[11rem] lg:leading-none">
            <span className="text-gradient">{name}.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-xl font-medium text-foreground/80 sm:text-2xl">{tagline}</p>
        </motion.div>

        {/* Legendas: uma por tela, trocando junto com ela */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[7vh] h-48 sm:h-56">
          <div className="absolute inset-x-0 -bottom-[7vh] top-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          {screens.map((screen, index) => (
            <Caption key={screen.title} screen={screen} index={index} total={screens.length} progress={scrollYProgress} />
          ))}
        </div>

        <div className="absolute bottom-6 right-6 hidden gap-2 sm:flex" aria-hidden="true">
          {screens.map((screen, index) => (
            <ProgressBar key={screen.title} index={index} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
