import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";
import { getGithubStats } from "@/lib/github";
import { socialLinks } from "@/lib/data";

function extractGithubUsername(): string | null {
  const github = socialLinks.find((social) => social.slug === "github");
  if (!github) return null;
  const match = github.href.match(/github\.com\/([^/]+)/);
  return match ? match[1] : null;
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

/**
 * Card com estatísticas reais do GitHub, buscadas direto da API pública
 * (sem serviço de terceiros pra gerar imagem, que costuma cair). Se a
 * busca falhar por qualquer motivo, a seção inteira só não aparece.
 */
export async function GithubStatsSection() {
  const username = extractGithubUsername();
  if (!username) return null;

  const stats = await getGithubStats(username);
  if (!stats) return null;

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">GitHub, ao vivo</h2>
          <p className="mt-4 text-muted">
            Sem print de tela: estes números vêm direto da API do GitHub toda vez que a página é publicada.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 rounded-3xl border border-border bg-surface p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border">
                <Image src={stats.avatarUrl} alt={`Avatar de ${stats.username} no GitHub`} fill sizes="64px" />
              </div>
              <div>
                <p className="font-mono text-sm font-medium text-foreground">@{stats.username}</p>
                <p className="text-xs text-muted">No GitHub desde {stats.memberSince}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <StatBlock value={stats.publicRepos} label="Repositórios" />
              <StatBlock value={stats.totalStars} label="Estrelas" />
              <StatBlock value={stats.followers} label="Seguidores" />
            </div>
          </div>

          {stats.topLanguages.length > 0 && (
            <div className="mt-8 border-t border-border pt-8">
              <p className="text-sm font-medium text-foreground">Linguagens mais usadas nos repositórios</p>
              <div className="mt-5 space-y-3">
                {stats.topLanguages.map((lang, index) => (
                  <div key={lang.name}>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="font-mono">{lang.name}</span>
                      <span className="font-mono">{lang.percent}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${lang.percent}%`, opacity: 1 - index * 0.18 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <a
            href={`https://github.com/${stats.username}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-accent"
          >
            Ver perfil completo <ArrowUpRight size={15} weight="bold" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
