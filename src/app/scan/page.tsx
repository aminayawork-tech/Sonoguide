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
import { PROTOCOLS, CATEGORY_COLORS, getProtocolById } from "@/lib/protocols";

function ScanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const protocolId = searchParams.get("protocol") ?? "";
  const protocol = getProtocolById(protocolId);

  const [selectedProtocolId, setSelectedProtocolId] = useState(protocolId);
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [selectedView, setSelectedView] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProtocol = getProtocolById(selectedProtocolId) ?? protocol;

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
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const runAnalysis = useCallback(async () => {
    if (!image || !selectedProtocolId) return;
    setIsAnalyzing(true);
    setAnalysisStep(0);

    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
      setAnalysisStep(i + 1);
    }

    await new Promise((r) => setTimeout(r, 400));
    router.push(`/results?protocol=${selectedProtocolId}`);
  }, [image, selectedProtocolId, router, ANALYSIS_STEPS.length]);

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16" style={{ background: "#0a0f1e" }}>
      <NavBar />

      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Back */}
        <Link
          href="/protocols"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Protocol Library
        </Link>

        <h1 className="mb-2 text-2xl font-bold text-white">New Scan</h1>
        <p className="mb-8 text-slate-400">
          Select a protocol and upload your ultrasound image for AI analysis.
        </p>

        {/* Step 1: Protocol Selection */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">1</span>
            <h2 className="font-semibold text-white">Select Protocol</h2>
          </div>

          {selectedProtocol ? (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedProtocol.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{selectedProtocol.name}</p>
                    <span className={`text-xs rounded-full border px-2 py-0.5 ${CATEGORY_COLORS[selectedProtocol.category]}`}>
                      {selectedProtocol.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProtocolId("")}
                  className="text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <p><span className="text-slate-300">Indication:</span> {selectedProtocol.indication}</p>
                <p><span className="text-slate-300">AI will measure:</span> {selectedProtocol.aiMeasurements.join(", ")}</p>
                <p><span className="text-slate-300">Detects:</span> {selectedProtocol.anomaliesDetected.join(", ")}</p>
              </div>

              {/* View selector */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-slate-300">Select view to capture:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProtocol.views.map((view, i) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(i)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        selectedView === i
                          ? "bg-cyan-500 text-white"
                          : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {PROTOCOLS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProtocolId(p.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition-all hover:border-cyan-500/30 hover:bg-cyan-500/5"
                >
                  <span className="text-lg">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 truncate">{p.indication}</p>
                  </div>
                  <span className={`shrink-0 text-xs rounded-full border px-2 py-0.5 ${CATEGORY_COLORS[p.category]}`}>
                    {p.category}
                  </span>
                  <ChevronRight size={14} className="shrink-0 text-slate-600" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Image Upload */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${selectedProtocolId ? "bg-cyan-500" : "bg-slate-600"}`}>
              2
            </span>
            <h2 className="font-semibold text-white">Upload Ultrasound Image</h2>
          </div>

          {!selectedProtocolId && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
              <AlertCircle size={12} />
              Select a protocol first to enable image upload
            </div>
          )}

          {image ? (
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Uploaded ultrasound"
                  className="w-full object-contain max-h-80"
                  style={{ background: "#000" }}
                />
                <button
                  onClick={() => setImage(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                >
                  <X size={14} />
                </button>

                {/* Capture tip overlay */}
                {selectedProtocol && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                    <p className="text-xs text-cyan-300 flex items-center gap-1.5">
                      <Info size={11} /> {selectedProtocol.tip}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setImage(null)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-all"
                >
                  <Edit3 size={14} /> Retake
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-all"
                >
                  <Upload size={14} /> Upload Different
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? "border-cyan-500 bg-cyan-500/10"
                  : selectedProtocolId
                  ? "border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/5"
                  : "border-white/10 opacity-50 cursor-not-allowed"
              }`}
              onClick={() => selectedProtocolId && fileInputRef.current?.click()}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                <ImageIcon size={24} className="text-slate-400" />
              </div>
              <p className="mb-1 text-sm font-medium text-white">
                Drop ultrasound image here
              </p>
              <p className="text-xs text-slate-500">
                or click to browse · JPG, PNG, DICOM export
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <Camera size={12} /> Camera
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <Upload size={12} /> Gallery
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        {/* Tip box */}
        {selectedProtocol && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-300">Protocol Tip</p>
              <p className="text-xs text-blue-200/80">{selectedProtocol.tip}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedProtocol.keyFindings.slice(0, 3).map((f) => (
                  <span key={f} className="rounded-full bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <DisclaimerBanner compact />

        {/* Analyze button */}
        <div className="mt-6">
          {isAnalyzing ? (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 text-center">
              <Loader2 size={32} className="mx-auto mb-3 animate-spin text-cyan-400" />
              <p className="font-semibold text-white">Analyzing your image...</p>
              <p className="mt-1 text-sm text-slate-400">{ANALYSIS_STEPS[analysisStep] ?? "Finalizing..."}</p>
              <div className="mt-4 flex justify-center gap-1">
                {ANALYSIS_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-8 rounded-full transition-all ${
                      i < analysisStep ? "bg-cyan-400" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={runAnalysis}
              disabled={!image || !selectedProtocolId}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all ${
                image && selectedProtocolId
                  ? "bg-cyan-500 text-white hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25"
                  : "cursor-not-allowed bg-white/10 text-slate-500"
              }`}
            >
              <Zap size={18} />
              {!selectedProtocolId
                ? "Select a protocol first"
                : !image
                ? "Upload an image to analyze"
                : "Run AI Analysis"}
            </button>
          )}
        </div>

        {/* Demo: allow analysis with no image for demo purposes */}
        {!image && selectedProtocolId && (
          <button
            onClick={runAnalysis}
            className="mt-3 w-full rounded-xl border border-white/10 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <CheckCircle size={14} className="inline mr-1.5" />
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
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#0a0f1e" }}>
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    }>
      <ScanContent />
    </Suspense>
  );
}
