"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Camera, Home, Library, LogIn } from "lucide-react";
import { useAuth } from "./AuthProvider";
import UserMenu from "./UserMenu";
import AuthModal from "./AuthModal";

const desktopNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocols", icon: Library },
];

function SonoLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? 30 : 34;
  const textSize = size === "sm" ? "text-[17px]" : "text-[20px]";
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      {/* Paper Plane Pulse — white background favicon */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pg" x1="84" y1="16" x2="18" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#14BBA6"/>
            <stop offset="100%" stopColor="#2563EB"/>
          </linearGradient>
          <linearGradient id="pgd" x1="84" y1="16" x2="16" y2="66" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0d9488"/>
            <stop offset="100%" stopColor="#1d4ed8"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="white" stroke="#e2e8f0" strokeWidth="2"/>
        <path d="M10 74 C15 65 21 65 26 74 C31 83 37 83 42 74 C47 65 53 65 58 74"
              stroke="#2563EB" strokeWidth="4.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M84 16 L14 40 L48 56 Z" fill="url(#pg)"/>
        <path d="M84 16 L48 56 L16 64 Z" fill="url(#pgd)" opacity="0.85"/>
        <path d="M14 40 L48 56 L16 64 Z" fill="#1d4ed8" opacity="0.4"/>
        <path d="M84 16 L48 56" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
      </svg>
      {/* Wordmark: "sono" regular + "pilot" bold, all lowercase */}
      <span className={`${textSize} tracking-tight leading-none font-normal`} style={{ color: "#374151" }}>
        sono<span className="font-bold" style={{ color: "#2563eb" }}>pilot</span>
      </span>
    </Link>
  );
}

function NavBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth]       = useState(false);
  const [authInitMode, setAuthInitMode] = useState<"signin" | "signup" | "forgot">("signin");

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "forgot") {
      setAuthInitMode("forgot");
      setShowAuth(true);
      // Clean the URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      router.replace(url.pathname + (url.search || ""), { scroll: false });
    }
  }, [searchParams, router]);

  function closeAuth() {
    setShowAuth(false);
    setAuthInitMode("signin");
  }

  return (
    <>
      {showAuth && <AuthModal onClose={closeAuth} initialMode={authInitMode} />}
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

      {/* ── Mobile bottom tab bar — Home | Scan | Protocols ── */}
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

          {/* Protocols */}
          <Link href="/protocols"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
            style={{ color: pathname.startsWith("/protocols") ? "#2563eb" : "#94a3b8" }}>
            <Library size={21} />
            Protocols
          </Link>
        </div>
      </nav>
    </>
  );
}

export default function NavBar() {
  return (
    <Suspense>
      <NavBarInner />
    </Suspense>
  );
}
