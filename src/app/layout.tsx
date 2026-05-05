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
  openGraph: {
    title: "SonoPilot — AI Ultrasound Interpretation",
    description:
      "Snap a photo of any ultrasound screen. AI labels structures, takes measurements, and flags findings in seconds.",
    url: APP_URL,
    siteName: "SonoPilot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SonoPilot — AI Ultrasound Interpretation",
    description:
      "Protocol-first AI ultrasound interpretation for clinicians and sonographers.",
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
