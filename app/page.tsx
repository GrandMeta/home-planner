"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Plus,
  ArrowRight,
  Check,
  MapPin,
  GitCompare,
  ClipboardCheck,
  CheckSquare,
  GraduationCap,
  Sparkles,
  Building2,
  Home as HomeIcon,
  Trees,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { AddPropertyWizard } from "@/components/projects/AddPropertyWizard";
import {
  JOURNEY_STAGES,
  stageIndexForStatus,
  getPropertyConfig,
} from "@/lib/glossary";
import { cn } from "@/lib/utils";

interface NextAction {
  title: string;
  blurb: string;
  href?: string;
  onClick?: () => void;
  icon: React.ElementType;
  tone: "primary" | "cyan" | "amber" | "green";
}

const TONES: Record<NextAction["tone"], string> = {
  primary: "bg-[var(--primary-light)] text-[var(--primary)]",
  cyan: "bg-cyan-50 text-cyan-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
};

export default function HomePage() {
  const projects = useAppStore((s) => s.projects);
  const followUps = useAppStore((s) => s.followUps);
  const siteVisits = useAppStore((s) => s.siteVisits);
  const [addOpen, setAddOpen] = useState(false);

  const active = projects.filter(
    (p) => !["Rejected", "Closed", "On Hold"].includes(p.projectStatus)
  );
  const openTasks = followUps.filter((f) => f.status === "Open");
  const shortlisted = projects.filter((p) =>
    ["Shortlisted", "Strong Shortlist"].includes(p.projectStatus)
  );

  // How far along is the buyer overall? (furthest any property has reached)
  const currentStage = projects.length
    ? Math.max(...projects.map((p) => stageIndexForStatus(p.projectStatus)))
    : 0;

  // Friendly count by type
  const counts = {
    Apartment: projects.filter((p) => p.projectType === "Apartment").length,
    Villa: projects.filter((p) => p.projectType === "Villa").length,
    Plot: projects.filter((p) => p.projectType === "Plot").length,
  };
  const countBits = [
    counts.Apartment && `${counts.Apartment} apartment${counts.Apartment > 1 ? "s" : ""}`,
    counts.Villa && `${counts.Villa} villa${counts.Villa > 1 ? "s" : ""}`,
    counts.Plot && `${counts.Plot} plot${counts.Plot > 1 ? "s" : ""}`,
  ].filter(Boolean);

  // Build the "what to do next" list, smartest first.
  const nextActions: NextAction[] = [];
  if (projects.length === 0) {
    nextActions.push({
      title: "Add your first property",
      blurb: "Spotted something you like? Pop it in — it takes 30 seconds.",
      onClick: () => setAddOpen(true),
      icon: Plus,
      tone: "primary",
    });
    nextActions.push({
      title: "Learn the basics first",
      blurb: "New to buying? A 5-minute read that explains the jargon.",
      href: "/learn",
      icon: GraduationCap,
      tone: "cyan",
    });
  } else {
    if (siteVisits.length === 0) {
      nextActions.push({
        title: "Plan a visit",
        blurb: "Photos lie a little. Go see your top picks in person.",
        href: "/site-visits",
        icon: ClipboardCheck,
        tone: "cyan",
      });
    }
    if (active.length >= 2) {
      nextActions.push({
        title: "Compare your options",
        blurb: `Line up your ${active.length} properties and see the real costs side by side.`,
        href: "/compare",
        icon: GitCompare,
        tone: "primary",
      });
    }
    if (openTasks.length > 0) {
      nextActions.push({
        title: `${openTasks.length} thing${openTasks.length > 1 ? "s" : ""} to follow up`,
        blurb: "Questions to ask and to-dos you noted down.",
        href: "/follow-ups",
        icon: CheckSquare,
        tone: "amber",
      });
    }
    if (shortlisted.length === 0) {
      nextActions.push({
        title: "Shortlist a favourite",
        blurb: "Found one you love? Mark it shortlisted to track it closely.",
        href: "/projects",
        icon: Check,
        tone: "green",
      });
    }
    nextActions.push({
      title: "See everything on the map",
      blurb: "Check how far each one is from work and home.",
      href: "/map",
      icon: MapPin,
      tone: "cyan",
    });
  }

  return (
    <div>
      {/* Welcome hero */}
      <div className="nest-hero border-b border-[var(--border)] px-6 py-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-light)] px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Your home-buying buddy
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {projects.length === 0
              ? "Let's find your place — one calm step at a time."
              : "Welcome back. Here's where things stand."}
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Nest helps you keep track of homes, villas and plots, understand the{" "}
            <em>real</em> cost of each, and decide with confidence — no jargon, no spreadsheets.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add a property
            </button>
            <Link
              href="/learn"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <GraduationCap className="w-4 h-4" /> Learn the basics
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Journey stepper */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3">Your journey</h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2">
              {JOURNEY_STAGES.map((stage, i) => {
                const done = i < currentStage;
                const current = i === currentStage && projects.length > 0;
                return (
                  <div key={stage.key} className="flex-1 flex flex-col items-center text-center relative">
                    {/* connector */}
                    {i > 0 && (
                      <span
                        className={cn(
                          "absolute top-4 right-1/2 w-full h-0.5 -z-0",
                          i <= currentStage ? "bg-[var(--primary)]" : "bg-slate-200"
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                        done
                          ? "bg-[var(--primary)] text-white"
                          : current
                          ? "bg-[var(--primary)] text-white ring-4 ring-[var(--primary-light)]"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {done ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <p
                      className={cn(
                        "text-xs font-semibold mt-2",
                        i <= currentStage ? "text-slate-900" : "text-slate-400"
                      )}
                    >
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block leading-tight">
                      {stage.blurb}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What to do next */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3">What to do next</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nextActions.slice(0, 3).map((a) => {
              const Icon = a.icon;
              const inner = (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:border-slate-300 transition-all h-full flex flex-col">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", TONES[a.tone])}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-900">{a.title}</p>
                  <p className="text-sm text-slate-500 mt-1 flex-1">{a.blurb}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] mt-3">
                    Let&apos;s go <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              );
              return a.href ? (
                <Link key={a.title} href={a.href}>
                  {inner}
                </Link>
              ) : (
                <button key={a.title} onClick={a.onClick} className="text-left">
                  {inner}
                </button>
              );
            })}
          </div>
        </section>

        {/* Properties at a glance */}
        {projects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your properties</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  You&apos;re looking at {projects.length}{" "}
                  {projects.length === 1 ? "property" : "properties"}
                  {countBits.length > 0 && ` — ${countBits.join(", ")}`}.
                </p>
              </div>
              <Link
                href="/projects"
                className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1 shrink-0"
              >
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* type summary chips */}
            <div className="flex gap-2 flex-wrap mb-4">
              {([
                { type: "Apartment", icon: Building2, n: counts.Apartment },
                { type: "Villa", icon: HomeIcon, n: counts.Villa },
                { type: "Plot", icon: Trees, n: counts.Plot },
              ] as const)
                .filter((c) => c.n > 0)
                .map((c) => {
                  const cfg = getPropertyConfig(c.type);
                  const Icon = c.icon;
                  return (
                    <span
                      key={c.type}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${cfg.accent}1a`, color: cfg.accent }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {c.n} {c.n === 1 ? cfg.noun.toLowerCase() : cfg.nounPlural.toLowerCase()}
                    </span>
                  );
                })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(shortlisted.length > 0 ? shortlisted : projects)
                .slice(0, 3)
                .map((p) => (
                  <ProjectCard key={p.projectId} project={p} />
                ))}
            </div>
          </section>
        )}

        {/* New here banner */}
        {projects.length === 0 && (
          <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 flex gap-3">
            <GraduationCap className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-cyan-900">
                Never bought property before? You&apos;re in the right place.
              </p>
              <p className="text-sm text-cyan-800 mt-0.5">
                Tap any{" "}
                <span className="underline decoration-dotted">underlined word</span> anywhere
                in the app for a plain-English explanation, or{" "}
                <Link href="/learn" className="font-semibold underline">
                  read the basics
                </Link>
                .
              </p>
            </div>
          </section>
        )}
      </div>

      <AddPropertyWizard open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
