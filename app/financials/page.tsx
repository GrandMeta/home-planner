"use client";

import { Wallet, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Explain } from "@/components/ui/Explain";

/**
 * Beginner-friendly "True Cost" explainer. Each cost line links to a plain
 * explanation so a first-timer understands exactly what they'd be paying for —
 * and why the advertised price is never the final number.
 */
const COST_GROUPS: {
  group: string;
  blurb: string;
  rows: { label: string; term?: string; note: string }[];
}[] = [
  {
    group: "What the builder charges",
    blurb: "The price you see in the ad, plus the extras they add on.",
    rows: [
      { label: "Base price", term: "base price", note: "The headline rate per sq.ft" },
      { label: "Floor-rise charge", term: "floor rise", note: "More for higher floors" },
      { label: "Preferred location charge", term: "plc", note: "Better view or corner spot" },
      { label: "Car parking", note: "Open, covered or stacked" },
      { label: "Clubhouse / amenities", note: "One-time joining charge" },
      { label: "Utility & power backup", note: "Water, electricity, generator" },
    ],
  },
  {
    group: "Government taxes & fees",
    blurb: "Unavoidable, and often forgotten when comparing homes.",
    rows: [
      { label: "GST", term: "gst", note: "Only on under-construction homes" },
      { label: "Stamp duty", term: "stamp duty", note: "To register it in your name" },
      { label: "Registration charges", term: "registration", note: "Recording the sale officially" },
    ],
  },
  {
    group: "Move-in & community costs",
    blurb: "The bits that hit your wallet right after you buy.",
    rows: [
      { label: "Corpus fund", term: "corpus fund", note: "One-time community reserve" },
      { label: "Maintenance advance", term: "maintenance advance", note: "First year or two of upkeep" },
      { label: "Interiors", note: "Furniture, fittings, wardrobes" },
      { label: "Moving in", note: "Shifting and setup" },
    ],
  },
];

export default function FinancialsPage() {
  return (
    <div>
      <PageHeader
        icon={Wallet}
        title="True Cost"
        description="The advertised price is never the final price. Here's everything that adds up — and what each bit means."
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Intro */}
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 flex gap-3">
          <Sparkles className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-cyan-900">
              Why the “true cost” matters
            </p>
            <p className="text-sm text-cyan-800 mt-0.5 leading-relaxed">
              Two homes advertised at the same price can cost very differently once taxes,
              parking and interiors are added. The all-in number is called the{" "}
              <Explain term="landing cost" />. Tap any{" "}
              <span className="underline decoration-dotted">underlined word</span> below to see
              what it means.
            </p>
          </div>
        </div>

        {/* Cost groups */}
        {COST_GROUPS.map((g) => (
          <div
            key={g.group}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900">{g.group}</p>
              <p className="text-xs text-slate-500 mt-0.5">{g.blurb}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {g.rows.map((row) => (
                <div key={row.label} className="flex items-center justify-between px-5 py-3 gap-4">
                  <div className="text-sm text-slate-800">
                    {row.term ? <Explain term={row.term}>{row.label}</Explain> : row.label}
                  </div>
                  <p className="text-xs text-slate-400 text-right">{row.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* All-in result */}
        <div className="rounded-2xl bg-[var(--primary)] text-white p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold opacity-90">Add them all up and you get…</p>
            <p className="text-lg font-bold">your true, all-in cost</p>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0"
          >
            See your properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          As you add cost details to each property, Nest fills in the real numbers for you and
          shows them in ₹ Lakh / Crore. Missing values are always shown clearly — never as ₹0.
        </p>
      </div>
    </div>
  );
}
