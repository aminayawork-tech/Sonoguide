import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sonopilot.app";

export default async function AppleIcon() {
  const iconData = await fetch(`${APP_URL}/sonopilot-share-icon.png`).then((r) => r.arrayBuffer());
  const iconBase64 = `data:image/png;base64,${Buffer.from(iconData).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img src={iconBase64} width={180} height={180} style={{ objectFit: "cover" }} />
      </div>
    ),
    { ...size },
  );
}
