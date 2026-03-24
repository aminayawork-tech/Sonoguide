import Link from "next/link";
import { ArrowRight, Camera, CheckCircle, ClipboardList, Shield, Upload, Zap } from "lucide-react";
import NavBar from "@/components/NavBar";

const personas = [
  {
    role: "Emergency Physician",
    quote: "Caught a FAST-positive I almost missed at 3AM. This is now part of every shift.",
    initials: "AEM",
    color: "#ef4444",
  },
  {
    role: "OB/GYN Resident",
    quote: "CRL with gestational age in 2 seconds. The OB flow is incredible.",
    initials: "SK",
    color: "#9333ea",
  },
  {
    role: "Rural Family Medicine",
    quote: "No radiologist for 90 miles. Sonoguide gave me the confidence to catch a AAA before transfer.",
    initials: "JT",
    color: "#2563eb",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#ffffff" }}>
      <NavBar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-20 pb-16 text-center md:pt-28">

        {/* Soft radial glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full opacity-30"
            style={{ width: 700, height: 500, background: "radial-gradient(ellipse, #bfdbfe 0%, transparent 70%)" }} />
        </div>

        {/* Badge */}
        <div className="relative mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
          style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#2563eb" }}>
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "#2563eb" }} />
          AI-Powered Ultrasound Interpretation
        </div>

        {/* Headline */}
        <h1 className="relative mb-5 max-w-3xl text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl"
          style={{ color: "#0f172a" }}>
          Snap a photo.{" "}
          <span style={{ color: "#2563eb" }}>Understand<br />in seconds.</span>
        </h1>

        {/* Subheadline */}
        <p className="relative mx-auto mb-10 max-w-xl text-lg leading-relaxed md:text-xl"
          style={{ color: "#64748b" }}>
          Point your phone at any ultrasound screen. AI labels structures,
          takes measurements, and flags findings in under 2 seconds.
        </p>

        {/* Primary CTA */}
        <Link
          href="/scan"
          className="relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-95"
          style={{ background: "#2563eb" }}>
          <Camera size={20} />
          Start Scanning Now
          <ArrowRight size={18} />
        </Link>

        {/* Trust bar */}
        <div className="relative mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm"
          style={{ color: "#94a3b8" }}>
          {[
            "Used by clinicians",
            "HIPAA-ready",
            "Not for primary diagnosis",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={13} style={{ color: "#2563eb" }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="border-y py-20" style={{ borderColor: "#f1f5f9", background: "#f8fafc" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-16 text-center text-3xl font-bold" style={{ color: "#0f172a" }}>
            Three steps. Zero learning curve.
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Upload,
                iconBg: "#eff6ff",
                iconColor: "#2563eb",
                title: "Snap or upload",
                desc: "Photograph your ultrasound screen or upload an image from your device. No special equipment needed.",
              },
              {
                step: "02",
                icon: Zap,
                iconBg: "#fefce8",
                iconColor: "#ca8a04",
                title: "AI analyzes instantly",
                desc: "Structures labeled, measurements calculated, anomalies flagged — all in under 2 seconds.",
              },
              {
                step: "03",
                icon: ClipboardList,
                iconBg: "#f0fdf4",
                iconColor: "#059669",
                title: "Instant insights",
                desc: "Annotated image, clinical summary, key findings, and a one-tap PDF report ready to share.",
              },
            ].map(({ step, icon: Icon, iconBg, iconColor, title, desc }) => (
              <div key={step} className="relative rounded-2xl border p-8 text-center shadow-sm"
                style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-bold text-white"
                  style={{ background: "#2563eb" }}>
                  {step}
                </div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ background: iconBg }}>
                  <Icon size={26} style={{ color: iconColor }} />
                </div>
                <h3 className="mb-2 text-lg font-bold" style={{ color: "#0f172a" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What it can do ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold" style={{ color: "#0f172a" }}>
              Powerful AI, simple experience
            </h2>
            <p style={{ color: "#64748b" }}>
              All the precision of expert analysis — without the complexity.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Instant AI Analysis",
                desc: "Structure labels, automated measurements, and anomaly detection in under 2 seconds.",
              },
              {
                icon: Shield,
                title: "Privacy-First",
                desc: "Auto-anonymization redacts patient headers. End-to-end encryption. HIPAA-ready.",
              },
              {
                icon: Camera,
                title: "31 Protocols Available",
                desc: "eFAST, cardiac echo, OB, vascular, MSK, and more — all accessible after your first scan.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border p-6 shadow-sm"
                style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "#eff6ff" }}>
                  <Icon size={20} style={{ color: "#2563eb" }} />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: "#0f172a" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="border-y py-20" style={{ borderColor: "#f1f5f9", background: "#f8fafc" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold" style={{ color: "#0f172a" }}>
            Trusted at the bedside
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {personas.map(({ role, quote, initials, color }) => (
              <div key={role} className="rounded-2xl border p-6 shadow-sm"
                style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                <p className="mb-5 text-sm leading-relaxed" style={{ color: "#475569" }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: color }}>
                    {initials}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#0f172a" }}>{role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold" style={{ color: "#0f172a" }}>
            Free to start
          </h2>
          <p className="mb-12 text-center" style={{ color: "#64748b" }}>
            5 free scans every month. Go Pro when you need more.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border p-8"
              style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Free</p>
              <p className="mb-6 text-4xl font-extrabold" style={{ color: "#0f172a" }}>$0</p>
              <ul className="mb-8 flex-1 space-y-3 text-sm" style={{ color: "#475569" }}>
                {[
                  "5 AI analyses/month",
                  "All 31 protocols",
                  "Structure labeling & measurements",
                  "PHI auto-redaction",
                  "30-day scan history",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/scan"
                className="block w-full rounded-xl border py-3 text-center text-sm font-semibold transition-all hover:bg-white"
                style={{ borderColor: "#e2e8f0", color: "#475569" }}>
                Start for free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative flex flex-col rounded-2xl border p-8 shadow-lg"
              style={{ borderColor: "#93c5fd", background: "#eff6ff" }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold text-white"
                style={{ background: "#2563eb" }}>
                Most popular
              </div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide" style={{ color: "#2563eb" }}>Pro</p>
              <p className="mb-1 text-4xl font-extrabold" style={{ color: "#0f172a" }}>
                $34.99<span className="text-base font-normal" style={{ color: "#64748b" }}>/mo</span>
              </p>
              <p className="mb-6 text-xs" style={{ color: "#64748b" }}>or $279/year — save 33%</p>
              <ul className="mb-8 flex-1 space-y-3 text-sm" style={{ color: "#1e40af" }}>
                {[
                  "150 AI analyses/month",
                  "All 31 protocols",
                  "Full measurements suite",
                  "AI chat follow-up",
                  "PDF report export",
                  "1-year scan history",
                  "Priority AI queue",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <CheckCircle size={15} style={{ color: "#2563eb", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/scan"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: "#2563eb" }}>
                Go Pro — Start free trial
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs" style={{ color: "#94a3b8" }}>
            Need clinic-wide access?{" "}
            <Link href="/scan" className="underline" style={{ color: "#64748b" }}>
              Contact us for team pricing →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="border-t py-20" style={{ borderColor: "#f1f5f9", background: "#f8fafc" }}>
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold" style={{ color: "#0f172a" }}>
            Ready to scan smarter?
          </h2>
          <p className="mb-8" style={{ color: "#64748b" }}>
            Join clinicians using Sonoguide to deliver better care at the bedside.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold text-white shadow-lg transition-all hover:opacity-90"
            style={{ background: "#2563eb" }}>
            <Camera size={18} />
            Start Your First Scan Free
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t py-8 pb-24 md:pb-8" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
        <div className="mx-auto max-w-4xl px-4 text-center text-xs" style={{ color: "#94a3b8" }}>
          <p className="mb-1">
            Sonoguide is not FDA-cleared for primary diagnosis. For educational and supportive use only.
          </p>
          <p>© 2026 Sonoguide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
