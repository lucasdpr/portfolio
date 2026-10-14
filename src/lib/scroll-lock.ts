/**
 * Trava/destrava a rolagem da página (ex: enquanto um modal está aberto).
 * A rolagem suave (Lenis, em components/ui/smooth-scroll.tsx) escuta estes
 * eventos; sem Lenis (toque, reduzir movimento), o overflow do <html> basta.
 *
 * Conta quantos travaram: se a paleta de comandos fecha no mesmo instante em
 * que um case abre, a página só destrava quando os dois tiverem soltado.
 */
export const SCROLL_LOCK_EVENT = "scroll:lock";
export const SCROLL_UNLOCK_EVENT = "scroll:unlock";

let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  document.documentElement.style.overflow = "hidden";
  window.dispatchEvent(new Event(SCROLL_LOCK_EVENT));
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.documentElement.style.overflow = "";
  window.dispatchEvent(new Event(SCROLL_UNLOCK_EVENT));
}
