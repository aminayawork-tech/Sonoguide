import Link from "next/link";
import { Activity, ArrowRight, CheckCircle, Search, Shield, Zap } from "lucide-react";
import NavBar from "@/components/NavBar";

const features = [
  {
    icon: Search,
    title: "Protocol-First Intelligence",
    desc: "Select your exam type first — our AI tailors every analysis to the specific anatomy, measurements, and pathologies of your chosen protocol.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Zap,
    title: "Instant AI Analysis",
    desc: "Upload a photo of any ultrasound screen. Receive structure labels, automated measurements, and anomaly detection in under 2 seconds.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Shield,
    title: "Privacy-First & HIPAA-Compliant",
    desc: "Auto-anonymization, end-to-end encryption, and optional offline models for sensitive cases. Your patients' data never leaves without your permission.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const protocols = [
  { name: "eFAST", color: "bg-red-500/20 text-red-300" },
  { name: "Cardiac PLAX", color: "bg-rose-500/20 text-rose-300" },
  { name: "BLUE Protocol", color: "bg-cyan-500/20 text-cyan-300" },
  { name: "OB Dating", color: "bg-purple-500/20 text-purple-300" },
  { name: "AAA Screening", color: "bg-blue-500/20 text-blue-300" },
  { name: "IVC Collapsibility", color: "bg-rose-500/20 text-rose-300" },
  { name: "DVT Compression", color: "bg-blue-500/20 text-blue-300" },
  { name: "Gallbladder", color: "bg-amber-500/20 text-amber-300" },
];

const personas = [
  {
    role: "Emergency Physician",
    quote: "I use Sonoguide every shift. It caught a FAST-positive I almost missed at 3AM.",
    initials: "AEM",
    color: "bg-red-500",
  },
  {
    role: "OB/GYN Resident",
    quote: "The first-trimester dating flow is incredible. CRL with GA in 2 seconds — exactly what I need.",
    initials: "SK",
    color: "bg-purple-500",
  },
  {
    role: "Rural Family Medicine",
    quote: "No radiologist for 90 miles. Sonoguide gave me the confidence to catch a AAA before transfer.",
    initials: "JT",
    color: "bg-cyan-500",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0f1e" }}>
      <NavBar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            AI-Powered Point-of-Care Ultrasound
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            Scan with confidence.{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Understand in seconds.
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 md:text-xl">
            Sonoguide is the AI ultrasound interpreter that works with any probe, any device, any
            protocol — delivering real-time image analysis, automated measurements, and educational
            guidance at the point of care.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/protocols"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Start a Scan <ArrowRight size={18} />
            </Link>
            <Link
              href="/protocols"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-300 transition-all hover:bg-white/10"
            >
              Browse Protocols
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            {[
              "26+ POCUS protocols",
              "Any probe, any device",
              "HIPAA-compliant",
              "Not FDA-cleared for primary diagnosis",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-cyan-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol chips */}
      <section className="py-8 border-y border-white/5">
        <div className="mx-auto max-w-5xl px-4">
          <p className="mb-4 text-center text-sm text-slate-500">20+ protocols across every specialty</p>
          <div className="flex flex-wrap justify-center gap-2">
            {protocols.map((p) => (
              <span key={p.name} className={`rounded-full px-3 py-1 text-xs font-medium ${p.color}`}>
                {p.name}
              </span>
            ))}
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400">+12 more</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-white">Built for clinicians, not hardware vendors</h2>
            <p className="text-slate-400">Every competitor locks you to their probe. Sonoguide works with everything.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={`rounded-2xl border p-6 ${bg}`}>
                <div className={`mb-4 w-fit rounded-lg p-2 ${bg}`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">How it works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Select Protocol", desc: "Choose from 26+ POCUS protocols. AI loads the right analysis context." },
              { step: "02", title: "Capture Image", desc: "Photo your ultrasound screen or upload from gallery. Works with any device." },
              { step: "03", title: "AI Analyzes", desc: "Structures labeled, measurements taken, anomalies flagged — in under 2 seconds." },
              { step: "04", title: "Review & Export", desc: "Clinical summary, annotated image, and PDF report ready to share." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-lg font-bold text-cyan-400">
                  {step}
                </div>
                <h3 className="mb-2 font-semibold text-white">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">Trusted by clinicians everywhere</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {personas.map(({ role, quote, initials, color }) => (
              <div key={role} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="mb-4 text-sm leading-relaxed text-slate-300">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}>
                    {initials}
                  </div>
                  <span className="text-sm text-slate-400">{role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 border-y border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-white">Simple pricing</h2>
          <p className="mb-12 text-center text-slate-400">Free to start. Powerful when you need more.</p>
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="mb-1 text-sm text-slate-400">Basic</p>
              <p className="mb-4 text-3xl font-bold text-white">Free</p>
              <ul className="mb-6 space-y-2 text-sm text-slate-300">
                {["15 AI analyses/month", "16 core protocols", "Structure labeling", "Anomaly detection", "30-day scan history"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/protocols" className="block w-full rounded-xl border border-white/10 py-2.5 text-center text-sm font-semibold text-slate-300 transition-all hover:bg-white/10">
                Get Started Free
              </Link>
            </div>
            <div className="relative rounded-2xl border border-cyan-500/40 bg-cyan-500/5 p-6">
              <div className="absolute -top-3 right-4 rounded-full bg-cyan-500 px-3 py-0.5 text-xs font-bold text-white">
                Most Popular
              </div>
              <p className="mb-1 text-sm text-cyan-400">Pro</p>
              <p className="mb-1 text-3xl font-bold text-white">
                $14.99<span className="text-base font-normal text-slate-400">/mo</span>
              </p>
              <p className="mb-4 text-xs text-slate-500">or $119/year (save 34%)</p>
              <ul className="mb-6 space-y-2 text-sm text-slate-300">
                {["Unlimited AI analyses", "All 26+ protocols", "Full measurements suite", "PDF report export", "Secure sharing", "Offline mode (8 protocols)", "Priority AI queue"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle size={14} className="shrink-0 text-cyan-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/protocols" className="block w-full rounded-xl bg-cyan-500 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-cyan-400">
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500">
              <Activity size={32} className="text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to scan smarter?</h2>
          <p className="mb-8 text-slate-400">
            Join thousands of clinicians using Sonoguide to deliver better care at the bedside.
          </p>
          <Link href="/protocols" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-white transition-all hover:bg-cyan-400">
            Start Your First Scan <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-slate-600">
          <p className="mb-2">
            Sonoguide is not FDA-cleared for primary diagnosis. For educational and supportive use
            only. All findings require qualified clinician review.
          </p>
          <p>© 2026 Sonoguide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
