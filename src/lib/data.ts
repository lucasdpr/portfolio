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

export type ProjectCategory = "sistema" | "site";

export type Project = {
  title: string;
  /** Frase curta que aparece em destaque no card. */
  headline: string;
  description: string;
  category: ProjectCategory;
  year: string;
  tags: string[];
  /** Caminho local (ex: "/projetos/oms.jpg") da screenshot de verdade.
   * Opcional: enquanto o arquivo não existir em `public/projetos/`, o card
   * mostra uma arte gerada no próprio site em vez de uma foto aleatória. */
  screenshot?: string;
  /** O problema real que o projeto resolveu (aparece antes da solução). */
  problem?: string;
  /** Números verificáveis do projeto (contados no código), em destaque no card. */
  stats?: { value: string; label: string }[];
  liveUrl?: string;
  repoUrl?: string;
  /** Card maior no topo da grade. */
  featured?: boolean;
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
  tagline: "Transformo processos feitos no papel e em planilhas em sistemas web, APIs e apps que funcionam offline, com Python, FastAPI, Next.js e PostgreSQL.",
  bio: "Sou desenvolvedor full stack e levo um projeto da conversa com quem vai usar até o sistema no ar: modelagem do banco, API, interface e deploy. A manutenção industrial me ensinou a trabalhar em equipe, com responsabilidade e atenção a cada detalhe. É com essa mesma dedicação que quero somar a um time de desenvolvimento.",
  lookingFor: "Vaga como desenvolvedor full stack",
  education: "Engenharia de Software · 6º período (conclusão em 2027)",
  location: "Barra Mansa - RJ, Brasil",
  email: "lucasgrafael05@gmail.com",
  whatsapp: "5524999597969",
  resumeUrl: `${BASE_PATH}/resume.pdf`,
  availableForWork: true,
  /** Tecnologias em destaque no topo da página (o que o recrutador lê primeiro). */
  mainStack: ["Python", "FastAPI", "Next.js", "React", "TypeScript", "PostgreSQL"],
};

/** "O que eu trago pro time": os diferenciais que aparecem na seção Sobre. */
export const strengths = [
  {
    title: "Entrega de ponta a ponta",
    text: "Banco, API, interface e deploy. Já coloquei sistemas no ar com FastAPI, PostgreSQL, Next.js, Render e Vercel.",
  },
  {
    title: "Foco no problema de quem usa",
    text: "Entendo o processo antes de escrever código. Foi assim que nasceram a OMS, a Central de Abastecimento e o Pass-Line.",
  },
  {
    title: "Responsabilidade e dedicação",
    text: "Venho de uma operação industrial onde erro custa caro. Levo essa seriedade e esse esforço pro time em que eu entrar.",
  },
];

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
      { name: "Zod", slug: "zod" },
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
      { name: "Express", slug: "express" },
      { name: "Java", slug: "openjdk" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Neon", slug: "neon" },
      { name: "Pandas", slug: "pandas" },
      { name: "Supabase", slug: "supabase" },
      { name: "MySQL", slug: "mysql" },
    ],
  },
  {
    title: "Ferramentas & deploy",
    items: [
      { name: "Git", slug: "git" },
      { name: "Vite", slug: "vite" },
      { name: "GitHub", slug: "github" },
      // Sem slug: a Microsoft pediu a remoção do ícone do VS Code do Simple
      // Icons (o mesmo motivo pelo qual o logo do LinkedIn não carrega).
      { name: "VS Code" },
      { name: "Render", slug: "render" },
      { name: "Vercel", slug: "vercel" },
    ],
  },
];

