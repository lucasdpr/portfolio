"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "@phosphor-icons/react";

const noopSubscribe = () => () => {};

// Evita divergência entre o HTML renderizado no servidor (que não sabe a
// preferência salva no navegador) e o cliente, sem disparar setState num
// efeito (useSyncExternalStore já retorna `false` no snapshot do servidor).
function useHasMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  if (!mounted) {
    return <span className="block h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent active:scale-95"
    >
      {isDark ? <Sun size={17} weight="bold" /> : <Moon size={17} weight="bold" />}
    </button>
  );
}
