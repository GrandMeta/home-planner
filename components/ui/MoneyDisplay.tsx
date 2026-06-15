import { formatINR } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface MoneyDisplayProps {
  value: number | null | undefined;
  treatment?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showMissing?: boolean;
}

const SIZE_CLASSES = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base font-semibold",
  xl: "text-xl font-bold",
};

export function MoneyDisplay({
  value,
  treatment,
  className,
  size = "md",
  showMissing = true,
}: MoneyDisplayProps) {
  if (treatment === "Not Applicable") {
    return (
      <span className={cn("text-slate-400 italic", SIZE_CLASSES[size], className)}>
        N/A
      </span>
    );
  }

  if (treatment === "Included" || treatment === "Bundled") {
    return (
      <span className={cn("text-sky-600", SIZE_CLASSES[size], className)}>
        Included
      </span>
    );
  }

  if (value === null || value === undefined || isNaN(value)) {
    if (!showMissing) return null;
    return (
      <span className={cn("text-red-500 font-medium", SIZE_CLASSES[size], className)}>
        —
      </span>
    );
  }

  return (
    <span className={cn("font-medium tabular-nums", SIZE_CLASSES[size], className)}>
      {formatINR(value)}
    </span>
  );
}
