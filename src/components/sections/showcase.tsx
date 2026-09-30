import { ShowcaseClient } from "@/components/sections/showcase-client";
import { omsShowcase } from "@/lib/data";
import { resolvePublicImage } from "@/lib/server-image";

/**
 * Vitrine imersiva da OMS: a tela do sistema cresce até ocupar a tela
 * inteira ("entrar no aplicativo") e passa pelas telas conforme a rolagem.
 * Só entram telas cujo print existe de verdade (checagem aqui no servidor).
 */
export function Showcase() {
  const screens = omsShowcase.screens
    .map((screen) => ({ ...screen, imageSrc: resolvePublicImage(screen.image, "") }))
    .filter((screen) => screen.imageSrc !== "");

  if (screens.length === 0) return null;
  return <ShowcaseClient name={omsShowcase.name} tagline={omsShowcase.tagline} screens={screens} stats={omsShowcase.stats} />;
}
