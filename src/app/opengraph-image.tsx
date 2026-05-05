import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "SonoPilot — AI Ultrasound Interpretation";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blue radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(59,130,246,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Icon mark */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 26,
            background: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Waveform dots (simplified for ImageResponse) */}
          <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
            <path
              d="M7 60 C11 50 17 50 21 60 C25 70 31 70 35 60 C39 50 45 50 49 60"
              stroke="#3b82f6"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M83 13 L26 84 L58 63 Z" fill="white" />
            <path d="M83 13 L58 63 L75 54 Z" fill="#94a3b8" />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 400,
              color: "#f8fafc",
              letterSpacing: "-2px",
            }}
          >
            sono
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#3b82f6",
              letterSpacing: "-2px",
            }}
          >
            pilot
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 26,
            color: "#94a3b8",
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          AI-Powered Ultrasound Interpretation
        </p>

        {/* Bottom feature pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
          }}
        >
          {["Protocol-first AI", "Live measurements", "31 exam types"].map((t) => (
            <div
              key={t}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                border: "1px solid rgba(59,130,246,0.35)",
                background: "rgba(59,130,246,0.1)",
                color: "#93c5fd",
                fontSize: 18,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
