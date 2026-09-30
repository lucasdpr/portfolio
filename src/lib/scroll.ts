/** Progresso de 0 a 1 de `progress` dentro do trecho [start, end]. */
export function segment(progress: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

/** Curva suave de entrada e saída (cúbica). */
export function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}
