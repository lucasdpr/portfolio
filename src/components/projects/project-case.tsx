"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle, GithubLogo, LockSimple, X } from "@phosphor-icons/react";
import type { ResolvedProject } from "@/components/projects/types";

type ProjectCaseProps = {
  project: ResolvedProject;
  position: { index: number; total: number };
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
};

function Gallery({ project }: { project: ResolvedProject }) {
  const [active, setActive] = useState(0);
  const images = project.images;
  const current = images[Math.min(active, images.length - 1)];

  if (!current) return null;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f] shadow-[0_40px_100px_-40px_var(--project-glow)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 truncate font-mono text-[11px] text-white/50">
            {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : project.title}
          </span>
        </div>
        <div className="relative aspect-[16/10]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={current}
                alt={`${project.title}: tela ${active + 1} de ${images.length}`}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover object-left-top"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Telas do projeto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Ver tela ${index + 1}`}
              onClick={() => setActive(index)}
              className={`relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border transition-all sm:w-28 ${
                index === active ? "border-[color:var(--project-accent)] opacity-100" : "border-border opacity-50 hover:opacity-90"
              }`}
            >
              <Image src={src} alt="" fill sizes="112px" className="object-cover object-left-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Case do projeto, aberto por cima da página. Tela cheia no celular, painel
 * centralizado no desktop. Esc fecha, ← → navegam entre os projetos e o foco
 * fica preso dentro do painel enquanto ele está aberto.
 */
export function ProjectCase({ project, position, onClose, onNavigate }: ProjectCaseProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const titleId = `case-${project.slug}-titulo`;

  // Foco no botão de fechar ao abrir e ao trocar de projeto; volta ao topo.
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project.slug]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onNavigate(1);
      else if (event.key === "ArrowLeft") onNavigate(-1);
      else if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNavigate]);

  const accentStyle = { "--project-accent": project.accent, "--project-glow": `${project.accent}55` } as CSSProperties;

  return (
    <motion.div
      className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-background/75 backdrop-blur-xl" />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={accentStyle}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="relative flex h-[100svh] w-full max-w-6xl flex-col overflow-hidden border-border bg-background shadow-2xl sm:h-auto sm:max-h-[92svh] sm:rounded-[2rem] sm:border"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: project.accent }}
        />

        {/* Barra do topo: posição, navegação e fechar */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
          <p className="font-mono text-xs text-muted">
            <span style={{ color: project.accent }}>{String(position.index + 1).padStart(2, "0")}</span> / {String(position.total).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate(-1)}
              aria-label="Projeto anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[color:var(--project-accent)]"
            >
              <ArrowLeft size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate(1)}
              aria-label="Próximo projeto"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-[color:var(--project-accent)]"
            >
              <ArrowRight size={16} weight="bold" />
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-95"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} data-lenis-prevent className="relative flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={project.slug}
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="px-4 pb-10 pt-6 sm:px-10 sm:pt-8"
            >
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted">
                <span className="rounded-full px-2.5 py-1 font-semibold text-white" style={{ background: project.accent }}>
                  {project.category === "sistema" ? "Sistema" : "Site"}
                </span>
                <span>{project.year}</span>
              </div>
              <h2 id={titleId} className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                {project.title}
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-muted sm:text-xl">{project.headline}</p>

              <div className="mt-8">
                <Gallery key={project.slug} project={project} />
              </div>

              <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div className="space-y-8">
                  {project.problem && (
                    <section>
                      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-3">O problema</h3>
                      <p className="mt-2 text-base leading-relaxed text-foreground/85">{project.problem}</p>
                    </section>
                  )}
                  <section>
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: project.accent }}>
                      {project.problem ? "O que eu construí" : "O projeto"}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-foreground/85">{project.description}</p>
                  </section>
                  {project.highlights && (
                    <section>
                      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Destaques técnicos</h3>
                      <ul className="mt-3 space-y-3">
                        {project.highlights.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                            <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0" style={{ color: project.accent }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                <aside className="space-y-8">
                  {project.stats && (
                    <dl className="grid grid-cols-3 gap-2 lg:grid-cols-1 xl:grid-cols-3">
                      {project.stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col-reverse rounded-2xl border border-border bg-surface p-4">
                          <dt className="mt-1 text-[11px] leading-tight text-muted">{stat.label}</dt>
                          <dd className="font-mono text-2xl font-bold text-foreground">{stat.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <section>
                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Stack</h3>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground/80">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="flex flex-wrap gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group/link inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform active:scale-95"
                        style={{ background: project.accent }}
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
                        className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[color:var(--project-accent)]"
                      >
                        <GithubLogo size={16} weight="bold" /> Código
                      </a>
                    )}
                  </div>
                  {project.note && (
                    <p className="flex items-center gap-2 text-xs text-muted">
                      {!project.liveUrl && !project.repoUrl && <LockSimple size={14} weight="bold" />}
                      {project.note}
                    </p>
                  )}
                </aside>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
