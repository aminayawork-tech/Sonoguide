import { ShieldAlert } from "lucide-react";

export default function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs"
        style={{ borderColor: "#fcd34d", background: "#fefce8", color: "#92400e" }}>
        <ShieldAlert size={13} style={{ flexShrink: 0, color: "#ca8a04" }} />
        <span>
          <strong>Not FDA-cleared for primary diagnosis.</strong> For educational and supportive use
          only. Clinical decisions require trained clinician review.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-4"
      style={{ borderColor: "#fcd34d", background: "#fefce8" }}>
      <div className="flex items-start gap-3">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" style={{ color: "#ca8a04" }} />
        <div className="space-y-1">
          <p className="text-sm font-bold" style={{ color: "#92400e" }}>Important Medical Disclaimer</p>
          <p className="text-xs leading-relaxed" style={{ color: "#92400e", opacity: 0.85 }}>
            SonoGuide is an AI-powered educational and clinical decision support tool.{" "}
            <strong>It is not FDA-cleared for primary diagnosis</strong> and does not replace formal
            diagnostic imaging, radiologist interpretation, or clinical judgment by a qualified
            healthcare professional. All findings must be reviewed and validated by a licensed
            clinician before influencing any clinical decision.
          </p>
        </div>
      </div>
    </div>
  );
}
