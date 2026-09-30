"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, GithubLogo, LockSimple } from "@phosphor-icons/react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ProjectVisual } from "@/components/ui/project-visual";
import type { Project, ProjectCategory } from "@/lib/data";

type ResolvedProject = Project & { imageSrc: string };

const filters: { value: ProjectCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "sistema", label: "Sistemas" },
  { value: "site", label: "Sites" },
];

function ProjectCard({ project, index }: { project: ResolvedProject; index: number }) {
  const mainUrl = project.liveUrl ?? project.repoUrl;

  return (
    <SpotlightCard
      tilt
      className={`group flex h-full flex-col rounded-3xl border border-border bg-surface/80 p-5 backdrop-blur transition-colors duration-500 hover:border-accent/40 sm:p-6 ${
        project.featured ? "glow-border" : ""
      }`}
    >
      <div data-cursor={mainUrl ? "Abrir" : undefined}>
        {mainUrl ? (
          <a href={mainUrl} target="_blank" rel="noreferrer" aria-label={`Abrir ${project.title}`} className="block">
            <ProjectVisual
              src={project.imageSrc}
              title={project.title}
              category={project.category}
              liveUrl={project.liveUrl}
              index={index}
              sizes="(min-width: 768px) 45vw, 90vw"
            />
          </a>
        ) : (
          <ProjectVisual
            src={project.imageSrc}
            title={project.title}
            category={project.category}
            index={index}
            sizes="(min-width: 768px) 45vw, 90vw"
          />
        )}
      </div>

      <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted">
        <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
        <span className="h-px flex-1 bg-border" />
        <span>{project.category === "sistema" ? "Sistema" : "Site"}</span>
        <span>·</span>
        <span>{project.year}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">{project.title}</h3>
      <p className="mt-2 text-base font-medium text-foreground/80">{project.headline}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[11px] text-muted">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-5 border-t border-border pt-5 text-sm font-medium">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
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
            <LockSimple size={15} weight="bold" /> Uso interno, demonstração sob pedido
          </span>
        )}
      </div>
    </SpotlightCard>
  );
}

export function ProjectsGrid({ projects }: { projects: ResolvedProject[] }) {
  const [filter, setFilter] = useState<ProjectCategory | "todos">("todos");
  const visible = projects.filter((project) => filter === "todos" || project.category === filter);

  return (
    <>
      <LayoutGroup id="project-filter">
        <div role="tablist" aria-label="Filtrar projetos" className="mt-12 inline-flex rounded-full border border-border bg-surface/60 p-1 backdrop-blur">
          {filters.map((item) => {
            const active = filter === item.value;
            const count = item.value === "todos" ? projects.length : projects.filter((p) => p.category === item.value).length;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.value)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${active ? "text-accent-foreground" : "text-muted hover:text-foreground"}`}
              >
                {active && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {item.label} <span className="font-mono text-xs opacity-60">{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <motion.div layout className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((project) => {
            const index = projects.indexOf(project);
            return (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
