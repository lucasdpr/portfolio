import { existsSync, readFileSync } from "node:fs";
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

/**
 * Largura e altura (em pixels) de um JPEG ou PNG dentro de `public/`, lidas
 * do cabeçalho do arquivo — sem dependência extra. A vitrine de projetos usa
 * isso pra saber se o print é alto (e precisa "rolar" dentro da janela).
 * Devolve `null` se o arquivo não existir ou não for JPEG/PNG.
 */
export function getImageSize(publicPath: string | undefined): { width: number; height: number } | null {
  if (!publicPath) return null;
  const filePath = path.join(process.cwd(), "public", publicPath);
  if (!existsSync(filePath)) return null;
  const data = readFileSync(filePath);

  // PNG: assinatura de 8 bytes e o bloco IHDR logo em seguida.
  if (data.length > 24 && data.readUInt32BE(0) === 0x89504e47) {
    return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
  }

  // JPEG: percorre os marcadores até um SOF (início do quadro), que guarda
  // as dimensões. Os outros blocos são pulados pelo tamanho declarado.
  if (data.length > 4 && data[0] === 0xff && data[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < data.length) {
      if (data[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = data[offset + 1];
      if (marker === 0xff) {
        offset += 1; // byte de preenchimento antes do marcador
        continue;
      }
      const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isFrame) {
        return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
      }
      offset += 2 + data.readUInt16BE(offset + 2);
    }
  }
  return null;
}
