/**
 * Abre o case de um projeto de qualquer lugar da página (ex: a paleta de
 * comandos). Quem escuta é a vitrine, em components/projects/projects-experience.tsx.
 */
export const PROJECT_OPEN_EVENT = "project:open";

export type ProjectOpenDetail = { slug: string };

export function requestOpenProject(slug: string) {
  window.dispatchEvent(new CustomEvent<ProjectOpenDetail>(PROJECT_OPEN_EVENT, { detail: { slug } }));
}
