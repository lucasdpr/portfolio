/** Mostra um aviso curto na tela (quem desenha é components/ui/toaster.tsx). */
export const TOAST_EVENT = "toast:show";

export type ToastDetail = { message: string };

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { message } }));
}

/**
 * Copia um texto e avisa. Usa a API de área de transferência e, se ela não
 * estiver disponível (navegador antigo, página sem HTTPS), o jeito antigo.
 */
export async function copyText(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  showToast(message);
}
