"use client";

import { useState } from "react";
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

const ALERT_STYLES: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  critical: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", label: "Critical" },
  high: { icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30", label: "High" },
  moderate: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", label: "Moderate" },
  low: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", label: "Low" },
  none: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "Normal" },
};

export default function HistoryPage() {
  const scans = getSavedScans();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = scans.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.protocol.toLowerCase().includes(search.toLowerCase()) ||
      s.finding.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || s.alertLevel === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: scans.length,
    critical: scans.filter((s) => s.alertLevel === "critical").length,
    normal: scans.filter((s) => s.alertLevel === "none").length,
    thisWeek: scans.length,
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16" style={{ background: "#0a0f1e" }}>
      <NavBar />

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">Scan History</h1>
            <p className="text-slate-400">Review and export your saved scans.</p>
          </div>
          <Link
            href="/scan"
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-400 transition-all"
          >
            New Scan <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Scans", value: stats.total, color: "text-white" },
            { label: "This Week", value: stats.thisWeek, color: "text-cyan-400" },
            { label: "Normal Findings", value: stats.normal, color: "text-emerald-400" },
            { label: "Critical Findings", value: stats.critical, color: "text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Free tier notice */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock size={14} />
            <span>Free tier: Scans retained for <strong className="text-white">30 days</strong></span>
          </div>
          <Link href="/" className="text-xs text-cyan-400 hover:underline">
            Upgrade to Pro →
          </Link>
        </div>

        {/* Search & filter */}
        <div className="mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search scans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50"
            />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-8 text-sm text-white outline-none focus:border-cyan-500/50 appearance-none"
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
            <div className="py-16 text-center">
              <FileText size={32} className="mx-auto mb-3 text-slate-600" />
              <p className="text-slate-500">No scans found</p>
            </div>
          ) : (
            filtered.map((scan) => {
              const style = ALERT_STYLES[scan.alertLevel] ?? ALERT_STYLES.none;
              const AlertIcon = style.icon;
              return (
                <div
                  key={scan.id}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20"
                >
                  {/* Alert icon */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.bg}`}>
                    <AlertIcon size={18} className={style.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-white">{scan.protocol}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${style.bg} ${style.color}`}>
                        {style.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 truncate">{scan.finding}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{scan.date}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/results?protocol=${scan.protocol.toLowerCase().replace(/ /g, "-").replace(/\//g, "-")}`}
                      className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10"
                    >
                      <ArrowRight size={12} /> View
                    </Link>
                    <button className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/10">
                      <Download size={12} />
                    </button>
                    <button className="flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/20">
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
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-all">
              <Download size={16} />
              Export All as PDF
            </button>
          </div>
        )}

        {/* HIPAA note */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 text-xs text-slate-500">
          <Info size={14} className="mt-0.5 shrink-0 text-slate-600" />
          <p>
            All scans are stored locally on this device and anonymized by default. No PHI is stored
            in the cloud unless you explicitly opt in. Scan data is encrypted at rest.
          </p>
        </div>
      </div>
    </div>
  );
}
