"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Download,
  Flag,
  Info,
  Loader2,
  RefreshCw,
  Share2,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import { getProtocolById } from "@/lib/protocols";
import { getMockAnalysis, type AnalysisResult } from "@/lib/mock-analysis";

const ALERT_CONFIG: Record<string, {
  border: string; bg: string; labelBg: string; labelText: string;
  icon: React.ElementType; iconColor: string; label: string;
}> = {
  critical: { border: "#fca5a5", bg: "#fef2f2", labelBg: "#fee2e2", labelText: "#dc2626", icon: XCircle, iconColor: "#dc2626", label: "CRITICAL FINDING" },
  high:     { border: "#fdba74", bg: "#fff7ed", labelBg: "#fed7aa", labelText: "#ea580c", icon: AlertTriangle, iconColor: "#ea580c", label: "SIGNIFICANT FINDING" },
  moderate: { border: "#fcd34d", bg: "#fefce8", labelBg: "#fef9c3", labelText: "#ca8a04", icon: AlertTriangle, iconColor: "#ca8a04", label: "NOTABLE FINDING" },
  low:      { border: "#93c5fd", bg: "#eff6ff", labelBg: "#dbeafe", labelText: "#2563eb", icon: Info, iconColor: "#2563eb", label: "NOTE" },
  none:     { border: "#6ee7b7", bg: "#f0fdf4", labelBg: "#d1fae5", labelText: "#059669", icon: CheckCircle, iconColor: "#059669", label: "NORMAL" },
};

const FINDING_STYLES: Record<string, { bg: string; border: string; label: string; value: string }> = {
  critical: { bg: "#fef2f2", border: "#fca5a5", label: "#dc2626", value: "#991b1b" },
  warning:  { bg: "#fefce8", border: "#fcd34d", label: "#ca8a04", value: "#92400e" },
  normal:   { bg: "#f0fdf4", border: "#6ee7b7", label: "#059669", value: "#065f46" },
  info:     { bg: "#eff6ff", border: "#93c5fd", label: "#2563eb", value: "#1e40af" },
};

const MEASURE_STATUS: Record<string, string> = {
  normal:    "#059669",
  borderline: "#d97706",
  abnormal:  "#dc2626",
};

const QUALITY_COLOR: Record<string, string> = {
  excellent: "#059669",
  good:      "#2563eb",
  fair:      "#d97706",
  poor:      "#dc2626",
};

