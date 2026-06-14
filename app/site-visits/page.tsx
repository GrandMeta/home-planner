import { ClipboardList, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

function StatusBadge({ label, color }: { label: string; color: "green" | "yellow" | "blue" }) {
  const styles = {
    green: "bg-[var(--positive-light)] text-[var(--positive)]",
    yellow: "bg-[var(--warning-light)] text-[var(--warning)]",
    blue: "bg-[var(--info-light)] text-[var(--info)]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[color]}`}>
      {label}
    </span>
  );
}

export default function SiteVisitsPage() {
  return (
    <div>
      <PageHeader
        icon={ClipboardList}
        title="Site Visits"
        description="Structured site visit records for each project. Capture observations, checklist items, photos, and follow-up actions during and after every visit."
      />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <StatusBadge label="All" color="blue" />
            <StatusBadge label="Scheduled" color="yellow" />
            <StatusBadge label="Completed" color="green" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Plus className="w-4 h-4" />
            Log Site Visit
          </button>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-muted)] flex items-center justify-center mb-3">
            <ClipboardList className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No site visits logged yet</p>
          <p className="text-sm text-[var(--text-muted)] max-w-xs">
            Log a site visit to capture structured observations using the built-in checklist — construction quality, amenities, surroundings, parking, and more.
          </p>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Each site visit links to a project, includes a structured checklist, and generates follow-up items for missing information or builder commitments.
        </p>
      </div>
    </div>
  );
}
