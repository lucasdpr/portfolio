"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";

type Word = string | { text: string; className?: string };

type WordRevealProps = {
  words: Word[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
};

/**
 * Título que sobe palavra por palavra, cada uma saindo de trás de uma
 * "máscara" (overflow hidden). Palavras em objeto recebem classe própria
 * (ex: gradiente).
 */
export function WordReveal({ words, className = "", delay = 0, as = "h2" }: WordRevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = as === "h1" ? motion.h1 : motion.h2;
  const items = words.map((word) => (typeof word === "string" ? { text: word, className: "" } : word));
  const label = items.map((item) => item.text).join(" ");

  return (
    <Tag
      aria-label={label}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      className={className}
    >
      {items.map((item, index) => (
        <Fragment key={`${item.text}-${index}`}>
          <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${item.className ?? ""}`}
              variants={{
                hidden: reduceMotion ? { y: 0 } : { y: "110%", rotate: 4 },
                visible: { y: 0, rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {item.text}
            </motion.span>
          </span>
          {index < items.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
