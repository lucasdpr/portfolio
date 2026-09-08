import Image from "next/image";
import { ArrowUpRight, CircleDashed, MapTrifold, Wrench, RocketLaunch } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { projects } from "@/lib/data";
import { resolvePublicImage } from "@/lib/server-image";

const chapters = [
  {
    icon: MapTrifold,
    title: "O problema",
    body: "Na oficina de moldes e segmentos da CSN, cada inspeção e reparo de equipamento de lingotamento contínuo era registrado em papel. Sem histórico centralizado, sem rastreabilidade, sem visibilidade pra gerência acompanhar o que realmente acontece no chão de fábrica.",
  },
  {
    icon: Wrench,
    title: "O que eu construí",
    body: "Uma API em Python com FastAPI, banco PostgreSQL (Neon) pra registrar cada inspeção com histórico completo, e um front-end em PWA pensado pra funcionar direto no celular, dentro da oficina, mesmo sem sinal forte.",
  },
  {
    icon: CircleDashed,
    title: "Como modelei",
    body: "Não parti de suposições. Modelei o banco e as rotas a partir do fluxo de trabalho que eu mesmo executo todos os dias como mecânico de manutenção nas MCC 2, 3 e 4.",
  },
  {
    icon: RocketLaunch,
    title: "Onde está agora",
    body: "Publicado no Render e em fase de apresentação à gerência para aprovação de implantação oficial. O próximo passo é sair do meu uso pessoal e virar ferramenta da equipe inteira.",
  },
];

export function OmsCase() {
  const oms = projects.find((project) => project.title.startsWith("OMS"));
  if (!oms) return null;

  return (
    <section className="border-t border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            OMS: o sistema que nasceu na oficina
          </h2>
          <p className="mt-4 text-muted">
            Meu projeto mais completo até hoje, construído pra resolver um problema que eu via de perto todo dia.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-border">
              <Image
                src={resolvePublicImage(oms.screenshot, oms.image)}
                alt={oms.title}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>
            {oms.liveUrl && (
              <a
                href={oms.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
              >
                Ver ao vivo <ArrowUpRight size={15} weight="bold" />
              </a>
            )}
          </div>

          <div className="space-y-10">
            {chapters.map((chapter, index) => (
              <Reveal key={chapter.title} delay={0.08 * index}>
                <chapter.icon size={22} weight="bold" className="text-accent" />
                <h3 className="mt-3 text-lg font-semibold text-foreground">{chapter.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-muted">{chapter.body}</p>
              </Reveal>
            ))}

            <Reveal delay={0.08 * chapters.length} className="flex flex-wrap gap-2 border-t border-border pt-8">
              {oms.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted">
                  {tag}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
