"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const text =
  "Não faço só telas bonitas. Construo ferramentas feitas pra usar todo dia: sistemas que funcionam sem internet, painéis que respondem perguntas e sites que trazem clientes de verdade.";

// Palavras que ganham o gradiente quando acendem.
const highlighted = new Set(["ferramentas", "todo", "dia:", "clientes", "verdade."]);

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  // Por função, não keyframes: evita a aceleração nativa (ScrollTimeline)
  // do motion, que calcula errado a opacidade ligada à rolagem.
  const opacity = useTransform(progress, (v) => 0.12 + 0.88 * Math.min(1, Math.max(0, (v - range[0]) / (range[1] - range[0]))));
  const y = useTransform(progress, range, [8, 0]);
  const isHighlight = highlighted.has(children);

  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${isHighlight ? "text-gradient" : ""}`}>
      {children}
    </motion.span>
  );
}

/**
 * Uma frase grande que "acende" palavra por palavra conforme a rolagem —
 * o progresso é ligado ao scroll (scrub), não a um timer.
 */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");

  return (
    <section aria-label="Manifesto" className="relative py-28 sm:py-40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
          <span className="h-px w-8 bg-muted" />
          no que eu acredito
        </p>
        <p
          ref={ref}
          className="flex flex-wrap gap-x-[0.28em] gap-y-1 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {words.map((word, index) => {
            const start = index / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={`${word}-${index}`} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}
