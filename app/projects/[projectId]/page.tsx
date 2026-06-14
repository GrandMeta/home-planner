import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

type Props = {
  params: Promise<{ projectId: string }>;
};

function PlaceholderTab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-[var(--primary)] text-[var(--primary)]"
          : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      }`}
    >
      {label}
    </button>
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = await params;

  return (
    <div>
      {/* Back link */}
      <div className="px-6 pt-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects
        </Link>
      </div>

      <PageHeader
        icon={Building2}
        title={`Project: ${projectId}`}
        description="Full project detail view — builder info, units, cost breakup, parking, legal/RERA status, site visits, scoring, and follow-ups."
        badge="Project Detail"
      />

      {/* Tabs */}
      <div className="px-6 border-b border-[var(--border)] bg-white flex gap-0 overflow-x-auto">
        <PlaceholderTab label="Overview" active />
        <PlaceholderTab label="Units" />
        <PlaceholderTab label="Cost Breakup" />
        <PlaceholderTab label="Parking" />
        <PlaceholderTab label="Legal / RERA" />
        <PlaceholderTab label="Site Visits" />
        <PlaceholderTab label="Follow-Ups" />
        <PlaceholderTab label="Scoring" />
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">Project Overview</p>
          <p className="text-sm text-[var(--text-muted)]">
            Builder info, location, possession timeline, RERA number, project status, and quick score summary will appear here.
          </p>
          <div className="mt-4 h-32 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center">
            <span className="text-xs text-[var(--text-disabled)]">Project detail — to be implemented</span>
          </div>
        </div>
      </div>
    </div>
  );
}
