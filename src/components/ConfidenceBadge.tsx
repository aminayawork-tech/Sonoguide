interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function ConfidenceBadge({ score, size = "md" }: Props) {
  const color =
    score >= 85
      ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
      : score >= 70
      ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
      : "text-red-400 border-red-500/40 bg-red-500/10";

  const dotColor =
    score >= 85 ? "bg-emerald-400" : score >= 70 ? "bg-amber-400" : "bg-red-400";

  const label = score >= 85 ? "High" : score >= 70 ? "Moderate" : "Low";

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs"
      : size === "lg"
      ? "px-4 py-2 text-base"
      : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${color} ${sizeClasses}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColor}`} />
      {score}% Confidence · {label}
    </span>
  );
}
