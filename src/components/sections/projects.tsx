import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { Reveal } from "@/components/ui/reveal";
import { ProjectsExperience } from "@/components/projects/projects-experience";
import type { ResolvedProject } from "@/components/projects/types";
import { projects } from "@/lib/data";
import { getImageSize, resolvePublicImage } from "@/lib/server-image";

export function Projects() {
  // A checagem dos arquivos de imagem roda aqui no servidor; a vitrine e o
  // case (interativos) são client components e recebem os caminhos prontos.
  const resolved: ResolvedProject[] = projects.map((project) => {
    const imageSrc = resolvePublicImage(project.screenshot, "");
    const gallery = (project.gallery ?? []).map((src) => resolvePublicImage(src, "")).filter(Boolean);
    // Print da vitrine: o `showcase` (pode ser alto) ou, sem ele, o principal.
    const showcasePath = [project.showcase, project.screenshot].find((src) => getImageSize(src));
    const showcaseSize = getImageSize(showcasePath);
    const showcase = showcasePath && showcaseSize ? { src: resolvePublicImage(showcasePath, ""), ...showcaseSize } : null;
    return { ...project, imageSrc, images: [imageSrc, ...gallery].filter(Boolean), showcase };
  });

  const systems = resolved.filter((project) => project.category === "sistema");
  const sites = resolved.filter((project) => project.category === "site");
  const live = projects.filter((project) => project.liveUrl).length;

  return (
    <section id="projetos" className="relative border-t border-border pb-28 pt-28">
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
              {projects.length} projetos: {systems.length} sistemas completos e {sites.length} sites, {live} deles no ar. Clique em qualquer projeto para ver o case completo.
            </p>
          </Reveal>
        </div>
      </div>

      <ProjectsExperience systems={systems} sites={sites} />
    </section>
  );
}
