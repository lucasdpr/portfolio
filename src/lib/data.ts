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
  tagline: "Crio sistemas web, PWAs e sites sob medida: de painéis com IA e apps que funcionam offline a sites que trazem clientes para negócios locais.",
  bio: "Desenvolvo sistemas web de ponta a ponta, do banco de dados à interface. Já entreguei desde painéis de dados com assistente de IA e aplicativos que funcionam offline até catálogos digitais e sites institucionais para clientes reais. Estudo Engenharia de Software e aplico na prática o que aprendo em sala, construindo projetos que clientes usam de verdade. Meu foco é entregar código limpo, performático e que resolve o problema do usuário antes de tudo.",
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
    description:
      "Plataforma de gestão da manutenção de moldes e segmentos de lingotamento contínuo: painel em tempo real do desgaste de cada peça, sinótico 3D das máquinas, checklists digitais com laudo em PDF, troca guiada por peça reserva, prontuário, auditoria e notificações push. Instala no celular e funciona offline.",
    category: "sistema",
    year: "2026",
    tags: ["Python", "FastAPI", "PostgreSQL", "Neon", "Pandas", "JavaScript", "Three.js", "PWA", "Web Push", "Render"],
    screenshot: "/projetos/oms.jpg",
    liveUrl: "https://lucasdpr.github.io/oficina-oms/",
    featured: true,
  },
  {
    title: "Central de Abastecimento",
    headline: "Um painel inteligente em cima das planilhas do SAP.",
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

/**
 * Roteiro da vitrine imersiva da OMS (seção "Em destaque"): a tela do
 * sistema cresce até ocupar a tela inteira e passa por estas telas
 * conforme a rolagem. `hotspots` marcam partes reais da interface, em %
 * da imagem (x da esquerda, y do topo). Prints em `public/projetos/`
 * (16:10); tela sem arquivo é pulada.
 */
export const omsShowcase = {
  name: "OMS",
  tagline: "Gestão inteligente da manutenção.",
  screens: [
    {
      image: "/projetos/oms-painel.jpg",
      title: "Tudo o que importa, numa tela.",
      text: "Ativos críticos, tonelagem do dia e risco de cada peça, direto do banco de dados.",
      hotspots: [
        { x: 14, y: 50, label: "Ativos críticos em tempo real" },
        { x: 49, y: 24, label: "Instala no celular e funciona offline" },
        { x: 81, y: 58, label: "Ativos monitorados e sincronizados" },
      ],
    },
    {
      image: "/projetos/oms-inspecao.jpg",
      title: "Sabe o que inspecionar primeiro.",
      text: "Fila de inspeção por desgaste, risco médio por veio e produção lançada por máquina.",
      hotspots: [
        { x: 62, y: 17, label: "Fila priorizada por desgaste" },
        { x: 22, y: 56, label: "Risco médio por veio" },
        { x: 83, y: 56, label: "Produção por máquina" },
      ],
    },
    {
      image: "/projetos/oms-veios.jpg",
      title: "Cada peça, em cada posição.",
      text: "Onde cada molde e segmento está instalado, quanto já rodou e quanto falta pro limite.",
      hotspots: [
        { x: 50, y: 14, label: "Todos os veios, um clique" },
        { x: 29, y: 46, label: "Desgaste acumulado da peça" },
        { x: 50, y: 55, label: "Troca pela reserva em uma ação" },
      ],
    },
  ],
  stats: [
    { value: 15, suffix: "+", label: "módulos no sistema" },
    { value: 3, suffix: "", label: "máquinas de lingotamento" },
    { value: 6, suffix: "", label: "veios monitorados" },
    { value: 344, suffix: "", label: "ativos rastreados" },
  ],
};
