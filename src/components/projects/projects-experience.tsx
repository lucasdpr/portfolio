"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { ProjectCase } from "@/components/projects/project-case";
import { ProjectStack } from "@/components/projects/project-stack";
import { ProjectTheater } from "@/components/projects/project-theater";
import { SitesList } from "@/components/projects/sites-list";
import type { ResolvedProject } from "@/components/projects/types";
import { PROJECT_OPEN_EVENT, type ProjectOpenDetail } from "@/lib/project-events";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

const HASH_PREFIX = "#projeto-";

/**
 * Tudo que é interativo na seção de projetos: a vitrine dos sistemas (palco
 * no desktop, pilha de cartões no celular), a lista de sites e o case aberto
 * por cima da página. O case pode ser aberto por um link com
 * #projeto-<slug> ou pelo evento de lib/project-events.ts.
 */
export function ProjectsExperience({ systems, sites }: { systems: ResolvedProject[]; sites: ResolvedProject[] }) {
  const all = useMemo(() => [...systems, ...sites], [systems, sites]);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openIndex = all.findIndex((project) => project.slug === openSlug);
  const openProject = openIndex >= 0 ? all[openIndex] : null;

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
      const current = all.findIndex((project) => project.slug === openSlug);
      const next = all[(current + direction + all.length) % all.length];
      setOpenSlug(next.slug);
      window.history.replaceState(null, "", `${HASH_PREFIX}${next.slug}`);
    },
    [all, openSlug],
  );

  // Endereço com #projeto-<slug> abre o case direto (dá pra mandar o link de
  // um projeto); o evento serve pra outras partes da página (paleta de comandos).
  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash;
      if (!hash.startsWith(HASH_PREFIX)) return;
      const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length));
      if (all.some((project) => project.slug === slug)) {
        setOpenSlug(slug);
        document.getElementById("projetos")?.scrollIntoView();
      }
    }
    function handleOpenEvent(event: Event) {
      const { slug } = (event as CustomEvent<ProjectOpenDetail>).detail;
      if (all.some((project) => project.slug === slug)) open(slug, document.activeElement instanceof HTMLElement ? document.activeElement : undefined);
    }
    const frame = requestAnimationFrame(syncFromHash);
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener(PROJECT_OPEN_EVENT, handleOpenEvent);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener(PROJECT_OPEN_EVENT, handleOpenEvent);
    };
  }, [all, open]);

  // Página parada por baixo enquanto o case está aberto.
  useEffect(() => {
    if (!openSlug) return;
    lockScroll();
    return () => unlockScroll();
  }, [openSlug]);

  return (
    <>
      <div className="mt-16 hidden lg:block">
        <ProjectTheater projects={systems} onOpen={open} />
      </div>
      <div className="mt-12 lg:hidden">
        <ProjectStack projects={systems} onOpen={open} />
      </div>

      <SitesList projects={sites} onOpen={open} />

      <AnimatePresence>
        {openProject && (
          <ProjectCase
            key="project-case"
            project={openProject}
            position={{ index: openIndex, total: all.length }}
            onClose={close}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </>
  );
}
