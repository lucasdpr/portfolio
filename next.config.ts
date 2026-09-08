import path from "node:path";
import type { NextConfig } from "next";

// Hospedado na Vercel (roda servidor Node de verdade), que serve o site na
// raiz do domínio — por isso sem output/basePath/assetPrefix, diferente de
// quando era publicado no GitHub Pages.
const nextConfig: NextConfig = {
  // Evita que o Turbopack suba até C:\Users\lucas procurando a raiz do
  // projeto (há um package-lock.json solto por lá fora deste repositório).
  turbopack: {
    root: path.join(__dirname),
  },
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
