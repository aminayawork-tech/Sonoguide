"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Clock, Home } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
];

function SonoLogo() {
  return (
    <Link href="/" className="flex items-baseline gap-0.5 select-none leading-none">
      <span className="text-xl font-extrabold tracking-tight" style={{ color: "#0f172a" }}>
        Sono
      </span>
      <span className="text-xl font-extrabold tracking-tight" style={{ color: "#2563eb" }}>
        guide
      </span>
    </Link>
  );
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top nav */}
      <header
        className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(255,255,255,0.95)", borderColor: "#e2e8f0", backdropFilter: "blur(8px)" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <SonoLogo />

          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all"
                  style={
                    active
                      ? { color: "#2563eb", background: "#eff6ff" }
                      : { color: "#64748b" }
                  }>
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/scan"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "#2563eb" }}>
            <Camera size={15} />
            Start Scanning
          </Link>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{ background: "rgba(255,255,255,0.97)", borderColor: "#e2e8f0" }}>
        <div className="flex items-stretch">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors"
                style={{ color: active ? "#2563eb" : "#94a3b8" }}>
                <Icon size={21} />
                {label}
              </Link>
            );
          })}

          {/* Center Scan tab — prominent */}
          <Link
            href="/scan"
            className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition-colors"
            style={{ color: pathname === "/scan" ? "#2563eb" : "#2563eb" }}>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: pathname === "/scan" ? "#2563eb" : "#eff6ff",
              }}>
              <Camera
                size={19}
                style={{ color: pathname === "/scan" ? "#ffffff" : "#2563eb" }}
              />
            </div>
            <span style={{ color: "#2563eb" }}>Scan</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