// `liveUrl`/`repoUrl` ficam de fora quando ainda não há um link público —
// é melhor não mostrar um botão do que mostrar um que não leva a lugar
// nenhum. Os sistemas internos (Abastecimento e Pass-Line) não têm link de
// propósito: exigem login e usam dados da empresa.
export const projects: Project[] = [
  {
    title: "OMS - Oficina de Moldes e Segmentos",
    headline: "Controle total da manutenção, do chão de fábrica à gerência.",
    problem:
      "Inspeções e reparos da oficina eram registrados em papel, sem histórico centralizado nem rastreabilidade do desgaste de cada peça.",
    description:
      "Plataforma de gestão da manutenção de moldes e segmentos de lingotamento contínuo: painel em tempo real do desgaste de cada peça, sinótico 3D das máquinas, checklists digitais com laudo em PDF, troca guiada por peça reserva, prontuário, auditoria e notificações push. Instala no celular e funciona offline.",
    category: "sistema",
    year: "2026",
    tags: ["Python", "FastAPI", "PostgreSQL", "Neon", "Pandas", "JavaScript", "Three.js", "PWA", "Web Push", "Render"],
    // Contados no repositório da API (routers/*.py: 52 GET + 68 POST) e no
    // README do front (veios C, D, E, F, G e H).
    stats: [
      { value: "120", label: "endpoints na API" },
      { value: "18", label: "módulos FastAPI" },
      { value: "6", label: "veios monitorados" },
    ],
    screenshot: "/projetos/oms.jpg",
    liveUrl: "https://lucasdpr.github.io/oficina-oms/",
    featured: true,
  },
  {
    title: "Central de Abastecimento",
    headline: "Um painel inteligente em cima das planilhas do SAP.",
    problem:
      "O acompanhamento de ordens de manutenção e da cobrança de fornecedores era feito em planilhas exportadas do SAP.",
    description:
      "PWA que acompanha ordens de manutenção a partir das planilhas exportadas do SAP: detecta mudanças a cada importação, aponta o que precisa ser cobrado e organiza o follow-up de fornecedores. Tem dashboard com KPIs e gráficos, assistente de IA que consulta o banco, notificações push e perfis de acesso.",
    category: "sistema",
    year: "2026",
    tags: ["Next.js", "React", "TypeScript", "PostgreSQL", "Neon", "Tailwind CSS", "Recharts", "ExcelJS", "IA", "Web Push", "Vercel"],
    screenshot: "/projetos/abastecimento.jpg",
    featured: true,
  },
  {
    title: "Pass-Line - Inspeção Digital",
    headline: "Fichas de medição em papel viraram um app que funciona offline.",
    problem:
      "As fichas de medição das máquinas eram preenchidas em papel, num ambiente onde o sinal de internet nem sempre chega.",
    description:
      "PWA offline-first que digitaliza quatro fichas de inspeção de máquinas de lingotamento contínuo, com alerta visual para medidas fora da tolerância. Salva no aparelho (IndexedDB) com fila de sincronização e gera o PDF oficial no servidor.",
    category: "sistema",
    year: "2026",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Dexie.js", "PWA", "pdf-lib", "Zod", "Zustand"],
    screenshot: "/projetos/passe-line.jpg",
  },
  {
    title: "RTS EPI - Catálogo de Produtos",
    headline: "Meu primeiro projeto vendido como freelancer.",
    description:
      "Site e catálogo digital para um fornecedor de equipamentos de proteção individual, no ar e em uso real pelo cliente, otimizado para o celular e para contato rápido via WhatsApp.",
    category: "site",
    year: "2025",
    tags: ["HTML5", "CSS3", "JavaScript", "Vercel"],
    screenshot: "/projetos/rts-epi.jpg",
    liveUrl: "https://rts-epi-frontend.vercel.app/",
    // Repositório encontrado automaticamente a partir da pasta local do
    // projeto (rts-epi-frontend-main) — confira se é este mesmo.
    repoUrl: "https://github.com/bloominglies/rts-epi-frontend",
  },
  {
    title: "Oficina do Ar",
    headline: "Site institucional em produção, com domínio próprio.",
    description:
      "Site para uma oficina especializada em ar-condicionado automotivo em Volta Redonda (RJ), apresentando os serviços e facilitando o contato de novos clientes.",
    category: "site",
    year: "2025",
    tags: ["HTML5", "CSS3", "JavaScript"],
    screenshot: "/projetos/oficina-do-ar.jpg",
    liveUrl: "https://oficinadoar.xyz",
  },
  {
    title: "Brasa da Vila (demo)",
    headline: "Cardápio digital com pedido direto no WhatsApp.",
    description:
      "Demo que criei para apresentar a restaurantes e lanchonetes: cardápio interativo com carrinho que monta o pedido e envia pelo WhatsApp. A marca é fictícia, mas o site é completo e funcional.",
    category: "site",
    year: "2026",
    tags: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
    screenshot: "/projetos/brasa-da-vila.jpg",
    liveUrl: "https://lucasdpr.github.io/Catalogo-de-Apresentacao/",
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
    place: "Indústria siderúrgica, Volta Redonda - RJ",
    description: "Manutenção preventiva e corretiva de máquinas e equipamentos na aciaria e oficina de moldes e segmentos.",
  },
  {
    period: "dez/2024 - Atual",
    title: "Mecânico de Manutenção",
    place: "Indústria siderúrgica, Volta Redonda - RJ",
    description:
      "Promovido após 9 meses na função anterior. Conhecer o processo por dentro me ensinou a entender o problema antes de escrever a primeira linha de código.",
  },
  {
    period: "Atual",
    title: "Engenharia de Software",
    place: "Centro Universitário de Barra Mansa (UBM), 6º período",
    description: "Conclusão prevista para 2027. Estudo à noite o que aplico de dia na oficina, e vice-versa.",
  },
];
