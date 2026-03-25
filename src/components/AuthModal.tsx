"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  onClose: () => void;
  /** If provided, shown above the form as context for why auth is required */
  reason?: string;
}

export default function AuthModal({ onClose, reason }: AuthModalProps) {
  const [mode,     setMode]     = useState<"signin" | "signup">("signin");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [sent,     setSent]     = useState(false); // email confirmation sent

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>

      <div
        className="relative w-full max-w-sm rounded-2xl border p-7 shadow-2xl"
        style={{ background: "#ffffff", borderColor: "#dde4ee" }}>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 transition-colors hover:bg-slate-100"
          style={{ color: "#94a3b8" }}>
          <X size={16} />
        </button>

        {/* Logo */}
        <div className="mb-5 flex items-baseline gap-0 select-none leading-none">
          <span className="text-lg font-extrabold" style={{ color: "#0f172a" }}>Sono</span>
          <span className="text-lg font-extrabold" style={{ color: "#2563eb" }}>Guide</span>
        </div>

        {sent ? (
          /* ── Email sent state ── */
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "#eff6ff" }}>
              <span className="text-xl">📧</span>
            </div>
            <p className="font-semibold" style={{ color: "#0f172a" }}>Check your email</p>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl py-2.5 text-sm font-bold text-white"
              style={{ background: "#2563eb" }}>
              Got it
            </button>
          </div>
        ) : (
          <>
            {reason && (
              <div className="mb-4 rounded-xl border px-3 py-2.5 text-sm"
                style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#1d4ed8" }}>
                {reason}
              </div>
            )}

            <h2 className="mb-1 text-lg font-bold" style={{ color: "#0f172a" }}>
              {mode === "signin" ? "Sign in" : "Create your account"}
            </h2>
            <p className="mb-5 text-sm" style={{ color: "#64748b" }}>
              {mode === "signin"
                ? "Welcome back — sign in to continue scanning."
                : "Free — 5 scans a month, no credit card required."}
            </p>

            {error && (
              <div className="mb-4 rounded-xl border px-3 py-2.5 text-sm"
                style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-400"
                style={{ borderColor: "#dde4ee", color: "#0f172a" }}
              />
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition-colors focus:border-blue-400"
                  style={{ borderColor: "#dde4ee", color: "#0f172a" }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#94a3b8" }}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: "#2563eb" }}>
                {loading && <Loader2 size={14} className="animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm" style={{ color: "#64748b" }}>
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
                className="font-semibold underline"
                style={{ color: "#2563eb" }}>
                {mode === "signin" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
