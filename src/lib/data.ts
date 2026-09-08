/**
 * Conteúdo central do portfólio.
 *
 * Este arquivo concentra praticamente tudo que é "seu": nome, bio, links,
 * tecnologias, projetos e trajetória. Edite aqui primeiro — a maior parte
 * do site vai se atualizar sozinha. O texto grande do topo da página
 * (headline do Hero) fica em `src/components/sections/hero.tsx`, porque
 * tem formatação própria (uma palavra em destaque).
 */

import { BASE_PATH } from "./site-config";

export type SkillItem = {
  name: string;
  /** Slug do Simple Icons (simpleicons.org). Deixe em branco se a
   * tecnologia/prática não tiver um logo de marca (ex: "Design Responsivo"). */
  slug?: string;
};

export type SkillCategory = {
  title: string;
  items: SkillItem[];
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Imagem de placeholder (Picsum) — usada até a screenshot real existir. */
  image: string;
  /** Caminho local (ex: "/projetos/oms.jpg") da screenshot de verdade.
   * Opcional: enquanto o arquivo não existir em `public/projetos/`, o site
   * cai automaticamente para `image` sem quebrar. */
  screenshot?: string;
  liveUrl?: string;
  repoUrl?: string;
};

export type TimelineItem = {
  period: string;
  title: string;
  place: string;
  description: string;
};

export type SocialLink = {
  label: string;
  href: string;
  /** "email" ou um slug do Simple Icons (github, linkedin, ...) */
  slug: string;
};

export const profile = {
  fullName: "Lucas Gabriel de Paula Rafael",
  firstName: "Lucas",
  role: "Desenvolvedor Full Stack",
  tagline: "Desenvolvo sistemas web e sites sob medida, de aplicações industriais a produtos digitais para negócios.",
  bio: "Desenvolvo sistemas web de ponta a ponta, do banco de dados à interface. Tenho experiência em criar soluções reais para problemas concretos — desde sistemas de gestão industrial até catálogos digitais e landing pages. Estudo Engenharia de Software e aplico na prática o que aprendo em sala, construindo projetos que clientes usam de verdade. Meu foco é entregar código limpo, performático e que resolve o problema do usuário antes de tudo.",
  education: "Engenharia de Software - 6º período",
  location: "Barra Mansa - RJ, Brasil",
  email: "lucasgrafael05@gmail.com",
  whatsapp: "5524999597969",
  resumeUrl: `${BASE_PATH}/resume.pdf`,
  availableForWork: true,
};

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/lucasdpr", slug: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lucasgabrieldepaula/", slug: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/lucasdprdev/", slug: "instagram" },
  { label: "WhatsApp", href: `https://wa.me/${profile.whatsapp}`, slug: "whatsapp" },
  { label: "Email", href: `mailto:${profile.email}`, slug: "email" },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    items: [
      { name: "HTML5", slug: "html5" },
      { name: "CSS3", slug: "css" },
      { name: "JavaScript", slug: "javascript" },
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "Three.js", slug: "threedotjs" },
      { name: "PWA" },
      { name: "Design Responsivo" },
    ],
  },
  {
    title: "Backend & dados",
    items: [
      { name: "Python", slug: "python" },
      { name: "FastAPI", slug: "fastapi" },
      { name: "Node.js", slug: "nodedotjs" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Neon", slug: "neon" },
      { name: "MySQL", slug: "mysql" },
    ],
  },
  {
    title: "Ferramentas & deploy",
    items: [
      { name: "Git", slug: "git" },
      { name: "GitHub", slug: "github" },
      // Sem slug: a Microsoft pediu a remoção do ícone do VS Code do Simple
      // Icons (o mesmo motivo pelo qual o logo do LinkedIn não carrega).
      { name: "VS Code" },
      { name: "Render", slug: "render" },
      { name: "Vercel", slug: "vercel" },
    ],
  },
];

