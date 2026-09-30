/**
 * Constantes da intro sem nenhuma dependência de cliente — este módulo é
 * importado tanto pelo layout (servidor) quanto por lib/intro.ts.
 */
export const INTRO_EVENT = "intro:done";
export const INTRO_STORAGE_KEY = "intro-seen";

/** Roda no <head> antes da página pintar: pula a intro em visitas repetidas. */
export const introInitScript = `try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="skip"}catch(e){document.documentElement.dataset.intro="skip"}`;
