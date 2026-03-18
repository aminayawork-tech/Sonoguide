import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonoguide — AI Ultrasound Guide",
  description:
    "AI-powered point-of-care ultrasound interpreter. Protocol-first image analysis, automated measurements, and educational guidance for clinicians.",
  keywords:
    "POCUS AI, ultrasound AI analyzer, point of care ultrasound, ultrasound interpretation, bedside ultrasound",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen"
        style={{ background: "#0a0f1e", color: "#e8edf5", fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
