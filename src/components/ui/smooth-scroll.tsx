"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { INTRO_EVENT, isIntroDone } from "@/lib/intro";

/**
 * Rolagem suave com inércia (Lenis). Continua sendo a rolagem nativa por
 * baixo — os efeitos ligados ao scroll (motion/useScroll) funcionam igual.
 * Fica travada enquanto a intro está na tela. Desliga com
 * prefers-reduced-motion e em telas de toque (lá a rolagem nativa é melhor).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.1 });

    function start() {
      lenis.start();
    }
    if (!isIntroDone()) {
      lenis.stop();
      window.addEventListener(INTRO_EVENT, start, { once: true });
    }

    return () => {
      window.removeEventListener(INTRO_EVENT, start);
      lenis.destroy();
    };
  }, []);

  return null;
}
