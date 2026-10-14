import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/lib/data";

/**
 * Imagem da prévia quando o link do portfólio é compartilhado (LinkedIn,
 * WhatsApp, e-mail...). Gerada uma vez no build, com as fontes do site.
 */
export const alt = `${profile.fullName} · ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const asset = (file: string) => readFile(join(process.cwd(), "assets/og", file));

export default async function OpengraphImage() {
  const [outfitRegular, outfitBold, mono, nexus, oms] = await Promise.all([
    asset("outfit-latin-400-normal.woff"),
    asset("outfit-latin-700-normal.woff"),
    asset("jetbrains-mono-latin-500-normal.woff"),
    readFile(join(process.cwd(), "public/projetos/nexus.jpg")),
    readFile(join(process.cwd(), "public/projetos/oms-painel.jpg")),
  ]);
  const dataUri = (buffer: Buffer) => `data:image/jpeg;base64,${buffer.toString("base64")}`;

  const windowStyle = {
    position: "absolute" as const,
    display: "flex",
    flexDirection: "column" as const,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#0b0b0f",
    boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
  };
  const dots = (
    <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
        <div key={color} style={{ width: 11, height: 11, borderRadius: 999, background: color }} />
      ))}
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#09090b",
          fontFamily: "Outfit",
          color: "#f4f4f5",
        }}
      >
        {/* Luzes nas cores do site */}
        <div style={{ position: "absolute", left: -160, top: -220, width: 620, height: 620, borderRadius: 999, background: "radial-gradient(circle, rgba(34,211,238,0.30), transparent 65%)" }} />
        <div style={{ position: "absolute", right: -120, bottom: -260, width: 760, height: 760, borderRadius: 999, background: "radial-gradient(circle, rgba(167,139,250,0.32), transparent 65%)" }} />

        {/* Telas dos projetos saindo pela borda direita */}
        <div style={{ ...windowStyle, left: 700, top: 70, width: 620, height: 400, transform: "rotate(-4deg)" }}>
          {dots}
          <img src={dataUri(oms)} width={620} height={388} style={{ objectFit: "cover", objectPosition: "left top" }} alt="" />
        </div>
        <div style={{ ...windowStyle, left: 760, top: 250, width: 620, height: 400, transform: "rotate(3deg)" }}>
          {dots}
          <img src={dataUri(nexus)} width={620} height={388} style={{ objectFit: "cover", objectPosition: "left top" }} alt="" />
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 56px 72px", width: 690 }}>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 24, color: "#a1a1aa" }}>
            {profile.firstName.toLowerCase()}
            <span style={{ color: "#22d3ee" }}>.</span>dev
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 82, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>Lucas Gabriel</div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                fontSize: 46,
                fontWeight: 700,
                letterSpacing: -1,
                backgroundImage: "linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {profile.role}
            </div>
            <div style={{ display: "flex", marginTop: 26, fontSize: 27, lineHeight: 1.4, color: "#a1a1aa", maxWidth: 580 }}>
              Sistemas web, APIs e PWAs offline em produção.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28, maxWidth: 600 }}>
              {profile.mainStack.map((tech) => (
                <div
                  key={tech}
                  style={{
                    display: "flex",
                    fontFamily: "JetBrains Mono",
                    fontSize: 19,
                    padding: "7px 16px",
                    borderRadius: 999,
                    border: "1px solid #27272a",
                    background: "rgba(17,17,19,0.85)",
                    color: "#e4e4e7",
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: "#a1a1aa" }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#34d399" }} />
            Aberto a vagas · {profile.location.replace(" - ", ", ").replace(", Brasil", "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: outfitRegular, style: "normal", weight: 400 },
        { name: "Outfit", data: outfitBold, style: "normal", weight: 700 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
