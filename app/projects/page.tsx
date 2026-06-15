"use client";

import { useState, useEffect } from "react";
import { Building2, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddPropertyWizard } from "@/components/projects/AddPropertyWizard";
import { useAppStore } from "@/store/useAppStore";
import type { ProjectType, ProjectPurpose, CityZone } from "@/types";
import { cn } from "@/lib/utils";

const TYPE_FILTERS: Array<{ label: string; value: ProjectType | "all" }> = [
  { label: "Everything", value: "all" },
  { label: "Apartments", value: "Apartment" },
  { label: "Villas", value: "Villa" },
  { label: "Plots", value: "Plot" },
];

const ZONE_FILTERS: Array<{ label: string; value: CityZone | "all" }> = [
  { label: "All areas", value: "all" },
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
  const [typeFilter, setTypeFilter] = useState<ProjectType | "all">("all");
  const [zoneFilter, setZoneFilter] = useState<CityZone | "all">("all");
  const [purposeFilter, setPurposeFilter] = useState<ProjectPurpose | "all">("all");

  // Open the wizard when arriving from the "Add a property" CTA (?add=1).
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("add=1")) {
      window.history.replaceState(null, "", "/projects");
      // Defer so we don't call setState synchronously inside the effect.
      const id = setTimeout(() => setAddOpen(true), 0);
      return () => clearTimeout(id);
    }
  }, []);

  const filtered = projects.filter((p) => {
    if (
      search &&
      !p.projectName.toLowerCase().includes(search.toLowerCase()) &&
      !p.builderName.toLowerCase().includes(search.toLowerCase()) &&
      !(p.microMarket ?? "").toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (typeFilter !== "all" && p.projectType !== typeFilter) return false;
    if (zoneFilter !== "all" && p.cityZone !== zoneFilter) return false;
    if (purposeFilter !== "all" && p.projectPurpose !== purposeFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        icon={Building2}
        title="My Properties"
        description="Every home, villa or plot you're keeping an eye on — in one place."
        badge={`${projects.length} saved`}
      />

      <div className="p-6 space-y-5">
        {/* Search + add */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, builder or area…"
              className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add a property
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                typeFilter === f.value
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-white text-slate-600 border-slate-300 hover:border-[var(--primary)]"
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
              {p === "all" ? "Any reason" : p === "Living" ? "To live in" : p === "Investment" ? "To invest" : "Both"}
            </button>
          ))}
        </div>

        {/* Grid / empty state */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-[var(--primary)]" />
            </div>
            <p className="font-semibold text-slate-800 mb-1">
              {projects.length === 0
                ? "Let's add your first property"
                : "Nothing matches those filters"}
            </p>
            <p className="text-sm text-slate-500 max-w-xs">
              {projects.length === 0
                ? "Spotted a home, villa or plot you like? Add it and Nest will help you figure out the rest."
                : "Try clearing a filter or searching differently."}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setAddOpen(true)}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add a property
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
              of {projects.length}
            </p>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard key={project.projectId} project={project} />
              ))}
            </div>
          </>
        )}
      </div>

      <AddPropertyWizard open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
