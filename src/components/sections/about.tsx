import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { profile, projects } from "@/lib/data";

export function About() {
  const facts = [
    { label: "Formação", value: profile.education },
    { label: "Baseado em", value: profile.location },
    { label: "Projetos no ar", value: `${projects.length}` },
    { label: "Disponibilidade", value: profile.availableForWork ? "Aberto a propostas" : "Ocupado agora" },
  ];

  return (
    <section id="sobre" className="border-t border-border py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Reveal>
          <ProfilePhoto />
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Sobre mim</h2>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{profile.bio}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-background px-5 py-4">
                <dt className="text-xs text-muted">{fact.label}</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href={profile.resumeUrl}
            download
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <DownloadSimple size={16} weight="bold" />
            Baixar currículo
          </a>
        </Reveal>
      </div>
    </section>
  );
}
