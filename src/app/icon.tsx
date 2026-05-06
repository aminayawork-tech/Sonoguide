import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 256, height: 256 };
export const contentType = "image/png";

const planeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M4 76 L92 8 L72 88 Z" fill="white"/>
  <path d="M92 8 L52 46 L72 88 Z" fill="black" fill-opacity="0.14"/>
  <path d="M4 76 L52 46 L42 72 Z" fill="black" fill-opacity="0.10"/>
  <path d="M4 92 Q12 86 20 92 Q28 98 36 92 Q44 86 52 92 Q60 98 68 92"
        stroke="white" stroke-width="4" fill="none"
        stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#2563EB",
          borderRadius: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(planeSvg)}`}
          width={218}
          height={218}
        />
      </div>
    ),
    { ...size },
  );
}
