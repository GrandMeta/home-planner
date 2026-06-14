import { TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

const COST_ROWS = [
  { label: "Base Price (SBA)", note: "Builder quoted price" },
  { label: "Floor Rise", note: "Per floor premium" },
  { label: "PLC (Preferential Location Charge)", note: "View, corner, garden, etc." },
  { label: "Car Parking", note: "Open / covered / stacked" },
  { label: "Clubhouse / Amenity Charge", note: "One-time" },
  { label: "BWSSB / BESCOM", note: "Utility connection charges" },
  { label: "Power Backup", note: "Generator / inverter provision" },
  { label: "EV Charger Provision", note: "" },
  { label: "GST (5%)", note: "On agreement value" },
  { label: "Stamp Duty", note: "State levy" },
  { label: "Registration", note: "State levy" },
  { label: "Legal / Franking", note: "" },
  { label: "Corpus Fund", note: "" },
  { label: "Maintenance Advance", note: "" },
  { label: "Interiors Budget", note: "User estimate" },
  { label: "Move-in / Shifting Cost", note: "User estimate" },
];

export default function FinancialsPage() {
  return (
    <div>
      <PageHeader
        icon={TrendingUp}
        title="Financial Analysis"
        description="True cost calculation for each unit. Goes beyond the builder's quoted price to show the real landing cost — including all taxes, levies, charges, and buyer-side costs."
      />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "True Landing Cost", value: "—" },
            { label: "Cost / Carpet sq.ft", value: "—" },
            { label: "Hidden Charges %", value: "—" },
            { label: "Carpet Efficiency", value: "—" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium mb-1">{kpi.label}</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{kpi.value}</p>
              <p className="text-xs text-[var(--text-disabled)] mt-0.5">Select a unit to calculate</p>
            </div>
          ))}
        </div>

        {/* Cost breakdown table */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--text-primary)]">True Cost Breakdown</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              All cost components tracked per unit — from base price to move-in cost
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--surface-muted)] text-xs text-[var(--text-muted)] uppercase tracking-wide">
                <th className="text-left px-5 py-2 font-medium">Component</th>
                <th className="text-left px-5 py-2 font-medium">Notes</th>
                <th className="text-right px-5 py-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {COST_ROWS.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "" : "bg-[var(--surface-muted)]"}>
                  <td className="px-5 py-2.5 text-[var(--text-primary)]">{row.label}</td>
                  <td className="px-5 py-2.5 text-[var(--text-muted)] text-xs">{row.note}</td>
                  <td className="px-5 py-2.5 text-right text-[var(--text-disabled)]">—</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[var(--border-strong)] bg-[var(--primary-light)]">
                <td className="px-5 py-3 font-semibold text-[var(--primary)]">True Landing Cost</td>
                <td className="px-5 py-3 text-xs text-[var(--text-muted)]">Sum of all above</td>
                <td className="px-5 py-3 text-right font-bold text-[var(--primary)]">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          All values use Indian number formatting (₹ Cr / ₹ L / ₹). Missing values are shown clearly — never as ₹0.
        </p>
      </div>
    </div>
  );
}
