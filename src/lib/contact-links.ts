/**
 * Monta um link que abre a tela de "nova mensagem" do Gmail direto no
 * navegador, já preenchida.
 *
 * Por que não usar `mailto:`? Porque `mailto:` só funciona se a pessoa
 * tiver um app de e-mail de verdade (Outlook, Mail...) configurado como
 * padrão no aparelho. Quem usa Gmail só pelo navegador não tem isso — o
 * link `mailto:` simplesmente não faz nada quando clicado, sem nenhum
 * aviso de erro. Esse link do Gmail abre em qualquer navegador, sem
 * depender de nada estar instalado.
 */
export function gmailComposeUrl(to: string, options?: { subject?: string; body?: string }) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to });
  if (options?.subject) params.set("su", options.subject);
  if (options?.body) params.set("body", options.body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
