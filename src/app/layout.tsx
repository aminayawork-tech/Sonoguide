import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://sonopilot.app";

export const metadata: Metadata = {
  title: "SonoPilot — AI Ultrasound Guide",
  description:
    "AI-powered point-of-care ultrasound interpreter. Protocol-first image analysis, automated measurements, and educational guidance for clinicians.",
  keywords:
    "POCUS AI, ultrasound AI analyzer, point of care ultrasound, ultrasound interpretation, bedside ultrasound",
  metadataBase: new URL(APP_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
      { url: "/sonopilot-favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/sonopilot-favicon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/sonopilot-favicon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "SonoPilot — AI Ultrasound Interpretation",
    description:
      "Snap a photo of any ultrasound screen. AI labels structures, takes measurements, and flags findings in seconds.",
    url: APP_URL,
    siteName: "SonoPilot",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "SonoPilot — AI Ultrasound Guide" }],
  },
  twitter: {
    card: "summary",
    title: "SonoPilot — AI Ultrasound Interpretation",
    description:
      "Protocol-first AI ultrasound interpretation for clinicians and sonographers.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen w-full overflow-x-hidden"
        style={{ background: "#eef3f8", color: "#1a2235", fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
