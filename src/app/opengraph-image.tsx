import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SonoPilot — AI Ultrasound Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sonopilot.app";

export default async function Image() {
  const iconData = await fetch(`${APP_URL}/sonopilot-share-icon.png`).then((r) => r.arrayBuffer());
  const iconBase64 = `data:image/png;base64,${Buffer.from(iconData).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Logo row: icon + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <img src={iconBase64} width={96} height={96} style={{ borderRadius: 20 }} />
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span
              style={{
                fontSize: 88,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              Sono
            </span>
            <span
              style={{
                fontSize: 88,
                fontWeight: 800,
                color: "#2563eb",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              Pilot
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#64748b",
            fontWeight: 400,
            letterSpacing: "-0.5px",
          }}
        >
          AI-Powered Ultrasound Interpretation
        </div>
      </div>
    ),
    { ...size },
  );
}
