import Image from "next/image";
import { profile } from "@/lib/data";
import { resolvePublicImage } from "@/lib/server-image";

/**
 * Mostra a foto real assim que `public/profile.jpg` existir. Até lá, cai
 * para um avatar com a inicial do nome — a checagem roda no servidor, não
 * depende de nada acontecer no navegador.
 */
export function ProfilePhoto() {
  const initial = profile.firstName.charAt(0).toUpperCase();
  const photoSrc = resolvePublicImage("/profile.jpg", "");
  const hasPhoto = photoSrc !== "";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-border bg-surface-elevated">
      {hasPhoto ? (
        <Image
          src={photoSrc}
          alt={`Foto de ${profile.firstName}`}
          fill
          priority
          sizes="(min-width: 1024px) 24rem, 90vw"
          className="object-cover"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-mono text-[9rem] font-bold leading-none text-foreground/10">
              {initial}
            </span>
          </div>
        </>
      )}

      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div>
          <p className="text-sm font-semibold text-foreground">{profile.firstName}</p>
          <p className="text-xs text-muted">{profile.role}</p>
        </div>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
      </div>
    </div>
  );
}
