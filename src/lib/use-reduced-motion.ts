"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/**
 * `true` quando o sistema pede "reduzir movimento". Diferente do hook do
 * motion, devolve `false` durante a hidratação (igual ao HTML do servidor)
 * e só depois o valor real — assim o que muda por causa dele (estrutura,
 * textos) nunca diverge do HTML que veio do servidor.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}
