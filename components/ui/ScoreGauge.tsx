import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number | null | undefined;
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function scoreColor(score: number) {
  if (score >= 85) return { ring: "text-green-600", bg: "bg-green-50", label: "Excellent" };
  if (score >= 70) return { ring: "text-blue-600", bg: "bg-blue-50", label: "Good" };
  if (score >= 55) return { ring: "text-amber-600", bg: "bg-amber-50", label: "Average" };
  if (score >= 40) return { ring: "text-orange-600", bg: "bg-orange-50", label: "Weak" };
  return { ring: "text-red-600", bg: "bg-red-50", label: "Poor" };
}

const SIZE_MAP = {
  sm: { outer: "w-10 h-10", text: "text-[11px] font-bold", sub: "text-[9px]" },
  md: { outer: "w-14 h-14", text: "text-sm font-bold", sub: "text-[10px]" },
  lg: { outer: "w-20 h-20", text: "text-xl font-bold", sub: "text-xs" },
};

export function ScoreGauge({ score, label, size = "md", showLabel = true }: ScoreGaugeProps) {
  const s = SIZE_MAP[size];

  if (score === null || score === undefined) {
    return (
      <div className={cn("flex flex-col items-center gap-1")}>
        <div
          className={cn(
            s.outer,
            "rounded-full flex items-center justify-center bg-slate-100 border-2 border-slate-200"
          )}
        >
          <span className="text-slate-400 text-xs">—</span>
        </div>
        {showLabel && label && (
          <span className="text-[10px] text-slate-400 text-center leading-tight">{label}</span>
        )}
      </div>
    );
  }

  const { ring, bg, label: interpretation } = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          s.outer,
          "rounded-full flex flex-col items-center justify-center border-2",
          bg,
          ring.replace("text-", "border-")
        )}
      >
        <span className={cn(s.text, ring)}>{score}</span>
        <span className={cn(s.sub, "text-slate-400 leading-tight")}>/100</span>
      </div>
      {showLabel && (
        <div className="flex flex-col items-center">
          {label && (
            <span className="text-[10px] text-slate-500 text-center leading-tight">{label}</span>
          )}
          <span className={cn("text-[10px] font-medium", ring)}>{interpretation}</span>
        </div>
      )}
    </div>
  );
}

// ─── Score Bar (horizontal) ───────────────────────────────────────────────────

export function ScoreBar({
  score,
  label,
  showValue = true,
}: {
  score: number | null;
  label: string;
  showValue?: boolean;
}) {
  const { ring, bg } = score != null ? scoreColor(score) : { ring: "text-slate-400", bg: "bg-slate-100" };
  const barColor = ring.replace("text-", "bg-");
  const pct = score ?? 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <span className={cn("text-xs font-semibold w-8 text-right", ring)}>
          {score ?? "—"}
        </span>
      )}
    </div>
  );
}
