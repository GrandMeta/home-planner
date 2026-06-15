"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft, MapPin, CheckCircle2, AlertTriangle, Calendar,
  BedDouble, FileText, Phone, Globe, Play, Star, ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/components/providers/SupabaseProvider";
import { ImageGallery, FloorPlanGallery } from "@/components/projects/ImageGallery";
import { BuilderLogo } from "@/components/ui/BuilderLogo";
import { StatusBadge, PurposeBadge, RiskBadge } from "@/components/ui/Badge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { formatINR, formatPerSqft, formatMonthYear } from "@/lib/currency";
import { cn } from "@/lib/utils";

const TABS = [
  "Overview", "Gallery", "Floor Plans", "Amenities",
  "Units", "Legal / RERA", "Documents", "Follow-Ups",
] as const;
type Tab = (typeof TABS)[number];

function SectionCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200 overflow-hidden", className)}>
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <span className={cn("text-xs font-medium text-right", highlight ? "text-blue-600" : "text-slate-800")}>
        {value ?? "—"}
      </span>
    </div>
  );
}

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const projects = useAppStore((s) => s.projects);
  const builders = useAppStore((s) => s.builders);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const project = projects.find((p) => p.projectId === projectId);
  if (!project) notFound();

  const builder = builders.find((b) => b.builderId === project.builderId);
  const galleryImages = project.images.filter((i) => i.category !== "floor-plan");
  const floorPlanImages = project.images.filter((i) => i.category === "floor-plan");

  const amenityGroups: Record<string, typeof project.amenities> = {};
  for (const a of project.amenities) {
    if (!amenityGroups[a.category]) amenityGroups[a.category] = [];
    amenityGroups[a.category].push(a);
  }

  const priceLabel =
    project.indicativePriceMin && project.indicativePriceMax
      ? `${formatINR(project.indicativePriceMin)} – ${formatINR(project.indicativePriceMax)}`
      : project.priceRangeMinPerSqft
      ? `${formatPerSqft(project.priceRangeMinPerSqft)} – ${formatPerSqft(project.priceRangeMaxPerSqft ?? project.priceRangeMinPerSqft)}`
      : "Price on Request";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>

      {/* Hero gallery */}
      <div className="px-6 pt-5">
        <ImageGallery images={galleryImages} />
      </div>

      {/* Project header */}
      <div className="px-6 py-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <BuilderLogo builder={builder} builderName={project.builderName} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">{project.builderName}</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                {project.projectDisplayName ?? project.projectName}
              </h1>
              <div className="flex items-center gap-1.5 mt-1.5 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{[project.locality, project.microMarket, project.cityZone].filter(Boolean).join(", ")}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <StatusBadge status={project.projectStatus} />
                <PurposeBadge purpose={project.projectPurpose} />
                {project.riskLevel && <RiskBadge risk={project.riskLevel} />}
                {project.reraStatus === "Registered" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600 text-white text-[11px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />RERA Registered
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Price Range</p>
                <p className="text-lg font-bold text-slate-900">{priceLabel}</p>
              </div>
              <div className="flex gap-4">
                <ScoreGauge score={null} label="Living" size="sm" />
                <ScoreGauge score={null} label="Investment" size="sm" />
              </div>
            </div>
          </div>
          {project.projectHighlights.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {project.projectHighlights.map((h) => (
                <div key={h} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-xs text-slate-600">{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
              )}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-6">
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <SectionCard title="Project Details">
                <div className="grid grid-cols-2 gap-x-8">
                  <div>
                    <InfoRow label="Project Type" value={project.projectType} />
                    <InfoRow label="Total Towers" value={project.totalTowers} />
                    <InfoRow label="Total Floors" value={project.totalFloors} />
                    <InfoRow label="Total Units" value={project.totalUnits} />
                    <InfoRow label="Land Area" value={project.totalLandAreaAcres ? `${project.totalLandAreaAcres} acres` : undefined} />
                    <InfoRow label="Open Space" value={project.openSpacePercentage ? `${project.openSpacePercentage}%` : undefined} />
                  </div>
                  <div>
                    <InfoRow label="Zone" value={project.cityZone} />
                    <InfoRow label="Micro-Market" value={project.microMarket} />
                    <InfoRow label="Possession" value={formatMonthYear(project.estimatedPossessionDate)} highlight />
                    <InfoRow label="Confidence" value={project.possessionConfidence} />
                    <InfoRow label="Available BHKs" value={project.availableBHKs.join(", ")} />
                    <InfoRow label="Source" value={project.sourceOfLead} />
                  </div>
                </div>
              </SectionCard>
              {project.videos.length > 0 && (
                <SectionCard title="Videos">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.videos.map((v) => (
                      <div key={v.id} className="rounded-xl overflow-hidden border border-slate-200">
                        {v.embedUrl ? (
                          <iframe src={v.embedUrl} title={v.title} className="w-full aspect-video" allowFullScreen />
                        ) : (
                          <a href={v.rawUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                            <Play className="w-8 h-8 text-red-500" />
                            <span className="text-sm font-medium text-slate-700">{v.title}</span>
                          </a>
                        )}
                        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200">
                          <p className="text-xs font-medium text-slate-700">{v.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
              {project.notes && (
                <SectionCard title="Notes">
                  <p className="text-sm text-slate-600 leading-relaxed">{project.notes}</p>
                </SectionCard>
              )}
            </div>
            <div className="space-y-5">
              <SectionCard title="Builder">
                <div className="flex items-center gap-3 mb-4">
                  <BuilderLogo builder={builder} builderName={project.builderName} size="md" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{project.builderName}</p>
                    {builder?.builderGroupName && <p className="text-xs text-slate-500">{builder.builderGroupName}</p>}
                  </div>
                </div>
                {builder?.builderWebsite && (
                  <a href={builder.builderWebsite} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-blue-600 hover:underline mb-3">
                    <Globe className="w-3.5 h-3.5" />{builder.builderWebsite}
                  </a>
                )}
                {builder?.primarySalesContactName && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {builder.primarySalesContactName}
                    {builder.primarySalesContactPhone && ` · ${builder.primarySalesContactPhone}`}
                  </div>
                )}
                {builder?.builderCredibilityRating !== undefined && (
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-slate-600">
                      Credibility: <span className="font-semibold">{builder.builderCredibilityRating}/10</span>
                    </span>
                  </div>
                )}
              </SectionCard>
              <SectionCard title="RERA Status">
                <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg mb-3",
                  project.reraStatus === "Registered" ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200")}>
                  {project.reraStatus === "Registered"
                    ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                  <span className={cn("text-xs font-semibold",
                    project.reraStatus === "Registered" ? "text-green-700" : "text-amber-700")}>
                    {project.reraStatus ?? "Unknown"}
                  </span>
                </div>
                {project.reraNumber && <p className="text-[11px] text-slate-500 font-mono break-all">{project.reraNumber}</p>}
              </SectionCard>
              <SectionCard title="Documents Checklist">
                {[
                  { label: "Brochure", collected: project.brochureCollected },
                  { label: "Floor Plans", collected: project.floorPlansCollected },
                  { label: "Master Plan", collected: project.masterPlanCollected },
                  { label: "RERA Certificate", collected: project.reraCertificateCollected },
                ].map((d) => (
                  <div key={d.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-xs text-slate-600">{d.label}</span>
                    {d.collected
                      ? <span className="flex items-center gap-1 text-[11px] text-green-600 font-medium"><CheckCircle2 className="w-3 h-3" /> Collected</span>
                      : <span className="flex items-center gap-1 text-[11px] text-red-500 font-medium"><AlertTriangle className="w-3 h-3" /> Missing</span>}
                  </div>
                ))}
              </SectionCard>
            </div>
          </div>
        )}

        {activeTab === "Gallery" && (
          <div className="space-y-4">
            <ImageGallery images={galleryImages} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {galleryImages.map((img) => (
                <div key={img.id} className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.caption ?? ""} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Floor Plans" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <FloorPlanGallery images={floorPlanImages} />
          </div>
        )}

        {activeTab === "Amenities" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.entries(amenityGroups).map(([category, items]) => (
              <SectionCard key={category} title={category}>
                <div className="space-y-1.5">
                  {items.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 py-1">
                      <CheckCircle2 className={cn("w-4 h-4 shrink-0", a.available ? "text-green-500" : "text-slate-300")} />
                      <span className={cn("text-sm", a.available ? "text-slate-700" : "text-slate-400 line-through")}>{a.name}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            ))}
            {project.amenities.length === 0 && (
              <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-400 text-sm">No amenities added yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "Units" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <BedDouble className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600 mb-1">No units added yet</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Add units to track BHK config, SBA, carpet area, pricing, and parking details.</p>
            <button className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">Add Unit</button>
          </div>
        )}

        {activeTab === "Legal / RERA" && (
          <div className="max-w-lg">
            <SectionCard title="RERA Information">
              <InfoRow label="RERA Status" value={project.reraStatus ?? "Unknown"} />
              <InfoRow label="RERA Number" value={project.reraNumber} highlight />
              {project.reraWebsiteUrl && (
                <InfoRow label="RERA Website" value={
                  <a href={project.reraWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on RERA</a>
                } />
              )}
            </SectionCard>
          </div>
        )}

        {activeTab === "Documents" && (
          <div className="space-y-3">
            {project.documents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600 mb-1">No documents uploaded</p>
                <p className="text-xs text-slate-400">Add brochure, RERA certificate, floor plan PDFs, or legal documents.</p>
              </div>
            ) : project.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{doc.type.replace("-", " ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full",
                    doc.collectionStatus === "Collected" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>
                    {doc.collectionStatus}
                  </span>
                  {doc.url !== "#" && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                      View <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Follow-Ups" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-sm font-medium text-slate-600 mb-1">No follow-ups for this project</p>
            <p className="text-xs text-slate-400">Track builder commitments, missing data, and action items here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
