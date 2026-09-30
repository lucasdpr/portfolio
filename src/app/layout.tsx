import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Preloader } from "@/components/ui/preloader";
import { introInitScript } from "@/lib/intro-script";
import Script from "next/script";
import "lenis/dist/lenis.css";
import { profile } from "@/lib/data";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${profile.fullName} - ${profile.role}`,
  description: `Portfólio de ${profile.fullName}, ${profile.role.toLowerCase()}. Projetos, tecnologias e contato.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sem JS, a intro nunca terminaria — some direto. */}
        <noscript>
          <style>{".preloader{display:none!important}"}</style>
        </noscript>
      </head>
      <body className="min-h-screen antialiased">
        <Script id="intro-init" strategy="beforeInteractive">
          {introInitScript}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Preloader />
          <SmoothScroll />
          <ScrollProgress />
          {children}
          <CustomCursor />
        </ThemeProvider>
        <div aria-hidden="true" className="grain-overlay pointer-events-none fixed inset-0 z-[60]" />
      </body>
    </html>
  );
}
