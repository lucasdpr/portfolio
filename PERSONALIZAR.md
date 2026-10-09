# Como personalizar este portfólio

O site já está no ar localmente com conteúdo de exemplo. Aqui está, em ordem
de prioridade, o que trocar para ele virar realmente seu.

## 1. Conteúdo (o arquivo mais importante)

Abra [`src/lib/data.ts`](src/lib/data.ts) e edite:

- `profile` — seu nome, cargo, bio, localização, e-mail, link do currículo.
- `socialLinks` — troque `seu-usuario` pelos seus usuários reais de GitHub e LinkedIn.
- `skillCategories` — a lista de tecnologias que você realmente usa. Os slugs
  (`react`, `nextdotjs`, ...) vêm do [Simple Icons](https://simpleicons.org/) —
  procure o nome da tecnologia lá para achar o slug certo.
- `projects` — seus projetos reais: título, descrição, tags, link ao vivo,
  link do repositório e uma screenshot (veja o passo 3).
- `timeline` — sua trajetória: empregos, cursos, marcos importantes.

O texto grande do topo da página (a "headline" do Hero) fica direto em
[`src/components/sections/hero.tsx`](src/components/sections/hero.tsx) porque
tem uma palavra em destaque formatada à mão.

## 2. Sua foto

Ainda não coloquei uma foto sua (eu não tenho acesso a ela). Hoje a seção
"Sobre" mostra um avatar com a inicial do seu nome, só para não deixar vazio.

Para trocar por uma foto real:

1. Salve sua foto como `public/profile.jpg`.
2. Em [`src/components/sections/about.tsx`](src/components/sections/about.tsx),
   troque o componente `AvatarPlaceholder` por uma `<Image>` do Next.js:

   ```tsx
   import Image from "next/image";
   // ...
   <Image src="/profile.jpg" alt={profile.firstName} fill className="object-cover rounded-[2rem]" />
   ```

## 3. Projetos

Cada projeto é um item de `projects` em `src/lib/data.ts`. A ordem da lista
é a ordem da grade. Campos principais:

- `size`: tamanho do card no desktop: `hero` (grande, 2 linhas), `tall`
  (estreito, 2 linhas, fica ao lado do `hero`), `wide` (metade da linha) ou
  `third` (um terço). No celular todos ocupam a largura toda.
- `accent`: cor do projeto (brilho do card e detalhes do case).
- `screenshot`: imagem principal; `gallery`: outras telas, mostradas no case.
  Salve os prints em `public/projetos/`, de preferência em 1600×1000.
- `problem`, `description`, `highlights` e `stats`: o texto do case.
- `liveUrl`, `repoUrl` e `note`: links e aviso curto (ex: "Sistema interno").

Clicar num card abre o case com endereço próprio, como `/#projeto-nexus`;
dá para mandar esse link direto para um recrutador.

## 4. Currículo em PDF

O botão "Baixar currículo" entrega `public/resume.pdf` (baixado com o nome
`Curriculo-Lucas-Gabriel-Desenvolvedor.pdf`, definido em `profile.resumeFileName`).

O arquivo-fonte fica em [`curriculo/curriculo.html`](curriculo/curriculo.html),
junto com as fontes. Para atualizar:

1. Edite o texto em `curriculo/curriculo.html`.
2. Abra o arquivo no Chrome → Imprimir → Destino "Salvar como PDF",
   Margens "Nenhuma", marque "Gráficos de plano de fundo".
3. Salve por cima de `public/resume.pdf`. Confira que ficou em 1 página.

## 5. Formulário de contato

O formulário de contato hoje não tem backend: ao enviar, ele abre o cliente
de e-mail do visitante já com a mensagem preenchida (via `mailto:`). Funciona
sem configuração nenhuma, mas depende do visitante ter um app de e-mail
configurado no aparelho dele.

Se no futuro você quiser receber as mensagens direto (sem depender do app de
e-mail do visitante), dá para trocar por um serviço como
[Resend](https://resend.com) ou [Formspree](https://formspree.io) numa API
route do Next.js — me chama quando quiser fazer essa parte.

## 6. Cores e fontes

- Cor de destaque (o ciano): variável `--accent` em
  [`src/app/globals.css`](src/app/globals.css) (uma versão para o tema claro,
  outra para o escuro).
- Fontes: `Outfit` (títulos/texto) e `JetBrains Mono` (detalhes técnicos),
  configuradas em [`src/app/layout.tsx`](src/app/layout.tsx).

## 7. Efeitos

- Intro (tela de abertura): aparece uma vez por sessão — `src/components/ui/preloader.tsx`.
  Para tirar, remova `<Preloader />` de `src/app/layout.tsx`.
- Rolagem suave: `src/components/ui/smooth-scroll.tsx` (Lenis).
- Frase do manifesto: `src/components/sections/manifesto.tsx`.
- Partículas do topo (galáxia → `</>` → seu nome): `src/components/three/hero-scene.tsx`.
- Todos os efeitos respeitam "reduzir movimento" do sistema operacional.

## 8. Rodando o projeto

```bash
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000). Depois de editar o
`data.ts`, é só salvar — a página atualiza sozinha.

## 9. Publicando o site

O jeito mais simples é a [Vercel](https://vercel.com) (mesma empresa do
Next.js, plano gratuito cobre um portfólio tranquilamente):

1. Suba este projeto para um repositório no GitHub.
2. Importe o repositório em vercel.com/new.
3. Ela detecta que é Next.js e publica sozinha.

Quando quiser, eu te ajudo a fazer esse deploy.
