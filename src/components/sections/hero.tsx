"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, EnvelopeSimple } from "@phosphor-icons/react";
import { Magnetic } from "@/components/ui/magnetic-button";
import { Reveal } from "@/components/ui/reveal";
import { WordReveal } from "@/components/ui/word-reveal";
import { profile } from "@/lib/data";
import { useIntroDone } from "@/lib/intro";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto mt-16 h-56 w-56 animate-pulse rounded-full bg-gradient-to-br from-accent/20 via-accent-2/10 to-transparent blur-xl" />
    ),
  },
);

// O que eu construo — gira embaixo do título.
const rotatingWords = ["sistemas web", "PWAs offline", "dashboards com IA", "sites que vendem", "APIs REST"];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setIndex((prev) => (prev + 1) % rotatingWords.length), 2400);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <span className="relative inline-flex h-[1.3em] min-w-[10ch] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={rotatingWords[index]}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-gradient whitespace-nowrap font-semibold"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const introDone = useIntroDone();
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const heroVisible = useInView(sectionRef);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // Parallax: ao rolar, o texto sobe mais rápido e some; a cena 3D afunda.
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  // Opacidade por função: evita a aceleração nativa do motion (ScrollTimeline).
  const textOpacity = useTransform(scrollYProgress, (v) => 1 - Math.min(1, v / 0.7));
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const el = spotRef.current;
    if (!el) return;
    el.style.setProperty("--mx", `${event.clientX}px`);
    el.style.setProperty("--my", `${event.clientY}px`);
  }

  return (
    <section
      ref={sectionRef}
      id="inicio"
      onPointerMove={handlePointerMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      {/* Fundo: aurora + grade de pontos + luz que segue o mouse */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="aurora-blob -left-[10%] top-[5%] h-[45vw] w-[45vw] bg-accent" />
        <div className="aurora-blob right-[-15%] top-[20%] h-[40vw] w-[40vw] bg-accent-2 [animation-delay:-6s]" />
        <div className="aurora-blob bottom-[-20%] left-[30%] h-[35vw] w-[35vw] bg-accent-3 opacity-25 [animation-delay:-12s]" />
        <div className="dot-grid absolute inset-0" />
        <div
          ref={spotRef}
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "radial-gradient(500px circle at var(--mx, 50%) var(--my, 30%), var(--glow), transparent 60%)",
            opacity: 0.35,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          {profile.availableForWork && (
            <Reveal delay={0} play={introDone}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Disponível para novos projetos
              </div>
            </Reveal>
          )}

          <Reveal delay={0.05} play={introDone}>
            <p className="font-mono text-sm text-muted">
              Olá, eu sou o <span className="text-foreground">{profile.firstName}</span> — {profile.role.toLowerCase()}
            </p>
          </Reveal>

          <WordReveal
            as="h1"
            play={introDone}
            delay={0.15}
            className="mt-4 text-[2.6rem] font-bold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-[5rem]"
            words={["Transformo", "ideias", "em", "produtos", "digitais", { text: "sólidos.", className: "text-gradient" }]}
          />

          <Reveal delay={0.55} play={introDone}>
            <p className="mt-8 text-xl text-muted sm:text-2xl">
              Eu construo <RotatingWord />
            </p>
          </Reveal>

          <Reveal delay={0.65} play={introDone}>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg">{profile.tagline}</p>
          </Reveal>

          <Reveal delay={0.75} play={introDone}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#projetos"
                  className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-7 py-4 text-sm font-semibold text-background transition-transform active:scale-95"
                >
                  <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-accent to-accent-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative">Ver projetos</span>
                  <ArrowRight size={16} weight="bold" className="relative transition-transform group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contato"
                  className="flex items-center gap-2 rounded-full border border-border bg-surface/40 px-7 py-4 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent active:scale-95"
                >
                  <EnvelopeSimple size={16} weight="bold" />
                  Falar comigo
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </motion.div>

        <motion.div
          style={{ y: sceneY, scale: sceneScale }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={introDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[340px] sm:h-[440px] lg:h-[580px]"
        >
          <HeroScene active={heroVisible} />
        </motion.div>
      </div>

      <motion.a
        href="#sobre"
        aria-label="Rolar para a próxima seção"
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:flex"
      >
        role
        <span className="flex h-10 w-6 justify-center rounded-full border border-border pt-2">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={10} weight="bold" />
          </motion.span>
        </span>
      </motion.a>
    </section>
  );
}
