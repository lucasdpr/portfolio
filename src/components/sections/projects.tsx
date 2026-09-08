import Image from "next/image";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { projects, type Project } from "@/lib/data";
import { resolvePublicImage } from "@/lib/server-image";

function ProjectLinks({ liveUrl, repoUrl }: Pick<Project, "liveUrl" | "repoUrl">) {
  if (!liveUrl && !repoUrl) return null;

  return (
    <div className="mt-5 flex items-center gap-5 text-sm font-medium">
      {liveUrl && (
        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-accent"
        >
          Ver ao vivo <ArrowUpRight size={15} weight="bold" />
        </a>
      )}
      {repoUrl && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
        >
          <GithubLogo size={16} weight="bold" /> Código
        </a>
      )}
    </div>
  );
}

export function Projects() {
  // O OMS já ganhou uma seção própria e mais completa logo acima — aqui
  // ficam só os outros, pra não contar a mesma história duas vezes.
  const otherProjects = projects.filter((project) => !project.title.startsWith("OMS"));

  return (
    <section id="projetos" className="border-t border-border py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Outros projetos</h2>
          <p className="mt-4 text-muted">Projetos reais, entregues para clientes reais e no ar até hoje.</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {otherProjects.map((project, index) => (
            <Reveal key={project.title} delay={0.08 * index}>
              <SpotlightCard
                tilt
                className="group rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-accent/50"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={resolvePublicImage(project.screenshot, project.image)}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 45vw, 90vw"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{project.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                <ProjectLinks liveUrl={project.liveUrl} repoUrl={project.repoUrl} />
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
