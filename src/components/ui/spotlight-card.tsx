"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  /** Além do brilho, inclina levemente o card em 3D seguindo o cursor. */
  tilt?: boolean;
};

/**
 * Envolve um card com um brilho sutil que segue o cursor (e, opcionalmente,
 * uma leve inclinação 3D). Escreve direto no DOM via ref a cada movimento
 * do mouse — nunca useState — pra não re-renderizar a árvore inteira.
 */
export function SpotlightCard({ children, className = "", tilt = false }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);

    if (tilt && !reduceMotion) {
      const rotateY = (x / bounds.width - 0.5) * 6;
      const rotateX = (y / bounds.height - 0.5) * -6;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }

  function handlePointerLeave() {
    if (tilt && ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group/spotlight relative ${tilt ? "transition-transform duration-200 ease-out will-change-transform" : ""} ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--glow), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
