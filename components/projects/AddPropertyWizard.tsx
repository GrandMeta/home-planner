"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight, Check, MapPin, Sparkles } from "lucide-react";
import { useAppStore } from "@/components/providers/SupabaseProvider";
import { PROPERTY_TYPES, getPropertyConfig } from "@/lib/glossary";
import type {
  Project,
  ProjectType,
  BHKConfig,
  CityZone,
  ProjectPurpose,
} from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ZONES: CityZone[] = [
  "East Bangalore",
  "North Bangalore",
  "South Bangalore",
  "West Bangalore",
  "Central Bangalore",
  "Other",
];

const BHK_OPTIONS: BHKConfig[] = ["1BHK", "2BHK", "2.5BHK", "3BHK", "3.5BHK", "4BHK"];

const PURPOSES: { value: ProjectPurpose; label: string; blurb: string }[] = [
  { value: "Living", label: "To live in", blurb: "It'll be your home" },
  { value: "Investment", label: "To invest", blurb: "Rent it out or resell later" },
  { value: "Both", label: "A bit of both", blurb: "Live now, value later" },
  { value: "Undecided", label: "Not sure yet", blurb: "Still figuring it out" },
];

const input =
  "w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white placeholder-slate-400";

export function AddPropertyWizard({ open, onClose }: Props) {
  const addProject = useAppStore((s) => s.addProject);

  const [step, setStep] = useState(0);
  const [type, setType] = useState<ProjectType | null>(null);
  const [name, setName] = useState("");
  const [builder, setBuilder] = useState("");
  const [zone, setZone] = useState<CityZone>("East Bangalore");
  const [area, setArea] = useState("");
  const [purpose, setPurpose] = useState<ProjectPurpose>("Living");
  const [bhks, setBhks] = useState<BHKConfig[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const cfg = type ? getPropertyConfig(type) : null;

  function reset() {
    setStep(0);
    setType(null);
    setName("");
    setBuilder("");
    setZone("East Bangalore");
    setArea("");
    setPurpose("Living");
    setBhks([]);
    setPriceMin("");
    setPriceMax("");
  }

  function close() {
    reset();
    onClose();
  }

  function toggleBhk(b: BHKConfig) {
    setBhks((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  }

  function save() {
    const now = new Date().toISOString();
    const project: Project = {
      projectId: `proj-${Date.now()}`,
      projectName: name.trim(),
      projectDisplayName: name.trim(),
      projectShortName: name.trim().split(" ").slice(0, 2).join(" "),
      builderName: builder.trim() || "Unknown developer",
      projectType: type ?? "Apartment",
      projectPurpose: purpose,
      projectStatus: "New Lead",
      city: "Bangalore",
      cityZone: zone,
      microMarket: area.trim() || undefined,
      locality: area.trim() || undefined,
      reraStatus: "Unknown",
      priceRangeMinPerSqft: priceMin ? Number(priceMin) : undefined,
      priceRangeMaxPerSqft: priceMax ? Number(priceMax) : undefined,
      availableBHKs: cfg?.hasBHK ? bhks : [],
      images: [],
      videos: [],
      documents: [],
      brochureCollected: false,
      floorPlansCollected: false,
      masterPlanCollected: false,
      reraCertificateCollected: false,
      amenities: [],
      projectHighlights: [],
      createdAt: now,
      updatedAt: now,
    };
    addProject(project);
    close();
  }

  if (!open) return null;

  const TOTAL_STEPS = 3;
  const canNext =
    step === 0 ? !!type : step === 1 ? name.trim().length > 0 : true;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white sm:rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-bold text-slate-900">Add a property</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Just a few quick questions — you can fill in the rest later.
            </p>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 px-6 pt-4">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-[var(--primary)]" : "bg-slate-200"
              )}
            />
          ))}
        </div>

        <div className="px-6 py-5">
          {/* STEP 0 — type */}
          {step === 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                What are you looking at?
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Pick the kind of property. We&apos;ll ask the right questions for each.
              </p>
              <div className="grid gap-3">
                {Object.values(PROPERTY_TYPES).map((p) => {
                  const Icon = p.icon;
                  const active = type === p.type;
                  return (
                    <button
                      key={p.type}
                      onClick={() => setType(p.type)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                        active
                          ? "border-[var(--primary)] bg-[var(--primary-light)]"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      )}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${p.accent}1a`, color: p.accent }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">{p.noun}</p>
                        <p className="text-xs text-slate-500">{p.tagline}</p>
                      </div>
                      {active && <Check className="w-5 h-5 text-[var(--primary)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1 — basics */}
          {step === 1 && cfg && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">The basics</h3>
                <p className="text-sm text-slate-500">
                  What&apos;s it called and where is it?
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {cfg.noun} name
                </label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={input}
                  placeholder={
                    type === "Plot" ? "e.g. Green Acres Plots" : "e.g. The Earthscape"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Builder / developer{" "}
                  <span className="text-slate-400 font-normal">(if you know it)</span>
                </label>
                <input
                  value={builder}
                  onChange={(e) => setBuilder(e.target.value)}
                  className={input}
                  placeholder="e.g. DSR Infrastructure"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Part of the city
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value as CityZone)}
                    className={input}
                  >
                    {ZONES.map((z) => (
                      <option key={z}>{z}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Neighbourhood
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className={cn(input, "pl-9")}
                      placeholder="e.g. Whitefield"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — details */}
          {step === 2 && cfg && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  A few more details
                </h3>
                <p className="text-sm text-slate-500">
                  All optional — skip anything you don&apos;t know yet.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Why this property?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PURPOSES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPurpose(p.value)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        purpose === p.value
                          ? "border-[var(--primary)] bg-[var(--primary-light)]"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <p className="text-sm font-semibold text-slate-800">{p.label}</p>
                      <p className="text-[11px] text-slate-500">{p.blurb}</p>
                    </button>
                  ))}
                </div>
              </div>

              {cfg.hasBHK && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Which sizes are you interested in?
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {BHK_OPTIONS.map((b) => (
                      <button
                        key={b}
                        onClick={() => toggleBhk(b)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                          bhks.includes(b)
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white text-slate-600 border-slate-300 hover:border-[var(--primary)]"
                        )}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Rough price (₹ per sq.ft)
                  <span className="text-slate-400 font-normal"> — if you&apos;ve seen one</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className={input}
                    placeholder="From e.g. 7500"
                  />
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className={input}
                    placeholder="To e.g. 9000"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-cyan-50 border border-cyan-100">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-800 leading-relaxed">
                  Don&apos;t worry about getting everything right. Once it&apos;s added, Nest will
                  guide you on what to check and ask next.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <span />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={save}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[var(--positive)] text-white text-sm font-semibold hover:opacity-90"
            >
              <Check className="w-4 h-4" /> Add property
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
