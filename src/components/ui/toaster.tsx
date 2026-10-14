"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { TOAST_EVENT, type ToastDetail } from "@/lib/toast";

/**
 * Avisos curtos no rodapé da tela (ex: "E-mail copiado"). Qualquer parte da
 * página chama `showToast` (lib/toast.ts); este componente fica no layout.
 * A região é `aria-live`, então leitores de tela também anunciam o aviso.
 */
export function Toaster() {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    let timer = 0;
    function handleToast(event: Event) {
      const { message } = (event as CustomEvent<ToastDetail>).detail;
      setToast({ id: Date.now(), message });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setToast(null), 2600);
    }
    window.addEventListener(TOAST_EVENT, handleToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="flex items-center gap-2.5 rounded-full border border-border bg-surface-elevated/95 px-5 py-3 text-sm font-medium text-foreground shadow-2xl backdrop-blur"
          >
            <CheckCircle size={18} weight="fill" className="text-emerald-400" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
