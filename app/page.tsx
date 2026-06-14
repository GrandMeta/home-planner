import { LayoutDashboard, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

function KpiCard({
  label,
  value,
  sub,
  intent = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  intent?: "default" | "warning" | "danger" | "positive";
}) {
  const intentStyles: Record<string, string> = {
    default: "text-[var(--text-primary)]",
    warning: "text-[var(--warning)]",
    danger: "text-[var(--danger)]",
    positive: "text-[var(--positive)]",
  };
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm">
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium mb-1">{label}</p>
      <p className={`text-2xl font-bold ${intentStyles[intent]}`}>{value}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

function PlaceholderSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{title}</h2>
      <p className="text-sm text-[var(--text-muted)]">{description}</p>
      <div className="mt-4 h-24 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center">
        <span className="text-xs text-[var(--text-disabled)]">Placeholder — to be implemented</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title="Master Dashboard"
        description="Overview of all active real estate evaluations — shortlisted units, true costs, risks, and next actions."
        badge="Home"
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <KpiCard label="Projects Tracked" value="—" sub="No data yet" />
          <KpiCard label="Units Under Review" value="—" sub="No data yet" />
          <KpiCard label="Open Follow-Ups" value="—" intent="warning" sub="No data yet" />
          <KpiCard label="Data Gaps" value="—" intent="danger" sub="No data yet" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PlaceholderSection
            title="Shortlisted Units"
            description="Units you have shortlisted for comparison, with true landing cost and scoring summary."
          />
          <PlaceholderSection
            title="Project Status Overview"
            description="All active projects with status, RERA readiness, site visit status, and risks."
          />
          <PlaceholderSection
            title="Cost Comparison"
            description="Side-by-side true landing cost and per carpet sq.ft cost for shortlisted units."
          />
          <PlaceholderSection
            title="Pending Follow-Ups"
            description="Open follow-up items with builders, sorted by urgency and due date."
          />
        </div>
        <div className="rounded-xl border border-[var(--primary-light)] bg-[var(--primary-light)] p-4 flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[var(--primary)]">Getting started</p>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Start by adding your first project via the <strong>Projects</strong> section in the sidebar.
              Once you add a project, the dashboard will populate with real data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
