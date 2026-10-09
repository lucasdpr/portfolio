"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { INTRO_EVENT, isIntroDone } from "@/lib/intro";
import { SCROLL_LOCK_EVENT, SCROLL_UNLOCK_EVENT } from "@/lib/scroll-lock";

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
    function stop() {
      lenis.stop();
    }
    if (!isIntroDone()) {
      lenis.stop();
      window.addEventListener(INTRO_EVENT, start, { once: true });
    }

    // Modais (ex: case de projeto) pausam a rolagem da página por baixo.
    window.addEventListener(SCROLL_LOCK_EVENT, stop);
    window.addEventListener(SCROLL_UNLOCK_EVENT, start);

    return () => {
      window.removeEventListener(INTRO_EVENT, start);
      window.removeEventListener(SCROLL_LOCK_EVENT, stop);
      window.removeEventListener(SCROLL_UNLOCK_EVENT, start);
      lenis.destroy();
    };
  }, []);

  return null;
}
