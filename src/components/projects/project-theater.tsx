"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { ArrowRight, ArrowUpRight, GithubLogo, LockSimple } from "@phosphor-icons/react";
import type { ResolvedProject } from "@/components/projects/types";
import { scrollToY } from "@/lib/scroll-to";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type TheaterProps = {
  projects: ResolvedProject[];
  onOpen: (slug: string, trigger: HTMLElement) => void;
};

type Role = "enter" | "exit" | "idle";

/** Proporção da janela (largura / altura), a mesma dos prints. */
const WINDOW_RATIO = 1.6;
/** Rolagem dedicada a cada projeto, em svh (altura da tela). */
const SEGMENT_SVH = 80;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const CLIP_SHOWN = "inset(0% 0% 0% 0%)";
const CLIP_BELOW = "inset(100% 0% 0% 0%)"; // escondido, revela de baixo pra cima
const CLIP_ABOVE = "inset(0% 0% 100% 0%)"; // escondido, revela de cima pra baixo

/* ---------- Transição entre as telas: cortina + parallax ---------- */

const curtain: Variants = {
  enter: (direction: number) => ({
    clipPath: [direction > 0 ? CLIP_BELOW : CLIP_ABOVE, CLIP_SHOWN],
    transition: { duration: 1.05, ease: EASE_IN_OUT },
  }),
  exit: { clipPath: CLIP_SHOWN, transition: { duration: 0.6, ease: EASE_IN_OUT } },
  idle: { clipPath: CLIP_BELOW, transition: { duration: 0 } },
};

// A tela nova entra com zoom assentando; a antiga é empurrada e escurece.
const push: Variants = {
  enter: { scale: [1.22, 1], y: "0%", transition: { duration: 1.3, ease: EASE_OUT } },
  exit: (direction: number) => ({
    scale: 1,
    y: direction > 0 ? "-14%" : "14%",
    transition: { duration: 1.05, ease: EASE_IN_OUT },
  }),
  idle: { scale: 1, y: "0%", transition: { duration: 0 } },
};

const shade: Variants = {
  enter: { opacity: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0.7, transition: { duration: 1.05, ease: EASE_IN_OUT } },
  idle: { opacity: 0, transition: { duration: 0 } },
};

// Com "reduzir movimento": só troca, com um fade curto.
const fadeOnly: Variants = {
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
  idle: { opacity: 0, transition: { duration: 0 } },
};

/* ---------- Transição dos textos ---------- */

const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, y: direction > 0 ? 28 : -28, filter: "blur(8px)" }),
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, delay: 0.18, ease: EASE_OUT } },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -20 : 20,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: EASE_IN },
  }),
};

const titleWord: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.028, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.012 } },
};

const titleChar: Variants = {
  enter: (direction: number) => ({ y: direction > 0 ? "110%" : "-110%" }),
  center: { y: "0%", transition: { duration: 0.85, ease: EASE_OUT } },
  exit: (direction: number) => ({ y: direction > 0 ? "-110%" : "110%", transition: { duration: 0.45, ease: EASE_IN } }),
};

const stagger: Variants = {
  enter: {},
  center: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
  exit: {},
};

