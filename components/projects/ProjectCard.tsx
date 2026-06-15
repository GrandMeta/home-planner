"use client";

import Link from "next/link";
import { MapPin, BedDouble, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import type { Project } from "@/types";
import { StatusBadge, PurposeBadge } from "@/components/ui/Badge";
import { BuilderLogo } from "@/components/ui/BuilderLogo";
import { formatINR, formatMonthYear, formatPerSqft } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/components/providers/SupabaseProvider";
import { getPropertyConfig } from "@/lib/glossary";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const builders = useAppStore((s) => s.builders);
  const builder = builders.find((b) => b.builderId === project.builderId);
  const cfg = getPropertyConfig(project.projectType);
  const TypeIcon = cfg.icon;

  const heroImage = project.images.find((i) => i.isCover) ?? project.images[0];
  const hasMissingDocs = !project.brochureCollected || !project.reraCertificateCollected;

  const priceLabel =
    project.indicativePriceMin && project.indicativePriceMax
      ? `${formatINR(project.indicativePriceMin)} – ${formatINR(project.indicativePriceMax)}`
      : project.indicativePriceMin
      ? `From ${formatINR(project.indicativePriceMin)}`
      : project.priceRangeMinPerSqft
      ? `From ${formatPerSqft(project.priceRangeMinPerSqft)}`
      : "Price on Request";

  return (
    <Link
      href={`/projects/${project.projectId}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200",
        className
      )}
    >
      {/* Hero image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        {heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage.url}
            alt={heroImage.altText ?? project.projectName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <span className="text-slate-400 text-sm">No image</span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white shadow"
            style={{ backgroundColor: cfg.accent }}
          >
            <TypeIcon className="w-3 h-3" />
            {cfg.noun}
          </span>
          <StatusBadge status={project.projectStatus} />
          <PurposeBadge purpose={project.projectPurpose} />
        </div>

        {/* RERA badge */}
        {project.reraStatus === "Registered" && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600 text-white text-[10px] font-semibold shadow">
              <CheckCircle2 className="w-3 h-3" />
              RERA
            </span>
          </div>
        )}

        {/* Risk warning */}
        {(project.riskLevel === "High" || project.riskLevel === "Critical") && (
          <div className="absolute bottom-3 right-3">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-semibold">
              <AlertTriangle className="w-3 h-3" />
              {project.riskLevel} Risk
            </span>
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3">
          <p className="text-white font-bold text-base leading-tight">{priceLabel}</p>
          {project.priceRangeMinPerSqft && (
            <p className="text-white/80 text-xs">
              {formatPerSqft(project.priceRangeMinPerSqft)} – {formatPerSqft(project.priceRangeMaxPerSqft ?? project.priceRangeMinPerSqft)}
            </p>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Builder row */}
        <div className="flex items-center gap-2">
          <BuilderLogo builder={builder} builderName={project.builderName} size="sm" />
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 truncate">{project.builderName}</p>
            <h3 className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
              {project.projectDisplayName ?? project.projectName}
            </h3>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-1.5 text-slate-500">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
          <span className="text-xs leading-snug">
            {[project.locality, project.microMarket, project.cityZone]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>

        {/* BHK tags (apartments & villas only) */}
        {cfg.hasBHK && project.availableBHKs.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {project.availableBHKs.map((bhk) => (
              <span
                key={bhk}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 font-medium"
              >
                <BedDouble className="w-3 h-3" />
                {bhk}
              </span>
            ))}
          </div>
        )}

        {/* Stats row — adapts to the property type */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          {(cfg.type === "Plot"
            ? [
                { label: "Land", value: project.totalLandAreaAcres ? `${project.totalLandAreaAcres} ac` : "—" },
                { label: "Plots", value: project.totalUnits ?? "—" },
                { label: "Open", value: project.openSpacePercentage ? `${project.openSpacePercentage}%` : "—" },
              ]
            : cfg.type === "Villa"
            ? [
                { label: "Land", value: project.totalLandAreaAcres ? `${project.totalLandAreaAcres} ac` : "—" },
                { label: "Homes", value: project.totalUnits ?? "—" },
                { label: "Open", value: project.openSpacePercentage ? `${project.openSpacePercentage}%` : "—" },
              ]
            : [
                { label: "Towers", value: project.totalTowers ?? "—" },
                { label: "Units", value: project.totalUnits ?? "—" },
                { label: "Open", value: project.openSpacePercentage ? `${project.openSpacePercentage}%` : "—" },
              ]
          ).map((s, i) => (
            <div key={s.label} className={cn("text-center", i === 1 && "border-x border-slate-100")}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-xs font-semibold text-slate-700">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Possession row */}
        {project.estimatedPossessionDate && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Possession: <span className="font-medium text-slate-700">{formatMonthYear(project.estimatedPossessionDate)}</span></span>
          </div>
        )}

        {/* Missing data warning */}
        {hasMissingDocs && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] text-amber-700">
              {!project.brochureCollected && !project.reraCertificateCollected
                ? "Brochure & RERA cert missing"
                : !project.brochureCollected
                ? "Brochure not collected"
                : "RERA certificate missing"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
