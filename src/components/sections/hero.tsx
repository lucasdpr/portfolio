"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react";
import { Magnetic } from "@/components/ui/magnetic-button";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/lib/data";

const HeroScene = dynamic(
  () => import("@/components/three/hero-scene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-3xl bg-gradient-to-br from-accent/10 via-surface-elevated to-surface-elevated" />
    ),
  },
);

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-24">
      <div aria-hidden="true" className="dot-grid absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <div>
          {profile.availableForWork && (
            <Reveal delay={0}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Disponível para novos projetos
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Transformo ideias em produtos digitais <span className="text-accent">sólidos</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-muted sm:text-lg">{profile.tagline}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  href="#projetos"
                  className="flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform active:scale-95"
                >
                  Ver projetos
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="#contato"
                  className="flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent active:scale-95"
                >
                  <EnvelopeSimple size={16} weight="bold" />
                  Falar comigo
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={0} className="relative h-[320px] sm:h-[420px] lg:h-[480px]">
          <HeroScene />
        </Reveal>
      </div>
    </section>
  );
}
