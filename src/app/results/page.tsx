"use client";

import { Suspense, useState } from "react";
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

const QUALITY_COLOR: Record<string, string> = {
  excellent: "text-emerald-400",
  good: "text-cyan-400",
  fair: "text-amber-400",
  poor: "text-red-400",
};

const ALERT_STYLES: Record<string, { border: string; bg: string; icon: React.ElementType; textColor: string }> = {
  critical: { border: "border-red-500/50", bg: "bg-red-500/10", icon: XCircle, textColor: "text-red-300" },
  high: { border: "border-orange-500/50", bg: "bg-orange-500/10", icon: AlertTriangle, textColor: "text-orange-300" },
  moderate: { border: "border-amber-500/50", bg: "bg-amber-500/10", icon: AlertTriangle, textColor: "text-amber-300" },
  low: { border: "border-blue-500/50", bg: "bg-blue-500/10", icon: Info, textColor: "text-blue-300" },
  none: { border: "border-emerald-500/50", bg: "bg-emerald-500/10", icon: CheckCircle, textColor: "text-emerald-300" },
};

const FINDING_COLORS: Record<string, string> = {
  critical: "border-red-500/30 bg-red-500/10 text-red-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  normal: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-300",
};

const MEASUREMENT_COLORS: Record<string, string> = {
  normal: "text-emerald-400",
  borderline: "text-amber-400",
  abnormal: "text-red-400",
};

