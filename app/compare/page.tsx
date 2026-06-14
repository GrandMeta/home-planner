import { GitCompare, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

function CompareColumnPlaceholder({ index }: { index: number }) {
  return (
    <div className="flex-1 min-w-48 bg-white rounded-xl border border-[var(--border)] p-4">
      <div className="flex items-center justify-center h-16 rounded-lg bg-[var(--surface-muted)] border border-dashed border-[var(--border-strong)]">
        <div className="flex flex-col items-center gap-1">
          <Plus className="w-4 h-4 text-[var(--text-disabled)]" />
          <span className="text-xs text-[var(--text-disabled)]">Add Unit {index}</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {["Builder", "Project", "Unit", "SBA", "Carpet Area", "Base Price", "True Landing Cost", "Cost / Carpet sq.ft", "Parking", "RERA", "Possession", "Living Score", "Investment Score"].map((row) => (
          <div key={row} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
            <span className="text-xs text-[var(--text-muted)]">{row}</span>
            <span className="text-xs text-[var(--text-disabled)]">—</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div>
      <PageHeader
        icon={GitCompare}
        title="Compare Units"
        description="Side-by-side comparison of shortlisted units. Compare true landing cost, carpet efficiency, parking, legal readiness, and living vs investment scores."
      />

      <div className="p-6 space-y-4">
        <p className="text-sm text-[var(--text-muted)]">
          Select units from your projects to compare them side by side. Up to 4 units can be compared at once.
        </p>

        {/* Compare grid */}
        <div className="overflow-x-auto">
          <div className="flex gap-3 min-w-[640px]">
            <CompareColumnPlaceholder index={1} />
            <CompareColumnPlaceholder index={2} />
            <CompareColumnPlaceholder index={3} />
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Comparison rows include: base price, floor rise, PLC, parking, GST, stamp duty, registration, corpus, maintenance advance, and all hidden charges — to surface the true landing cost.
        </p>
      </div>
    </div>
  );
}
