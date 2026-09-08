import { existsSync } from "node:fs";
import path from "node:path";
import { BASE_PATH } from "./site-config";

/**
 * Servidor apenas (usa `node:fs`, nunca importe isto num Client Component):
 * confere se um arquivo dentro de `public/` existe de verdade antes de
 * usá-lo. Se não existir, devolve o `fallback`.
 *
 * Preferimos isso a um `onError` no `<Image>` do lado do cliente: a
 * checagem acontece uma vez, no servidor, antes da página ser enviada —
 * sem depender de lazy-loading/onError disparar corretamente no navegador.
 *
 * Também prefixa o caminho com BASE_PATH: com `images.unoptimized: true`
 * (necessário pro GitHub Pages), o `next/image` não adiciona o prefixo
 * sozinho pra imagens locais como faz com os outros assets.
 */
export function resolvePublicImage(preferred: string | undefined, fallback: string): string {
  if (!preferred) return fallback;
  const filePath = path.join(process.cwd(), "public", preferred);
  return existsSync(filePath) ? `${BASE_PATH}${preferred}` : fallback;
}
