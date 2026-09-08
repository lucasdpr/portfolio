/**
 * Busca estatísticas reais do GitHub (servidor apenas). Roda no build e se
 * revalida sozinho de tempos em tempos (ISR) — sem depender de nenhum
 * serviço externo de terceiros pra gerar imagem (esses costumam cair).
 *
 * Se a API do GitHub falhar por qualquer motivo (limite de requisições,
 * rede, etc.), devolve `null` e a seção correspondente simplesmente não
 * aparece, em vez de quebrar a página.
 */

export type GithubStats = {
  username: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  memberSince: number;
  totalStars: number;
  topLanguages: { name: string; count: number; percent: number }[];
};

type GithubRepo = {
  language: string | null;
  stargazers_count: number;
  fork: boolean;
};

const REVALIDATE_SECONDS = 60 * 60; // 1 hora

export async function getGithubStats(username: string): Promise<GithubStats | null> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: REVALIDATE_SECONDS },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) return null;

    const user = await userRes.json();
    const repos: GithubRepo[] = await reposRes.json();
    if (!Array.isArray(repos)) return null;

    const ownRepos = repos.filter((repo) => !repo.fork);
    const languageCounts = new Map<string, number>();
    for (const repo of ownRepos) {
      if (!repo.language) continue;
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }

    const totalWithLanguage = [...languageCounts.values()].reduce((sum, n) => sum + n, 0);
    const topLanguages = [...languageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalWithLanguage > 0 ? Math.round((count / totalWithLanguage) * 100) : 0,
      }));

    return {
      username,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos ?? ownRepos.length,
      followers: user.followers ?? 0,
      memberSince: new Date(user.created_at).getFullYear(),
      totalStars: ownRepos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0),
      topLanguages,
    };
  } catch {
    return null;
  }
}
