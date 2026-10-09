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

/** Tamanho do card na grade de projetos (desktop). No celular todos ocupam a largura toda. */
export type ProjectSize = "hero" | "tall" | "wide" | "third";

export type Project = {
  /** Identificador curto, usado no endereço do case (ex: #projeto-nexus). */
  slug: string;
  title: string;
  /** Frase curta que aparece em destaque no card. */
  headline: string;
  description: string;
  category: ProjectCategory;
  year: string;
  tags: string[];
  /** Cor de destaque do projeto (brilho do card e detalhes do case). */
  accent: string;
  size: ProjectSize;
  /** Caminho local (ex: "/projetos/oms.jpg") da imagem principal. Se o
   * arquivo não existir em `public/projetos/`, o card mostra uma arte gerada. */
  screenshot?: string;
  /** Outras telas do projeto, mostradas na galeria do case. */
  gallery?: string[];
  /** O problema real que o projeto resolveu (aparece antes da solução). */
  problem?: string;
  /** O que o projeto tem de mais forte, em tópicos (aparece no case). */
  highlights?: string[];
  /** Números verificáveis do projeto (contados no código). */
  stats?: { value: string; label: string }[];
  liveUrl?: string;
  repoUrl?: string;
  /** Aviso curto quando não há link público (ex: sistema interno). */
  note?: string;
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
  bio: [
    "Construí sistemas completos para a manutenção de uma siderúrgica: uma API com 120+ endpoints, um painel em cima do SAP com assistente de IA e um app de medição que funciona sem internet.",
    "Disponível para vagas de desenvolvimento full stack.",
  ],
  education: "Engenharia de Software · 6º período (conclusão em 2027)",
  location: "Barra Mansa - RJ, Brasil",
  email: "lucasgrafael05@gmail.com",
  whatsapp: "5524999597969",
  resumeUrl: `${BASE_PATH}/resume.pdf`,
  /** Nome do arquivo quando o recrutador baixa o currículo. */
  resumeFileName: "Curriculo-Lucas-Gabriel-Desenvolvedor.pdf",
  availableForWork: true,
  /** Tecnologias em destaque no topo da página (o que o recrutador lê primeiro). */
  mainStack: ["Python", "FastAPI", "Next.js", "React", "TypeScript", "PostgreSQL"],
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

// `liveUrl`/`repoUrl` ficam de fora quando ainda não há um link público:
// é melhor não mostrar um botão do que mostrar um que não leva a lugar
// nenhum. Os sistemas da siderúrgica não têm link de código de propósito:
// os repositórios citam a empresa. A ordem aqui é a ordem da grade.
export const projects: Project[] = [
  {
    slug: "nexus",
    title: "NEXUS",
    headline: "Pergunte aos documentos da empresa e receba a resposta com a fonte.",
    problem:
      "Manuais, normas e contratos ficam espalhados em PDFs que ninguém encontra na hora certa, e respostas de IA sem fonte não são confiáveis.",
    description:
      "Plataforma de busca em documentos com IA (RAG): os arquivos viram uma base pesquisável e cada resposta cita o documento e a página de onde saiu. Multiempresa, com permissões por coleção aplicadas dentro do próprio banco de dados.",
    highlights: [
      "Ingestão de PDF e DOCX com fila no PostgreSQL e worker, sem serviços extras",
      "Busca híbrida (vetorial com pgvector + texto em português) com fusão RRF",
      "Citações validadas: fonte inexistente é removida e resposta sem fonte vira \"não encontrei\"",
      "Isolamento entre empresas com Row-Level Security, sessão httpOnly e senhas com argon2id",
      "CI com lint, mypy estrito, testes de integração em PostgreSQL real e build Docker",
    ],
    category: "sistema",
    year: "2026",
    tags: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "pgvector", "Next.js", "TypeScript", "Docker", "GitHub Actions"],
    accent: "#8b5cf6",
    size: "hero",
    // Contados no repositório: def test_ em apps/api/tests e etapas do ci.yml.
    stats: [
      { value: "100", label: "testes automatizados" },
      { value: "RAG", label: "respostas com fonte" },
      { value: "RLS", label: "isolamento no banco" },
    ],
    screenshot: "/projetos/nexus.jpg",
    gallery: ["/projetos/nexus-biblioteca.jpg", "/projetos/nexus-entrar.jpg"],
    repoUrl: "https://github.com/lucasdpr/nexus",
    note: "Em desenvolvimento · prints da organização de demonstração",
  },
  {
    slug: "oms",
    title: "OMS",
    headline: "Gestão da manutenção industrial, do chão de fábrica à gerência.",
    problem:
      "Inspeções e reparos da oficina eram registrados em papel, sem histórico centralizado nem rastreabilidade do desgaste de cada peça.",
    description:
      "Plataforma de gestão da manutenção de moldes e segmentos de lingotamento contínuo, usada em campo pelo celular e acompanhada pela gerência no painel.",
    highlights: [
      "Painel em tempo real do desgaste de cada peça instalada, por máquina e veio",
      "Sinótico 3D das máquinas em Three.js, com o status de cada posição por cor",
      "Checklists digitais com laudo em PDF e troca guiada por peça reserva",
      "PWA instalável com cache offline, notificações push e auditoria de ações",
      "Backup diário automático do banco com GitHub Actions",
    ],
    category: "sistema",
    year: "2025–26",
    tags: ["Python", "FastAPI", "PostgreSQL", "Neon", "Pandas", "JavaScript", "Three.js", "PWA", "Web Push", "Render"],
    accent: "#f59e0b",
    size: "tall",
    // Contados no repositório da API (routers/*.py) e no README do front.
    stats: [
      { value: "120+", label: "endpoints na API" },
      { value: "18", label: "módulos FastAPI" },
      { value: "6", label: "veios monitorados" },
    ],
    screenshot: "/projetos/oms-painel.jpg",
    gallery: ["/projetos/oms-inspecao.jpg", "/projetos/oms-veios.jpg", "/projetos/oms.jpg"],
    liveUrl: "https://lucasdpr.github.io/oficina-oms/",
  },
  {
    slug: "abastecimento",
    title: "Central de Abastecimento",
    headline: "Um painel inteligente em cima das planilhas do SAP.",
    problem:
      "O acompanhamento de ordens de manutenção e da cobrança de fornecedores era feito em planilhas exportadas do SAP.",
    description:
      "PWA que acompanha ordens de manutenção a partir das planilhas exportadas do SAP e aponta o que precisa ser cobrado.",
    highlights: [
      "Importação das planilhas do SAP com detecção de mudanças a cada importação",
      "Dashboard com KPIs e gráficos, follow-up de fornecedores e exportação para Excel",
      "Assistente de IA que responde consultando o banco por ordem, pedido ou fornecedor",
      "Perfis de acesso, login por matrícula e notificações push",
    ],
    category: "sistema",
    year: "2026",
    tags: ["Next.js", "React", "TypeScript", "PostgreSQL", "Neon", "Tailwind CSS", "Recharts", "ExcelJS", "IA", "Web Push"],
    accent: "#06b6d4",
    size: "wide",
    screenshot: "/projetos/abastecimento.jpg",
    note: "Sistema interno · demonstração sob pedido",
  },
  {
    slug: "pass-line",
    title: "Pass-Line",
    headline: "Fichas de medição em papel viraram um app que funciona offline.",
    problem:
      "As fichas de medição das máquinas eram preenchidas em papel, num ambiente onde o sinal de internet nem sempre chega.",
    description:
      "PWA offline-first que digitaliza quatro fichas de inspeção de máquinas de lingotamento contínuo.",
    highlights: [
      "Alerta visual para medidas fora da tolerância durante o preenchimento",
      "Dados salvos no aparelho (IndexedDB) com fila de sincronização",
      "PDF oficial gerado no servidor a partir dos dados confirmados no banco",
    ],
    category: "sistema",
    year: "2026",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Dexie.js", "PWA", "pdf-lib", "Zod", "Zustand"],
    accent: "#10b981",
    size: "wide",
    screenshot: "/projetos/passe-line.jpg",
    note: "Sistema interno · demonstração sob pedido",
  },
  {
    slug: "economy-bot",
    title: "Economy Bot",
    headline: "Bot de Discord com economia, loja e painel web.",
    description:
      "Bot de economia para servidores do Discord com carteira, banco, loja de cargos e ranking, e um site onde os administradores entram com a conta do Discord para gerenciar tudo.",
    highlights: [
      "13 comandos de barra (/) com recompensas, transferências, roubo e banco",
      "Login com Discord (OAuth2) e painel de gestão da loja e da moeda por servidor",
      "Página pública de ranking e loja de cada servidor",
      "Plano Premium por servidor, ativado pelo painel do dono do bot",
    ],
    category: "sistema",
    year: "2026",
    tags: ["Node.js", "discord.js", "Express", "EJS", "SQLite", "OAuth2", "Render"],
    accent: "#6366f1",
    size: "third",
    stats: [{ value: "13", label: "comandos de barra" }],
    screenshot: "/projetos/economy-bot.jpg",
    gallery: ["/projetos/economy-bot-ranking.jpg"],
    repoUrl: "https://github.com/lucasdpr/economy-bot",
    note: "Prints com dados de demonstração",
  },
  {
    slug: "noctun",
    title: "Noctun Tarot",
    headline: "Site de leituras de tarot com loja e pedido pelo WhatsApp.",
    description:
      "Site para leituras de tarot e venda de velas e banhos, com experiência interativa e pedido rápido pelo celular.",
    highlights: [
      "Carta do dia interativa e fase da lua calculada no navegador",
      "Carrinho que guarda o pedido no aparelho e monta a mensagem para o WhatsApp",
      "Design próprio, responsivo e com imagens otimizadas (WebP em dois tamanhos)",
    ],
    category: "site",
    year: "2026",
    tags: ["HTML5", "CSS3", "JavaScript", "Vercel"],
    accent: "#c8a24a",
    size: "third",
    screenshot: "/projetos/noctun.jpg",
    liveUrl: "https://noctun.vercel.app/",
    repoUrl: "https://github.com/lucasdpr/Noctun",
  },
  {
    slug: "rts-epi",
    title: "RTS EPI",
    headline: "Catálogo digital: meu primeiro projeto vendido como freelancer.",
    description:
      "Site e catálogo digital para um fornecedor de equipamentos de proteção individual, no ar e em uso pelo cliente, otimizado para o celular e para contato rápido via WhatsApp.",
    category: "site",
    year: "2025",
    tags: ["HTML5", "CSS3", "JavaScript", "Vercel"],
    accent: "#f97316",
    size: "third",
    screenshot: "/projetos/rts-epi.jpg",
    liveUrl: "https://rts-epi-frontend.vercel.app/",
    // Repositório encontrado automaticamente a partir da pasta local do
    // projeto (rts-epi-frontend-main) — confira se é este mesmo.
    repoUrl: "https://github.com/bloominglies/rts-epi-frontend",
  },
  {
    slug: "oficina-do-ar",
    title: "Oficina do Ar",
    headline: "Site institucional em produção, com domínio próprio.",
    description:
      "Site para uma oficina especializada em ar-condicionado automotivo em Volta Redonda (RJ), apresentando os serviços e facilitando o contato de novos clientes.",
    category: "site",
    year: "2025",
    tags: ["HTML5", "CSS3", "JavaScript"],
    accent: "#0ea5e9",
    size: "wide",
    screenshot: "/projetos/oficina-do-ar.jpg",
    liveUrl: "https://oficinadoar.xyz",
  },
  {
    slug: "brasa-da-vila",
    title: "Brasa da Vila",
    headline: "Cardápio digital com pedido direto no WhatsApp.",
    description:
      "Demo que criei para apresentar a restaurantes e lanchonetes: cardápio interativo com carrinho que monta o pedido e envia pelo WhatsApp. A marca é fictícia, mas o site é completo e funcional.",
    category: "site",
    year: "2026",
    tags: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
    accent: "#ef4444",
    size: "wide",
    screenshot: "/projetos/brasa-da-vila.jpg",
    liveUrl: "https://lucasdpr.github.io/Catalogo-de-Apresentacao/",
    note: "Demo de vendas · marca fictícia",
  },
];

// Trajetória como desenvolvedor (datas dos projetos em `projects`).
export const timeline: TimelineItem[] = [
  {
    period: "2025",
    title: "Primeiros projetos para clientes",
    place: "Freelancer",
    description:
      "RTS EPI, catálogo digital e meu primeiro projeto vendido, e o site da Oficina do Ar, no ar com domínio próprio.",
  },
  {
    period: "2025 - 2026",
    title: "OMS - gestão da manutenção industrial",
    place: "Python, FastAPI, PostgreSQL e PWA",
    description: "API com 120+ endpoints, painel em tempo real do desgaste das peças, visualização 3D das máquinas e laudos em PDF.",
  },
  {
    period: "2026",
    title: "Central de Abastecimento, Pass-Line e NEXUS",
    place: "Next.js, TypeScript, PostgreSQL e IA",
    description: "Painel sobre as planilhas do SAP com assistente de IA, app de medição que funciona sem internet e uma plataforma de busca em documentos com IA (RAG).",
  },
  {
    period: "Atual",
    title: "Engenharia de Software",
    place: "Centro Universitário de Barra Mansa (UBM), 6º período",
    description: "Conclusão prevista para 2027.",
  },
];
