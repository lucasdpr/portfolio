import { ArrowUp, PaperPlaneTilt, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { TechIcon } from "@/components/ui/tech-icon";
import { profile, socialLinks } from "@/lib/data";
import { gmailComposeUrl } from "@/lib/contact-links";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 text-sm text-muted sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {year} {profile.firstName}. Construído com Next.js, Three.js e Tailwind CSS.
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map((social) => {
            if (social.slug === "email") {
              return (
                <a
                  key={social.label}
                  href={gmailComposeUrl(profile.email)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="transition-colors hover:text-accent"
                >
                  <PaperPlaneTilt size={18} weight="bold" />
                </a>
              );
            }
            // O Simple Icons não serve mais o logo do LinkedIn (pedido de
            // remoção da Microsoft) — usamos o ícone da Phosphor, que vem
            // empacotado localmente.
            if (social.slug === "linkedin") {
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="transition-colors hover:text-accent"
                >
                  <LinkedinLogo size={18} weight="bold" />
                </a>
              );
            }
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="group transition-colors hover:text-accent"
              >
                <TechIcon slug={social.slug} label={social.label} size={18} />
              </a>
            );
          })}
        </div>

        <a href="#inicio" className="inline-flex items-center gap-1.5 transition-colors hover:text-accent">
          Voltar ao topo <ArrowUp size={14} weight="bold" />
        </a>
      </div>
    </footer>
  );
}
