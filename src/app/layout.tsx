import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/ui/command-palette";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SkipLink } from "@/components/ui/skip-link";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { Preloader } from "@/components/ui/preloader";
import { Toaster } from "@/components/ui/toaster";
import { introInitScript } from "@/lib/intro-script";
import Script from "next/script";
import "lenis/dist/lenis.css";
import { profile, socialLinks } from "@/lib/data";
import { SITE_URL } from "@/lib/site-url";
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

const title = `${profile.fullName} · ${profile.role}`;
const description = `${profile.role} (${profile.mainStack.join(", ")}). Sistemas web, APIs e PWAs offline em produção. Veja os projetos, baixe o currículo e entre em contato.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: `${profile.firstName}.dev`,
  authors: [{ name: profile.fullName, url: SITE_URL }],
  creator: profile.fullName,
  keywords: [
    profile.fullName,
    "desenvolvedor full stack",
    "desenvolvedor júnior",
    "portfólio",
    ...profile.mainStack,
    "PWA",
    "Barra Mansa",
    "Volta Redonda",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: `${profile.firstName}.dev`,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

// Dados estruturados (schema.org): ajudam o Google a entender quem é a pessoa do site.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.fullName,
  jobTitle: profile.role,
  url: SITE_URL,
  image: `${SITE_URL}/profile.jpg`,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Barra Mansa", addressRegion: "RJ", addressCountry: "BR" },
  knowsAbout: profile.mainStack,
  sameAs: socialLinks.filter((link) => link.href.startsWith("https://") && link.slug !== "whatsapp").map((link) => link.href),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SkipLink />
          <Preloader />
          <SmoothScroll />
          <ScrollProgress />
          {children}
          <CommandPalette />
          <Toaster />
          <CustomCursor />
        </ThemeProvider>
        <div aria-hidden="true" className="grain-overlay pointer-events-none fixed inset-0 z-[60]" />
      </body>
    </html>
  );
}
