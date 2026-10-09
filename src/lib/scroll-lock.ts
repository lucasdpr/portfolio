/**
 * Trava/destrava a rolagem da página (ex: enquanto um modal está aberto).
 * A rolagem suave (Lenis, em components/ui/smooth-scroll.tsx) escuta estes
 * eventos; sem Lenis (toque, reduzir movimento), o overflow do <html> basta.
 */
export const SCROLL_LOCK_EVENT = "scroll:lock";
export const SCROLL_UNLOCK_EVENT = "scroll:unlock";

export function lockScroll() {
  document.documentElement.style.overflow = "hidden";
  window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
}
