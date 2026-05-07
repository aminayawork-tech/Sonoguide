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
        }}
      >
        {/* Wordmark on left, icon on right — matches navbar layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span
              style={{
                fontSize: 120,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-4px",
                lineHeight: 1,
              }}
            >
              Sono
            </span>
            <span
              style={{
                fontSize: 120,
                fontWeight: 800,
                color: "#2563eb",
                letterSpacing: "-4px",
                lineHeight: 1,
              }}
            >
              Pilot
            </span>
          </div>

          {/* Icon in blue rounded square */}
          <div
            style={{
              width: 140,
              height: 140,
              background: "#2563eb",
              borderRadius: 32,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={iconBase64} width={140} height={140} />
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
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
