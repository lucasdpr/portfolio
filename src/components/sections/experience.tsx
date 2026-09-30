"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { timeline } from "@/lib/data";

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  // A linha da timeline "se desenha" conforme a lista passa pela tela.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="trajetoria" className="border-t border-border bg-surface py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="07" text="trajetória" />
        <WordReveal
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          words={["O", "caminho", "até", { text: "aqui.", className: "text-gradient" }]}
        />
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl text-muted">
            Uma base técnica na indústria e a engenharia de software em paralelo: aprendi a entender o problema antes de propor a solução.
          </p>
        </Reveal>

        <ol ref={listRef} className="relative mt-16 space-y-14 pl-10">
          <span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY }}
            className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3"
          />
          {timeline.map((item, index) => (
            <li key={item.title} className="relative">
              <Reveal delay={0.05 * index}>
                <span className="absolute -left-10 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-accent bg-surface">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                <p className="font-mono text-xs text-accent">{item.period}</p>
                <h3 className="mt-2 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted">{item.place}</p>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
