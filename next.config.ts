import path from "node:path";
import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/site-config";

// GitHub Pages serve o repositório em https://lucasdpr.github.io/portfolio/
// (um subcaminho, não a raiz), e não roda servidor Node — só arquivos
// estáticos. Os três campos abaixo (output/basePath/assetPrefix) existem
// só por causa disso. Se um dia trocar pra Vercel (que roda servidor de
// verdade), pode remover os três (e zerar BASE_PATH em site-config.ts).
const nextConfig: NextConfig = {
  // Evita que o Turbopack suba até C:\Users\lucas procurando a raiz do
  // projeto (há um package-lock.json solto por lá fora deste repositório).
  turbopack: {
    root: path.join(__dirname),
  },
  output: "export",
  basePath: BASE_PATH,
  assetPrefix: `${BASE_PATH}/`,
  images: {
    // GitHub Pages não roda o otimizador de imagem do Next (precisa de
    // servidor). Sem isso, todo <Image> de fora do domínio quebraria.
    unoptimized: true,
    remotePatterns: [
      // Placeholder project screenshots (see src/lib/data.ts) — safe to
      // remove once every project has a real image.
      { protocol: "https", hostname: "picsum.photos" },
      // Avatar real do GitHub (seção "GitHub, ao vivo").
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
