"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  onClose: () => void;
  /** If provided, shown above the form as context for why auth is required */
  reason?: string;
  /** Open the modal directly in a specific mode */
  initialMode?: "signin" | "signup" | "forgot";
}

export default function AuthModal({ onClose, reason, initialMode = "signin" }: AuthModalProps) {
  const [mode,     setMode]     = useState<"signin" | "signup" | "forgot">(initialMode);
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [sent,     setSent]     = useState(false); // email sent (confirm or reset)

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
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
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
        <div className="mb-5 flex items-center gap-2 select-none">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" rx="22" fill="#2563EB"/>
            <path d="M10 74 C15 65 21 65 26 74 C31 83 37 83 42 74 C47 65 53 65 58 74"
                  stroke="white" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M84 16 L14 42 L46 56 Z" fill="white"/>
            <path d="M84 16 L46 56 L16 66 Z" fill="white" opacity="0.65"/>
            <path d="M14 42 L46 56 L16 66 Z" fill="white" opacity="0.3"/>
            <path d="M84 16 L46 56" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <span className="text-[17px] tracking-tight leading-none">
            <span style={{ color: "#374151", fontWeight: 400 }}>sono</span><span style={{ color: "#2563eb", fontWeight: 700 }}>pilot</span>
          </span>
        </div>

        {sent ? (
          /* ── Email sent state (signup confirm OR password reset) ── */
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: "#eff6ff" }}>
              <span className="text-xl">📧</span>
            </div>
            <p className="font-semibold" style={{ color: "#0f172a" }}>Check your email</p>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
              {mode === "forgot"
                ? <>We sent a password reset link to <strong>{email}</strong>. Click it to set a new password.</>
                : <>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</>}
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
            {reason && mode !== "forgot" && (
              <div className="mb-4 rounded-xl border px-3 py-2.5 text-sm"
                style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#1d4ed8" }}>
                {reason}
              </div>
            )}

            <h2 className="mb-1 text-lg font-bold" style={{ color: "#0f172a" }}>
              {mode === "signin" ? "Sign in" : mode === "signup" ? "Create your account" : "Reset password"}
            </h2>
            <p className="mb-5 text-sm" style={{ color: "#64748b" }}>
              {mode === "signin"
                ? "Welcome back — sign in to continue scanning."
                : mode === "signup"
                ? "Free — 5 scans a month, no credit card required."
                : "Enter your email and we'll send you a reset link."}
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

              {mode !== "forgot" && (
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
              )}

              {mode === "signin" && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(null); }}
                    className="text-xs underline"
                    style={{ color: "#64748b" }}>
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                style={{ background: "#2563eb" }}>
                {loading && <Loader2 size={14} className="animate-spin" />}
                {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm" style={{ color: "#64748b" }}>
              {mode === "forgot" ? (
                <>
                  Remember your password?{" "}
                  <button
                    onClick={() => { setMode("signin"); setError(null); }}
                    className="font-semibold underline"
                    style={{ color: "#2563eb" }}>
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
                    className="font-semibold underline"
                    style={{ color: "#2563eb" }}>
                    {mode === "signin" ? "Sign up free" : "Sign in"}
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
