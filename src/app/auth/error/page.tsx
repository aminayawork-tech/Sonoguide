"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const params = useSearchParams();
  const type = params.get("type"); // "recovery" if we add it later

  const isReset = type === "recovery";

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "#eef3f8" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-xl text-center"
        style={{ background: "#fff" }}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-2 select-none">
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

        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl"
          style={{ background: "#fef2f2" }}
        >
          🔗
        </div>

        <h1 className="text-lg font-bold mb-2" style={{ color: "#1a2235" }}>
          {isReset ? "Reset link expired" : "Link expired or invalid"}
        </h1>

        <p className="text-sm mb-2" style={{ color: "#64748b" }}>
          {isReset
            ? "This password reset link has already been used or has expired."
            : "This confirmation link is no longer valid. It may have already been used or expired."}
        </p>

        <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>
          Links expire after 1 hour and can only be clicked once.
        </p>

        <div className="flex flex-col gap-2">
          <a
            href="/?auth=forgot"
            className="w-full rounded-xl py-2.5 text-sm font-bold text-white inline-block"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)" }}
          >
            Request a new reset link
          </a>
          <a
            href="/"
            className="w-full rounded-xl py-2.5 text-sm font-medium inline-block"
            style={{ color: "#64748b" }}
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
