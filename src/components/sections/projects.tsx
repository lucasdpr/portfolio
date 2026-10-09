import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { Reveal } from "@/components/ui/reveal";
import { ProjectsShowcase } from "@/components/projects/projects-showcase";
import { projects } from "@/lib/data";
import { resolvePublicImage } from "@/lib/server-image";

export function Projects() {
  // A checagem dos arquivos de imagem roda aqui no servidor; a grade e o
  // case (interativos) são client components e recebem os caminhos prontos.
  const resolved = projects.map((project) => {
    const imageSrc = resolvePublicImage(project.screenshot, "");
    const gallery = (project.gallery ?? []).map((src) => resolvePublicImage(src, "")).filter(Boolean);
    return { ...project, imageSrc, images: [imageSrc, ...gallery].filter(Boolean) };
  });

  const systems = projects.filter((project) => project.category === "sistema").length;
  const sites = projects.filter((project) => project.category === "site").length;
  const live = projects.filter((project) => project.liveUrl).length;

  return (
    <section id="projetos" className="relative border-t border-border py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <SectionLabel index="01" text="projetos" />
            <WordReveal
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              words={["Coisas", "que", "eu", { text: "construí.", className: "text-gradient" }]}
            />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted">
              {projects.length} projetos: {systems} sistemas completos e {sites} sites, {live} deles no ar. Toque em um projeto para ver o case.
            </p>
          </Reveal>
        </div>

        <ProjectsShowcase projects={resolved} />
      </div>
    </section>
  );
}
