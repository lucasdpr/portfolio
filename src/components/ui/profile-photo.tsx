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
    <div className="glow-border relative mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem]">
    <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-accent/30 via-accent-2/20 to-transparent blur-3xl" />
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-surface-elevated">
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
    </div>
  );
}