function AnnotatedImagePlaceholder({
  labels,
  alertLevel,
}: {
  labels: AnalysisResult["labels"];
  alertLevel: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ background: "#0a1020", aspectRatio: "4/3" }}>
      {/* Simulated ultrasound image background */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          background: "radial-gradient(ellipse at 40% 50%, rgba(100,120,200,0.3) 0%, rgba(20,30,60,0.8) 60%, rgba(5,10,20,1) 100%)",
        }} />
        {/* Simulated scan lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px opacity-10"
            style={{ top: `${(i + 1) * 5}%`, background: "rgba(100,150,255,0.3)" }}
          />
        ))}
        {/* Simulated echo regions */}
        <div className="absolute" style={{ top: "25%", left: "25%", width: "50%", height: "40%", background: "radial-gradient(ellipse, rgba(180,200,255,0.15), transparent 70%)", borderRadius: "50%" }} />
        <div className="absolute" style={{ top: "50%", left: "55%", width: "30%", height: "30%", background: "radial-gradient(ellipse, rgba(150,180,255,0.12), transparent 70%)", borderRadius: "50%" }} />
        {alertLevel === "critical" && (
          <div className="absolute" style={{ top: "40%", left: "42%", width: "20%", height: "15%", background: "rgba(239,68,68,0.15)", borderRadius: "30%" }} />
        )}
      </div>

      {/* Structure labels */}
      {labels.map((label) => (
        <div
          key={label.id}
          className="absolute"
          style={{ left: `${label.x}%`, top: `${label.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div
            className="rounded-md px-2 py-1 text-xs font-semibold shadow-lg whitespace-nowrap"
            style={{
              background: "rgba(0,0,0,0.75)",
              border: `1px solid ${label.color}`,
              color: label.color,
            }}
          >
            {label.name}
          </div>
          <div
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: label.color }}
          />
        </div>
      ))}

      {/* Confidence overlay */}
      <div className="absolute bottom-3 right-3">
        <span className="rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white border border-white/20">
          AI Analysis Active
        </span>
      </div>

      {/* Depth scale */}
      <div className="absolute right-2 top-4 bottom-4 flex flex-col justify-between">
        {["2cm", "4cm", "6cm", "8cm", "10cm"].map((d) => (
          <span key={d} className="text-[9px] text-slate-600">{d}</span>
        ))}
      </div>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const protocolId = searchParams.get("protocol") ?? "efast";
  const analysis = getMockAnalysis(protocolId);
  const protocol = getProtocolById(protocolId);

  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const alertStyle = ALERT_STYLES[analysis.alertLevel] ?? ALERT_STYLES.none;
  const AlertIcon = alertStyle.icon;

  const timestamp = new Date(analysis.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16" style={{ background: "#0a0f1e" }}>
      <NavBar />

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/scan?protocol=${protocolId}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Back to Scan
          </Link>
          <span className="text-xs text-slate-500">{timestamp}</span>
        </div>

        <div className="mb-2 flex items-center gap-3">
          <span className="text-2xl">{protocol?.icon}</span>
          <div>
            <h1 className="text-xl font-bold text-white">{analysis.protocolName}</h1>
            <p className="text-sm text-slate-400">AI Analysis Results</p>
          </div>
        </div>

        {/* Alert banner */}
        {analysis.alertMessage && (
          <div className={`my-4 rounded-xl border p-4 ${alertStyle.border} ${alertStyle.bg}`}>
            <div className="flex items-start gap-3">
              <AlertIcon size={18} className={`mt-0.5 shrink-0 ${alertStyle.textColor}`} />
              <div>
                <p className={`text-sm font-bold ${alertStyle.textColor}`}>
                  {analysis.alertLevel === "critical" ? "CRITICAL FINDING" :
                   analysis.alertLevel === "high" ? "SIGNIFICANT FINDING" :
                   analysis.alertLevel === "moderate" ? "NOTABLE FINDING" : "NOTE"}
                </p>
                <p className={`text-sm mt-0.5 ${alertStyle.textColor} opacity-90`}>
                  {analysis.alertMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Annotated image */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
          <AnnotatedImagePlaceholder labels={analysis.labels} alertLevel={analysis.alertLevel} />
          <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-4 py-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${QUALITY_COLOR[analysis.imageQuality]}`}>
                Image Quality: {analysis.imageQuality.charAt(0).toUpperCase() + analysis.imageQuality.slice(1)}
              </span>
            </div>
            <ConfidenceBadge score={analysis.confidence} size="sm" />
          </div>
          {analysis.imageQualityNote && (
            <div className="border-t border-white/5 bg-blue-500/5 px-4 py-2">
              <p className="flex items-start gap-1.5 text-xs text-blue-300">
                <Info size={11} className="mt-0.5 shrink-0" />
                {analysis.imageQualityNote}
              </p>
            </div>
          )}
        </div>

        {/* Structure labels legend */}
        <div className="mb-6 flex flex-wrap gap-2">
          {analysis.labels.map((label) => (
            <span
              key={label.id}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: label.color }} />
              {label.name}
            </span>
          ))}
        </div>

        {/* Findings */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-4 font-semibold text-white">Findings</h2>
          <div className="space-y-2">
            {analysis.findings.map((finding, i) => (
              <div
                key={i}
                className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 ${FINDING_COLORS[finding.severity]}`}
              >
                <span className="text-xs font-semibold opacity-70">{finding.label}</span>
                <span className="text-right text-xs font-medium">{finding.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Measurements */}
        {analysis.measurements.length > 0 && (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-4 font-semibold text-white">Automated Measurements</h2>
            <div className="space-y-3">
              {analysis.measurements.map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">{m.name}</p>
                    {m.reference && (
                      <p className="text-xs text-slate-500">{m.reference}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${MEASUREMENT_COLORS[m.status]}`}>{m.value}</p>
                    <p className="text-xs text-slate-500 capitalize">{m.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-3 font-semibold text-white">AI Summary</h2>
          <p className="text-sm leading-relaxed text-slate-300">{analysis.summary}</p>
        </div>

        {/* Recommendations */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="mb-3 font-semibold text-white">Recommendations</h2>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-cyan-400" />
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* Next views */}
        {analysis.nextViews.length > 0 && (
          <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <h2 className="mb-3 font-semibold text-white">Suggested Next Views</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.nextViews.map((view) => (
                <Link
                  key={view}
                  href={`/scan?protocol=${protocolId}`}
                  className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-all"
                >
                  {view} <ArrowRight size={10} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-300">Important Medical Disclaimer</p>
              <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
                Sonoguide is an AI-powered educational and clinical decision support tool.{" "}
                <strong className="text-amber-300">Not FDA-cleared for primary diagnosis.</strong>{" "}
                All findings must be reviewed by a qualified clinician before influencing clinical decisions.
              </p>
              <label className="mt-3 flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={reviewConfirmed}
                  onChange={(e) => setReviewConfirmed(e.target.checked)}
                  className="mt-0.5 accent-amber-400"
                />
                <span className="text-xs text-amber-300">
                  I confirm I have reviewed these findings with clinical judgment and that a qualified
                  clinician has assessed or will assess this patient.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            onClick={() => reviewConfirmed && setShowExportModal(true)}
            disabled={!reviewConfirmed}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all ${
              reviewConfirmed
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                : "border-white/5 bg-white/2 text-slate-600 cursor-not-allowed"
            }`}
          >
            <Download size={18} />
            Export PDF
          </button>
          <button
            disabled={!reviewConfirmed}
            className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all ${
              reviewConfirmed
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                : "border-white/5 bg-white/2 text-slate-600 cursor-not-allowed"
            }`}
          >
            <Share2 size={18} />
            Share
          </button>
          <Link
            href={`/scan?protocol=${protocolId}`}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-medium text-slate-300 hover:bg-white/10 transition-all"
          >
            <RefreshCw size={18} />
            New View
          </Link>
          <button className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-medium text-slate-300 hover:bg-white/10 transition-all">
            <Flag size={18} />
            Report Error
          </button>
        </div>

        {/* Protocol checklist */}
        {protocol && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="mb-3 font-semibold text-white">Protocol Checklist</h2>
            <div className="space-y-2">
              {protocol.views.map((view, i) => (
                <div key={view} className="flex items-center gap-3 text-sm">
                  {i === 0 ? (
                    <CheckCircle size={16} className="shrink-0 text-emerald-400" />
                  ) : (
                    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-600" />
                  )}
                  <span className={i === 0 ? "text-slate-300" : "text-slate-500"}>{view}</span>
                  {i === 0 && (
                    <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                      Complete
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>1 of {protocol.views.length} views complete</span>
              <Link
                href={`/scan?protocol=${protocolId}`}
                className="text-cyan-400 hover:underline"
              >
                Continue exam →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Export modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1829] p-6">
            <h3 className="mb-2 font-semibold text-white">Export Report</h3>
            <p className="mb-4 text-sm text-slate-400">
              Your PDF report will include the annotated image, all findings, measurements, and the full clinical disclaimer.
            </p>
            <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
              <ShieldAlert size={12} className="inline mr-1.5" />
              Disclaimer will be included on all pages. PHI will not be stored.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-slate-400 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-sm font-semibold text-white hover:bg-cyan-400"
              >
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
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0a0f1e" }}>
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
