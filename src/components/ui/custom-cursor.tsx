"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const INTERACTIVE = "a, button, input, textarea, select, label, [data-cursor]";

/**
 * Anel que segue o cursor com atraso de mola e cresce sobre links/botões.
 * Só aparece com mouse (pointer: fine) — em toque não faz sentido. O
 * cursor nativo continua visível: o anel é um enfeite, não um substituto.
 * Escreve em motion values e direto no DOM (nunca useState) pra não
 * re-renderizar nada a cada movimento.
 */
export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;
    ring.style.opacity = "1";

    function handleMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
    }

    function handleOver(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
      const text = target?.dataset.cursor ?? "";
      ring!.dataset.state = text ? "label" : target ? "hover" : "idle";
      label!.textContent = text;
    }

    function handleLeave() {
      ring!.style.opacity = "0";
    }
    function handleEnter() {
      ring!.style.opacity = "1";
    }

    window.addEventListener("pointermove", handleMove);
    document.addEventListener("pointerover", handleOver);
    document.documentElement.addEventListener("pointerleave", handleLeave);
    document.documentElement.addEventListener("pointerenter", handleEnter);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handleOver);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      document.documentElement.removeEventListener("pointerenter", handleEnter);
    };
  }, [reduceMotion, x, y]);

  return (
    <motion.div
      ref={ringRef}
      aria-hidden="true"
      data-state="idle"
      style={{ x: ringX, y: ringY, opacity: 0 }}
      className="group/cursor pointer-events-none fixed left-0 top-0 z-[95] hidden md:block"
    >
      <div className="flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/70 transition-[width,height,background-color,border-color] duration-300 ease-out group-data-[state=hover]/cursor:h-14 group-data-[state=hover]/cursor:w-14 group-data-[state=hover]/cursor:bg-accent/10 group-data-[state=label]/cursor:h-20 group-data-[state=label]/cursor:w-20 group-data-[state=label]/cursor:border-accent group-data-[state=label]/cursor:bg-accent">
        <span
          ref={labelRef}
          className="text-[11px] font-semibold uppercase tracking-wider text-accent-foreground opacity-0 transition-opacity duration-200 group-data-[state=label]/cursor:opacity-100"
        />
      </div>
    </motion.div>
  );
}
