import { ClipboardList, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

type Props = {
  params: Promise<{ siteVisitId: string }>;
};

export default async function SiteVisitDetailPage({ params }: Props) {
  const { siteVisitId } = await params;

  return (
    <div>
      <div className="px-6 pt-4">
        <Link
          href="/site-visits"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Site Visits
        </Link>
      </div>

      <PageHeader
        icon={ClipboardList}
        title={`Site Visit: ${siteVisitId}`}
        description="Detailed site visit record — checklist results, observations, photos, builder commitments, and follow-up actions."
        badge="Site Visit Detail"
      />

      <div className="p-6 space-y-4">
        {[
          {
            title: "Visit Info",
            desc: "Date, time, project, unit visited, who attended, and visit type (first look, second visit, negotiation, booking).",
          },
          {
            title: "Checklist Results",
            desc: "Structured checklist covering construction quality, workmanship, amenities, surroundings, parking, lobby, lifts, and site safety.",
          },
          {
            title: "Observations",
            desc: "Free-form notes and observations captured during the visit.",
          },
          {
            title: "Follow-Up Items",
            desc: "Action items raised during this visit — builder commitments, data to collect, and confirmations needed.",
          },
        ].map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-[var(--border)] p-5">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{section.title}</p>
            <p className="text-sm text-[var(--text-muted)]">{section.desc}</p>
            <div className="mt-3 h-20 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center">
              <span className="text-xs text-[var(--text-disabled)]">To be implemented</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
