"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  Info,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { getSavedScans } from "@/lib/mock-analysis";

const LS_KEY = "sonoguide_history";

const ALERT_CFG: Record<string, {
  icon: React.ElementType; iconColor: string; border: string; bg: string; badge: string; badgeText: string; label: string;
}> = {
  critical: { icon: XCircle,      iconColor: "#dc2626", border: "#fca5a5", bg: "#fef2f2", badge: "#fee2e2", badgeText: "#dc2626", label: "Critical" },
  high:     { icon: AlertTriangle, iconColor: "#ea580c", border: "#fdba74", bg: "#fff7ed", badge: "#fed7aa", badgeText: "#ea580c", label: "High" },
  moderate: { icon: AlertTriangle, iconColor: "#ca8a04", border: "#fcd34d", bg: "#fefce8", badge: "#fef9c3", badgeText: "#ca8a04", label: "Moderate" },
  low:      { icon: Info,          iconColor: "#2563eb", border: "#93c5fd", bg: "#eff6ff", badge: "#dbeafe", badgeText: "#2563eb", label: "Low" },
  none:     { icon: CheckCircle,   iconColor: "#059669", border: "#6ee7b7", bg: "#f0fdf4", badge: "#d1fae5", badgeText: "#059669", label: "Normal" },
};

export default function HistoryPage() {
  const [scans, setScans] = useState(() => getSavedScans());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setScans(JSON.parse(stored));
      else localStorage.setItem(LS_KEY, JSON.stringify(getSavedScans()));
    } catch { /* ignore */ }
  }, []);

  function handleDelete(id: string) {
    setScans((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  const filtered = scans.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.protocol.toLowerCase().includes(search.toLowerCase()) ||
      s.finding.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === "all" || s.alertLevel === filter);
  });

  const stats = {
    total: scans.length,
    thisWeek: scans.length,
    normal: scans.filter((s) => s.alertLevel === "none").length,
    critical: scans.filter((s) => s.alertLevel === "critical").length,
  };

  return (
    <div className="min-h-screen pt-14 pb-24 md:pb-8 md:pt-16" style={{ background: "#eef3f8" }}>
      <NavBar />

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-1 text-3xl font-extrabold" style={{ color: "#1a2235" }}>Scan History</h1>
            <p className="text-sm" style={{ color: "#5a6a85" }}>Review and export your saved scans.</p>
          </div>
          <Link href="/scan"
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            style={{ background: "#2563eb" }}>
            New Scan <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Scans", value: stats.total, color: "#1a2235" },
            { label: "This Week", value: stats.thisWeek, color: "#2563eb" },
            { label: "Normal", value: stats.normal, color: "#059669" },
            { label: "Critical", value: stats.critical, color: "#dc2626" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border p-4 text-center shadow-sm"
              style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
              <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Free tier notice */}
        <div className="mb-5 flex items-center justify-between rounded-xl border px-4 py-3"
          style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
          <div className="flex items-center gap-2 text-sm" style={{ color: "#5a6a85" }}>
            <Clock size={14} />
            Free tier: Scans retained for <strong style={{ color: "#1a2235" }}>30 days</strong>
          </div>
          <Link href="/" className="text-xs font-semibold" style={{ color: "#2563eb" }}>
            Upgrade to Pro →
          </Link>
        </div>

        {/* Search + filter */}
        <div className="mb-5 flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search scans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border py-2.5 pl-9 pr-4 text-sm outline-none"
              style={{ background: "#ffffff", borderColor: "#dde4ee", color: "#1a2235" }}
            />
          </div>
          <div className="relative">
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#94a3b8" }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border py-2.5 pl-9 pr-7 text-sm outline-none appearance-none"
              style={{ background: "#ffffff", borderColor: "#dde4ee", color: "#5a6a85" }}
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
              <option value="none">Normal</option>
            </select>
          </div>
        </div>

        {/* Scan list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <FileText size={32} className="mx-auto mb-3" style={{ color: "#dde4ee" }} />
              <p style={{ color: "#94a3b8" }}>No scans found</p>
            </div>
          ) : (
            filtered.map((scan) => {
              const cfg = ALERT_CFG[scan.alertLevel] ?? ALERT_CFG.none;
              const AlertIcon = cfg.icon;
              return (
                <div key={scan.id}
                  className="group flex items-center gap-4 rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md"
                  style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{ borderColor: cfg.border, background: cfg.bg }}>
                    <AlertIcon size={17} style={{ color: cfg.iconColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold" style={{ color: "#1a2235" }}>{scan.protocol}</p>
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: cfg.badge, color: cfg.badgeText }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: "#5a6a85" }}>{scan.finding}</p>
                    <p className="mt-0.5 text-xs" style={{ color: "#94a3b8" }}>{scan.date}</p>
                  </div>

                  {/* Actions — always visible on mobile, fade-in on desktop hover */}
                  <div className="flex shrink-0 gap-1.5 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity">
                    <Link href={`/results?protocol=${scan.protocol.toLowerCase().replace(/ /g, "-")}`}
                      className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium"
                      style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                      <ArrowRight size={11} /> <span className="hidden sm:inline">View</span>
                    </Link>
                    <button className="hidden sm:flex items-center rounded-lg border px-2.5 py-1.5 text-xs"
                      style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                      <Download size={12} />
                    </button>
                    <button onClick={() => handleDelete(scan.id)}
                      className="flex items-center rounded-lg border px-2.5 py-1.5 text-xs transition-colors hover:bg-red-100"
                      style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Export all */}
        {filtered.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all hover:bg-white"
              style={{ borderColor: "#dde4ee", color: "#5a6a85", background: "#f8fafc" }}>
              <Download size={15} /> Export All as PDF
            </button>
          </div>
        )}

        {/* HIPAA note */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border p-4"
          style={{ borderColor: "#dde4ee", background: "#f8fafc" }}>
          <Info size={14} className="mt-0.5 shrink-0" style={{ color: "#94a3b8" }} />
          <p className="text-xs" style={{ color: "#94a3b8" }}>
            All scans are stored locally on this device and anonymized by default. No PHI is stored
            in the cloud unless you explicitly opt in. Scan data is encrypted at rest.
          </p>
        </div>
      </div>
    </div>
  );
}
