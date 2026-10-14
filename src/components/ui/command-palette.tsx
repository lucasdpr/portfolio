"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import {
  ArrowSquareOut,
  Briefcase,
  Copy,
  DownloadSimple,
  Hash,
  MagnifyingGlass,
  MoonStars,
  type Icon,
} from "@phosphor-icons/react";
import { profile, projects, socialLinks } from "@/lib/data";
import { requestOpenProject } from "@/lib/project-events";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { scrollToY } from "@/lib/scroll-to";
import { copyText } from "@/lib/toast";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export const PALETTE_EVENT = "palette:open";

/** Abre a paleta de qualquer lugar (ex: o botão da navbar). */
export function openCommandPalette() {
  window.dispatchEvent(new Event(PALETTE_EVENT));
}

type Command = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: Icon;
  run: () => void;
};

const sections = [
  { id: "inicio", label: "Início" },
  { id: "projetos", label: "Projetos" },
  { id: "habilidades", label: "Habilidades" },
  { id: "sobre", label: "Sobre mim" },
  { id: "skills", label: "Stack" },
  { id: "trajetoria", label: "Trajetória" },
  { id: "contato", label: "Contato" },
];

/** Minúsculas e sem acento, pra "trajetoria" achar "Trajetória". */
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  scrollToY(target.getBoundingClientRect().top + window.scrollY - (id === "inicio" ? 0 : 72));
}

/**
 * Paleta de comandos (⌘K / Ctrl+K): pula pra uma seção, abre o case de um
 * projeto, baixa o currículo, copia o e-mail, troca o tema. Segue o padrão
 * de combobox acessível: o foco fica no campo e as setas movem a opção ativa.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { resolvedTheme, setTheme } = useTheme();
  const reduceMotion = usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(() => {
    const links = socialLinks.filter((link) => ["github", "linkedin", "whatsapp"].includes(link.slug));
    return [
      ...sections.map((section) => ({
        id: `secao-${section.id}`,
        group: "Navegar",
        label: section.label,
        icon: Hash,
        run: () => scrollToSection(section.id),
      })),
      ...projects.map((project) => ({
        id: `projeto-${project.slug}`,
        group: "Projetos",
        label: project.title,
        hint: project.category === "sistema" ? "Sistema" : "Site",
        keywords: `${project.headline} ${project.tags.join(" ")}`,
        icon: Briefcase,
        run: () => requestOpenProject(project.slug),
      })),
      {
        id: "curriculo",
        group: "Ações",
        label: "Baixar currículo",
        hint: "PDF",
        keywords: "cv resume download",
        icon: DownloadSimple,
        run: () => {
          const link = document.createElement("a");
          link.href = profile.resumeUrl;
          link.download = profile.resumeFileName;
          link.click();
        },
      },
      {
        id: "email",
        group: "Ações",
        label: "Copiar e-mail",
        hint: profile.email,
        keywords: "email contato",
        icon: Copy,
        run: () => copyText(profile.email, "E-mail copiado"),
      },
      {
        id: "tema",
        group: "Ações",
        label: resolvedTheme === "dark" ? "Ativar tema claro" : "Ativar tema escuro",
        keywords: "tema dark light modo escuro claro",
        icon: MoonStars,
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      ...links.map((link) => ({
        id: `link-${link.slug}`,
        group: "Links",
        label: link.label,
        hint: link.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
        icon: ArrowSquareOut,
        run: () => window.open(link.href, "_blank", "noopener,noreferrer"),
      })),
    ];
  }, [resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return commands;
    return commands.filter((command) => {
      const haystack = normalize(`${command.label} ${command.group} ${command.hint ?? ""} ${command.keywords ?? ""}`);
      return words.every((word) => haystack.includes(word));
    });
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  function run(command: Command) {
    close();
    // Espera a paleta fechar e a rolagem destravar antes de agir.
    requestAnimationFrame(() => requestAnimationFrame(command.run));
  }

  // Atalho ⌘K / Ctrl+K e o evento do botão da navbar.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }
    function handleOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", handleKey);
    window.addEventListener(PALETTE_EVENT, handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener(PALETTE_EVENT, handleOpen);
    };
  }, []);

  // Aberta: trava a página, foca o campo e devolve o foco ao fechar.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockScroll();
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      unlockScroll();
      previous?.focus({ preventScroll: true });
    };
  }, [open]);

  // Mantém a opção ativa visível na lista.
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index - 1 + results.length) % results.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const command = results[activeIndex];
      if (command) run(command);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      // O foco fica no campo: as opções são navegadas pelas setas.
      event.preventDefault();
    }
  }

  const active = results[activeIndex];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[88] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div aria-hidden="true" onClick={close} className="absolute inset-0 bg-background/70 backdrop-blur-md" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Paleta de comandos"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <MagnifyingGlass size={18} weight="bold" className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls="paleta-opcoes"
                aria-activedescendant={active ? `paleta-${active.id}` : undefined}
                aria-autocomplete="list"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Buscar seção, projeto ou ação..."
                className="h-14 w-full bg-transparent text-base text-foreground placeholder:text-muted/70 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">Esc</kbd>
            </div>

            <ul ref={listRef} id="paleta-opcoes" role="listbox" aria-label="Resultados" data-lenis-prevent className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">Nada encontrado para “{query}”.</li>}
              {results.map((command, index) => {
                const showGroup = index === 0 || results[index - 1].group !== command.group;
                const selected = index === activeIndex;
                const CommandIcon = command.icon;
                return (
                  <li key={command.id} role="presentation">
                    {showGroup && <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{command.group}</p>}
                    <div
                      id={`paleta-${command.id}`}
                      role="option"
                      aria-selected={selected}
                      data-index={index}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => run(command)}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        selected ? "bg-surface-elevated text-foreground" : "text-foreground/80"
                      }`}
                    >
                      <CommandIcon size={16} weight="bold" className={selected ? "text-accent" : "text-muted"} />
                      <span className="flex-1 truncate">{command.label}</span>
                      {command.hint && <span className="truncate font-mono text-[11px] text-muted">{command.hint}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4 border-t border-border px-4 py-2.5 font-mono text-[10px] text-muted">
              <span>↑↓ navegar</span>
              <span>Enter abrir</span>
              <span className="ml-auto">Esc fechar</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
