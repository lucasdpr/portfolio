import { Reveal } from "@/components/ui/reveal";
import { TechIcon } from "@/components/ui/tech-icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { skillCategories, type SkillItem } from "@/lib/data";

// A marquee só faz sentido pra itens com logo de marca (algumas práticas,
// tipo "Design Responsivo", não têm um ícone do Simple Icons).
const allSkills = skillCategories
  .flatMap((category) => category.items)
  .filter((item): item is SkillItem & { slug: string } => Boolean(item.slug));

function CategoryCard({ title, items, className = "" }: { title: string; items: SkillItem[]; className?: string }) {
  return (
    <SpotlightCard className={`rounded-3xl border border-border p-8 ${className}`}>
      <h3 className="font-mono text-sm text-muted">{title}</h3>
      <div className="mt-6 flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item.name}
            className="group flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/10"
          >
            {item.slug && <TechIcon slug={item.slug} label={item.name} size={18} />}
            {item.name}
          </span>
        ))}
      </div>
    </SpotlightCard>
  );
}

export function Skills() {
  const [frontend, ...rest] = skillCategories;

  return (
    <section id="skills" className="border-t border-border bg-surface py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <SectionLabel index="02" text="stack" />
          <WordReveal
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            words={["Minha", "caixa", "de", { text: "ferramentas.", className: "text-gradient" }]}
          />
          <Reveal delay={0.1}>
            <p className="mt-4 text-muted">
              Um retrato honesto do que uso hoje, não uma lista de tudo que já toquei uma vez.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <CategoryCard
              title={frontend.title}
              items={frontend.items}
              className="h-full bg-gradient-to-br from-accent/10 via-surface-elevated to-surface-elevated"
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-4">
            {rest.map((category, index) => (
              <Reveal key={category.title} delay={0.1 * (index + 1)}>
                <CategoryCard title={category.title} items={category.items} className="bg-surface-elevated" />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-16 space-y-6 overflow-hidden border-y border-border py-8"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {[false, true].map((reverse) => (
          <div key={String(reverse)} className={`flex w-max gap-16 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
            {(reverse ? [...allSkills].reverse() : allSkills)
              .concat(reverse ? [...allSkills].reverse() : allSkills)
              .map((item, index) => (
                <span key={`${item.name}-${index}`} className="group flex items-center gap-3 text-muted">
                  <TechIcon slug={item.slug} label={item.name} size={26} />
                  <span className="font-mono text-sm whitespace-nowrap">{item.name}</span>
                </span>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}
