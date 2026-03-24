"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Clock, Home, LogIn } from "lucide-react";
import { useAuth } from "./AuthProvider";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";

const desktopNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
];

function SonoLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const cls = size === "sm"
    ? "text-lg font-extrabold tracking-tight"
    : "text-xl font-extrabold tracking-tight";
  return (
    <Link href="/" className="flex items-baseline gap-0 select-none leading-none">
      <span className={cls} style={{ color: "#0f172a" }}>Sono</span>
      <span className={cls} style={{ color: "#2563eb" }}>Guide</span>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {/* ── Desktop top nav ── */}
      <header
        className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(255,255,255,0.95)", borderColor: "#e2e8f0", backdropFilter: "blur(8px)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <SonoLogo />

          <nav className="flex items-center gap-1">
            {desktopNavItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
                  style={active ? { color: "#2563eb", background: "#eff6ff" } : { color: "#64748b" }}>
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {!loading && (
              user
                ? <UserMenu />
                : (
                  <button onClick={() => setShowAuth(true)}
                    className="flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all hover:bg-slate-50"
                    style={{ borderColor: "#e2e8f0", color: "#374151" }}>
                    <LogIn size={14} />
                    Sign in
                  </button>
                )
            )}
            <Link href="/scan"
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#2563eb" }}>
              <Camera size={15} />
              Start Scanning
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile top bar (logo + auth) ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(255,255,255,0.97)", borderColor: "#e2e8f0" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <SonoLogo size="sm" />
          <div>
            {!loading && (
              user
                ? <UserMenu />
                : (
                  <button onClick={() => setShowAuth(true)}
                    className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all"
                    style={{ borderColor: "#e2e8f0", color: "#374151" }}>
                    <LogIn size={13} />
                    Sign in
                  </button>
                )
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile bottom tab bar — Home | Scan | History ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ background: "rgba(255,255,255,0.97)", borderColor: "#e2e8f0" }}>
        <div className="flex items-stretch">
          {/* Home */}
          <Link href="/"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
            style={{ color: pathname === "/" ? "#2563eb" : "#94a3b8" }}>
            <Home size={21} />
            Home
          </Link>

          {/* Scan — center, prominent */}
          <Link href="/scan"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: pathname === "/scan" ? "#2563eb" : "#eff6ff" }}>
              <Camera size={19} style={{ color: pathname === "/scan" ? "#ffffff" : "#2563eb" }} />
            </div>
            <span style={{ color: "#2563eb" }}>Scan</span>
          </Link>

          {/* History */}
          <Link href="/history"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
            style={{ color: pathname.startsWith("/history") ? "#2563eb" : "#94a3b8" }}>
            <Clock size={21} />
            History
          </Link>
        </div>
      </nav>
    </>
  );
}
