"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  ChartBar,
  CheckCircle,
  ClockCountdown,
  DeviceMobile,
  Robot,
  WhatsappLogo,
  WifiHigh,
  WifiSlash,
} from "@phosphor-icons/react";
import { SectionLabel } from "@/components/ui/scramble-text";
import { WordReveal } from "@/components/ui/word-reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";

/* ---------- Demo 1: painel com barras vivas ---------------------------- */

const barsA = [42, 68, 51, 80, 60, 92, 71, 58, 86, 64, 77, 95];
const barsB = [55, 48, 73, 62, 88, 70, 83, 66, 59, 91, 68, 80];

function DashboardDemo() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Ordens", value: 641, color: "text-accent" },
          { label: "No prazo", value: 87, suffix: "%", color: "text-emerald-400" },
          { label: "Alertas", value: 12, color: "text-accent-3" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-surface px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted">{kpi.label}</p>
            <p className={`font-mono text-lg font-bold ${kpi.color}`}>
              <Counter value={kpi.value} suffix={kpi.suffix} />
            </p>
          </div>
        ))}
      </div>
      <div className="flex h-36 items-end gap-1.5 rounded-xl border border-border bg-surface p-3">
        {barsA.map((height, index) => (
          <motion.div
            key={index}
            className="flex-1 rounded-t bg-gradient-to-t from-accent to-accent-2"
            initial={{ height: "8%" }}
            whileInView={
              reduceMotion
                ? { height: `${height}%` }
                : { height: [`${height}%`, `${barsB[index]}%`, `${height}%`] }
            }
            viewport={{ once: false, amount: 0.4 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 4, delay: index * 0.06, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Demo 2: online/offline + fila de sincronização -------------- */

function OfflineDemo() {
  const reduceMotion = useReducedMotion();
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setOnline((prev) => !prev), 2600);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const rows = ["Medição #128", "Medição #129", "Medição #130"];

  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Status</span>
        <motion.span
          layout
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            online ? "bg-emerald-400/15 text-emerald-400" : "bg-amber-400/15 text-amber-400"
          }`}
        >
          {online ? <WifiHigh size={14} weight="bold" /> : <WifiSlash size={14} weight="bold" />}
          {online ? "Online" : "Sem sinal"}
        </motion.span>
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((row, index) => {
          const synced = online || index === 0;
          return (
            <li key={row} className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-sm">
              <span className="text-foreground">{row}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={synced ? "ok" : "fila"}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25, delay: online ? index * 0.15 : 0 }}
                  className={`flex items-center gap-1 text-xs ${synced ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {synced ? <CheckCircle size={14} weight="fill" /> : <ClockCountdown size={14} weight="bold" />}
                  {synced ? "Sincronizado" : "Na fila"}
                </motion.span>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Demo 3: site no celular rolando sozinho -------------------- */

function PhoneDemo() {
  return (
    <div className="relative mx-auto h-56 w-32 overflow-hidden rounded-[1.6rem] border-4 border-foreground/15 bg-background shadow-2xl shadow-accent/10">
      <div className="absolute left-1/2 top-1.5 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-foreground/15" />
      <div className="animate-phone-scroll space-y-2 p-2 pt-5">
        {[0, 1].map((copy) => (
          <div key={copy} className="space-y-2">
            <div className="h-20 rounded-lg bg-gradient-to-br from-accent/60 to-accent-2/60" />
            <div className="h-2 w-3/4 rounded-full bg-muted/30" />
            <div className="h-2 w-1/2 rounded-full bg-muted/20" />
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-12 rounded-md bg-surface-elevated" />
              <div className="h-12 rounded-md bg-surface-elevated" />
              <div className="h-12 rounded-md bg-surface-elevated" />
              <div className="h-12 rounded-md bg-surface-elevated" />
            </div>
            <div className="h-2 w-2/3 rounded-full bg-muted/20" />
          </div>
        ))}
      </div>
      <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-40" />
        <WhatsappLogo size={16} weight="fill" className="relative" />
      </span>
    </div>
  );
}

/* ---------- Demo 4: chat com IA que consulta o banco -------------------- */

const question = "Quais pedidos estão atrasados com o fornecedor?";
const answer = "Encontrei 3 pedidos vencidos. O mais antigo está há 12 dias sem retorno, já marquei para cobrança.";

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  // 0: vazio, 1: pergunta, 2: digitando, 3+: resposta sendo escrita
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timers: number[] = [];
    let interval = 0;

    function run() {
      setStep(0);
      setTyped(0);
      timers.push(window.setTimeout(() => setStep(1), 400));
      timers.push(window.setTimeout(() => setStep(2), 1300));
      timers.push(
        window.setTimeout(() => {
          setStep(3);
          let count = 0;
          interval = window.setInterval(() => {
            count += 2;
            setTyped(count);
            if (count >= answer.length) window.clearInterval(interval);
          }, 28);
        }, 2600),
      );
      timers.push(window.setTimeout(run, 9000));
    }

    run();
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(interval);
    };
  }, [inView, reduceMotion]);

  const showQuestion = reduceMotion || step >= 1;
  const showTyping = !reduceMotion && step === 2;
  const shownAnswer = reduceMotion ? answer : step >= 3 ? answer.slice(0, typed) : "";

  return (
    <div ref={ref} className="flex h-full min-h-56 flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-accent-foreground">
          <Robot size={15} weight="bold" />
        </span>
        <span className="text-sm font-medium text-foreground">Assistente</span>
      </div>
      <AnimatePresence>
        {showQuestion && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-4 py-2 text-sm text-accent-foreground"
          >
            {question}
          </motion.p>
        )}
      </AnimatePresence>
      {showTyping && (
        <div className="flex w-fit gap-1 rounded-2xl rounded-bl-sm bg-surface-elevated px-4 py-3">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-muted"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.12 }}
            />
          ))}
        </div>
      )}
      {shownAnswer && (
        <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-surface-elevated px-4 py-2 text-sm text-foreground">
          {shownAnswer}
          {!reduceMotion && typed < answer.length && <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-foreground align-middle" />}
        </p>
      )}
    </div>
  );
}

