import type { Project } from "@/lib/data";

/** Projeto com os caminhos das imagens já conferidos no servidor. */
export type ResolvedProject = Project & {
  /** Imagem principal (vazia se o arquivo não existir). */
  imageSrc: string;
  /** Todas as telas existentes, começando pela principal. */
  images: string[];
};
