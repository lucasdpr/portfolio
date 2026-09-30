"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

type ScrambleTextProps = {
  text: string;
  className?: string;
};

/**
 * Rótulo que "decodifica" letra por letra ao entrar na tela, estilo
 * terminal. O texto final já vem renderizado no HTML (bom pra SEO e leitor
 * de tela); o embaralhamento só reescreve o conteúdo durante a animação.
 */
export function ScrambleText({ text, className = "" }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduceMotion) return;

    let frame = 0;
    let raf = 0;
    const totalFrames = text.length * 2 + 12;

    function tick() {
      const revealed = Math.max(0, Math.floor((frame - 8) / 2));
      el!.textContent = text
        .split("")
        .map((char, index) => {
          if (char === " " || index < revealed) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      frame += 1;
      if (frame <= totalFrames) raf = requestAnimationFrame(tick);
      else el!.textContent = text;
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [inView, reduceMotion, text]);

  return (
    <span ref={ref} aria-label={text} className={className}>
      {text}
    </span>
  );
}

/** Rótulo pequeno de seção: "// 02 — projetos". */
export function SectionLabel({ index, text }: { index: string; text: string }) {
  return (
    <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
      <span className="h-px w-8 bg-accent" />
      <ScrambleText text={`${index} / ${text}`} />
    </p>
  );
}
