import { CreditCard, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const MILESTONE_STAGES = [
  { label: "Booking Amount", note: "At time of booking" },
  { label: "Agreement Execution", note: "On signing agreement" },
  { label: "Excavation", note: "On completion of excavation" },
  { label: "Plinth", note: "On plinth completion" },
  { label: "Slab 1", note: "After first slab" },
  { label: "Slab 2", note: "" },
  { label: "Slab 3", note: "" },
  { label: "Brick Work", note: "On brick work completion" },
  { label: "Plastering", note: "" },
  { label: "Flooring", note: "" },
  { label: "Handover / Possession", note: "On possession" },
  { label: "Registration", note: "At registration" },
];

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader
        icon={CreditCard}
        title="Payment Milestones"
        description="Track construction-linked payment schedule for each unit. Know exactly when each instalment is due, how much is paid, and what is outstanding."
      />

      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Agreement Value", value: "—" },
            { label: "Amount Paid", value: "—" },
            { label: "Amount Pending", value: "—" },
            { label: "Next Due Date", value: "—" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium mb-1">{kpi.label}</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Payment Schedule</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Construction-linked milestones</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-medium hover:bg-[var(--primary-hover)] transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Add Milestone
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--surface-muted)] text-xs text-[var(--text-muted)] uppercase tracking-wide">
                <th className="text-left px-5 py-2 font-medium">Stage</th>
                <th className="text-left px-5 py-2 font-medium">Note</th>
                <th className="text-right px-5 py-2 font-medium">Amount</th>
                <th className="text-right px-5 py-2 font-medium">Due Date</th>
                <th className="text-right px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MILESTONE_STAGES.map((stage, i) => (
                <tr key={stage.label} className={i % 2 === 0 ? "" : "bg-[var(--surface-muted)]"}>
                  <td className="px-5 py-2.5 text-[var(--text-primary)]">{stage.label}</td>
                  <td className="px-5 py-2.5 text-xs text-[var(--text-muted)]">{stage.note}</td>
                  <td className="px-5 py-2.5 text-right text-[var(--text-disabled)]">—</td>
                  <td className="px-5 py-2.5 text-right text-[var(--text-disabled)]">—</td>
                  <td className="px-5 py-2.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--surface-muted)] text-[var(--text-disabled)]">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
