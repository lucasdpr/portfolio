import { ArrowUp, PaperPlaneTilt, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { TechIcon } from "@/components/ui/tech-icon";
import { LocalTime } from "@/components/ui/local-time";
import { profile, socialLinks } from "@/lib/data";
import { gmailComposeUrl } from "@/lib/contact-links";

const iconClass = "flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Hora local · {profile.location.split(" - ")[0]}</p>
            <p className="mt-2 font-mono text-3xl font-semibold text-foreground">
              <LocalTime />
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              if (social.slug === "email") {
                return (
                  <a key={social.label} href={gmailComposeUrl(profile.email)} target="_blank" rel="noreferrer" aria-label={social.label} className={iconClass}>
                    <PaperPlaneTilt size={17} weight="bold" />
                  </a>
                );
              }
              // O Simple Icons não serve mais o logo do LinkedIn (pedido de
              // remoção da Microsoft) — usamos o ícone da Phosphor, que vem
              // empacotado localmente.
              if (social.slug === "linkedin") {
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className={iconClass}>
                    <LinkedinLogo size={17} weight="bold" />
                  </a>
                );
              }
              return (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className={`group ${iconClass}`}>
                  <TechIcon slug={social.slug} label={social.label} size={17} />
                </a>
              );
            })}
          </div>

          <a href="#inicio" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent">
            Voltar ao topo
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all group-hover:-translate-y-1 group-hover:border-accent">
              <ArrowUp size={14} weight="bold" />
            </span>
          </a>
        </div>

        <p className="mt-12 flex flex-col gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:justify-between">
          <span>© {year} {profile.fullName}</span>
          <span>Feito à mão com Next.js, Three.js e Tailwind CSS.</span>
        </p>
      </div>

      {/* Assinatura gigante saindo pela borda de baixo */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none text-center text-[26vw] font-bold leading-[0.75] tracking-tighter text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 14%, transparent), transparent 85%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {profile.firstName}
      </p>
    </footer>
  );
}
