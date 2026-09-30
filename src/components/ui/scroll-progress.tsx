"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Barra fina no topo da página que enche conforme a rolagem. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
    />
  );
}
