import Link from "next/link";
import { ArrowRight, CheckCircle, Search, Shield, Zap } from "lucide-react";
import NavBar from "@/components/NavBar";

const features = [
  {
    icon: Search,
    title: "Protocol-First Intelligence",
    desc: "Select your exam type first — AI tailors every analysis to the specific anatomy, measurements, and pathologies of your chosen protocol.",
  },
  {
    icon: Zap,
    title: "Instant AI Analysis",
    desc: "Upload a photo of any ultrasound screen. Structure labels, automated measurements, and anomaly detection in under 2 seconds.",
  },
  {
    icon: Shield,
    title: "Privacy-First & HIPAA-Ready",
    desc: "Auto-anonymization, end-to-end encryption, and optional offline models. Your patients' data never leaves without permission.",
  },
];

const protocols = [
  { name: "eFAST", color: "#fee2e2", text: "#dc2626" },
  { name: "Carotid Duplex", color: "#dbeafe", text: "#2563eb" },
  { name: "TTE Echo", color: "#fce7f3", text: "#db2777" },
  { name: "BLUE Protocol", color: "#e0f2fe", text: "#0284c7" },
  { name: "OB 1st Tri", color: "#f3e8ff", text: "#9333ea" },
  { name: "Thyroid US", color: "#ccfbf1", text: "#0d9488" },
  { name: "AAA Screening", color: "#dbeafe", text: "#2563eb" },
  { name: "DVT Duplex", color: "#dbeafe", text: "#2563eb" },
  { name: "Rotator Cuff", color: "#fef3c7", text: "#d97706" },
  { name: "Pelvic US", color: "#f3e8ff", text: "#9333ea" },
  { name: "ABI", color: "#dbeafe", text: "#2563eb" },
  { name: "Gallbladder / RUQ", color: "#fef9c3", text: "#a16207" },
];

