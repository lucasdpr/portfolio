"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}

/** Hora atual em Barra Mansa (horário de Brasília). Vazio no servidor. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, () => formatter.format(new Date()), () => "--:--");
  return <span className="tabular-nums">{time}</span>;
}
