"use client";

import { useState } from "react";
import Link from "next/link";
import { X, LogIn, CreditCard, HelpCircle, MessageCircle, Shield, FileText, ChevronRight } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  onSignIn: () => void;
  onClose: () => void;
}

export default function MobileMenu({ onSignIn, onClose }: Props) {
  const { user, profile, signOut } = useAuth();
  const [loadingPortal, setLoadingPortal] = useState(false);

  async function handlePortal() {
    setLoadingPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoadingPortal(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    onClose();
  }

  const sections = [
    {
      title: "ACCOUNT",
      items: user
        ? [
            {
              icon: LogIn,
              label: "Sign Out",
              sublabel: user.email ?? undefined,
              action: handleSignOut,
              color: "#dc2626",
            },
          ]
        : [
            {
              icon: LogIn,
              label: "Sign In",
              action: () => { onClose(); onSignIn(); },
              color: "#2563eb",
            },
          ],
    },
    {
      title: "SUBSCRIPTION",
      items: [
        {
          icon: CreditCard,
          label: "Manage Subscription",
          sublabel: profile ? `${profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)} plan` : undefined,
          action: handlePortal,
          loading: loadingPortal,
        },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        {
          icon: HelpCircle,
          label: "How does this work?",
          href: "/#how-it-works",
        },
        {
          icon: MessageCircle,
          label: "Contact Support",
          href: "mailto:support@sonopilot.app",
        },
      ],
    },
    {
      title: "LEGAL",
      items: [
        { icon: Shield,   label: "Privacy Policy", href: "/privacy" },
        { icon: FileText, label: "Terms of Use",    href: "/terms"   },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "#f8fafc" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
        <span className="text-base font-bold" style={{ color: "#1a2235" }}>Menu</span>
        <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100">
          <X size={20} style={{ color: "#64748b" }} />
        </button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-1 text-xs font-semibold tracking-widest" style={{ color: "#94a3b8" }}>
              {section.title}
            </p>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "#e2e8f0", background: "#ffffff" }}>
              {section.items.map((item, i) => {
                const Icon = item.icon;
                const isLast = i === section.items.length - 1;
                const content = (
                  <div
                    className={`flex items-center gap-3.5 px-4 py-4 ${!isLast ? "border-b" : ""}`}
                    style={{ borderColor: "#f1f5f9" }}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                      style={{ background: "#eff6ff" }}>
                      <Icon size={18} style={{ color: (item as { color?: string }).color ?? "#2563eb" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: (item as { color?: string }).color ?? "#1a2235" }}>
                        {(item as { loading?: boolean }).loading ? "Loading…" : item.label}
                      </p>
                      {(item as { sublabel?: string }).sublabel && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: "#94a3b8" }}>
                          {(item as { sublabel?: string }).sublabel}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={16} style={{ color: "#cbd5e1" }} />
                  </div>
                );

                if ((item as { href?: string }).href) {
                  return (
                    <Link key={item.label} href={(item as { href: string }).href} onClick={onClose}>
                      {content}
                    </Link>
                  );
                }
                return (
                  <button key={item.label} className="w-full text-left" onClick={(item as { action?: () => void }).action}>
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Version footer */}
      <div className="py-6 text-center">
        <p className="text-xs tracking-widest font-medium" style={{ color: "#cbd5e1" }}>SONOPILOT V1.0</p>
      </div>
    </div>
  );
}
