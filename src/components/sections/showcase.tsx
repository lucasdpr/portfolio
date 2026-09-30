import { ShowcaseClient } from "@/components/sections/showcase-client";
import { omsShowcase } from "@/lib/data";
import { resolvePublicImage } from "@/lib/server-image";

/**
 * Vitrine estilo página de produto da Apple, dedicada à OMS: um notebook
 * 3D que abre e passa pelas telas do sistema conforme a rolagem. Só entram
 * telas cujo print existe de verdade (checagem feita aqui no servidor).
 */
export function Showcase() {
  const screens = omsShowcase.screens
    .map((screen) => ({ ...screen, imageSrc: resolvePublicImage(screen.image, "") }))
    .filter((screen) => screen.imageSrc !== "")
    .slice(0, 3);

  if (screens.length === 0) return null;
  return <ShowcaseClient name={omsShowcase.name} tagline={omsShowcase.tagline} screens={screens} />;
}
