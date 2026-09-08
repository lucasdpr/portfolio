import { MagnifyingGlass, Notebook, Code, RocketLaunch } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const steps = [
  {
    icon: MagnifyingGlass,
    title: "Entender",
    description: "Antes de programar, entendo o processo de verdade, do jeito que aprendi a fazer antes de mexer numa máquina.",
  },
  {
    icon: Notebook,
    title: "Planejar",
    description: "Modelo o banco de dados e a arquitetura a partir do fluxo real de trabalho, não do que parece bonito no papel.",
  },
  {
    icon: Code,
    title: "Construir",
    description: "Programo com atenção a detalhe e testo cada parte, a mesma disciplina que uma parada de máquina exige.",
  },
  {
    icon: RocketLaunch,
    title: "Entregar",
    description: "Documento o que foi feito e acompanho o resultado na prática, não só até o deploy.",
  },
];

export function Process() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Como eu trabalho</h2>
          <p className="mt-4 text-muted">
            O mesmo processo que aprendi na manutenção industrial, aplicado a cada projeto que construo.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={0.08 * index}>
              <SpotlightCard tilt className="h-full rounded-3xl border border-border bg-surface p-6">
                <span className="font-mono text-xs text-muted">0{index + 1}</span>
                <step.icon size={22} weight="bold" className="mt-3 text-accent" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
