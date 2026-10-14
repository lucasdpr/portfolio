import Link from "next/link";
import { ArrowLeft, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/lib/data";

/** Página de endereço inexistente (ex: link quebrado ou digitado errado). */
export default function NotFound() {
  return (
    <main id="conteudo" tabIndex={-1} className="relative flex min-h-[100svh] items-center overflow-hidden px-4 outline-none sm:px-6 lg:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="aurora-blob -left-[10%] top-[10%] h-[40vw] w-[40vw] bg-accent" />
        <div className="aurora-blob bottom-[-15%] right-[-10%] h-[38vw] w-[38vw] bg-accent-2 [animation-delay:-6s]" />
        <div className="dot-grid absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl">
        <Link href="/" className="font-mono text-lg font-semibold text-foreground">
          {profile.firstName}
          <span className="text-accent">.</span>dev
        </Link>

        <p aria-hidden="true" className="text-outline mt-10 select-none text-[34vw] font-bold leading-[0.8] tracking-tighter sm:text-[16rem]">
          404
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Essa página <span className="text-gradient">não existe.</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted">
          O link pode estar quebrado ou ter sido digitado errado. O que você procura provavelmente está na página inicial.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-transform active:scale-95"
          >
            <ArrowLeft size={16} weight="bold" /> Voltar ao início
          </Link>
          <Link
            href="/#projetos"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            <Briefcase size={16} weight="bold" /> Ver projetos
          </Link>
        </div>
      </div>
    </main>
  );
}
