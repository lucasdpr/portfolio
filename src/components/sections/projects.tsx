import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { Reveal } from "@/components/ui/reveal";
import { ProjectsStack } from "@/components/sections/projects-stack";
import { projects } from "@/lib/data";
import { resolvePublicImage } from "@/lib/server-image";

export function Projects() {
  // A checagem de arquivo roda aqui no servidor; a pilha de cards (efeitos
  // de rolagem) é client component e recebe o caminho já resolvido.
  const resolved = projects.map((project) => ({
    ...project,
    imageSrc: resolvePublicImage(project.screenshot, ""),
  }));

  return (
    <section id="projetos" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <SectionLabel index="03" text="projetos" />
            <WordReveal
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              words={["Coisas", "que", "eu", { text: "construí.", className: "text-gradient" }]}
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted">
              De sistemas internos com dashboard e IA a sites para clientes reais. Todos saíram do papel e estão em uso.
            </p>
          </Reveal>
        </div>

        <ProjectsStack projects={resolved} />
      </div>
    </section>
  );
}