const rise: Variants = {
  enter: (direction: number) => ({ opacity: 0, y: direction > 0 ? 18 : -18 }),
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

function displayUrl(project: ResolvedProject) {
  const url = project.liveUrl ?? project.repoUrl;
  if (!url) return `${project.title.toLowerCase().replace(/\s+/g, "-")} · sistema interno`;
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

/** Uma tela dentro da janela. Prints altos "rolam" conforme a página rola. */
function TheaterLayer({
  project,
  index,
  count,
  role,
  direction,
  progress,
  reduceMotion,
}: {
  project: ResolvedProject;
  index: number;
  count: number;
  role: Role;
  direction: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const media = project.showcase;
  const ratio = media ? media.width / media.height : WINDOW_RATIO;
  // Quanto do print fica além da janela (fração da altura do print).
  const overflow = Math.max(0, 1 - ratio / WINDOW_RATIO);
  const tall = overflow > 0.02 && !reduceMotion;

  // Progresso só deste projeto: 0 quando ele entra, 1 quando o próximo chega.
  const local = useTransform(progress, (p) => clamp01(p * count - index));
  // Segura um pouco no topo, desce, segura um pouco no fim.
  const panY = useTransform(local, (t) => `${-easeInOut(clamp01((t - 0.08) / 0.78)) * overflow * 100}%`);
  const drift = useTransform(local, (t) => (reduceMotion ? 1 : 1.02 + 0.05 * t));

  const zIndex = role === "enter" ? 3 : role === "exit" ? 2 : 1;

  return (
    <motion.div
      custom={direction}
      variants={reduceMotion ? fadeOnly : curtain}
      initial={false}
      animate={role}
      style={{ zIndex }}
      className="absolute inset-0 overflow-hidden"
    >
      <motion.div custom={direction} variants={reduceMotion ? undefined : push} initial={false} animate={role} className="absolute inset-0">
        {media ? (
          tall ? (
            <motion.div style={{ y: panY, aspectRatio: `${media.width} / ${media.height}` }} className="absolute inset-x-0 top-0">
              <Image src={media.src} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-top" />
            </motion.div>
          ) : (
            <motion.div style={{ scale: drift }} className="absolute inset-0 origin-top-left">
              <Image src={media.src} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-left-top" />
            </motion.div>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: `radial-gradient(circle at 30% 20%, ${project.accent}66, #0b0b0f 70%)` }}>
            <span className="text-8xl font-bold text-white/80">{project.title.charAt(0)}</span>
          </div>
        )}
      </motion.div>
      {!reduceMotion && <motion.div variants={shade} initial={false} animate={role} className="pointer-events-none absolute inset-0 bg-black" />}
    </motion.div>
  );
}

/** Título que troca letra por letra (cada palavra é uma máscara). */
function RollingTitle({ project, direction, long }: { project: ResolvedProject; direction: number; long: boolean }) {
  return (
    <div className="relative grid h-[var(--title-size)] items-end">
      <AnimatePresence initial={false} custom={direction}>
        <motion.h3
          key={project.slug}
          aria-label={project.title}
          initial="enter"
          animate="center"
          exit="exit"
          variants={titleWord}
          className={`[grid-area:1/1] font-bold tracking-tight text-foreground ${long ? "text-[length:calc(var(--title-size)*0.5)] leading-[1]" : "text-[length:var(--title-size)] leading-[0.95]"}`}
        >
          {project.title.split(" ").map((word, wordIndex, words) => (
            <span key={`${word}-${wordIndex}`} aria-hidden="true">
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                {Array.from(word).map((char, charIndex) => (
                  <motion.span key={charIndex} custom={direction} variants={titleChar} className="inline-block">
                    {char}
                  </motion.span>
                ))}
              </span>
              {wordIndex < words.length - 1 && " "}
            </span>
          ))}
        </motion.h3>
      </AnimatePresence>
    </div>
  );
}

/** Contador "01" que rola como um odômetro. */
function RollingIndex({ index, direction, accent }: { index: number; direction: number; accent: string }) {
  return (
    <span className="relative inline-flex h-[1.2em] overflow-hidden font-semibold" style={{ color: accent }}>
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.span
          key={index}
          custom={direction}
          initial={{ y: direction > 0 ? "100%" : "-100%" }}
          animate={{ y: "0%", transition: { duration: 0.7, ease: EASE_OUT } }}
          exit={{ y: direction > 0 ? "-100%" : "100%", transition: { duration: 0.4, ease: EASE_IN } }}
          className="inline-block"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Um capítulo da barra de baixo: nome + linha que enche com a rolagem. */
function Chapter({
  project,
  index,
  count,
  active,
  progress,
  onSelect,
}: {
  project: ResolvedProject;
  index: number;
  count: number;
  active: boolean;
  progress: MotionValue<number>;
  onSelect: (index: number) => void;
}) {
  const fill = useTransform(progress, (p) => clamp01(p * count - index));
  return (
    <li className="min-w-0 flex-1">
      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-current={active ? "step" : undefined}
        aria-label={`Ir para o projeto ${project.title}`}
        className="group/chapter flex w-full flex-col gap-2.5 py-3 text-left"
      >
        <span className="relative block h-[2px] w-full overflow-hidden rounded-full bg-border">
          <motion.span style={{ scaleX: fill, background: project.accent }} className="absolute inset-0 origin-left" />
        </span>
        <span className={`flex items-baseline gap-2 truncate text-sm transition-colors ${active ? "text-foreground" : "text-muted group-hover/chapter:text-foreground"}`}>
          <span className="font-mono text-[11px]" style={active ? { color: project.accent } : undefined}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="truncate font-medium">{project.title}</span>
        </span>
      </button>
    </li>
  );
}

/**
 * Vitrine dos sistemas no desktop: a seção fica presa na tela enquanto a
 * rolagem passa de um projeto para o outro. A tela nova sobe como uma
 * cortina por cima da anterior (que é empurrada e escurece), o texto troca
 * letra por letra e a cor de destaque acompanha o projeto. Prints altos
 * rolam dentro da janela. Os capítulos embaixo pulam direto pra um projeto.
 */
export function ProjectTheater({ projects, onOpen }: TheaterProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const count = projects.length;
  const [state, setState] = useState({ active: 0, previous: -1, direction: 1 });

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  // Entrada: a janela "deita" e cresce enquanto a seção chega ao topo.
  const { scrollYProgress: entrance } = useScroll({ target: trackRef, offset: ["start end", "start start"] });
  const windowScale = useTransform(entrance, (v) => (reduceMotion ? 1 : 0.86 + 0.14 * (1 - Math.pow(1 - v, 3))));
  const windowTilt = useTransform(entrance, (v) => (reduceMotion ? 0 : (1 - v) * 14));
  const windowOpacity = useTransform(entrance, (v) => (reduceMotion ? 1 : 0.35 + 0.65 * Math.min(1, v * 1.6)));

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(p * count)));
    setState((current) =>
      current.active === next ? current : { active: next, previous: current.active, direction: next > current.active ? 1 : -1 },
    );
  });

  const { active, previous, direction } = state;
  const project = projects[active];
  const long = project.title.length > 11;
  const visibleTags = project.tags.slice(0, 5);
  const hiddenTags = project.tags.length - visibleTags.length;

  function jumpTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    // Um pouco depois do começo do trecho do projeto (o print começa no topo).
    scrollToY(top + ((index + 0.04) / count) * distance);
  }

  const stageStyle = { "--title-size": "clamp(3rem, 4.8vw, 5.5rem)" } as CSSProperties;

  return (
    <div ref={trackRef} className="relative" style={{ height: `calc(100svh + ${count * SEGMENT_SVH}svh)` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden" style={stageStyle}>
        {/* Luz de fundo na cor do projeto ativo (troca com fade) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {projects.map((item, index) => (
            <div
              key={item.slug}
              className="absolute right-[-12%] top-[45%] h-[85vh] w-[65vw] -translate-y-1/2 rounded-full blur-[120px] transition-opacity duration-1000"
              style={{ background: item.accent, opacity: index === active ? 0.16 : 0 }}
            />
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          Projeto {active + 1} de {count}: {project.title}
        </p>

        {/* O texto alinha com a grade do resto do site; a janela vai até perto da borda direita. */}
        <div className="relative grid w-full flex-1 grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] items-center gap-10 pl-[max(2rem,calc((100%-80rem)/2+2rem))] pr-8 pt-20 xl:gap-16">
          {/* Texto do projeto ativo */}
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <RollingIndex index={active} direction={direction} accent={project.accent} />
              <span className="h-px w-8 bg-border" />
              <span className="grid">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.span
                    key={project.slug}
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="[grid-area:1/1] whitespace-nowrap"
                  >
                    Sistema · {project.year}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <div className="mt-5">
              <RollingTitle project={project} direction={direction} long={long} />
            </div>

            <div className="mt-6 grid min-h-[3.25em] text-lg leading-relaxed text-muted xl:text-xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.p key={project.slug} custom={direction} variants={slide} initial="enter" animate="center" exit="exit" className="[grid-area:1/1] max-w-[34ch]">
                  {project.headline}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Números (ou os dois destaques principais, se não houver números) */}
            <div className="mt-6 grid min-h-[5.75rem]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div key={project.slug} variants={stagger} initial="enter" animate="center" exit="exit" className="[grid-area:1/1]">
                  {project.stats ? (
                    <dl className="grid grid-cols-3 gap-4">
                      {project.stats.map((stat) => (
                        <motion.div key={stat.label} custom={direction} variants={rise} className="flex flex-col-reverse">
                          <dt className="mt-1 text-xs text-muted">{stat.label}</dt>
                          <dd className="font-mono text-3xl font-bold text-foreground">{stat.value}</dd>
                        </motion.div>
                      ))}
                    </dl>
                  ) : (
                    <ul className="space-y-2">
                      {(project.highlights ?? []).slice(0, 2).map((item) => (
                        <motion.li key={item} custom={direction} variants={rise} className="flex gap-3 text-[13px] leading-snug text-foreground/80 xl:text-sm">
                          <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: project.accent }} />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 grid h-[3.75rem] overflow-hidden [@media(max-height:760px)]:hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.ul key={project.slug} variants={stagger} initial="enter" animate="center" exit="exit" aria-label="Tecnologias" className="[grid-area:1/1] flex flex-wrap content-start items-start gap-1.5">
                  {visibleTags.map((tag) => (
                    <motion.li key={tag} custom={direction} variants={rise} className="rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs text-foreground/80 backdrop-blur">
                      {tag}
                    </motion.li>
                  ))}
                  {hiddenTags > 0 && (
                    <motion.li custom={direction} variants={rise} className="px-1.5 py-1 font-mono text-xs text-muted">
                      +{hiddenTags}
                    </motion.li>
                  )}
                </motion.ul>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex min-h-[5.5rem] flex-wrap content-start items-center gap-3">
              <button
                type="button"
                onClick={(event) => onOpen(project.slug, event.currentTarget)}
                className="group/cta relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform active:scale-95"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-y-0"
                  style={{ background: project.accent }}
                />
                <span className="relative">Ver case completo</span>
                <ArrowRight size={15} weight="bold" className="relative transition-transform group-hover/cta:translate-x-1" />
              </button>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
                >
                  Ao vivo <ArrowUpRight size={14} weight="bold" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
                >
                  <GithubLogo size={15} weight="bold" /> Código
                </a>
              )}
              {!project.liveUrl && !project.repoUrl && project.note && (
                <span className="inline-flex items-center gap-1.5 px-2 text-xs text-muted">
                  <LockSimple size={13} weight="bold" /> {project.note}
                </span>
              )}
            </div>
          </div>

          {/* Janela com as telas empilhadas */}
          <div className="flex min-w-0 justify-end [perspective:1600px]">
            <motion.div
              style={{ scale: windowScale, rotateX: windowTilt, opacity: windowOpacity }}
              className="w-[min(100%,calc((100svh-17rem)*1.6))] origin-top"
            >
              <div
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f] transition-shadow duration-1000"
                style={{ boxShadow: `0 50px 120px -50px ${project.accent}80` }}
              >
                <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  <span className="relative ml-3 grid min-w-0 flex-1 font-mono text-[11px] text-white/50">
                    <AnimatePresence initial={false}>
                      <motion.span
                        key={project.slug}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.3 } }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="[grid-area:1/1] truncate"
                      >
                        {displayUrl(project)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="font-mono text-[11px] text-white/40">
                    {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                  </span>
                </div>
                <button
                  type="button"
                  data-cursor="Ver case"
                  onClick={(event) => onOpen(project.slug, event.currentTarget)}
                  aria-label={`Abrir o case do projeto ${project.title}`}
                  className="relative block aspect-[16/10] w-full overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                >
                  {projects.map((item, index) => (
                    <TheaterLayer
                      key={item.slug}
                      project={item}
                      index={index}
                      count={count}
                      role={index === active ? "enter" : index === previous ? "exit" : "idle"}
                      direction={direction}
                      progress={scrollYProgress}
                      reduceMotion={reduceMotion}
                    />
                  ))}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Capítulos: progresso de cada projeto + pulo direto */}
        <nav aria-label="Projetos da vitrine" className="relative w-full pb-5 pl-[max(2rem,calc((100%-80rem)/2+2rem))] pr-8">
          <ol className="flex gap-4 border-t border-border/60 pt-1">
            {projects.map((item, index) => (
              <Chapter
                key={item.slug}
                project={item}
                index={index}
                count={count}
                active={index === active}
                progress={scrollYProgress}
                onSelect={jumpTo}
              />
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
