import type { Project } from "@/lib/data";

/** Projeto com os caminhos das imagens já conferidos no servidor. */
export type ResolvedProject = Omit<Project, "showcase"> & {
  /** Imagem principal (vazia se o arquivo não existir). */
  imageSrc: string;
  /** Todas as telas existentes, começando pela principal. */
  images: string[];
  /** Print da vitrine (o `showcase` ou, sem ele, a imagem principal) com as
   * dimensões reais, pra saber se ele é alto e precisa rolar na janela. */
  showcase: { src: string; width: number; height: number } | null;
};
