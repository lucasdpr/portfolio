"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { ResolvedProject } from "@/components/projects/types";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type StackProps = {
  projects: ResolvedProject[];
  onOpen: (slug: string, trigger: HTMLElement) => void;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function StackCard({
  project,
  index,
  count,
  progress,
  onOpen,
}: {
  project: ResolvedProject;
  index: number;
  count: number;
  progress: MotionValue<number>;
  onOpen: StackProps["onOpen"];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  // Enquanto os próximos cartões sobem por cima, este encolhe e escurece.
  const start = index / Math.max(1, count - 1);
  const targetScale = 1 - (count - 1 - index) * 0.045;
  const covered = useTransform(progress, (p) => (index === count - 1 ? 0 : clamp01((p - start) / (1 - start))));
  const scale = useTransform(covered, (c) => (reduceMotion ? 1 : 1 - (1 - targetScale) * c));
  const dim = useTransform(progress, (p) => (index === count - 1 ? 0 : clamp01((p - start) * (count - 1)) * 0.55));

  // A tela dentro do cartão assenta (zoom + leve subida) enquanto ele chega.
  const { scrollYProgress: arrival } = useScroll({ target: wrapperRef, offset: ["start end", "start start"] });
  const imageScale = useTransform(arrival, (v) => (reduceMotion ? 1 : 1.18 - 0.18 * v));
  const imageY = useTransform(arrival, (v) => (reduceMotion ? "0%" : `${(1 - v) * 10}%`));

  const visibleTags = project.tags.slice(0, 4);
  const hiddenTags = project.tags.length - visibleTags.length;
  const accentStyle = { "--project-accent": project.accent } as CSSProperties;

  return (
    <div ref={wrapperRef} className="sticky top-0 flex h-[100svh] items-start justify-center" style={{ paddingTop: `calc(5.25rem + ${index * 14}px)` }}>
      <motion.article
        style={{ ...accentStyle, scale, transformOrigin: "50% 0%" }}
        className="relative flex h-[min(74svh,640px)] w-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.45)] md:h-[min(76svh,900px)]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: project.accent }} />

        <div className="relative px-5 pt-5 sm:px-8 sm:pt-8">
          <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-widest text-muted">
            <span className="flex items-center gap-2.5">
              <span className="font-semibold" style={{ color: project.accent }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-5 bg-border" />
              Sistema · {project.year}
            </span>
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: project.accent }}>
              <ArrowUpRight size={15} weight="bold" />
            </span>
          </div>

          <h3 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted sm:text-lg">{project.headline}</p>

          {project.stats && (
            <dl className="mt-4 hidden gap-8 sm:flex">
              {project.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="text-xs text-muted">{stat.label}</dt>
                  <dd className="font-mono text-2xl font-bold text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tecnologias">
            {visibleTags.map((tag) => (
              <li key={tag} className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted">
                {tag}
              </li>
            ))}
            {hiddenTags > 0 && <li className="px-1.5 py-1 font-mono text-[11px] text-muted">+{hiddenTags}</li>}
          </ul>
        </div>

        {/* Tela do projeto, cortada pela borda de baixo do cartão */}
        <div className="relative mx-5 mt-5 min-h-[120px] flex-1 overflow-hidden rounded-t-2xl border border-b-0 border-white/10 bg-[#0b0b0f] sm:mx-8 sm:mt-6">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="absolute inset-x-0 bottom-0 top-[29px] overflow-hidden">
            {project.imageSrc ? (
              <motion.div style={{ scale: imageScale, y: imageY }} className="absolute inset-0 origin-top">
                <Image src={project.imageSrc} alt="" fill sizes="100vw" className="object-cover object-left-top" />
              </motion.div>
            ) : (
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${project.accent}55, transparent)` }} />
            )}
          </div>
        </div>

        <motion.div aria-hidden="true" style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />

        <button
          type="button"
          data-cursor="Ver case"
          onClick={(event) => onOpen(project.slug, event.currentTarget)}
          className="absolute inset-0 z-10 rounded-[1.75rem] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--project-accent)]"
        >
          <span className="sr-only">Ver o case do projeto {project.title}</span>
        </button>
      </motion.article>
    </div>
  );
}

/**
 * Vitrine dos sistemas no celular e no tablet: cada cartão gruda no topo e o
 * próximo sobe por cima dele, enquanto os de trás encolhem e escurecem —
 * uma pilha que se forma com a rolagem. Toque no cartão abre o case.
 */
export function ProjectStack({ projects, onOpen }: StackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <div ref={containerRef} className="relative mx-auto max-w-3xl px-4 sm:px-6">
      {projects.map((project, index) => (
        <StackCard key={project.slug} project={project} index={index} count={projects.length} progress={scrollYProgress} onOpen={onOpen} />
      ))}
    </div>
  );
}
