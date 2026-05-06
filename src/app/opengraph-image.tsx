import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SonoPilot — AI Ultrasound Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #eef3f8 0%, #dbeafe 60%, #eff6ff 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: "24px" }}>
          <span style={{ fontSize: "96px", fontWeight: "900", color: "#0f172a", lineHeight: 1 }}>Sono</span>
          <span style={{ fontSize: "96px", fontWeight: "900", color: "#2563eb", lineHeight: 1 }}>Pilot</span>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: "34px", color: "#475569", margin: "0 0 12px", textAlign: "center", fontWeight: 500 }}>
          AI-Powered Ultrasound Interpretation
        </p>
        <p style={{ fontSize: "24px", color: "#94a3b8", margin: 0, textAlign: "center" }}>
          Protocol-first image analysis for clinicians and sonographers
        </p>

        {/* Bottom badge */}
        <div style={{
          marginTop: "48px",
          background: "#2563eb",
          borderRadius: "40px",
          padding: "12px 32px",
          display: "flex",
          alignItems: "center",
        }}>
          <span style={{ color: "white", fontSize: "22px", fontWeight: 700 }}>sonopilot.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
