import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { Counter } from "@/components/ui/counter";
import { profile, projects, skillCategories } from "@/lib/data";

export function About() {
  const stats = [
    { value: projects.filter((project) => project.category === "sistema").length, suffix: "", label: "sistemas completos" },
    { value: projects.filter((project) => project.liveUrl).length, suffix: "", label: "projetos publicados" },
    // Contado no código da API da OMS (routers/*.py: 52 GET + 68 POST).
    { value: 120, suffix: "", label: "endpoints na API da OMS" },
    { value: skillCategories.flatMap((category) => category.items).length, suffix: "", label: "tecnologias que uso" },
  ];

  const facts = [
    { label: "Formação", value: profile.education },
    { label: "Baseado em", value: profile.location },
  ];

  return (
    <section id="sobre" className="relative overflow-hidden border-t border-border py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <Reveal>
          <ProfilePhoto />
        </Reveal>

        <div>
          <SectionLabel index="01" text="sobre mim" />
          <WordReveal
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            words={["Do", "banco", "de", "dados", "à", { text: "interface.", className: "text-gradient" }]}
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.bio}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs text-muted">{stat.label}</dt>
                  <dd className="text-gradient text-4xl font-bold tabular-nums sm:text-5xl">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
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
              className="group mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <DownloadSimple size={16} weight="bold" className="transition-transform group-hover:translate-y-0.5" />
              Baixar currículo
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
