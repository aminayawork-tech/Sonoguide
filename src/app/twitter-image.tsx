import { ImageResponse } from "next/og";

export const runtime     = "edge";
export const alt         = "SonoPilot — AI Ultrasound Interpretation";
export const size        = { width: 1200, height: 628 };
export const contentType = "image/png";

// Reuse the same design as OG image
export { default } from "./opengraph-image";
