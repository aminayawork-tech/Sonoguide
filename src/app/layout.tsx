import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "SonoPilot — AI Ultrasound Guide",
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
