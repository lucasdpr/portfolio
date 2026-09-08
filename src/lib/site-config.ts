/**
 * Caminho base do site quando publicado no GitHub Pages, que serve o
 * repositório em `usuario.github.io/<nome-do-repo>` (um subcaminho, não a
 * raiz). Usado tanto em `next.config.ts` quanto em qualquer link/arquivo
 * referenciado diretamente (fora de `next/link` e `next/image`, que já
 * lidam com isso sozinhos).
 *
 * Trocando de hospedagem pra algo que serve na raiz (Vercel, domínio
 * próprio), é só mudar pra string vazia "" aqui.
 */
export const BASE_PATH = "";
