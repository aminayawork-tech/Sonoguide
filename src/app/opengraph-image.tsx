import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SonoPilot — AI Ultrasound Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const planeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M4 76 L92 8 L72 88 Z" fill="white"/>
  <path d="M92 8 L52 46 L72 88 Z" fill="black" fill-opacity="0.14"/>
  <path d="M4 76 L52 46 L42 72 Z" fill="black" fill-opacity="0.10"/>
  <path d="M4 92 Q12 86 20 92 Q28 98 36 92 Q44 86 52 92 Q60 98 68 92"
        stroke="white" stroke-width="4" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          gap: "60px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 220,
            height: 220,
            background: "rgba(255,255,255,0.15)",
            borderRadius: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(planeSvg)}`}
            width={186}
            height={186}
          />
        </div>

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span style={{ fontSize: "88px", fontWeight: "900", color: "white", lineHeight: 1 }}>Sono</span>
            <span style={{ fontSize: "88px", fontWeight: "900", color: "rgba(255,255,255,0.75)", lineHeight: 1 }}>Pilot</span>
          </div>
          <span style={{ fontSize: "32px", color: "rgba(255,255,255,0.80)", fontWeight: 500 }}>
            AI-Powered Ultrasound Interpretation
          </span>
          <span style={{ fontSize: "24px", color: "rgba(255,255,255,0.55)" }}>
            sonopilot.app
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}

