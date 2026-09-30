"use client";

import { useSyncExternalStore } from "react";
import { INTRO_EVENT, INTRO_STORAGE_KEY } from "./intro-script";

/**
 * A intro (preloader) roda só na primeira visita da sessão. Um script
 * inline no <head> (ver layout.tsx) marca `data-intro="skip"` no <html>
 * antes da página pintar quando ela já foi vista — assim ela nem aparece.
 * Na primeira visita, a própria intro marca `"done"` ao terminar.
 * Os componentes do Hero esperam este sinal pra começar a animar.
 */
export { INTRO_EVENT };

function subscribe(callback: () => void) {
  window.addEventListener(INTRO_EVENT, callback);
  return () => window.removeEventListener(INTRO_EVENT, callback);
}

export function isIntroDone() {
  const state = document.documentElement.dataset.intro;
  return state === "done" || state === "skip";
}

export function finishIntro() {
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Modo privado/storage bloqueado: a intro só volta a aparecer, sem problema.
  }
  window.dispatchEvent(new Event(INTRO_EVENT));
}

export function useIntroDone() {
  return useSyncExternalStore(subscribe, isIntroDone, () => false);
}
