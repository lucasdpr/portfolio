"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectCase } from "@/components/projects/project-case";
import type { ResolvedProject } from "@/components/projects/types";
import type { ProjectCategory, ProjectSize } from "@/lib/data";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

type Filter = ProjectCategory | "todos";

const filters: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "sistema", label: "Sistemas" },
  { value: "site", label: "Sites" },
];

const HASH_PREFIX = "#projeto-";

// Grade em mosaico (desktop, 6 colunas). Tablet: 2 colunas; celular: 1.
const sizeClasses: Record<ProjectSize, string> = {
  hero: "md:col-span-2 lg:col-span-4 lg:row-span-2",
  tall: "lg:col-span-2 lg:row-span-2",
  wide: "lg:col-span-3",
  third: "lg:col-span-2",
};

/** Com filtro ativo, a grade vira pares iguais (o primeiro ocupa a linha toda se sobrar um). */
function filteredClasses(index: number, total: number) {
  return index === 0 && total % 2 === 1 ? "md:col-span-2 lg:col-span-6" : "lg:col-span-3";
}

export function ProjectsShowcase({ projects }: { projects: ResolvedProject[] }) {
  const [filter, setFilter] = useState<Filter>("todos");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();

  const visible = useMemo(
    () => projects.filter((project) => filter === "todos" || project.category === filter),
    [filter, projects],
  );
  const openIndex = visible.findIndex((project) => project.slug === openSlug);
  const openProject = openIndex >= 0 ? visible[openIndex] : projects.find((project) => project.slug === openSlug);

  const open = useCallback((slug: string, trigger?: HTMLElement) => {
    triggerRef.current = trigger ?? null;
    setOpenSlug(slug);
    window.history.replaceState(null, "", `${HASH_PREFIX}${slug}`);
  }, []);

  const close = useCallback(() => {
    setOpenSlug(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      const list = openIndex >= 0 ? visible : projects;
      const current = list.findIndex((project) => project.slug === openSlug);
      const next = list[(current + direction + list.length) % list.length];
      setOpenSlug(next.slug);
      window.history.replaceState(null, "", `${HASH_PREFIX}${next.slug}`);
    },
    [openIndex, openSlug, projects, visible],
  );

  // Endereço com #projeto-<slug> abre o case direto (dá pra mandar o link de um projeto).
  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash;
      if (!hash.startsWith(HASH_PREFIX)) return;
      const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length));
      if (projects.some((project) => project.slug === slug)) {
        setOpenSlug(slug);
        document.getElementById("projetos")?.scrollIntoView();
      }
    }
    const frame = requestAnimationFrame(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, [projects]);

  // Página parada por baixo enquanto o case está aberto.
  useEffect(() => {
    if (!openSlug) return;
    lockScroll();
    return () => unlockScroll();
  }, [openSlug]);

  const counts = {
    todos: projects.length,
    sistema: projects.filter((project) => project.category === "sistema").length,
    site: projects.filter((project) => project.category === "site").length,
  };

  return (
    <>
      <LayoutGroup id="project-filter">
        <div className="mt-10 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="Filtrar projetos" className="inline-flex rounded-full border border-border bg-surface/60 p-1 backdrop-blur">
            {filters.map((item) => {
              const active = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.value)}
                  className={`relative whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    active ? "text-background" : "text-muted hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-filter-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {item.label} <span className="font-mono text-xs opacity-60">{counts[item.value]}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </LayoutGroup>

      <motion.ul layout={!reduceMotion} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, index) => {
            const number = projects.indexOf(project);
            const span = filter === "todos" ? sizeClasses[project.size] : filteredClasses(index, visible.length);
            return (
              <motion.li
                key={project.slug}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={span}
              >
                <ProjectCard
                  project={project}
                  index={number}
                  variant={filter === "todos" && project.size === "hero" ? "large" : "regular"}
                  onOpen={open}
                />
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {openProject && (
          <ProjectCase
            key="project-case"
            project={openProject}
            position={{
              index: openIndex >= 0 ? openIndex : projects.indexOf(openProject),
              total: openIndex >= 0 ? visible.length : projects.length,
            }}
            onClose={close}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </>
  );
}
