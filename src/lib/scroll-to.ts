/**
 * Rola a página até uma posição. Com a rolagem suave ligada, quem anima é o
 * Lenis (components/ui/smooth-scroll.tsx escuta este evento e o cancela);
 * sem ele (toque, reduzir movimento), cai na rolagem nativa do navegador.
 */
export const SCROLL_TO_EVENT = "scroll:to";

export type ScrollToDetail = { top: number };

export function scrollToY(top: number) {
  const event = new CustomEvent<ScrollToDetail>(SCROLL_TO_EVENT, { detail: { top }, cancelable: true });
  const handledByLenis = !window.dispatchEvent(event);
  if (handledByLenis) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
