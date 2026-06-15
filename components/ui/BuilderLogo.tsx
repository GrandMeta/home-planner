import { cn } from "@/lib/utils";
import type { Builder } from "@/types";

interface BuilderLogoProps {
  builder?: Builder | null;
  builderName?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  xs: { outer: "w-6 h-6", text: "text-[9px]" },
  sm: { outer: "w-8 h-8", text: "text-[11px]" },
  md: { outer: "w-10 h-10", text: "text-xs" },
  lg: { outer: "w-14 h-14", text: "text-sm" },
};

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const DEFAULT_COLORS = [
  "#1e40af", "#059669", "#7c3aed", "#b45309", "#dc2626",
  "#0284c7", "#15803d", "#9333ea", "#c2410c", "#0f766e",
];

function colorFromName(name: string): string {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff;
  return DEFAULT_COLORS[Math.abs(hash) % DEFAULT_COLORS.length];
}

export function BuilderLogo({ builder, builderName, size = "md", className }: BuilderLogoProps) {
  const s = SIZE_MAP[size];
  const name = builder?.builderName ?? builderName ?? "?";
  const initials = builder?.logoInitials ?? getInitials(name);
  const color = builder?.logoColor ?? colorFromName(name);
  const logoUrl = builder?.logoUrl;

  if (logoUrl) {
    return (
      <div className={cn("rounded-lg overflow-hidden border border-slate-200 shrink-0", s.outer, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={name} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center shrink-0 font-bold text-white",
        s.outer,
        s.text,
        className
      )}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
}
