"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { Project, BHKConfig, CityZone, ProjectPurpose, ProjectType } from "@/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  builderName: z.string().min(1, "Builder name is required"),
  projectType: z.string(),
  projectPurpose: z.string(),
  cityZone: z.string(),
  microMarket: z.string().optional(),
  locality: z.string().optional(),
  reraNumber: z.string().optional(),
  estimatedPossessionDate: z.string().optional(),
  priceRangeMinPerSqft: z.string().optional(),
  priceRangeMaxPerSqft: z.string().optional(),
  sourceOfLead: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
}

function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-slate-400";
const selectCls = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

export function AddProjectModal({ open, onClose }: AddProjectModalProps) {
  const addProject = useAppStore((s) => s.addProject);
  const [selectedBHKs, setSelectedBHKs] = useState<BHKConfig[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const bhkOptions: BHKConfig[] = ["1BHK", "2BHK", "2.5BHK", "3BHK", "3.5BHK", "4BHK"];

  function toggleBHK(bhk: BHKConfig) {
    setSelectedBHKs((prev) =>
      prev.includes(bhk) ? prev.filter((b) => b !== bhk) : [...prev, bhk]
    );
  }

  function onSubmit(data: FormValues) {
    const now = new Date().toISOString();
    const project: Project = {
      projectId: `proj-${Date.now()}`,
      projectName: data.projectName,
      projectDisplayName: data.projectName,
      projectShortName: data.projectName.split(" ").slice(0, 2).join(" "),
      builderName: data.builderName,
      projectType: (data.projectType as ProjectType) ?? "Apartment",
      projectPurpose: (data.projectPurpose as ProjectPurpose) ?? "Undecided",
      projectStatus: "New Lead",
      city: "Bangalore",
      cityZone: (data.cityZone as CityZone) ?? "East Bangalore",
      microMarket: data.microMarket,
      locality: data.locality,
      reraNumber: data.reraNumber,
      reraStatus: data.reraNumber ? "Registered" : "Unknown",
      estimatedPossessionDate: data.estimatedPossessionDate,
      priceRangeMinPerSqft: data.priceRangeMinPerSqft
        ? Number(data.priceRangeMinPerSqft)
        : undefined,
      priceRangeMaxPerSqft: data.priceRangeMaxPerSqft
        ? Number(data.priceRangeMaxPerSqft)
        : undefined,
      availableBHKs: selectedBHKs,
      sourceOfLead: data.sourceOfLead,
      images: [],
      videos: [],
      documents: [],
      brochureCollected: false,
      floorPlansCollected: false,
      masterPlanCollected: false,
      reraCertificateCollected: false,
      amenities: [],
      projectHighlights: [],
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };
    addProject(project);
    reset();
    setSelectedBHKs([]);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add New Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">Start with minimum details. Enrich later.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          <FieldGroup label="Project Name *" error={errors.projectName?.message}>
            <input {...register("projectName")} className={inputCls} placeholder="e.g. The Earthscape" />
          </FieldGroup>

          <FieldGroup label="Builder Name *" error={errors.builderName?.message}>
            <input {...register("builderName")} className={inputCls} placeholder="e.g. DSR Infrastructure" />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Project Type">
              <select {...register("projectType")} className={selectCls} defaultValue="Apartment">
                <option>Apartment</option>
                <option>Villa</option>
                <option>Plot</option>
                <option>Mixed Use</option>
              </select>
            </FieldGroup>

            <FieldGroup label="Purpose">
              <select {...register("projectPurpose")} className={selectCls} defaultValue="Undecided">
                <option>Living</option>
                <option>Investment</option>
                <option>Both</option>
                <option>Undecided</option>
              </select>
            </FieldGroup>
          </div>

          <FieldGroup label="City Zone">
            <select {...register("cityZone")} className={selectCls} defaultValue="East Bangalore">
              <option>East Bangalore</option>
              <option>North Bangalore</option>
              <option>South Bangalore</option>
              <option>West Bangalore</option>
              <option>Central Bangalore</option>
            </select>
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Micro-Market">
              <input {...register("microMarket")} className={inputCls} placeholder="e.g. Whitefield" />
            </FieldGroup>
            <FieldGroup label="Locality">
              <input {...register("locality")} className={inputCls} placeholder="e.g. ITPL Road" />
            </FieldGroup>
          </div>

          <FieldGroup label="RERA Number">
            <input {...register("reraNumber")} className={inputCls} placeholder="PRM/KA/RERA/..." />
          </FieldGroup>

          <FieldGroup label="Estimated Possession">
            <input type="date" {...register("estimatedPossessionDate")} className={inputCls} />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Price Min (₹/sq.ft)">
              <input type="number" {...register("priceRangeMinPerSqft")} className={inputCls} placeholder="e.g. 7500" />
            </FieldGroup>
            <FieldGroup label="Price Max (₹/sq.ft)">
              <input type="number" {...register("priceRangeMaxPerSqft")} className={inputCls} placeholder="e.g. 9000" />
            </FieldGroup>
          </div>

          <FieldGroup label="Available BHK Configurations">
            <div className="flex gap-2 flex-wrap mt-1">
              {bhkOptions.map((bhk) => (
                <button
                  key={bhk}
                  type="button"
                  onClick={() => toggleBHK(bhk)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    selectedBHKs.includes(bhk)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                  )}
                >
                  {bhk}
                </button>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Source of Lead">
            <select {...register("sourceOfLead")} className={selectCls}>
              <option value="">Select source...</option>
              <option>Builder Website</option>
              <option>Broker</option>
              <option>Referral</option>
              <option>Real Estate Portal</option>
              <option>Drive-by</option>
              <option>Ad</option>
              <option>Other</option>
            </select>
          </FieldGroup>

          <FieldGroup label="Notes">
            <textarea
              {...register("notes")}
              rows={2}
              className={cn(inputCls, "resize-none")}
              placeholder="Initial observations, key questions to confirm..."
            />
          </FieldGroup>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
