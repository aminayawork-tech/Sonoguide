import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SonoPilot — AI Ultrasound Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sonopilot.app";

export default async function Image() {
  const iconData = await fetch(`${APP_URL}/sonopilot-favicon.png`).then((r) => r.arrayBuffer());
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
          fontFamily: "system-ui, -apple-system, sans-serif",
          gap: "0px",
        }}
      >
        {/* Icon + wordmark row */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px", marginBottom: "28px" }}>
          <img src={iconBase64} width={96} height={96} style={{ borderRadius: "22px" }} />
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: "90px", fontWeight: "900", color: "#0f172a", lineHeight: 1 }}>Sono</span>
            <span style={{ fontSize: "90px", fontWeight: "900", color: "#2563eb", lineHeight: 1 }}>Pilot</span>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: "36px", color: "#475569", fontWeight: 500, textAlign: "center" }}>
          AI-Powered Ultrasound Interpretation
        </div>
        <div style={{ fontSize: "26px", color: "#94a3b8", marginTop: "16px" }}>
          Protocol-first image analysis for clinicians
        </div>

        {/* URL pill */}
        <div style={{
          marginTop: "48px",
          background: "#eff6ff",
          borderRadius: "40px",
          padding: "12px 36px",
          display: "flex",
        }}>
          <span style={{ color: "#2563eb", fontSize: "24px", fontWeight: 700 }}>sonopilot.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}



