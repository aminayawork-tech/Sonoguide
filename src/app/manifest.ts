import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SonoPilot",
    short_name: "SonoPilot",
    description: "AI-Guided Ultrasound Study Companion",
    start_url: "/",
    display: "standalone",
    background_color: "#eef3f8",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/sonopilot-favicon.png",
        sizes: "236x236",
        type: "image/png",
      },
      {
        src: "/sonopilot-favicon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
