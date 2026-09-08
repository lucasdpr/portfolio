"use client";

import { useState, type FormEvent } from "react";
import { PaperPlaneTilt, LinkedinLogo, WhatsappLogo } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/reveal";
import { TechIcon } from "@/components/ui/tech-icon";
import { profile, socialLinks } from "@/lib/data";
import { gmailComposeUrl } from "@/lib/contact-links";

type FormState = { name: string; email: string; message: string };
type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { name: "", email: "", message: "" };

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Conte seu nome.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Digite um e-mail válido.";
  if (values.message.trim().length < 10) errors.message = "Escreva pelo menos uma frase.";
  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Sem backend por enquanto: abre a tela de nova mensagem do Gmail numa
    // aba, já preenchida. Dá pra trocar por uma API route (Resend, etc.)
    // depois.
    const url = gmailComposeUrl(profile.email, {
      subject: `Contato pelo portfólio: ${form.name}`,
      body: `${form.message}\n\n${form.email}`,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("sent");
  }

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section id="contato" className="border-t border-border py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Vamos conversar</h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Tem um projeto em mente, uma vaga ou só quer trocar uma ideia sobre tecnologia? Me manda uma mensagem.
          </p>

          <a
            href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Olá, Lucas! Vi seu portfólio e quero conversar.")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex h-12 w-fit items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform active:scale-95"
          >
            <WhatsappLogo size={18} weight="bold" />
            Chamar no WhatsApp
          </a>

          <div className="mt-6 flex items-center gap-4">
            {socialLinks
              .filter((social) => social.slug !== "whatsapp")
              .map((social) => {
              if (social.slug === "email") {
                return (
                  <a
                    key={social.label}
                    href={gmailComposeUrl(profile.email)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <PaperPlaneTilt size={18} weight="bold" />
                  </a>
                );
              }
              // O Simple Icons não serve mais o logo do LinkedIn (pedido de
              // remoção da Microsoft) — usamos o ícone da Phosphor aqui.
              if (social.slug === "linkedin") {
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <LinkedinLogo size={20} weight="bold" />
                  </a>
                );
              }
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-accent"
                >
                  <TechIcon slug={social.slug} label={social.label} size={20} />
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome
              </label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Como posso te chamar?"
              />
              {errors.name && <p className="text-sm text-danger">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="voce@email.com"
              />
              {errors.email && <p className="text-sm text-danger">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Mensagem
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="resize-none rounded-xl border border-border bg-surface px-4 py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="Me conta um pouco sobre o projeto ou a ideia."
              />
              {errors.message && <p className="text-sm text-danger">{errors.message}</p>}
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-transform active:scale-95 sm:w-auto"
            >
              Enviar mensagem
              <PaperPlaneTilt size={16} weight="bold" />
            </button>

            {status === "sent" && (
              <p className="text-sm text-accent">
                Abri uma aba do Gmail com a mensagem pronta. Se não abrir (ou você não usa Gmail), me
                escreva direto em{" "}
                <a href={gmailComposeUrl(profile.email)} target="_blank" rel="noreferrer" className="underline">
                  {profile.email}
                </a>
                .
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
