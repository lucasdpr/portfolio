import { ArrowRight, DownloadSimple, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { profile, projects, socialLinks } from "@/lib/data";

/** Sobre curto: quem é, o que já fez (em fatos) e o que quer. Sem adjetivos. */
export function About() {
  const systems = projects.filter((project) => project.category === "sistema").length;
  const sites = projects.filter((project) => project.category === "site").length;
  const facts = [
    // Contado no código da API da OMS (routers/*.py: 52 GET + 68 POST).
    { value: "120", label: "endpoints na API da OMS" },
    { value: String(projects.length), label: `projetos: ${systems} sistemas e ${sites} sites` },
    { value: String(projects.filter((project) => project.liveUrl).length), label: "projetos no ar" },
    { value: "2027", label: "formatura em Eng. de Software" },
  ];
  const linkedin = socialLinks.find((link) => link.slug === "linkedin")?.href;

  return (
    <section id="sobre" className="relative overflow-hidden border-t border-border py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <Reveal>
          <ProfilePhoto />
        </Reveal>

        <div>
          <SectionLabel index="03" text="sobre mim" />
          <WordReveal
            className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl"
            words={["Desenvolvedor", { text: "full", className: "text-gradient" }, { text: "stack.", className: "text-gradient" }]}
          />

          <Reveal delay={0.1}>
            <div className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-muted">
              {profile.bio.map((paragraph, index) => (
                <p key={index} className={index === profile.bio.length - 1 ? "font-medium text-foreground" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col border-t border-border pt-4">
                  <dt className="mt-1 text-xs leading-snug text-muted">{fact.label}</dt>
                  <dd className="order-first font-mono text-3xl font-bold tracking-tight text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <a
                href={profile.resumeUrl}
                download
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform active:scale-95"
              >
                <DownloadSimple size={16} weight="bold" className="transition-transform group-hover:translate-y-0.5" />
                Baixar currículo
              </a>
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <LinkedinLogo size={16} weight="bold" />
                  LinkedIn
                </a>
              )}
              <a href="#contato" className="group inline-flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-muted transition-colors hover:text-accent">
                Falar comigo
                <ArrowRight size={15} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
