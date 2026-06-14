import { Building2, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProjectsPage() {
  return (
    <div>
      <PageHeader
        icon={Building2}
        title="Projects"
        description="All real estate projects under evaluation — from initial discovery to shortlisting. Add a project to start tracking builder details, units, cost sheets, RERA status, and site visit history."
      />

      <div className="p-6 space-y-4">
        {/* Actions row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 border border-[var(--border)] rounded-lg bg-white w-full sm:w-72">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-disabled)]">Search projects…</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-muted)] flex items-center justify-center mb-3">
            <Building2 className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No projects yet</p>
          <p className="text-sm text-[var(--text-muted)] max-w-xs">
            Add your first project to begin tracking builder details, units, cost breakups, and site visit status.
          </p>
          <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Plus className="w-4 h-4" />
            Add your first project
          </button>
        </div>

        {/* Placeholder list hint */}
        <p className="text-xs text-[var(--text-muted)]">
          Projects list, filters (by status, location, purpose), and project cards will appear here once data is added.
        </p>
      </div>
    </div>
  );
}
