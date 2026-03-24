"use client";

import { useState } from "react";
import { Check, Loader2, Sparkles, X, Zap } from "lucide-react";
import { PLANS, FREE_SCAN_LIMIT, type PlanKey } from "@/lib/stripe";

interface UpgradeModalProps {
  onClose: () => void;
  /** If true, shows the "limit reached" headline; otherwise shows generic upgrade */
  limitReached?: boolean;
}

const PLAN_ORDER: PlanKey[] = ["pro_monthly", "pro_yearly", "clinic"];

export default function UpgradeModal({ onClose, limitReached }: UpgradeModalProps) {
  const [loading,    setLoading]    = useState<PlanKey | null>(null);
  const [errorMsg,   setErrorMsg]   = useState<string | null>(null);
  const [billingTab, setBillingTab] = useState<"monthly" | "yearly">("monthly");

  async function handleUpgrade(planKey: PlanKey) {
    setLoading(planKey);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  const visiblePlans: PlanKey[] = billingTab === "yearly"
    ? ["pro_yearly", "clinic"]
    : ["pro_monthly", "clinic"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl"
        style={{ background: "#ffffff", borderColor: "#dde4ee" }}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" }}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-slate-100"
            style={{ color: "#94a3b8" }}>
            <X size={16} />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: "#2563eb" }}>
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold" style={{ color: "#0f172a" }}>Upgrade Sonoguide</span>
          </div>

          {limitReached ? (
            <>
              <p className="text-lg font-bold leading-snug" style={{ color: "#0f172a" }}>
                You&apos;ve used your {FREE_SCAN_LIMIT} free scans this month.
              </p>
              <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
                Upgrade to Pro for unlimited scans + advanced features.
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "#64748b" }}>
              Unlock unlimited scans, all protocols, and priority AI analysis.
            </p>
          )}
        </div>

        {/* Billing toggle */}
        <div className="flex gap-1 px-6 pb-4 pt-2">
          {(["monthly", "yearly"] as const).map((t) => (
            <button key={t}
              onClick={() => setBillingTab(t)}
              className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all"
              style={billingTab === t
                ? { background: "#2563eb", color: "#ffffff" }
                : { background: "#f1f5f9", color: "#64748b" }}>
              {t === "yearly" && <Sparkles size={10} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === "yearly" && (
                <span className="rounded px-1 text-[9px] font-bold"
                  style={{ background: "rgba(255,255,255,0.25)" }}>
                  SAVE 33%
                </span>
              )}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="mx-6 mb-3 rounded-xl border px-3 py-2.5 text-sm"
            style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
            {errorMsg}
          </div>
        )}

        {/* Plan cards */}
        <div className="space-y-3 px-6 pb-6">
          {visiblePlans.map((key) => {
            const plan = PLANS[key];
            const isPopular = key === "pro_monthly" || key === "pro_yearly";
            return (
              <div key={key}
                className="rounded-xl border p-4"
                style={{
                  borderColor: isPopular ? "#2563eb" : "#dde4ee",
                  background:  isPopular ? "#eff6ff"  : "#fafafa",
                }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: "#0f172a" }}>
                        {plan.name}
                      </span>
                      {isPopular && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ background: "#2563eb" }}>
                          POPULAR
                        </span>
                      )}
                      {"badge" in plan && plan.badge && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={{ background: "#d1fae5", color: "#059669" }}>
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: "#64748b" }}>
                      <span className="text-base font-extrabold" style={{ color: "#0f172a" }}>
                        {plan.price}
                      </span>
                      {" "}/{plan.period}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpgrade(key)}
                    disabled={loading !== null}
                    className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white disabled:opacity-60 transition-all hover:opacity-90"
                    style={{ background: isPopular ? "#2563eb" : "#374151", minWidth: 80 }}>
                    {loading === key ? <Loader2 size={12} className="animate-spin" /> : null}
                    {loading === key ? "Loading…" : "Upgrade"}
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "#374151" }}>
                      <Check size={12} className="mt-0.5 shrink-0" style={{ color: "#2563eb" }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="pb-4 text-center text-xs" style={{ color: "#94a3b8" }}>
          Cancel anytime. Billed securely via Stripe.
        </p>
      </div>
    </div>
  );
}