const personas = [
  {
    role: "Emergency Physician",
    quote: "I use Sonoguide every shift. It caught a FAST-positive I almost missed at 3AM.",
    initials: "AEM",
    color: "#ef4444",
  },
  {
    role: "OB/GYN Resident",
    quote: "The first-trimester dating flow is incredible. CRL with GA in 2 seconds.",
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
    <div className="min-h-screen" style={{ background: "#eef3f8" }}>
      <NavBar />

      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-4xl px-4 text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium"
            style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#2563eb" }}>
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "#2563eb" }} />
            AI-Powered Point-of-Care Ultrasound
          </div>

          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
            style={{ color: "#1a2235" }}>
            Scan with confidence.{" "}
            <span style={{ color: "#2563eb" }}>Understand in seconds.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed md:text-xl"
            style={{ color: "#5a6a85" }}>
            Sonoguide is the AI ultrasound interpreter that works with any probe, any device, any
            protocol — delivering real-time analysis, automated measurements, and educational
            guidance at the bedside.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/protocols"
              className="flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition-all hover:opacity-90"
              style={{ background: "#2563eb" }}>
              Start a Scan <ArrowRight size={17} />
            </Link>
            <Link href="/protocols"
              className="flex items-center gap-2 rounded-xl border px-6 py-3 font-semibold transition-all hover:bg-white"
              style={{ borderColor: "#dde4ee", color: "#5a6a85", background: "transparent" }}>
              Browse Protocols
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2.5 text-sm" style={{ color: "#94a3b8" }}>
            {["31 POCUS protocols", "Any probe, any device", "HIPAA-ready", "Not FDA-cleared for primary diagnosis"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={13} style={{ color: "#2563eb" }} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol chips */}
      <section className="py-8 border-y" style={{ borderColor: "#dde4ee", background: "#ffffff" }}>
        <div className="mx-auto max-w-4xl px-4">
          <p className="mb-4 text-center text-sm" style={{ color: "#94a3b8" }}>
            31 protocols across 10 specialties
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {protocols.map((p) => (
              <span key={p.name} className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: p.color, color: p.text }}>
                {p.name}
              </span>
            ))}
            <span className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "#f1f5f9", color: "#94a3b8" }}>
              +19 more
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold" style={{ color: "#1a2235" }}>
              Built for clinicians, not hardware vendors
            </h2>
            <p style={{ color: "#5a6a85" }}>
              Every competitor locks you to their probe. Sonoguide works with everything.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border p-6 shadow-sm"
                style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "#eff6ff" }}>
                  <Icon size={20} style={{ color: "#2563eb" }} />
                </div>
                <h3 className="mb-2 font-semibold" style={{ color: "#1a2235" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a6a85" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-y" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold" style={{ color: "#1a2235" }}>
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Select Protocol", desc: "Choose from 31 POCUS protocols. AI loads the right context." },
              { step: "02", title: "Capture Image", desc: "Photo your ultrasound screen or upload from gallery. Any device." },
              { step: "03", title: "AI Analyzes", desc: "Structures labeled, measurements taken, anomalies flagged in <2s." },
              { step: "04", title: "Review & Export", desc: "Clinical summary, annotated image, PDF report ready to share." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: "#2563eb" }}>
                  {step}
                </div>
                <h3 className="mb-1.5 font-semibold" style={{ color: "#1a2235" }}>{title}</h3>
                <p className="text-sm" style={{ color: "#5a6a85" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold" style={{ color: "#1a2235" }}>
            Trusted by clinicians everywhere
          </h2>
          <div className="grid gap-5 md:grid-cols-3">
            {personas.map(({ role, quote, initials, color }) => (
              <div key={role} className="rounded-2xl border p-6 shadow-sm"
                style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "#5a6a85" }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: color }}>
                    {initials}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#1a2235" }}>{role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-y" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold" style={{ color: "#1a2235" }}>
            Simple pricing
          </h2>
          <p className="mb-12 text-center" style={{ color: "#5a6a85" }}>
            Free to start. Powerful when you need more.
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Free */}
            <div className="flex flex-col rounded-2xl border p-6" style={{ borderColor: "#dde4ee", background: "#f8fafc" }}>
              <p className="mb-1 text-sm font-medium" style={{ color: "#94a3b8" }}>Free</p>
              <p className="mb-1 text-3xl font-extrabold" style={{ color: "#1a2235" }}>$0</p>
              <p className="mb-5 text-xs" style={{ color: "#94a3b8" }}>forever</p>
              <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                {[
                  "5 AI analyses/month",
                  "All 31 protocols",
                  "Structure labeling",
                  "Anomaly detection",
                  "30-day scan history",
                  "PHI auto-redaction",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5" style={{ color: "#5a6a85" }}>
                    <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#94a3b8" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/scan"
                className="block w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-all hover:bg-white"
                style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                Get Started Free
              </Link>
            </div>

            {/* Student */}
            <div className="flex flex-col rounded-2xl border p-6" style={{ borderColor: "#dde4ee", background: "#ffffff" }}>
              <p className="mb-1 text-sm font-medium" style={{ color: "#5a6a85" }}>Student</p>
              <p className="mb-1 text-3xl font-extrabold" style={{ color: "#1a2235" }}>
                $14.99<span className="text-base font-normal" style={{ color: "#94a3b8" }}>/mo</span>
              </p>
              <p className="mb-5 text-xs" style={{ color: "#94a3b8" }}>or $119/year (save 34%)</p>
              <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                {[
                  "50 AI analyses/month",
                  "All 31 protocols",
                  "Full measurements suite",
                  "AI chat (150 msgs/mo)",
                  "90-day scan history",
                  "PHI auto-redaction",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5" style={{ color: "#5a6a85" }}>
                    <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#2563eb" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/scan"
                className="block w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-all hover:bg-slate-50"
                style={{ borderColor: "#2563eb", color: "#2563eb" }}>
                Start Free Trial
              </Link>
            </div>

            {/* Professional — Most Popular */}
            <div className="relative flex flex-col rounded-2xl border p-6 shadow-lg"
              style={{ borderColor: "#93c5fd", background: "#eff6ff" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-0.5 text-xs font-bold text-white"
                style={{ background: "#2563eb" }}>
                Most Popular
              </div>
              <p className="mb-1 text-sm font-medium" style={{ color: "#2563eb" }}>Professional</p>
              <p className="mb-1 text-3xl font-extrabold" style={{ color: "#1a2235" }}>
                $34.99<span className="text-base font-normal" style={{ color: "#64748b" }}>/mo</span>
              </p>
              <p className="mb-5 text-xs" style={{ color: "#64748b" }}>or $279/year (save 33%)</p>
              <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                {[
                  "150 AI analyses/month",
                  "All 31 protocols",
                  "Full measurements suite",
                  "AI chat (500 msgs/mo)",
                  "PDF report export",
                  "1-year scan history",
                  "PHI auto-redaction",
                  "Priority AI queue",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5" style={{ color: "#1e40af" }}>
                    <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#2563eb" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/scan"
                className="block w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "#2563eb" }}>
                Start Pro Trial
              </Link>
            </div>

            {/* Clinic */}
            <div className="flex flex-col rounded-2xl border p-6" style={{ borderColor: "#dde4ee", background: "#f8fafc" }}>
              <p className="mb-1 text-sm font-medium" style={{ color: "#5a6a85" }}>Clinic</p>
              <p className="mb-1 text-3xl font-extrabold" style={{ color: "#1a2235" }}>
                $89.99<span className="text-base font-normal" style={{ color: "#94a3b8" }}>/mo</span>
              </p>
              <p className="mb-5 text-xs" style={{ color: "#94a3b8" }}>or $719/year (save 33%)</p>
              <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                {[
                  "600 AI analyses/month",
                  "3 user seats",
                  "All 31 protocols",
                  "Full measurements suite",
                  "AI chat (2,000 msgs/mo)",
                  "PDF export",
                  "Unlimited history",
                  "PHI auto-redaction",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5" style={{ color: "#5a6a85" }}>
                    <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "#059669" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/scan"
                className="block w-full rounded-xl border py-2.5 text-center text-sm font-semibold transition-all hover:bg-white"
                style={{ borderColor: "#dde4ee", color: "#1a2235" }}>
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold" style={{ color: "#1a2235" }}>Ready to scan smarter?</h2>
          <p className="mb-8" style={{ color: "#5a6a85" }}>
            Join thousands of clinicians using Sonoguide to deliver better care at the bedside.
          </p>
          <Link href="/protocols"
            className="inline-flex items-center gap-2 rounded-xl px-8 py-3 font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: "#2563eb" }}>
            Start Your First Scan <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 pb-24 md:pb-8" style={{ borderColor: "#dde4ee", background: "#ffffff" }}>
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
