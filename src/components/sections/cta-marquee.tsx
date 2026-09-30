"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";

const phrase = ["Vamos construir algo", "✦", "Sistemas", "✦", "Sites", "✦", "PWAs", "✦"];

/**
 * Faixa gigante antes do contato. As duas linhas andam em sentidos opostos
 * conforme a rolagem (não em loop): o movimento acompanha o scroll.
 */
export function CtaMarquee() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const line = [...phrase, ...phrase, ...phrase];

  return (
    <section ref={ref} aria-label="Chamada para contato" className="overflow-hidden border-t border-border py-20">
      <Link href="#contato" data-cursor="Contato" className="block space-y-2">
        <motion.p style={{ x: xLeft }} className="flex w-max gap-8 whitespace-nowrap text-6xl font-bold tracking-tight text-foreground sm:text-8xl">
          {line.map((word, index) => (
            <span key={index} className={word === "✦" ? "text-gradient" : ""}>
              {word}
            </span>
          ))}
        </motion.p>
        <motion.p style={{ x: xRight }} aria-hidden="true" className="text-outline flex w-max gap-8 whitespace-nowrap text-6xl font-bold tracking-tight sm:text-8xl">
          {line.map((word, index) => (
            <span key={index}>{word}</span>
          ))}
        </motion.p>
      </Link>
    </section>
  );
}