function AnnotatedImagePlaceholder({ labels, alertLevel }: { labels: AnalysisResult["labels"]; alertLevel: string }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: "#0a1020", aspectRatio: "4/3" }}>
      {/* Simulated US background */}
      <div className="absolute inset-0 opacity-25"
        style={{ background: "radial-gradient(ellipse at 40% 50%, rgba(80,120,200,0.4) 0%, rgba(20,30,60,0.8) 60%, rgba(5,10,20,1) 100%)" }} />
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="absolute left-0 right-0 h-px opacity-10"
          style={{ top: `${(i + 1) * 5.5}%`, background: "rgba(120,160,255,0.35)" }} />
      ))}
      <div className="absolute opacity-20"
        style={{ top: "22%", left: "22%", width: "52%", height: "42%", background: "radial-gradient(ellipse, rgba(160,190,255,0.2), transparent 70%)", borderRadius: "50%" }} />
      {alertLevel === "critical" && (
        <div className="absolute opacity-30"
          style={{ top: "40%", left: "44%", width: "18%", height: "12%", background: "#ef4444", borderRadius: "40%" }} />
      )}

      {/* Labels */}
      {labels.map((label) => (
        <div key={label.id} className="absolute"
          style={{ left: `${label.x}%`, top: `${label.y}%`, transform: "translate(-50%,-50%)" }}>
          <div className="rounded-md px-2 py-1 text-xs font-bold whitespace-nowrap shadow"
            style={{ background: "rgba(0,0,0,0.72)", border: `1px solid ${label.color}`, color: label.color }}>
            {label.name}
          </div>
        </div>
      ))}

      <div className="absolute bottom-3 right-3">
        <span className="rounded-full text-xs font-semibold text-white px-2.5 py-1"
          style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.15)" }}>
          AI Analysis Active
        </span>
      </div>
      <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between">
        {["2cm","4cm","6cm","8cm","10cm"].map((d) => (
          <span key={d} className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{d}</span>
        ))}
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const protocolId = searchParams.get("protocol") ?? "efast";
  const protocol = getProtocolById(protocolId);

  const [analysis, setAnalysis] = useState<AnalysisResult>(() => getMockAnalysis(protocolId));
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("lastAnalysis");
      if (stored) {
        setAnalysis(JSON.parse(stored));
        sessionStorage.removeItem("lastAnalysis");
      }
      const img = sessionStorage.getItem("lastImage");
      if (img) {
        setCapturedImage(img);
        sessionStorage.removeItem("lastImage");
      }
    } catch {
      // sessionStorage unavailable or parse error — keep mock
    }
  }, []);

  const cfg = ALERT_CONFIG[analysis.alertLevel] ?? ALERT_CONFIG.none;
  const AlertIcon = cfg.icon;

  const timestamp = new Date(analysis.timestamp).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-2xl border p-5 shadow-sm ${className}`}
      style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16" style={{ background: "#eef3f8" }}>
      <NavBar />
      <div className="mx-auto max-w-2xl px-4 py-8">

        {/* Back + timestamp */}
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/scan?protocol=${protocolId}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70"
            style={{ color: "#5a6a85" }}>
            <ArrowLeft size={14} /> Back to Scan
          </Link>
          <span className="text-xs" style={{ color: "#94a3b8" }}>{timestamp}</span>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="text-2xl">{protocol?.icon}</span>
          <div>
            <h1 className="text-xl font-extrabold" style={{ color: "#1a2235" }}>{analysis.protocolName}</h1>
            <p className="text-sm" style={{ color: "#5a6a85" }}>AI Analysis Results</p>
          </div>
        </div>

        {/* Alert banner */}
        {analysis.alertMessage && (
          <div className="my-4 rounded-xl border p-4" style={{ borderColor: cfg.border, background: cfg.bg }}>
            <div className="flex items-start gap-3">
              <AlertIcon size={17} className="mt-0.5 shrink-0" style={{ color: cfg.iconColor }} />
              <div>
                <p className="text-sm font-bold" style={{ color: cfg.iconColor }}>{cfg.label}</p>
                <p className="mt-0.5 text-sm leading-relaxed" style={{ color: cfg.iconColor, opacity: 0.9 }}>
                  {analysis.alertMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Annotated image */}
        <div className="mb-5 overflow-hidden rounded-2xl border shadow-sm" style={{ borderColor: "#dde4ee" }}>
          {capturedImage ? (
            <div className="relative w-full overflow-hidden" style={{ background: "#0a1020" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="Analyzed ultrasound" className="w-full object-contain max-h-80" />
              {/* Overlay labels */}
              <div className="absolute inset-0 pointer-events-none">
                {analysis.labels.map((label) => (
                  <div key={label.id} className="absolute"
                    style={{ left: `${label.x}%`, top: `${label.y}%`, transform: "translate(-50%,-50%)" }}>
                    <div className="rounded-md px-2 py-1 text-xs font-bold whitespace-nowrap shadow"
                      style={{ background: "rgba(0,0,0,0.72)", border: `1px solid ${label.color}`, color: label.color }}>
                      {label.name}
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-3 right-3">
                  <span className="rounded-full text-xs font-semibold text-white px-2.5 py-1"
                    style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    AI Analysis Active
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <AnnotatedImagePlaceholder labels={analysis.labels} alertLevel={analysis.alertLevel} />
          )}
          <div className="flex items-center justify-between border-t px-4 py-2.5"
            style={{ borderColor: "#dde4ee", background: "#f8fafc" }}>
            <span className="text-xs font-semibold"
              style={{ color: QUALITY_COLOR[analysis.imageQuality] }}>
              Image Quality: {analysis.imageQuality.charAt(0).toUpperCase() + analysis.imageQuality.slice(1)}
            </span>
            <ConfidenceBadge score={analysis.confidence} size="sm" />
          </div>
          {analysis.imageQualityNote && (
            <div className="border-t px-4 py-2" style={{ borderColor: "#dde4ee", background: "#eff6ff" }}>
              <p className="flex items-start gap-1.5 text-xs" style={{ color: "#2563eb" }}>
                <Info size={11} className="mt-0.5 shrink-0" />
                {analysis.imageQualityNote}
              </p>
            </div>
          )}
        </div>

        {/* Label legend */}
        <div className="mb-5 flex flex-wrap gap-2">
          {analysis.labels.map((label) => (
            <span key={label.id}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
              style={{ borderColor: "#dde4ee", background: "#ffffff", color: "#5a6a85" }}>
              <span className="h-2 w-2 rounded-full" style={{ background: label.color }} />
              {label.name}
            </span>
          ))}
        </div>

        {/* Findings */}
        <Card className="mb-5">
          <h2 className="mb-4 font-semibold" style={{ color: "#1a2235" }}>Findings</h2>
          <div className="space-y-2">
            {analysis.findings.map((finding, i) => {
              const s = FINDING_STYLES[finding.severity] ?? FINDING_STYLES.info;
              return (
                <div key={i} className="flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5"
                  style={{ borderColor: s.border, background: s.bg }}>
                  <span className="text-xs font-semibold" style={{ color: s.label }}>{finding.label}</span>
                  <span className="text-right text-xs font-bold" style={{ color: s.value }}>{finding.value}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Measurements */}
        {analysis.measurements.length > 0 && (
          <Card className="mb-5">
            <h2 className="mb-4 font-semibold" style={{ color: "#1a2235" }}>Automated Measurements</h2>
            <div className="divide-y" style={{ borderColor: "#f1f5f9" }}>
              {analysis.measurements.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1a2235" }}>{m.name}</p>
                    {m.reference && <p className="text-xs" style={{ color: "#94a3b8" }}>{m.reference}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: MEASURE_STATUS[m.status] }}>{m.value}</p>
                    <p className="text-xs capitalize" style={{ color: "#94a3b8" }}>{m.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Summary */}
        <Card className="mb-5">
          <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>AI Summary</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#5a6a85" }}>{analysis.summary}</p>
        </Card>

        {/* Recommendations */}
        <Card className="mb-5">
          <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>Recommendations</h2>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#5a6a85" }}>
                <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: "#2563eb" }} />
                {rec}
              </li>
            ))}
          </ul>
        </Card>

        {/* Next views */}
        {analysis.nextViews.length > 0 && (
          <div className="mb-5 rounded-2xl border p-5" style={{ borderColor: "#bfdbfe", background: "#eff6ff" }}>
            <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>Suggested Next Views</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.nextViews.map((view) => (
                <Link key={view} href={`/scan?protocol=${protocolId}`}
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                  style={{ borderColor: "#93c5fd", background: "#dbeafe", color: "#1d4ed8" }}>
                  {view} <ArrowRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer + confirm */}
        <div className="mb-5 rounded-2xl border p-5" style={{ borderColor: "#fcd34d", background: "#fefce8" }}>
          <div className="flex items-start gap-3">
            <ShieldAlert size={17} className="mt-0.5 shrink-0" style={{ color: "#ca8a04" }} />
            <div>
              <p className="text-sm font-bold" style={{ color: "#92400e" }}>Important Medical Disclaimer</p>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: "#92400e", opacity: 0.85 }}>
                Sonoguide is not FDA-cleared for primary diagnosis. All findings must be reviewed by a
                qualified clinician before influencing any clinical decision.
              </p>
              <label className="mt-3 flex cursor-pointer items-start gap-2">
                <input type="checkbox" checked={reviewConfirmed}
                  onChange={(e) => setReviewConfirmed(e.target.checked)}
                  className="mt-0.5" style={{ accentColor: "#ca8a04" }} />
                <span className="text-xs font-medium" style={{ color: "#92400e" }}>
                  I confirm a qualified clinician has assessed or will assess this patient before
                  acting on these findings.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Download, label: "Export PDF", onClick: () => reviewConfirmed && setShowExportModal(true) },
            { icon: Share2, label: "Share", onClick: () => {} },
          ].map(({ icon: Icon, label, onClick }) => (
            <button key={label} onClick={onClick} disabled={!reviewConfirmed}
              className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: "#dde4ee", color: "#5a6a85", background: "#ffffff" }}>
              <Icon size={17} /> {label}
            </button>
          ))}
          <Link href={`/scan?protocol=${protocolId}`}
            className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all hover:bg-slate-50"
            style={{ borderColor: "#dde4ee", color: "#5a6a85", background: "#ffffff" }}>
            <RefreshCw size={17} /> New View
          </Link>
          <button className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all hover:bg-slate-50"
            style={{ borderColor: "#dde4ee", color: "#5a6a85", background: "#ffffff" }}>
            <Flag size={17} /> Report Error
          </button>
        </div>

        {/* Protocol checklist */}
        {protocol && (
          <Card className="mt-5">
            <h2 className="mb-3 font-semibold" style={{ color: "#1a2235" }}>Protocol Checklist</h2>
            <div className="space-y-2">
              {protocol.views.map((view, i) => (
                <div key={view} className="flex items-center gap-3 text-sm">
                  {i === 0
                    ? <CheckCircle size={15} className="shrink-0" style={{ color: "#2563eb" }} />
                    : <div className="h-4 w-4 shrink-0 rounded-full border-2" style={{ borderColor: "#dde4ee" }} />}
                  <span style={{ color: i === 0 ? "#1a2235" : "#94a3b8" }}>{view}</span>
                  {i === 0 && (
                    <span className="ml-auto rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{ background: "#dbeafe", color: "#2563eb" }}>
                      Complete
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "#94a3b8" }}>
              <span>1 of {protocol.views.length} views complete</span>
              <Link href={`/scan?protocol=${protocolId}`} className="font-medium" style={{ color: "#2563eb" }}>
                Continue exam →
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Export modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="w-full max-w-sm rounded-2xl border p-6 shadow-xl"
            style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
            <h3 className="mb-2 font-bold" style={{ color: "#1a2235" }}>Export Report</h3>
            <p className="mb-4 text-sm" style={{ color: "#5a6a85" }}>
              Your PDF will include the annotated image, all findings, measurements, and the full clinical disclaimer.
            </p>
            <div className="mb-4 flex items-start gap-2 rounded-xl border p-3 text-xs"
              style={{ borderColor: "#fcd34d", background: "#fefce8", color: "#92400e" }}>
              <ShieldAlert size={13} className="shrink-0 mt-0.5" />
              Disclaimer included on all pages. PHI will not be stored.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowExportModal(false)}
                className="flex-1 rounded-xl border py-2.5 text-sm font-medium"
                style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                Cancel
              </button>
              <button onClick={() => setShowExportModal(false)}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white"
                style={{ background: "#2563eb" }}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#eef3f8" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "#2563eb" }} />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