// O primeiro item vira o "projeto em destaque"; os demais entram na grade
// abaixo. `liveUrl`/`repoUrl` ficam de fora quando ainda não há um link
// público — é melhor não mostrar um botão do que mostrar um que não leva a
// lugar nenhum.
export const projects: Project[] = [
  {
    title: "OMS - Oficina de Moldes e Segmentos",
    description:
      "Sistema de gestão de manutenção industrial para a Companhia Siderúrgica Nacional (CSN), com API em Python/FastAPI e front-end em PWA para uso em campo. Case completo mais abaixo.",
    tags: ["Python", "FastAPI", "PostgreSQL", "JavaScript", "PWA", "Render"],
    image: "https://picsum.photos/seed/oms-oficina-moldes/1400/1000",
    screenshot: "/projetos/oms.jpg",
    liveUrl: "https://lucasdpr.github.io/oficina-oms/",
  },
  {
    title: "RTS EPI - Catálogo de Produtos",
    description:
      "Site e catálogo digital para um fornecedor de equipamentos de proteção individual. Meu primeiro projeto vendido como freelancer, no ar e em uso real pelo cliente, otimizado para navegação no celular e contato rápido via WhatsApp.",
    tags: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
    image: "https://picsum.photos/seed/rts-epi-catalogo/900/700",
    screenshot: "/projetos/rts-epi.jpg",
    liveUrl: "https://rts-epi-frontend.vercel.app/",
    // Repositório encontrado automaticamente a partir da pasta local do
    // projeto (rts-epi-frontend-main) — confira se é este mesmo.
    repoUrl: "https://github.com/bloominglies/rts-epi-frontend",
  },
  {
    title: "Brasa da Vila - Site & Cardápio Digital",
    description:
      "Plataforma web para restaurante com cardápio interativo, com foco em carregamento rápido e boa experiência para o cliente.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: "https://picsum.photos/seed/brasa-da-vila/900/700",
    screenshot: "/projetos/brasa-da-vila.jpg",
    liveUrl: "https://lucasdpr.github.io/Catalogo-de-Apresentacao/",
  },
  {
    title: "Oficina do Ar - Ar-condicionado Automotivo",
    description:
      "Site institucional para uma oficina especializada em ar-condicionado automotivo em Volta Redonda (RJ). Projeto real, no ar em produção com domínio próprio, apresentando os serviços da empresa e facilitando o contato de clientes.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: "https://picsum.photos/seed/oficina-do-ar/900/700",
    screenshot: "/projetos/oficina-do-ar.jpg",
    liveUrl: "https://oficinadoar.xyz",
  },
];

export const timeline: TimelineItem[] = [
  {
    period: "2022 - 2023",
    title: "Operador de Máquinas Convencionais",
    place: "Curso profissionalizante - 800 horas",
    description: "Primeiro contato formal com processos industriais, antes mesmo de pensar em programar.",
  },
  {
    period: "2023 - 2024",
    title: "Técnico em Mecânica",
    place: "Curso técnico - 1.200 horas",
    description:
      "Aprofundei a base técnica de manutenção industrial que uso até hoje pra entender os problemas que resolvo com código.",
  },
  {
    period: "mar/2024 - dez/2024",
    title: "Mecânico Júnior",
    place: "CBSI (Grupo CSN), Volta Redonda - RJ",
    description: "Manutenção preventiva e corretiva de máquinas e equipamentos na aciaria e oficina de moldes e segmentos.",
  },
  {
    period: "dez/2024 - Atual",
    title: "Mecânico de Manutenção",
    place: "CBSI (Grupo CSN), Volta Redonda - RJ",
    description:
      "Promovido após 9 meses na função anterior. Foi vendo de perto os checklists em papel que nasceu a ideia do sistema OMS.",
  },
  {
    period: "Atual",
    title: "Engenharia de Software",
    place: "Centro Universitário de Barra Mansa (UBM), 6º período",
    description: "Conclusão prevista para 2027. Estudo à noite o que aplico de dia na oficina, e vice-versa.",
  },
];
