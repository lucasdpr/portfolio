"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { ResolvedProject } from "@/components/projects/types";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type SitesListProps = {
  projects: ResolvedProject[];
  onOpen: (slug: string, trigger: HTMLElement) => void;
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Sites em lista tipográfica. Com mouse, uma prévia do site segue o cursor
 * e desliza de um print para o outro ao trocar de linha (inclina conforme a
 * velocidade). Em toque, cada linha mostra a miniatura. Clique abre o case.
 */
export function SitesList({ projects, onOpen }: SitesListProps) {
  const reduceMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  // Último print mostrado: a prévia continua nele enquanto encolhe ao sair.
  const [shown, setShown] = useState(0);
  // A prévia fica fixa no canto da tela (invisível): sem isso, os prints
  // seriam baixados logo ao abrir a página, mesmo sem ninguém chegar aqui.
  const listRef = useRef<HTMLUListElement>(null);
  const nearList = useInView(listRef, { once: true, margin: "400px 0px" });

  function show(index: number) {
    setHovered(index);
    setShown(index);
  }

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });
  const velocityX = useVelocity(springX);
  const rotate = useTransform(velocityX, (v) => (reduceMotion ? 0 : Math.max(-10, Math.min(10, v / 120))));

  function handlePointerMove(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;
    x.set(event.clientX);
    y.set(event.clientY);
  }

  function handlePointerEnter(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType !== "mouse") return;
    // Sem isso a prévia "voa" do canto da tela até o mouse na primeira vez.
    x.jump(event.clientX);
    y.jump(event.clientY);
    springX.jump(event.clientX);
    springY.jump(event.clientY);
  }

  return (
    <div className="mx-auto mt-28 max-w-7xl px-4 sm:px-6 lg:mt-36 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="h-px w-8 bg-muted" />
            sites · {String(projects.length).padStart(2, "0")}
          </p>
          <h3 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Sites no ar, para clientes e demos.</h3>
        </div>
        <p className="max-w-xs text-sm text-muted">
          <span className="hidden pointer-fine:inline">Passe o mouse para ver a prévia. </span>Clique para ver o case.
        </p>
      </div>

      <ul
        ref={listRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={() => setHovered(null)}
        className="group/list mt-10 border-t border-border"
      >
        {projects.map((project, index) => (
          <motion.li
            key={project.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: index * 0.06, ease: EASE_OUT }}
            className="relative border-b border-border"
            style={{ "--project-accent": project.accent } as CSSProperties}
          >
            <button
              type="button"
              data-cursor="Ver case"
              onPointerEnter={(event) => event.pointerType === "mouse" && show(index)}
              onFocus={() => show(index)}
              onBlur={() => setHovered(null)}
              onClick={(event) => onOpen(project.slug, event.currentTarget)}
              className="group/row grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5 text-left transition-opacity duration-300 sm:gap-6 sm:py-7 lg:grid-cols-[3.5rem_minmax(0,1.25fr)_minmax(0,1fr)_auto] lg:py-9 pointer-fine:group-hover/list:opacity-35 pointer-fine:hover:!opacity-100 focus-visible:!opacity-100"
            >
              {/* Miniatura (toque) ou número (mouse) */}
              <span className="relative block aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-lg border border-border sm:w-32 pointer-fine:hidden">
                {project.imageSrc && <Image src={project.imageSrc} alt="" fill sizes="128px" className="object-cover object-left-top" />}
              </span>
              <span className="hidden font-mono text-xs text-muted pointer-fine:block">{String(index + 1).padStart(2, "0")}</span>

              <span className="min-w-0">
                <span className="block truncate text-2xl font-bold tracking-tight text-foreground transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:translate-x-3 group-hover/row:text-[color:var(--project-accent)] sm:text-4xl lg:text-5xl xl:text-6xl">
                  {project.title}
                </span>
                <span className="mt-1 block text-sm text-muted lg:hidden">{project.headline}</span>
              </span>

              <span className="hidden text-sm leading-relaxed text-muted lg:block">{project.headline}</span>

              <span className="flex items-center gap-4">
                <span className="hidden font-mono text-xs text-muted sm:block">{project.year}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-all duration-500 group-hover/row:rotate-45 group-hover/row:border-transparent group-hover/row:bg-[color:var(--project-accent)] group-hover/row:text-white sm:h-12 sm:w-12">
                  <ArrowUpRight size={16} weight="bold" />
                </span>
              </span>
            </button>
            {/* Linha na cor do site que cresce sob a linha em foco */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ background: project.accent, transform: hovered === index ? "scaleX(1)" : "scaleX(0)" }}
            />
          </motion.li>
        ))}
      </ul>

      {/* Prévia que segue o mouse (só com mouse) */}
      <motion.div
        aria-hidden="true"
        style={{ x: springX, y: springY, rotate }}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden pointer-fine:block"
      >
        <motion.div
          initial={false}
          animate={hovered !== null ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="-translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-[250px] w-[400px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            <motion.div
              initial={false}
              animate={{ y: `${-shown * 100}%` }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 26 }}
              className="h-full"
            >
              {projects.map((project) => (
                <div key={project.slug} className="relative h-full w-full">
                  {nearList && project.imageSrc && <Image src={project.imageSrc} alt="" fill sizes="400px" className="object-cover object-left-top" />}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
