import { FileText, Plus, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const DOC_CATEGORIES = [
  {
    category: "Legal & RERA",
    items: ["RERA Certificate", "Title Deed / Title Report", "Encumbrance Certificate", "Khata Certificate", "Building Plan Approval", "Commencement Certificate", "Occupancy Certificate"],
  },
  {
    category: "Builder Documents",
    items: ["Allotment Letter", "Builder-Buyer Agreement", "Cost Sheet", "Payment Schedule", "Floor Plan", "Specification Sheet"],
  },
  {
    category: "Bank / Loan",
    items: ["Loan Sanction Letter", "Disbursement Schedule", "Bank NOC"],
  },
  {
    category: "Personal",
    items: ["Identity Proof", "Address Proof", "Income Documents"],
  },
];

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader
        icon={FileText}
        title="Documents"
        description="Store and track all legal, RERA, builder, and personal documents per project. Know exactly which documents are received, pending, or require review."
      />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-[var(--text-muted)]">
            Track document collection status for each project. Missing legal documents are flagged as risks.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOC_CATEGORIES.map((cat) => (
            <div key={cat.category} className="bg-white rounded-xl border border-[var(--border)] p-5">
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">{cat.category}</p>
              <div className="space-y-1.5">
                {cat.items.map((doc) => (
                  <div key={doc} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--text-secondary)]">{doc}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--surface-muted)] text-[var(--text-disabled)]">
                      Not uploaded
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
