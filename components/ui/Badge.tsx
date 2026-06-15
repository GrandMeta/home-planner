import { cn } from "@/lib/utils";
import type { ProjectStatus, RiskLevel, ProjectPurpose, FollowUpPriority, FollowUpStatus } from "@/types";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "muted" | "primary";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-green-50 text-green-700 border border-green-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-sky-50 text-sky-700 border border-sky-200",
  muted: "bg-slate-100 text-slate-500",
  primary: "bg-blue-50 text-blue-700 border border-blue-200",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function statusToVariant(status: ProjectStatus): BadgeVariant {
  switch (status) {
    case "Strong Shortlist":
    case "Shortlisted":
    case "Booked":
    case "Registered":
    case "Possession Received":
      return "success";
    case "Rejected":
    case "Closed":
      return "danger";
    case "Under Comparison":
    case "Negotiation":
    case "Booking Ready":
      return "primary";
    case "Watchlist":
    case "On Hold":
    case "Data Pending":
      return "warning";
    case "Legal Review Required":
    case "Financial Review Required":
    case "Family Review Required":
      return "warning";
    default:
      return "muted";
  }
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge variant={statusToVariant(status)}>{status}</Badge>;
}

// ─── Risk Badge ───────────────────────────────────────────────────────────────

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, BadgeVariant> = {
    Low: "success",
    Medium: "warning",
    High: "danger",
    Critical: "danger",
    Unknown: "muted",
  };
  return <Badge variant={map[risk]}>{risk} Risk</Badge>;
}

// ─── Purpose Badge ────────────────────────────────────────────────────────────

export function PurposeBadge({ purpose }: { purpose: ProjectPurpose }) {
  const map: Record<ProjectPurpose, BadgeVariant> = {
    Living: "info",
    Investment: "success",
    Both: "primary",
    Undecided: "muted",
  };
  return <Badge variant={map[purpose]}>{purpose}</Badge>;
}

// ─── Priority Badge ───────────────────────────────────────────────────────────

export function PriorityBadge({ priority }: { priority: FollowUpPriority }) {
  const map: Record<FollowUpPriority, BadgeVariant> = {
    High: "danger",
    Medium: "warning",
    Low: "muted",
  };
  return <Badge variant={map[priority]}>{priority}</Badge>;
}

// ─── Follow-up Status Badge ───────────────────────────────────────────────────

export function FollowUpStatusBadge({ status }: { status: FollowUpStatus }) {
  const map: Record<FollowUpStatus, BadgeVariant> = {
    Open: "danger",
    "In Progress": "warning",
    Resolved: "success",
    Cancelled: "muted",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

// ─── Data Missing Badge ───────────────────────────────────────────────────────

export function DataMissingBadge({ label = "Data Missing" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-600 border border-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
      {label}
    </span>
  );
}
