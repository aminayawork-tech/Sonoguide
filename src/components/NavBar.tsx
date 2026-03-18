"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Clock, Home, Search } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/protocols", label: "Protocols", icon: Search },
  { href: "/scan", label: "Scan", icon: Activity },
  { href: "/history", label: "History", icon: Clock },
];

/** "Sono" dark-bold + "guide" blue — matching the SonoBuddy logo pattern */
function SonoLogo() {
  return (
    <Link href="/" className="flex flex-col leading-none select-none">
      <span className="text-xl font-extrabold tracking-tight" style={{ color: "#1a2235" }}>
        Sono<span style={{ color: "#2563eb" }}>guide</span>
      </span>
      <span className="text-[10px] font-medium mt-0.5" style={{ color: "#94a3b8" }}>
        Your AI ultrasound guide
      </span>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top nav */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <SonoLogo />

          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    active
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                  style={active ? { color: "#2563eb", background: "#eff6ff" } : undefined}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <span className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#2563eb" }}>
            Free · 15 scans/mo
          </span>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
        <div className="flex items-stretch">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
                style={{ color: active ? "#2563eb" : "#94a3b8" }}
              >
                <Icon size={21} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
