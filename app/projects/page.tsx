"use client";

import { useState } from "react";
import { Building2, Plus, Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddProjectModal } from "@/components/projects/AddProjectModal";
import { useAppStore } from "@/store/useAppStore";
import type { ProjectStatus, ProjectPurpose, CityZone } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: Array<{ label: string; value: ProjectStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Shortlisted", value: "Shortlisted" },
  { label: "Strong Shortlist", value: "Strong Shortlist" },
  { label: "Under Comparison", value: "Under Comparison" },
  { label: "Site Visited", value: "Site Visited" },
  { label: "Watchlist", value: "Watchlist" },
  { label: "New Lead", value: "New Lead" },
  { label: "Rejected", value: "Rejected" },
];

const ZONE_FILTERS: Array<{ label: string; value: CityZone | "all" }> = [
  { label: "All Zones", value: "all" },
  { label: "East", value: "East Bangalore" },
  { label: "North", value: "North Bangalore" },
  { label: "South", value: "South Bangalore" },
  { label: "West", value: "West Bangalore" },
  { label: "Central", value: "Central Bangalore" },
];

export default function ProjectsPage() {
  const projects = useAppStore((s) => s.projects);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [zoneFilter, setZoneFilter] = useState<CityZone | "all">("all");
  const [purposeFilter, setPurposeFilter] = useState<ProjectPurpose | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = projects.filter((p) => {
    if (search && !p.projectName.toLowerCase().includes(search.toLowerCase()) &&
        !p.builderName.toLowerCase().includes(search.toLowerCase()) &&
        !(p.microMarket ?? "").toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.projectStatus !== statusFilter) return false;
    if (zoneFilter !== "all" && p.cityZone !== zoneFilter) return false;
    if (purposeFilter !== "all" && p.projectPurpose !== purposeFilter) return false;
    return true;
  });

  const shortlistedCount = projects.filter(
    (p) => p.projectStatus === "Shortlisted" || p.projectStatus === "Strong Shortlist"
  ).length;

  return (
    <div>
      <PageHeader
        icon={Building2}
        title="Projects"
        description="All real estate projects under evaluation. Track builder details, units, costs, RERA status and site visits."
        badge={`${projects.length} projects`}
      />

      <div className="p-6 space-y-5">
        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Projects", value: projects.length },
            { label: "Shortlisted", value: shortlistedCount },
            { label: "East Bangalore", value: projects.filter((p) => p.cityZone === "East Bangalore").length },
            { label: "RERA Registered", value: projects.filter((p) => p.reraStatus === "Registered").length },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + actions */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project, builder, or area…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 border border-slate-300 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-2.5 transition-colors", viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-2.5 transition-colors", viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                statusFilter === f.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="w-px h-6 bg-slate-200 self-center mx-1" />
          {ZONE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setZoneFilter(f.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                zoneFilter === f.value
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-600 border-slate-300 hover:border-slate-500"
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="w-px h-6 bg-slate-200 self-center mx-1" />
          {(["all", "Living", "Investment", "Both"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPurposeFilter(p as ProjectPurpose | "all")}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                purposeFilter === p
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-600 border-slate-300 hover:border-emerald-400"
              )}
            >
              {p === "all" ? "All Purposes" : p}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {projects.length} projects
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700 mb-1">No projects match your filters</p>
            <p className="text-sm text-slate-400 max-w-xs">
              {projects.length === 0
                ? "Add your first project to get started."
                : "Try clearing some filters or search differently."}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setAddOpen(true)}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add your first project
              </button>
            )}
          </div>
        ) : (
          <div className={cn(
            "grid gap-5",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}>
            {filtered.map((project) => (
              <ProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        )}
      </div>

      <AddProjectModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
