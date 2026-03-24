"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit3,
  ImageIcon,
  Info,
  Loader2,
  Upload,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import DisclaimerBanner from "@/components/DisclaimerBanner";
import AuthModal from "@/components/AuthModal";
import UpgradeModal from "@/components/UpgradeModal";
import { useAuth } from "@/components/AuthProvider";
import { PROTOCOLS, getProtocolById } from "@/lib/protocols";
import { FREE_SCAN_LIMIT } from "@/lib/stripe";

// Default protocol when user doesn't pick one
const DEFAULT_PROTOCOL_ID = "efast";

const ANALYSIS_STEPS = [
  "Assessing image quality...",
  "Identifying anatomical structures...",
  "Running AI analysis...",
  "Calculating measurements...",
  "Generating findings summary...",
];

function ScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile, scansLeft, refreshProfile } = useAuth();

  // Pre-select if coming from a protocol deep-link, otherwise empty
  const urlProtocolId = searchParams.get("protocol") ?? "";

  const [selectedProtocolId, setSelectedProtocolId] = useState(urlProtocolId);
  const [protocolOpen, setProtocolOpen] = useState(!!urlProtocolId);
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAuthModal,    setShowAuthModal]    = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason,    setUpgradeReason]    = useState<"limit" | "generic">("generic");

  const fileInputRef   = useRef<HTMLInputElement>(null);   // gallery – no capture
  const cameraInputRef = useRef<HTMLInputElement>(null); // camera – with capture

  const effectiveProtocolId = selectedProtocolId || DEFAULT_PROTOCOL_ID;
  const selectedProtocol = getProtocolById(effectiveProtocolId);

  // Show upgrade success toast when returning from Stripe
  useEffect(() => {
    if (searchParams.get("upgrade") === "success") {
      refreshProfile();
    }
  }, [searchParams, refreshProfile]);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        // Redact patient header (top 13%)
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, img.width, Math.round(img.height * 0.13));
        setImage(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function compressImage(
    dataUrl: string,
    maxPx = 1024,
    quality = 0.82,
  ): Promise<{ dataUrl: string; base64: string; mediaType: string }> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve({
          dataUrl: compressed,
          base64: compressed.split(",")[1],
          mediaType: "image/jpeg",
        });
      };
      img.src = dataUrl;
    });
  }

  const runAnalysis = useCallback(async () => {
    // Gate: must be signed in
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);

    let imageBase64: string | null = null;
    let mediaType: string | null = null;
    let compressedDataUrl: string | null = null;

    if (image) {
      try {
        const compressed = await compressImage(image);
        imageBase64 = compressed.base64;
        mediaType = compressed.mediaType;
        compressedDataUrl = compressed.dataUrl;
      } catch {
        const match = image.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mediaType = match[1];
          imageBase64 = match[2];
          compressedDataUrl = image;
        }
      }
    }

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mediaType,
          protocolId: effectiveProtocolId,
        }),
      });

      clearInterval(stepInterval);
      setAnalysisStep(ANALYSIS_STEPS.length);

      if (res.status === 401) {
        setIsAnalyzing(false);
        setShowAuthModal(true);
        return;
      }

      if (res.status === 429) {
        setIsAnalyzing(false);
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        const msg = data.error ?? "Analysis failed";
        if (
          msg.toLowerCase().includes("auth") ||
          msg.toLowerCase().includes("api") ||
          msg.toLowerCase().includes("key")
        ) {
          throw new Error(
            "API key error: Make sure ANTHROPIC_API_KEY is set in your environment variables.",
          );
        }
        throw new Error(msg);
      }

      const analysis = await res.json();
      sessionStorage.setItem("lastAnalysis", JSON.stringify(analysis));
      if (compressedDataUrl) sessionStorage.setItem("lastImage", compressedDataUrl);
      else sessionStorage.removeItem("lastImage");

      // Refresh profile to update scan counter in UI
      refreshProfile();

      await new Promise((r) => setTimeout(r, 300));
      router.push(`/results?protocol=${effectiveProtocolId}`);
    } catch (err) {
      clearInterval(stepInterval);
      const msg =
        err instanceof Error ? err.message : "Analysis failed. Please try again.";
      setIsAnalyzing(false);
      setAnalysisError(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveProtocolId, router, image, user]);

  const isFreeAtLimit = profile?.tier === "free" && profile.scans_used_this_month >= FREE_SCAN_LIMIT;

  return (
    <div className="min-h-screen pb-28 md:pb-10 md:pt-16" style={{ background: "#f8fafc" }}>
      <NavBar onSignIn={() => setShowAuthModal(true)} />

      <div className="mx-auto max-w-lg px-4 py-8">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold" style={{ color: "#0f172a" }}>
            New Scan
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
            Upload your ultrasound image — AI analyzes it instantly
          </p>
        </div>

        {/* Scan counter badge */}
        {user && profile && (
          <div className="mb-4 flex justify-center">
            {profile.tier === "free" ? (
              <button
                onClick={() => { setUpgradeReason("generic"); setShowUpgradeModal(true); }}
                className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all hover:bg-slate-50"
                style={{
                  borderColor: scansLeft <= 1 ? "#fca5a5" : "#dde4ee",
                  background:  scansLeft <= 1 ? "#fef2f2" : "#ffffff",
                  color:       scansLeft <= 1 ? "#dc2626" : "#5a6a85",
                }}>
                <span className="font-bold" style={{ color: scansLeft <= 1 ? "#dc2626" : "#2563eb" }}>
                  {scansLeft}/{FREE_SCAN_LIMIT}
                </span>
                free scans left this month
                {scansLeft <= 1 && " · Upgrade"}
              </button>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium"
                style={{ borderColor: "#bfdbfe", background: "#eff6ff", color: "#1d4ed8" }}>
                <Zap size={11} />
                {profile.tier === "clinic" ? "Clinic" : "Pro"} — unlimited scans
              </span>
            )}
          </div>
        )}

        {/* Limit-reached banner */}
        {isFreeAtLimit && (
          <div className="mb-5 rounded-2xl border p-4"
            style={{ borderColor: "#fca5a5", background: "#fef2f2" }}>
            <p className="text-sm font-bold" style={{ color: "#dc2626" }}>Monthly limit reached</p>
            <p className="mt-1 text-xs" style={{ color: "#dc2626", opacity: 0.85 }}>
              You&apos;ve used your {FREE_SCAN_LIMIT} free scans this month.{" "}
              <button
                onClick={() => { setUpgradeReason("limit"); setShowUpgradeModal(true); }}
                className="font-bold underline">
                Upgrade to Pro
              </button>{" "}
              for unlimited scans.
            </p>
          </div>
        )}

        {/* ── Upload Zone ── */}
        <div className="mb-5 overflow-hidden rounded-2xl border shadow-sm"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>

          {image ? (
            /* Image preview */
            <div>
              <div className="relative" style={{ background: "#000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Uploaded ultrasound"
                  className="w-full object-contain"
                  style={{ maxHeight: 320 }}
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-white transition-opacity hover:opacity-90"
                  style={{ background: "rgba(0,0,0,0.6)" }}>
                  <X size={14} />
                </button>
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ background: "rgba(5,150,105,0.9)" }}>
                  <CheckCircle size={11} /> PHI redacted
                </div>
                {selectedProtocol && (
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}>
                    <p className="flex items-center gap-1.5 text-xs text-white">
                      <Info size={11} /> {selectedProtocol.tip}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 p-3">
                <button
                  onClick={() => setImage(null)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all hover:bg-slate-50"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                  <Edit3 size={13} /> Retake
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all hover:bg-slate-50"
                  style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                  <Upload size={13} /> Different image
                </button>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer p-10 text-center transition-all select-none"
              style={{
                background: isDragging ? "#eff6ff" : "#ffffff",
                border: isDragging ? "2px dashed #2563eb" : "2px dashed #cbd5e1",
                borderRadius: "1rem",
              }}>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: isDragging ? "#dbeafe" : "#f1f5f9" }}>
                <ImageIcon size={28} style={{ color: isDragging ? "#2563eb" : "#94a3b8" }} />
              </div>
              <p className="mb-1 text-base font-semibold" style={{ color: "#0f172a" }}>
                Tap to photograph your ultrasound
              </p>
              <p className="mb-5 text-sm" style={{ color: "#94a3b8" }}>
                or drag & drop an image here
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
                  className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-slate-100"
                  style={{ borderColor: "#e2e8f0", color: "#64748b", background: "#f8fafc" }}>
                  <Camera size={13} /> Camera
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:bg-slate-100"
                  style={{ borderColor: "#e2e8f0", color: "#64748b", background: "#f8fafc" }}>
                  <Upload size={13} /> Gallery
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gallery input – no capture so mobile shows photo library */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { handleFile(f); e.target.value = ""; }
          }}
        />
        {/* Camera input – capture opens camera directly on mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { handleFile(f); e.target.value = ""; }
          }}
        />

        {/* ── Protocol selector (optional, collapsed by default) ── */}
        <div className="mb-5 overflow-hidden rounded-2xl border shadow-sm"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <button
            onClick={() => setProtocolOpen((o) => !o)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-slate-50">
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>
                {selectedProtocolId
                  ? getProtocolById(selectedProtocolId)?.name
                  : "Protocol (optional)"}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: "#94a3b8" }}>
                {selectedProtocolId
                  ? getProtocolById(selectedProtocolId)?.indication
                  : "AI auto-detects — or choose for precision"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {selectedProtocolId && (
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedProtocolId(""); }}
                  className="rounded-full p-1" style={{ color: "#94a3b8" }}>
                  <X size={13} />
                </button>
              )}
              {protocolOpen
                ? <ChevronUp size={16} style={{ color: "#94a3b8" }} />
                : <ChevronDown size={16} style={{ color: "#94a3b8" }} />}
            </div>
          </button>

          {protocolOpen && (
            <div className="max-h-64 overflow-y-auto border-t" style={{ borderColor: "#f1f5f9" }}>
              {[...PROTOCOLS]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProtocolId(p.id); setProtocolOpen(false); }}
                    className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-slate-50"
                    style={
                      selectedProtocolId === p.id
                        ? { background: "#eff6ff" }
                        : undefined
                    }>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "#0f172a" }}>
                        {p.name}
                      </p>
                      <p className="text-xs truncate" style={{ color: "#94a3b8" }}>
                        {p.indication}
                      </p>
                    </div>
                    {selectedProtocolId === p.id && (
                      <CheckCircle size={14} style={{ color: "#2563eb", flexShrink: 0 }} />
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>

        <DisclaimerBanner compact />

        {/* ── Analyze / Loading ── */}
        <div className="mt-5">
          {isAnalyzing ? (
            <div className="overflow-hidden rounded-2xl border"
              style={{ borderColor: "#bfdbfe", background: "#eff6ff" }}>
              {image && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt="Analyzing..."
                    className="w-full object-contain"
                    style={{ maxHeight: 280, background: "#000" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "rgba(10,16,32,0.55)" }}>
                    <div className="rounded-2xl px-6 py-4 text-center"
                      style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(37,99,235,0.4)" }}>
                      <Loader2 size={24} className="mx-auto mb-2 animate-spin" style={{ color: "#60a5fa" }} />
                      <p className="text-sm font-semibold text-white">
                        {ANALYSIS_STEPS[analysisStep] ?? "Finalizing..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="px-6 py-5">
                {!image && (
                  <>
                    <Loader2 size={28} className="mx-auto mb-2 animate-spin" style={{ color: "#2563eb" }} />
                    <p className="text-center font-semibold" style={{ color: "#0f172a" }}>
                      {ANALYSIS_STEPS[analysisStep] ?? "Analyzing..."}
                    </p>
                  </>
                )}
                <div className="mt-3 flex justify-center gap-1.5">
                  {ANALYSIS_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: i <= analysisStep ? "2rem" : "0.5rem",
                        background: i <= analysisStep ? "#2563eb" : "#dde4ee",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {analysisError && (
                <div className="mb-4 rounded-2xl border p-4 text-sm"
                  style={{ borderColor: "#fca5a5", background: "#fef2f2", color: "#dc2626" }}>
                  <div className="flex items-start gap-2">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Analysis failed</p>
                      <p className="mt-0.5 leading-relaxed opacity-90">{analysisError}</p>
                      {analysisError.includes("API key") && (
                        <p className="mt-2 text-xs font-medium" style={{ color: "#991b1b" }}>
                          → Add <code className="rounded px-1" style={{ background: "#fee2e2" }}>ANTHROPIC_API_KEY</code> to your environment variables.
                        </p>
                      )}
                    </div>
                    <button onClick={() => setAnalysisError(null)} style={{ color: "#dc2626", flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {!user ? (
                /* Not signed in — show sign-in CTA */
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-lg font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
                    style={{ background: "#2563eb" }}>
                    <Zap size={19} />
                    Sign in to Start Scanning
                  </button>
                  <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
                    Free account · 5 scans/month · No credit card
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => { setAnalysisError(null); runAnalysis(); }}
                    disabled={!image || isFreeAtLimit}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-lg font-bold text-white shadow-md transition-all hover:opacity-90 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: "#2563eb" }}>
                    <Zap size={19} />
                    {isFreeAtLimit
                      ? "Upgrade to Continue"
                      : image ? "Analyze Now" : "Upload an image to start"}
                  </button>

                  {isFreeAtLimit && (
                    <button
                      onClick={() => { setUpgradeReason("limit"); setShowUpgradeModal(true); }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold transition-all hover:bg-white"
                      style={{ borderColor: "#2563eb", color: "#2563eb" }}>
                      View upgrade plans →
                    </button>
                  )}

                  {/* Demo shortcut — no image required */}
                  {!image && !isAnalyzing && !isFreeAtLimit && (
                    <button
                      onClick={() => { setAnalysisError(null); runAnalysis(); }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium transition-all hover:bg-white"
                      style={{ borderColor: "#e2e8f0", color: "#64748b" }}>
                      <CheckCircle size={14} style={{ color: "#2563eb" }} />
                      Try a demo analysis without uploading
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          reason={
            !user
              ? "Sign in to start scanning — free account, 5 scans per month."
              : undefined
          }
        />
      )}

      {/* Upgrade modal */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          limitReached={upgradeReason === "limit"}
        />
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ background: "#f8fafc" }}>
          <Loader2 size={28} className="animate-spin" style={{ color: "#2563eb" }} />
        </div>
      }>
      <ScanContent />
    </Suspense>
  );
}
