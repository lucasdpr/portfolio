import { Reveal } from "@/components/ui/reveal";
import { timeline } from "@/lib/data";

export function Experience() {
  return (
    <section id="trajetoria" className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Trajetória</h2>
          <p className="mt-4 max-w-xl text-muted">
            De mecânico industrial a desenvolvedor: os marcos que me trouxeram até aqui.
          </p>
        </Reveal>

        <ol className="relative mt-14 space-y-12 border-l border-border pl-8">
          {timeline.map((item, index) => (
            <li key={item.title} className="relative">
              <Reveal delay={0.08 * index}>
                <span className="absolute -left-[2.35rem] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-accent" />
                <p className="font-mono text-xs text-accent">{item.period}</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted">{item.place}</p>
                <p className="mt-2 max-w-xl leading-relaxed text-muted">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
