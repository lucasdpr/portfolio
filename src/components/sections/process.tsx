import { MagnifyingGlass, Notebook, Code, RocketLaunch } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";

const steps = [
  {
    icon: MagnifyingGlass,
    title: "Entender",
    description: "Converso com quem vai usar e entendo o processo de verdade antes de escrever a primeira linha de código.",
  },
  {
    icon: Notebook,
    title: "Planejar",
    description: "Modelo o banco de dados e a arquitetura a partir do fluxo real de trabalho, não do que parece bonito no papel.",
  },
  {
    icon: Code,
    title: "Construir",
    description: "Entregas pequenas, versionadas no Git e testadas, validando com quem usa a cada etapa.",
  },
  {
    icon: RocketLaunch,
    title: "Entregar",
    description: "Publico, documento e acompanho o uso real. O projeto não termina no deploy.",
  },
];

export function Process() {
  return (
    <section className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionLabel index="06" text="processo" />
        <WordReveal
          className="max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          words={["Como", "eu", { text: "trabalho.", className: "text-gradient" }]}
        />

        <div className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Linha que conecta os passos no desktop */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent lg:block" />
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={0.1 * index}>
              <SpotlightCard tilt className="group h-full overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-accent/40">
                <span
                  aria-hidden="true"
                  className="text-outline pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-bold leading-none opacity-40 transition-opacity group-hover:opacity-80"
                >
                  {index + 1}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-accent-foreground shadow-lg shadow-accent/20">
                  <step.icon size={20} weight="bold" />
                </span>
                <h3 className="relative mt-6 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
