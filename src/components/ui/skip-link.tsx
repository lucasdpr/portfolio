"use client";

/**
 * Primeiro item da página para quem navega pelo teclado: pula o menu e vai
 * direto ao conteúdo. O foco é movido pelo código porque a rolagem suave
 * (Lenis) intercepta links com "#" e o navegador não moveria o foco sozinho.
 */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      onClick={() => document.getElementById("conteudo")?.focus({ preventScroll: true })}
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition-transform focus:translate-y-0"
    >
      Pular para o conteúdo
    </a>
  );
}
