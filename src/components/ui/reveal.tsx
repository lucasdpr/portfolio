"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  /** Se definido, anima quando virar `true` em vez de ao entrar na tela. */
  play?: boolean;
};

/** Revela o conteúdo com um leve fade + subida ao entrar na viewport. */
export function Reveal({ children, delay = 0, className = "", y = 24, play }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const trigger =
    play === undefined
      ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.3 } }
      : { animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y } };
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y }}
      {...trigger}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