/* ---------- Grade --------------------------------------------------------- */

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  /** Projetos reais do portfólio onde a habilidade foi aplicada. */
  usedIn: string[];
  stack: string[];
  demo: ReactNode;
  className?: string;
  horizontal?: boolean;
};

function ServiceCard({ icon, title, description, usedIn, stack, demo, className = "", horizontal = false }: ServiceCardProps) {
  return (
    <SpotlightCard
      className={`h-full overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-colors duration-500 hover:border-accent/40 sm:p-8 ${className}`}
    >
      <div className={`flex h-full flex-col gap-8 ${horizontal ? "md:flex-row md:items-center" : ""}`}>
        <div className={horizontal ? "md:w-2/5" : ""}>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-accent">
            {icon}
          </span>
          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
          <p className="mt-3 leading-relaxed text-muted">{description}</p>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-muted">Onde apliquei</p>
          <p className="mt-1.5 text-sm font-medium text-foreground">{usedIn.join(" · ")}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span key={tech} className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-muted">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className={`flex-1 ${horizontal ? "md:w-3/5" : ""}`}>
          <p className="mb-2 text-right font-mono text-[10px] uppercase tracking-wider text-muted/70">ilustração</p>
          {demo}
        </div>
      </div>
    </SpotlightCard>
  );
}

export function Services() {
  return (
    <section id="habilidades" className="border-t border-border py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <SectionLabel index="02" text="habilidades" />
          <WordReveal
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            words={["O", "que", "eu", "sei", { text: "fazer.", className: "text-gradient" }]}
          />
          <Reveal delay={0.1}>
            <p className="mt-4 text-muted">Cada habilidade abaixo está aplicada num projeto real deste portfólio.</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <ServiceCard
              horizontal
              icon={<ChartBar size={20} weight="bold" />}
              title="Sistemas completos, do banco à interface"
              description="API REST, banco relacional, painéis com indicadores, auditoria e controle de acesso por perfil."
              usedIn={["OMS", "Central de Abastecimento"]}
              stack={["FastAPI", "Next.js", "PostgreSQL", "Recharts"]}
              demo={<DashboardDemo />}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ServiceCard
              icon={<WifiSlash size={20} weight="bold" />}
              title="Apps que funcionam offline"
              description="PWAs instaláveis que salvam os dados no aparelho e sincronizam quando a conexão volta."
              usedIn={["Pass-Line", "OMS"]}
              stack={["Service Worker", "Dexie.js", "Supabase"]}
              demo={<OfflineDemo />}
            />
          </Reveal>
          <Reveal>
            <ServiceCard
              icon={<DeviceMobile size={20} weight="bold" />}
              title="Sites responsivos"
              description="Sites e catálogos pensados primeiro pro celular, com contato direto pelo WhatsApp."
              usedIn={["RTS EPI", "Oficina do Ar", "Brasa da Vila"]}
              stack={["HTML", "CSS", "JavaScript"]}
              demo={<PhoneDemo />}
            />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-2">
            <ServiceCard
              horizontal
              icon={<Robot size={20} weight="bold" />}
              title="IA integrada ao sistema"
              description="Assistente que responde consultando o banco de dados: busca por número de ordem, pedido, material ou fornecedor."
              usedIn={["Central de Abastecimento"]}
              stack={["LLM (API compatível com OpenAI)", "PostgreSQL"]}
              demo={<ChatDemo />}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
