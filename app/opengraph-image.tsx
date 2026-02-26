import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const iconSvg = readFileSync(join(process.cwd(), "public/arbutus-icon.svg"));
  const iconSrc = `data:image/svg+xml;base64,${iconSvg.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#1C3A4A",
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Subtle texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 60% 40%, rgba(168,196,184,0.12) 0%, transparent 60%)",
          }}
        />

        {/* Logo icon */}
        <img
          src={iconSrc}
          width={130}
          height={90}
          style={{ marginBottom: 28, opacity: 0.95 }}
        />

        {/* Wordmark */}
        <div
          style={{
            color: "white",
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: "-3px",
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          Arbutus
        </div>

        {/* Tagline */}
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 28,
            letterSpacing: "0.5px",
          }}
        >
          Same-day massage, physio &amp; chiro · Victoria, BC
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
