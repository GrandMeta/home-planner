import { Bell, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const FOLLOW_UP_TYPES = [
  { label: "Data Collection", desc: "Missing cost breakup, parking details, carpet area, etc." },
  { label: "Builder Commitment", desc: "Items promised by builder but not yet confirmed in writing." },
  { label: "Legal / RERA", desc: "RERA verification, title check, encumbrance confirmation." },
  { label: "Site Visit", desc: "Follow-up items raised after a site visit." },
  { label: "Negotiation", desc: "Price negotiation, discount requests, floor rise waiver, etc." },
  { label: "Loan / Bank", desc: "Home loan pre-approval, disbursement schedule, NOC." },
];

export default function FollowUpsPage() {
  return (
    <div>
      <PageHeader
        icon={Bell}
        title="Follow-Ups"
        description="Track all pending actions, builder commitments, data collection tasks, and open questions. Never lose track of what you need to follow up on."
      />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {["All", "Open", "In Progress", "Resolved"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  f === "All"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Plus className="w-4 h-4" />
            Add Follow-Up
          </button>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-10 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-muted)] flex items-center justify-center mb-3">
            <Bell className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No follow-ups yet</p>
          <p className="text-sm text-[var(--text-muted)] max-w-xs">
            Add follow-up items to track builder commitments, data gaps, legal queries, and negotiation tasks.
          </p>
        </div>

        {/* Categories reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FOLLOW_UP_TYPES.map((type) => (
            <div key={type.label} className="bg-white rounded-xl border border-[var(--border)] p-4">
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{type.label}</p>
              <p className="text-xs text-[var(--text-muted)]">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
