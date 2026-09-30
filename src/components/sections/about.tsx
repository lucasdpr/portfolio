import { ArrowRight, DownloadSimple, MagnifyingGlass, ShieldCheck, Stack } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { ProfilePhoto } from "@/components/ui/profile-photo";
import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { profile, strengths } from "@/lib/data";

const strengthIcons = [MagnifyingGlass, Stack, ShieldCheck];

/**
 * Responde, nessa ordem, o que o recrutador quer saber: quem é, o que
 * procura e por que vale chamar pra entrevista.
 */
export function About() {
  const facts = [
    { label: "Procurando", value: profile.lookingFor },
    { label: "Formação", value: profile.education },
    { label: "Local", value: profile.location },
  ];

  return (
    <section id="sobre" className="relative overflow-hidden border-t border-border py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-16 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <Reveal className="lg:sticky lg:top-28">
          <ProfilePhoto />
        </Reveal>

        <div>
          <SectionLabel index="03" text="sobre mim" />
          <WordReveal
            className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl"
            words={["Mecânico", "de", "formação,", { text: "desenvolvedor", className: "text-gradient" }, { text: "por", className: "text-gradient" }, { text: "escolha.", className: "text-gradient" }]}
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.bio}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-background px-5 py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-foreground">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <h3 className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-accent">Por que me chamar</h3>
            <ul className="mt-5 space-y-5">
              {strengths.map((strength, index) => {
                const Icon = strengthIcons[index % strengthIcons.length];
                return (
                  <li key={strength.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-accent-foreground shadow-lg shadow-accent/20">
                      <Icon size={18} weight="bold" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{strength.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{strength.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={profile.resumeUrl}
                download
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform active:scale-95"
              >
                <DownloadSimple size={16} weight="bold" className="transition-transform group-hover:translate-y-0.5" />
                Baixar currículo
              </a>
              <a
                href="#contato"
                className="group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                Falar comigo
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
