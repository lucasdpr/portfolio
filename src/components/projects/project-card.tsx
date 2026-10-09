"use client";

import { useRef, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { ResolvedProject } from "@/components/projects/types";

type ProjectCardProps = {
  project: ResolvedProject;
  index: number;
  /** "large" para o card principal (NEXUS): título e tela maiores. */
  variant: "large" | "regular";
  onOpen: (slug: string, trigger: HTMLElement) => void;
};

/** Janela de navegador com o print, cortada pela borda do card. */
function PeekingWindow({ project, large }: { project: ResolvedProject; large: boolean }) {
  // Altura fixa no celular/tablet; no desktop a tela preenche o resto do card
  // (o card alto da OMS acompanha a altura do NEXUS ao lado).
  return (
    <div
      className={`relative overflow-hidden lg:flex-1 ${
        large ? "mt-6 h-[210px] sm:mt-8 sm:h-[340px] lg:h-auto lg:min-h-[340px]" : "mt-5 h-[180px] sm:mt-6 sm:h-[220px] lg:h-auto lg:min-h-[220px]"
      }`}
    >
      <div className="absolute bottom-0 left-5 top-0 flex w-[calc(100%+3rem)] flex-col overflow-hidden rounded-tl-2xl border-l border-t border-white/10 bg-[#0b0b0f] shadow-[0_-20px_60px_-20px_var(--project-glow)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 sm:left-7">
        <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="relative flex-1">
          {project.imageSrc ? (
            <Image
              src={project.imageSrc}
              alt={`Tela do projeto ${project.title}`}
              fill
              sizes={large ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"}
              className="object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${project.accent}55, transparent)` }} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Card da grade de projetos. O card inteiro abre o case (um botão cobre o
 * card); o brilho na cor do projeto segue o mouse via variáveis CSS, escritas
 * direto no DOM pra não re-renderizar nada.
 */
export function ProjectCard({ project, index, variant, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const large = variant === "large";
  const visibleTags = project.tags.slice(0, large ? 6 : 4);
  const hiddenTags = project.tags.length - visibleTags.length;

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    el.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  }

  return (
    <article
      ref={ref}
      onPointerMove={handlePointerMove}
      style={{ "--project-accent": project.accent, "--project-glow": `${project.accent}55` } as CSSProperties}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface transition-[border-color,box-shadow] duration-500 hover:border-[color:var(--project-accent)]/50 hover:shadow-[0_30px_80px_-40px_var(--project-glow)]"
    >
      {/* Brilho fixo no canto + brilho que segue o mouse */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-50"
        style={{ background: project.accent }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), var(--project-glow), transparent 65%)" }}
      />

      <div className={`relative flex flex-col ${large ? "p-6 sm:p-10" : "p-5 sm:p-7"}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-widest text-muted">
            <span className="font-semibold" style={{ color: project.accent }}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-5 bg-border" />
            <span>{project.category === "sistema" ? "Sistema" : "Site"}</span>
            <span>·</span>
            <span>{project.year}</span>
          </div>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-[color:var(--project-accent)] group-hover:text-white"
          >
            <ArrowUpRight size={16} weight="bold" />
          </span>
        </div>

        <h3 className={`mt-4 font-bold tracking-tight text-foreground sm:mt-5 ${large ? "text-4xl sm:text-5xl" : "text-2xl"}`}>{project.title}</h3>
        <p className={`mt-2 max-w-xl text-muted ${large ? "text-base sm:text-lg" : "text-sm leading-relaxed"}`}>{project.headline}</p>

        {large && project.stats && (
          <dl className="mt-5 grid grid-cols-3 gap-3 sm:mt-6 sm:flex sm:flex-wrap sm:gap-x-8">
            {project.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-xs text-muted">{stat.label}</dt>
                <dd className="font-mono text-2xl font-bold text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <ul className="mt-4 flex flex-wrap gap-1.5 sm:mt-5" aria-label="Tecnologias">
          {visibleTags.map((tag) => (
            <li key={tag} className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] text-muted backdrop-blur">
              {tag}
            </li>
          ))}
          {hiddenTags > 0 && <li className="px-1.5 py-1 font-mono text-[11px] text-muted">+{hiddenTags}</li>}
        </ul>
      </div>

      <PeekingWindow project={project} large={large} />

      {/* O card inteiro é clicável; o texto do botão fica para leitores de tela. */}
      <button
        type="button"
        data-cursor="Ver case"
        onClick={(event) => onOpen(project.slug, event.currentTarget)}
        className="absolute inset-0 z-10 rounded-[1.75rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--project-accent)]"
      >
        <span className="sr-only">Ver detalhes do projeto {project.title}</span>
      </button>
    </article>
  );
}
