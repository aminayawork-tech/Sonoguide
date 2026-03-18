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

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0f1e]/95 backdrop-blur-md md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 md:py-3">
        {/* Logo — hidden on mobile, shown on md+ */}
        <Link href="/" className="hidden items-center gap-2 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
            <Activity size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">Sonoguide</span>
        </Link>

        {/* Nav items */}
        <div className="flex w-full items-center justify-around md:w-auto md:gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-4 py-2 text-xs transition-all md:flex-row md:gap-2 md:text-sm ${
                  active
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={20} className="md:size-4" />
                <span className="md:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* CTA — desktop only */}
        <div className="hidden md:block">
          <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400 border border-cyan-500/30">
            Free Tier • 15 scans/mo
          </span>
        </div>
      </div>
    </nav>
  );
}
