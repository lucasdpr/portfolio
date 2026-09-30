import Image from "next/image";
import type { ProjectCategory } from "@/lib/data";

// Paletas das artes geradas (quando ainda não há screenshot real).
const palettes = [
  ["#22d3ee", "#a78bfa"],
  ["#34d399", "#22d3ee"],
  ["#f472b6", "#a78bfa"],
  ["#fbbf24", "#f472b6"],
];

function hostLabel(liveUrl?: string) {
  if (!liveUrl) return "app interno · acesso restrito";
  try {
    return new URL(liveUrl).host + new URL(liveUrl).pathname.replace(/\/$/, "");
  } catch {
    return liveUrl;
  }
}

/** Mini "tela" desenhada em CSS: dashboard para sistemas, landing para sites. */
function GeneratedArt({ category, title, palette }: { category: ProjectCategory; title: string; palette: string[] }) {
  const [a, b] = palette;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: `radial-gradient(120% 90% at 0% 0%, ${a}33, transparent 60%), radial-gradient(100% 80% at 100% 100%, ${b}33, transparent 60%), var(--surface-elevated)` }}
    >
      {category === "sistema" ? (
        <div className="absolute inset-0 flex gap-3 p-4 sm:p-5">
          <div className="hidden w-1/5 flex-col gap-2 rounded-lg border border-border/60 bg-background/50 p-2 sm:flex">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 rounded-full bg-muted/20" style={{ width: `${90 - i * 12}%`, background: i === 0 ? a : undefined }} />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="grid grid-cols-3 gap-2">
              {[a, b, a].map((color, i) => (
                <div key={i} className="rounded-lg border border-border/60 bg-background/50 p-2">
                  <div className="h-1.5 w-1/2 rounded-full bg-muted/25" />
                  <div className="mt-2 h-3 w-2/3 rounded-full" style={{ background: color, opacity: 0.8 }} />
                </div>
              ))}
            </div>
            <div className="flex flex-1 items-end gap-1.5 rounded-lg border border-border/60 bg-background/50 p-3">
              {[40, 65, 45, 80, 55, 90, 70, 60, 85, 50, 75, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-700 group-hover:opacity-100"
                  style={{ height: `${h}%`, background: `linear-gradient(to top, ${a}, ${b})`, opacity: 0.55 }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="h-2 w-16 rounded-full" style={{ background: a }} />
          <p className="max-w-[16ch] text-xl font-bold leading-tight text-foreground/80 sm:text-2xl">{title}</p>
          <div className="h-6 w-24 rounded-full" style={{ background: `linear-gradient(90deg, ${a}, ${b})` }} />
        </div>
      )}
    </div>
  );
}

type ProjectVisualProps = {
  src: string;
  title: string;
  category: ProjectCategory;
  liveUrl?: string;
  index: number;
  sizes: string;
};

/**
 * "Janela de navegador" com a screenshot do projeto — ou, se ainda não
 * existir screenshot (src vazio), uma arte gerada em CSS no lugar de uma
 * foto aleatória que não tem nada a ver com o projeto.
 */
export function ProjectVisual({ src, title, category, liveUrl, index, sizes }: ProjectVisualProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-md bg-surface-elevated px-3 py-0.5 font-mono text-[10px] text-muted">
          {hostLabel(liveUrl)}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={`Tela do projeto ${title}`}
            fill
            className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            sizes={sizes}
          />
        ) : (
          <GeneratedArt category={category} title={title} palette={palettes[index % palettes.length]} />
        )}
      </div>
    </div>
  );
}
