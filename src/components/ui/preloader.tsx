"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import { finishIntro, isIntroDone } from "@/lib/intro";
import { profile } from "@/lib/data";

/**
 * Tela de abertura: contador de 0 a 100 + nome, depois a cortina sobe.
 * Aparece uma vez por sessão (ver lib/intro.ts). Some via CSS quando o
 * <html> já está marcado — sem piscar na tela em visitas seguintes.
 */
export function Preloader() {
  const countRef = useRef<HTMLSpanElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (isIntroDone()) return;
    const controls = animate(0, 100, {
      duration: 1.3,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (latest) => {
        if (countRef.current) countRef.current.textContent = String(Math.round(latest)).padStart(3, "0");
      },
      onComplete: () => {
        setLeaving(true);
        finishIntro();
      },
    });
    return () => controls.stop();
  }, []);

  if (gone) return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={leaving ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leaving && setGone(true)}
      className="preloader fixed inset-0 z-[90] flex flex-col justify-between bg-background p-6 sm:p-10"
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted">
        <span>
          {profile.firstName}
          <span className="text-accent">.</span>dev
        </span>
        <span>Portfólio · {new Date().getFullYear()}</span>
      </div>

      <div className="overflow-hidden">
        <motion.p
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl"
        >
          {profile.fullName.split(" ").slice(0, 2).join(" ")}
          <span className="text-gradient">.</span>
        </motion.p>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="h-px flex-1 overflow-hidden bg-border">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
            className="h-full origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
          />
        </div>
        <span ref={countRef} className="font-mono text-6xl font-bold tabular-nums text-foreground sm:text-8xl">
          000
        </span>
      </div>
    </motion.div>
  );
}
