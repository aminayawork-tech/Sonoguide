"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle,
  ChevronRight,
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
import { CATEGORY_PILL, PROTOCOLS, getProtocolById } from "@/lib/protocols";

function ScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const protocolId = searchParams.get("protocol") ?? "";

  const [selectedProtocolId, setSelectedProtocolId] = useState(protocolId);
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [selectedView, setSelectedView] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProtocol = getProtocolById(selectedProtocolId);

  const ANALYSIS_STEPS = [
    "Assessing image quality...",
    "Identifying anatomical structures...",
    "Running protocol-specific analysis...",
    "Calculating measurements...",
    "Generating findings summary...",
  ];

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const runAnalysis = useCallback(async () => {
    if (!selectedProtocolId) return;
    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Kick off the API call immediately
    let imageBase64: string | null = null;
    let mediaType: string | null = null;

    if (image) {
      // image is a data URL: "data:image/jpeg;base64,<data>"
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mediaType = match[1];
        imageBase64 = match[2];
      }
    }

    // Animate steps while waiting for the real API
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 800);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mediaType, protocolId: selectedProtocolId }),
      });

      clearInterval(stepInterval);
      setAnalysisStep(ANALYSIS_STEPS.length);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Analysis failed");
      }

      const analysis = await res.json();

      // Store result and original image in sessionStorage for results page
      sessionStorage.setItem("lastAnalysis", JSON.stringify(analysis));
      if (image) sessionStorage.setItem("lastImage", image);
      else sessionStorage.removeItem("lastImage");

      await new Promise((r) => setTimeout(r, 300));
      router.push(`/results?protocol=${selectedProtocolId}`);
    } catch (err) {
      clearInterval(stepInterval);
      console.error("Analysis error:", err);
      // Fallback: navigate to results with mock data
      sessionStorage.removeItem("lastAnalysis");
      sessionStorage.removeItem("lastImage");
      router.push(`/results?protocol=${selectedProtocolId}`);
    }
  }, [selectedProtocolId, router, image, ANALYSIS_STEPS.length]);

  const pill = selectedProtocol ? CATEGORY_PILL[selectedProtocol.category] ?? { bg: "#f1f5f9", text: "#64748b" } : null;

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16" style={{ background: "#eef3f8" }}>
      <NavBar />

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Back */}
        <Link href="/protocols"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: "#5a6a85" }}>
          <ArrowLeft size={14} /> Protocol Library
        </Link>

        <h1 className="mb-1.5 text-2xl font-extrabold" style={{ color: "#1a2235" }}>New Scan</h1>
        <p className="mb-8 text-sm" style={{ color: "#5a6a85" }}>
          Select a protocol and upload your ultrasound image for AI analysis.
        </p>

        {/* Step 1 */}
        <div className="mb-5 rounded-2xl border p-5 shadow-sm" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "#2563eb" }}>1</span>
            <h2 className="font-semibold" style={{ color: "#1a2235" }}>Select Protocol</h2>
          </div>

          {selectedProtocol && pill ? (
            <div className="rounded-xl border p-4" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedProtocol.icon}</span>
                  <div>
                    <p className="font-semibold" style={{ color: "#1a2235" }}>{selectedProtocol.name}</p>
                    <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: pill.bg, color: pill.text }}>
                      {selectedProtocol.category}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedProtocolId("")} style={{ color: "#94a3b8" }}>
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 space-y-1.5 text-xs" style={{ color: "#5a6a85" }}>
                <p><span style={{ color: "#1a2235" }} className="font-medium">Indication:</span> {selectedProtocol.indication}</p>
                <p><span style={{ color: "#1a2235" }} className="font-medium">AI measures:</span> {selectedProtocol.aiMeasurements.join(", ")}</p>
                <p><span style={{ color: "#1a2235" }} className="font-medium">Detects:</span> {selectedProtocol.anomaliesDetected.join(", ")}</p>
              </div>

              {/* View selector */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium" style={{ color: "#5a6a85" }}>Select view to capture:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProtocol.views.map((view, i) => (
                    <button key={view} onClick={() => setSelectedView(i)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                      style={
                        selectedView === i
                          ? { background: "#2563eb", color: "#ffffff" }
                          : { background: "#f1f5f9", color: "#64748b", border: "1px solid #dde4ee" }
                      }>
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-1.5">
              {PROTOCOLS.map((p) => {
                const ppill = CATEGORY_PILL[p.category] ?? { bg: "#f1f5f9", text: "#64748b" };
                return (
                  <button key={p.id} onClick={() => setSelectedProtocolId(p.id)}
                    className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all hover:border-blue-200"
                    style={{ borderColor: "#dde4ee", background: "#f8fafc" }}>
                    <span className="text-lg">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "#1a2235" }}>{p.name}</p>
                      <p className="text-xs truncate" style={{ color: "#94a3b8" }}>{p.indication}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ background: ppill.bg, color: ppill.text }}>
                      {p.category}
                    </span>
                    <ChevronRight size={13} style={{ color: "#cbd5e1", flexShrink: 0 }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 2 */}
        <div className="mb-5 rounded-2xl border p-5 shadow-sm" style={{ background: "#ffffff", borderColor: "#dde4ee" }}>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: selectedProtocolId ? "#2563eb" : "#cbd5e1" }}>2</span>
            <h2 className="font-semibold" style={{ color: "#1a2235" }}>Upload Ultrasound Image</h2>
          </div>

          {!selectedProtocolId && (
            <div className="mb-3 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs"
              style={{ borderColor: "#fcd34d", background: "#fef9c3", color: "#92400e" }}>
              <AlertCircle size={13} style={{ flexShrink: 0 }} />
              Select a protocol first to enable image upload
            </div>
          )}

          {image ? (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-xl border" style={{ borderColor: "#dde4ee", background: "#000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="Uploaded ultrasound" className="w-full object-contain max-h-72" />
                <button onClick={() => setImage(null)}
                  className="absolute right-2 top-2 rounded-full p-1.5 text-white"
                  style={{ background: "rgba(0,0,0,0.55)" }}>
                  <X size={13} />
                </button>
                {selectedProtocol && (
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                    <p className="text-xs text-white flex items-center gap-1.5">
                      <Info size={11} /> {selectedProtocol.tip}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setImage(null)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all hover:bg-slate-50"
                  style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                  <Edit3 size={13} /> Retake
                </button>
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all hover:bg-slate-50"
                  style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                  <Upload size={13} /> Different Image
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => selectedProtocolId && fileInputRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all"
              style={{
                borderColor: isDragging ? "#2563eb" : selectedProtocolId ? "#bfdbfe" : "#dde4ee",
                background: isDragging ? "#eff6ff" : selectedProtocolId ? "#f8fafc" : "#f8fafc",
                opacity: selectedProtocolId ? 1 : 0.55,
                cursor: selectedProtocolId ? "pointer" : "not-allowed",
              }}
            >
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: "#f1f5f9" }}>
                <ImageIcon size={22} style={{ color: "#94a3b8" }} />
              </div>
              <p className="mb-1 text-sm font-semibold" style={{ color: "#1a2235" }}>
                Drop ultrasound image here
              </p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                or click to browse · JPG, PNG, DICOM export
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
                  style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                  <Camera size={11} /> Camera
                </span>
                <span className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
                  style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
                  <Upload size={11} /> Gallery
                </span>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }} />
        </div>

        {/* Protocol tip */}
        {selectedProtocol && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border p-4"
            style={{ borderColor: "#bfdbfe", background: "#eff6ff" }}>
            <Info size={15} className="mt-0.5 shrink-0" style={{ color: "#2563eb" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#1e40af" }}>Protocol Tip</p>
              <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "#1e40af", opacity: 0.85 }}>
                {selectedProtocol.tip}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedProtocol.keyFindings.slice(0, 3).map((f) => (
                  <span key={f} className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ background: "#dbeafe", color: "#1d4ed8" }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <DisclaimerBanner compact />

        {/* Analyze button */}
        <div className="mt-5">
          {isAnalyzing ? (
            <div className="rounded-2xl border p-6 text-center"
              style={{ borderColor: "#bfdbfe", background: "#eff6ff" }}>
              <Loader2 size={30} className="mx-auto mb-3 animate-spin" style={{ color: "#2563eb" }} />
              <p className="font-semibold" style={{ color: "#1a2235" }}>Analyzing your image...</p>
              <p className="mt-1 text-sm" style={{ color: "#5a6a85" }}>
                {ANALYSIS_STEPS[analysisStep] ?? "Finalizing..."}
              </p>
              <div className="mt-4 flex justify-center gap-1">
                {ANALYSIS_STEPS.map((_, i) => (
                  <div key={i} className="h-1.5 w-8 rounded-full transition-all"
                    style={{ background: i < analysisStep ? "#2563eb" : "#dde4ee" }} />
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={runAnalysis}
              disabled={!image || !selectedProtocolId}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#2563eb" }}
            >
              <Zap size={17} />
              {!selectedProtocolId
                ? "Select a protocol first"
                : !image
                ? "Upload an image to analyze"
                : "Run AI Analysis"}
            </button>
          )}
        </div>

        {/* Demo shortcut */}
        {!image && selectedProtocolId && !isAnalyzing && (
          <button onClick={runAnalysis}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm transition-all hover:bg-white"
            style={{ borderColor: "#dde4ee", color: "#5a6a85" }}>
            <CheckCircle size={14} style={{ color: "#2563eb" }} />
            Demo: Run analysis with sample image
          </button>
        )}
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#eef3f8" }}>
        <Loader2 size={28} className="animate-spin" style={{ color: "#2563eb" }} />
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}
