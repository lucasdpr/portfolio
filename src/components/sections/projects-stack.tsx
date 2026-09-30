"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowUpRight, GithubLogo, LockSimple } from "@phosphor-icons/react";
import { ProjectVisual } from "@/components/ui/project-visual";
import type { Project } from "@/lib/data";

type ResolvedProject = Project & { imageSrc: string };

type CardProps = {
  project: ResolvedProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

/**
 * Cada card gruda no topo (sticky) e, conforme os próximos sobem por cima,
 * ele encolhe e escurece um pouco — efeito de "pilha de cartas".
 */
function StackCard({ project, index, total, progress }: CardProps) {
  const reduceMotion = useReducedMotion();
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dimEnd = Math.min(1, start + 2 / total);
  // Opacidade por função: evita a aceleração nativa do motion (ScrollTimeline).
  const dim = useTransform(progress, (v) =>
    index === total - 1 ? 0 : 0.35 * Math.min(1, Math.max(0, (v - start) / (dimEnd - start))),
  );
  const mainUrl = project.liveUrl ?? project.repoUrl;

  const visual = (
    <ProjectVisual
      src={project.imageSrc}
      title={project.title}
      category={project.category}
      liveUrl={project.liveUrl}
      index={index}
      sizes="(min-width: 1024px) 55vw, 90vw"
    />
  );

  return (
    <div className="stack-item" style={{ top: `calc(5.5rem + ${index * 1.1}rem)` }}>
      <motion.article
        style={reduceMotion ? undefined : { scale }}
        className={`group relative origin-top overflow-hidden rounded-[2rem] border border-border bg-surface p-5 shadow-2xl shadow-black/30 sm:p-7 ${
          project.featured ? "glow-border" : ""
        }`}
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
          <div data-cursor={mainUrl ? "Abrir" : undefined}>
            {mainUrl ? (
              <a href={mainUrl} target="_blank" rel="noreferrer" aria-label={`Abrir ${project.title}`} className="block">
                {visual}
              </a>
            ) : (
              visual
            )}
          </div>

          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted">
              <span className="text-gradient text-3xl font-bold tracking-normal">{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-border" />
              <span>{project.category === "sistema" ? "Sistema" : "Site"}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">{project.title}</h3>
            <p className="mt-2 text-base font-medium text-foreground/80">{project.headline}</p>
            {project.problem ? (
              <dl className="mt-4 space-y-3 border-l-2 border-border pl-4">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-accent-3">O problema</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{project.problem}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-accent">O que eu construí</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted">{project.description}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[11px] text-muted">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-medium">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-background transition-transform active:scale-95"
                >
                  Ver ao vivo
                  <ArrowUpRight size={15} weight="bold" className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
                >
                  <GithubLogo size={16} weight="bold" /> Código
                </a>
              )}
              {!project.liveUrl && !project.repoUrl && (
                <span className="inline-flex items-center gap-1.5 text-muted">
                  <LockSimple size={15} weight="bold" /> Uso interno · demonstração sob pedido
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Escurece o card conforme ele vai pro fundo da pilha */}
        <motion.div aria-hidden="true" style={{ opacity: reduceMotion ? 0 : dim }} className="pointer-events-none absolute inset-0 bg-background" />
      </motion.article>
    </div>
  );
}

export function ProjectsStack({ projects }: { projects: ResolvedProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <div ref={containerRef} className="mt-14">
      {projects.map((project, index) => (
        <StackCard key={project.title} project={project} index={index} total={projects.length} progress={scrollYProgress} />
      ))}
    </div>
  );
}
