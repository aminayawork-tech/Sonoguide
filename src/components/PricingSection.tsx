"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Mail, X } from "lucide-react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";

type PlanKey = "pro_monthly" | "pro_yearly" | "clinic";

function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-sm rounded-2xl border p-7 shadow-2xl"
        style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
        <button onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-slate-100"
          style={{ color: "#94a3b8" }}>
          <X size={16} />
        </button>
        <div className="mb-5 flex items-baseline gap-0.5">
          <span className="text-lg font-extrabold" style={{ color: "#0f172a" }}>Sono</span>
          <span className="text-lg font-extrabold" style={{ color: "#2563eb" }}>Guide</span>
        </div>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: "#eff6ff" }}>
          <Mail size={22} style={{ color: "#2563eb" }} />
        </div>
        <h2 className="mb-1 text-lg font-bold" style={{ color: "#0f172a" }}>Contact Sales</h2>
        <p className="mb-5 text-sm" style={{ color: "#64748b" }}>
          Interested in the Clinic plan? Reach out and we'll get you set up with a custom demo.
        </p>
        <a
          href="mailto:sales@sonoguide.app?subject=Clinic Plan Inquiry"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "#2563eb" }}>
          <Mail size={14} />
          Email us at sales@sonoguide.app
        </a>
        <button onClick={onClose}
          className="mt-3 w-full rounded-xl border py-2.5 text-sm font-medium transition-all hover:bg-slate-50"
          style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function PaidButton({
  planKey,
  label,
  primary,
}: {
  planKey: PlanKey;
  label: string;
  primary?: boolean;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    if (!user) {
      setShowAuth(true);
    } else {
      startCheckout();
    }
  }

  return (
    <>
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          reason="Sign in to continue with your subscription."
        />
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all hover:opacity-90 disabled:opacity-60 ${primary ? "text-white" : "border"}`}
        style={primary
          ? { background: "#2563eb" }
          : { borderColor: "#e2e8f0", color: "#475569" }}>
        {loading && <Loader2 size={12} className="animate-spin" />}
        {label}
      </button>
    </>
  );
}

export default function PricingSection() {
  const [showContact, setShowContact] = useState(false);

  return (
    <section className="py-20">
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-3 text-center text-3xl font-bold" style={{ color: "#0f172a" }}>
          Simple, transparent pricing
        </h2>
        <p className="mb-12 text-center" style={{ color: "#64748b" }}>
          Start free. Upgrade as you grow.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border p-6"
            style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Free</p>
            <p className="mb-5 text-3xl font-extrabold" style={{ color: "#0f172a" }}>$0</p>
            <ul className="mb-6 flex-1 space-y-2.5 text-xs" style={{ color: "#475569" }}>
              {["5 AI analyses/month","All 31 protocols","Structure labeling","Anomaly detection","30-day scan history","PHI auto-redaction"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/scan"
              className="block w-full rounded-xl border py-2.5 text-center text-xs font-semibold transition-all hover:bg-slate-50"
              style={{ borderColor: "#e2e8f0", color: "#475569" }}>
              Get Started Free
            </Link>
          </div>

          {/* Student */}
          <div className="flex flex-col rounded-2xl border p-6"
            style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Student</p>
            <p className="mb-1 text-3xl font-extrabold" style={{ color: "#0f172a" }}>
              $14.99<span className="text-sm font-normal" style={{ color: "#64748b" }}>/mo</span>
            </p>
            <p className="mb-5 text-xs" style={{ color: "#64748b" }}>or $119/yr — save 34%</p>
            <ul className="mb-6 flex-1 space-y-2.5 text-xs" style={{ color: "#475569" }}>
              {["50 AI analyses/month","All 31 protocols","Full measurements suite","AI chat (150 msgs/mo)","90-day scan history","PHI auto-redaction"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <PaidButton planKey="pro_monthly" label="Start Free Trial" />
          </div>

          {/* Professional */}
          <div className="relative flex flex-col rounded-2xl border p-6 shadow-lg"
            style={{ borderColor: "#93c5fd", background: "#eff6ff" }}>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: "#2563eb" }}>
              Most Popular
            </div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#2563eb" }}>Professional</p>
            <p className="mb-1 text-3xl font-extrabold" style={{ color: "#0f172a" }}>
              $34.99<span className="text-sm font-normal" style={{ color: "#64748b" }}>/mo</span>
            </p>
            <p className="mb-5 text-xs" style={{ color: "#64748b" }}>or $279/yr — save 33%</p>
            <ul className="mb-6 flex-1 space-y-2.5 text-xs" style={{ color: "#1e40af" }}>
              {["150 AI analyses/month","All 31 protocols","Full measurements suite","AI chat (500 msgs/mo)","PDF report export","1-year scan history","PHI auto-redaction","Priority AI queue"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: "#2563eb", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <PaidButton planKey="pro_monthly" label="Start Pro Trial" primary />
          </div>

          {/* Clinic */}
          <div className="flex flex-col rounded-2xl border p-6"
            style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8" }}>Clinic</p>
            <p className="mb-1 text-3xl font-extrabold" style={{ color: "#0f172a" }}>
              $89.99<span className="text-sm font-normal" style={{ color: "#64748b" }}>/mo</span>
            </p>
            <p className="mb-5 text-xs" style={{ color: "#64748b" }}>or $719/yr — save 33%</p>
            <ul className="mb-6 flex-1 space-y-2.5 text-xs" style={{ color: "#475569" }}>
              {["600 AI analyses/month","3 user seats","All 31 protocols","Full measurements suite","AI chat (2,000 msgs/mo)","PDF export","Unlimited history","PHI auto-redaction","Priority support"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle size={13} style={{ color: "#94a3b8", flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowContact(true)}
              className="w-full rounded-xl border py-2.5 text-xs font-semibold transition-all hover:bg-white"
              style={{ borderColor: "#e2e8f0", color: "#475569" }}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
