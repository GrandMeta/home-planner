"use client";

import Link from "next/link";
import {
  Building2, TrendingUp, Bell, AlertTriangle, CheckCircle2,
  ArrowRight, LayoutDashboard, MapPin, Calendar, BedDouble,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAppStore } from "@/store/useAppStore";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { StatusBadge, PurposeBadge } from "@/components/ui/Badge";
import { formatINR, formatMonthYear } from "@/lib/currency";

function KpiCard({
  label, value, sub, icon: Icon, href, variant = "default",
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; href?: string; variant?: "default" | "warning" | "danger" | "success";
}) {
  const colors = {
    default: "text-blue-600 bg-blue-50",
    warning: "text-amber-600 bg-amber-50",
    danger: "text-red-600 bg-red-50",
    success: "text-green-600 bg-green-50",
  };
  const valueColors = {
    default: "text-slate-900", warning: "text-amber-700",
    danger: "text-red-700", success: "text-green-700",
  };
  const card = (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[variant]}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {href && <ArrowRight className="w-4 h-4 text-slate-300" />}
      </div>
      <p className={`text-2xl font-bold ${valueColors[variant]}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

export default function DashboardPage() {
  const projects = useAppStore((s) => s.projects);
  const followUps = useAppStore((s) => s.followUps);

  const activeProjects = projects.filter(
    (p) => !["Rejected", "Closed", "On Hold"].includes(p.projectStatus)
  );
  const shortlisted = projects.filter(
    (p) => p.projectStatus === "Shortlisted" || p.projectStatus === "Strong Shortlist"
  );
  const openFollowUps = followUps.filter((f) => f.status === "Open");
  const missingRera = projects.filter(
    (p) => !["Registered"].includes(p.reraStatus ?? "") && !["Rejected", "Closed"].includes(p.projectStatus)
  );
  const highRisk = projects.filter(
    (p) => p.riskLevel === "High" || p.riskLevel === "Critical"
  );

  const soonest = [...projects]
    .filter((p) => p.estimatedPossessionDate)
    .sort((a, b) => new Date(a.estimatedPossessionDate!).getTime() - new Date(b.estimatedPossessionDate!).getTime())
    [0];

  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title="Master Dashboard"
        description="Overview of all active evaluations — shortlisted projects, costs, risks, and next actions."
        badge="Home"
      />

      <div className="p-6 space-y-8">
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <KpiCard label="Total Projects" value={projects.length} icon={Building2} href="/projects" />
          <KpiCard label="Active" value={activeProjects.length} icon={Building2} variant="success" />
          <KpiCard label="Shortlisted" value={shortlisted.length} icon={CheckCircle2} variant="success" href="/projects" />
          <KpiCard label="Open Follow-Ups" value={openFollowUps.length} icon={Bell} variant={openFollowUps.length > 0 ? "warning" : "default"} href="/follow-ups" />
          <KpiCard label="RERA Pending" value={missingRera.length} icon={AlertTriangle} variant={missingRera.length > 0 ? "danger" : "success"} />
          <KpiCard label="High Risk" value={highRisk.length} icon={AlertTriangle} variant={highRisk.length > 0 ? "danger" : "default"} />
        </div>

        {/* Shortlisted projects */}
        {shortlisted.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Shortlisted Projects</h2>
              <Link href="/projects" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shortlisted.slice(0, 3).map((p) => (
                <ProjectCard key={p.projectId} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All projects status */}
          <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-800">All Projects</h2>
              <Link href="/projects" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-slate-100">
              {projects.slice(0, 6).map((p) => {
                const hero = p.images.find((i) => i.isCover) ?? p.images[0];
                return (
                  <Link key={p.projectId} href={`/projects/${p.projectId}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      {hero
                        ? <img src={hero.url} alt={p.projectName} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-400" />
                          </div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {p.projectDisplayName ?? p.projectName}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <MapPin className="w-3 h-3" />
                        <span>{p.microMarket ?? p.cityZone}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <StatusBadge status={p.projectStatus} />
                      <PurposeBadge purpose={p.projectPurpose} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Upcoming possessions + risk */}
          <div className="space-y-5">
            {/* Upcoming possessions */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Possession Timeline</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {[...projects]
                  .filter((p) => p.estimatedPossessionDate && !["Rejected", "Closed"].includes(p.projectStatus))
                  .sort((a, b) => new Date(a.estimatedPossessionDate!).getTime() - new Date(b.estimatedPossessionDate!).getTime())
                  .slice(0, 4)
                  .map((p) => (
                    <Link key={p.projectId} href={`/projects/${p.projectId}`}
                      className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{p.projectShortName ?? p.projectName}</p>
                        <p className="text-xs text-slate-400">{p.microMarket ?? p.cityZone}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatMonthYear(p.estimatedPossessionDate!)}
                      </div>
                    </Link>
                  ))}
                {projects.filter((p) => p.estimatedPossessionDate).length === 0 && (
                  <p className="px-5 py-6 text-sm text-slate-400 text-center">No possession dates set</p>
                )}
              </div>
            </section>

            {/* Risk alerts */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-bold text-slate-800">Alerts</h2>
              </div>
              <div className="p-4 space-y-2">
                {missingRera.length > 0 && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-red-700">RERA Not Verified</p>
                      <p className="text-[11px] text-red-600">{missingRera.length} project(s) missing RERA registration</p>
                    </div>
                  </div>
                )}
                {projects.filter((p) => !p.brochureCollected && !["Rejected","Closed"].includes(p.projectStatus)).length > 0 && (
                  <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700">Brochures Missing</p>
                      <p className="text-[11px] text-amber-600">
                        {projects.filter((p) => !p.brochureCollected && !["Rejected","Closed"].includes(p.projectStatus)).length} project(s) without brochure
                      </p>
                    </div>
                  </div>
                )}
                {missingRera.length === 0 && projects.filter((p) => !p.brochureCollected).length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-xs text-green-700 font-medium">No critical alerts</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Getting started (shown only when no shortlisted projects) */}
        {shortlisted.length === 0 && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Shortlist a project to get started</p>
              <p className="text-sm text-blue-700 mt-0.5">
                Go to <Link href="/projects" className="underline font-medium">Projects</Link> and mark a project as{" "}
                <strong>Shortlisted</strong> to see it highlighted here on the dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
