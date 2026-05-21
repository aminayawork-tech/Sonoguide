"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Camera } from "lucide-react";

const TABS = [
  { href: "/",          label: "Home",      Icon: Home },
  { href: "/scan",      label: "Scan",      Icon: Camera },
  { href: "/protocols", label: "Protocols", Icon: BookOpen },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background: "#000000",
        borderTop: "1px solid #1e293b",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-3 transition-colors"
            style={{ color: active ? "#2563eb" : "#f8fafc" }}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span style={{ fontSize: "10px", fontWeight: active ? 700 : 500 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
