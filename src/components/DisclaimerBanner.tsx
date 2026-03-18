import { ShieldAlert } from "lucide-react";

export default function DisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
        <ShieldAlert size={14} className="shrink-0" />
        <span>
          <strong>Not FDA-cleared for primary diagnosis.</strong> For educational and supportive use
          only. Clinical decisions require trained clinician review.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <ShieldAlert size={20} className="mt-0.5 shrink-0 text-amber-400" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-amber-300">Important Medical Disclaimer</p>
          <p className="text-xs leading-relaxed text-amber-200/80">
            Sonoguide is an AI-powered educational and clinical decision support tool.{" "}
            <strong className="text-amber-300">
              It is not FDA-cleared for primary diagnosis
            </strong>{" "}
            and does not replace formal diagnostic imaging, radiologist interpretation, or clinical
            judgment by a qualified healthcare professional. All findings must be reviewed and
            validated by a licensed clinician before influencing any clinical decision.
          </p>
        </div>
      </div>
    </div>
  );
}
