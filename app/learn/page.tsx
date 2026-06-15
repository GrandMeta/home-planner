"use client";

import { useState } from "react";
import { GraduationCap, Search, Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GLOSSARY, type GlossaryEntry } from "@/lib/glossary";

const CATEGORY_ORDER: GlossaryEntry["category"][] = [
  "Basics",
  "Money",
  "Size & Space",
  "Legal & Safety",
  "Timeline",
];

const STEPS = [
  {
    n: 1,
    title: "Get your bearings",
    body: "Decide roughly how much you can spend and which parts of the city you'd actually want to live in. No pressure to be exact.",
  },
  {
    n: 2,
    title: "Collect options",
    body: "Add any home, villa or plot that catches your eye. More options means a better sense of what's fair.",
  },
  {
    n: 3,
    title: "Visit in person",
    body: "Brochures and photos hide a lot. Walk the area, check the commute, and trust how a place feels.",
  },
  {
    n: 4,
    title: "Find the true cost",
    body: "The sticker price is never the final price. Taxes, registration, parking and interiors all add up — Nest does this maths for you.",
  },
  {
    n: 5,
    title: "Compare honestly",
    body: "Put your favourites side by side. The cheapest-looking one often isn't the cheapest once everything's added.",
  },
  {
    n: 6,
    title: "Decide & buy safely",
    body: "Check the paperwork (RERA, title, approvals), shortlist your pick, and track payments until you get the keys.",
  },
];

export default function LearnPage() {
  const [q, setQ] = useState("");

  const filtered = GLOSSARY.filter((e) => {
    if (!q) return true;
    const hay = `${e.label} ${e.short} ${e.long ?? ""} ${(e.aliases ?? []).join(" ")}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <PageHeader
        icon={GraduationCap}
        title="Learn the basics"
        description="Buying a home explained simply — and a dictionary for every confusing word."
      />

      <div className="p-6 space-y-10 max-w-4xl">
        {/* Buying in 6 steps */}
        <section>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Buying a property, in 6 calm steps
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            You don&apos;t need to know everything. Just follow the path.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {s.n}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{s.title}</p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Golden rule */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">The one rule to remember</p>
            <p className="text-sm text-amber-800 mt-0.5 leading-relaxed">
              The advertised price is <strong>never</strong> the final price. Always ask for the
              all-in cost — including taxes, registration, parking and interiors — before you
              compare two homes. Nest works this out for you on the True Cost page.
            </p>
          </div>
        </section>

        {/* Glossary */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div>
              <h2 className="text-base font-bold text-slate-900">Word dictionary</h2>
              <p className="text-sm text-slate-500">
                Every confusing term, explained in one sentence.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a word…"
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-52"
              />
            </div>
          </div>

          {CATEGORY_ORDER.map((cat) => {
            const entries = filtered.filter((e) => e.category === cat);
            if (entries.length === 0) return null;
            return (
              <div key={cat} className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {cat}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {entries.map((e) => (
                    <div
                      key={e.term}
                      className="bg-white border border-slate-200 rounded-xl p-4"
                    >
                      <p className="font-semibold text-slate-900 text-sm">{e.label}</p>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{e.short}</p>
                      {e.long && (
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{e.long}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">
              No words match “{q}”. Try a different spelling.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
