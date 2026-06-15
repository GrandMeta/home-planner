/**
 * Plain-English glossary + property-type configuration.
 *
 * The whole point of this app is that a first-time buyer who has *never*
 * thought about real estate should feel comfortable. Every scary term gets a
 * one-line, jargon-free explanation here, surfaced in the UI via <Explain>.
 *
 * This is presentation/help content — no calculations live here.
 */

import {
  Building2,
  Home,
  Trees,
  type LucideIcon,
} from "lucide-react";
import type { ProjectType } from "@/types";

// ─── Glossary ──────────────────────────────────────────────────────────────

export interface GlossaryEntry {
  /** Canonical key, lower-case, used as the lookup id. */
  term: string;
  /** How it's shown to the user. */
  label: string;
  /** One friendly sentence. No jargon inside the explanation itself. */
  short: string;
  /** Optional longer help shown on the Learn page. */
  long?: string;
  /** Other terms people search for this by. */
  aliases?: string[];
  category: "Money" | "Size & Space" | "Legal & Safety" | "Timeline" | "Basics";
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: "carpet area",
    label: "Carpet area",
    short:
      "The actual usable floor space inside your walls — what you could lay a carpet on.",
    long: "This is the real space you live in: bedrooms, hall, kitchen, bathrooms. It does not include walls, shared corridors, or the lift lobby. When comparing homes, carpet area is the most honest number.",
    aliases: ["usable area"],
    category: "Size & Space",
  },
  {
    term: "super built-up area",
    label: "Super built-up area (SBA)",
    short:
      "Your home's space PLUS your share of shared areas like lobbies and stairs. Builders quote prices on this, so it looks bigger than what you actually use.",
    long: "Builders usually advertise the price 'per sq.ft' on super built-up area. Two homes with the same super built-up area can have very different usable (carpet) areas, so always check both.",
    aliases: ["sba", "saleable area"],
    category: "Size & Space",
  },
  {
    term: "built-up area",
    label: "Built-up area",
    short:
      "Carpet area plus the thickness of your walls and balconies — a bit more than what you use.",
    category: "Size & Space",
  },
  {
    term: "plot area",
    label: "Plot area",
    short: "The size of the piece of land itself, usually measured in sq.ft.",
    category: "Size & Space",
  },
  {
    term: "bhk",
    label: "BHK",
    short:
      "Bedrooms, Hall, Kitchen. '2BHK' means 2 bedrooms + a hall + a kitchen.",
    aliases: ["configuration"],
    category: "Basics",
  },
  {
    term: "rera",
    label: "RERA",
    short:
      "A government registration that protects buyers. A RERA number means the project is officially approved and you can verify it online.",
    long: "RERA (Real Estate Regulation Act) makes builders accountable for delivering on time and as promised. If a project has no RERA number, treat it as a red flag until you've checked why.",
    category: "Legal & Safety",
  },
  {
    term: "possession",
    label: "Possession",
    short: "The date you actually get the keys and can move in.",
    aliases: ["handover", "possession date"],
    category: "Timeline",
  },
  {
    term: "ready to move",
    label: "Ready-to-move",
    short:
      "The home is finished — you can move in right away. Less risk, but usually costs more.",
    category: "Timeline",
  },
  {
    term: "under construction",
    label: "Under construction",
    short:
      "Still being built. Often cheaper, but you wait for keys and there's some risk it gets delayed.",
    category: "Timeline",
  },
  {
    term: "gst",
    label: "GST",
    short:
      "A government tax added on under-construction homes (not on ready or resale ones). It's a real cost on top of the price.",
    category: "Money",
  },
  {
    term: "stamp duty",
    label: "Stamp duty",
    short:
      "A government fee you pay to legally register the property in your name. Usually a few percent of the price.",
    category: "Money",
  },
  {
    term: "registration",
    label: "Registration charges",
    short:
      "The fee to officially record the sale with the government, paid along with stamp duty.",
    category: "Money",
  },
  {
    term: "corpus fund",
    label: "Corpus fund",
    short:
      "A one-time deposit you pay the builder that goes into a reserve for the community's big future repairs.",
    category: "Money",
  },
  {
    term: "maintenance advance",
    label: "Maintenance advance",
    short:
      "Upfront payment for the first year or two of upkeep — security, cleaning, gardening of shared areas.",
    category: "Money",
  },
  {
    term: "emi",
    label: "EMI",
    short:
      "The fixed amount you pay the bank every month if you take a home loan.",
    category: "Money",
  },
  {
    term: "floor rise",
    label: "Floor-rise charge",
    short:
      "Extra money builders charge for higher floors (better view, more light).",
    category: "Money",
  },
  {
    term: "plc",
    label: "PLC (preferred location charge)",
    short:
      "Extra cost for a 'better' spot — park-facing, corner, or a specific view.",
    category: "Money",
  },
  {
    term: "agreement value",
    label: "Agreement value",
    short:
      "The total price written in the sale agreement: base price plus the builder's extra charges (before taxes).",
    category: "Money",
  },
  {
    term: "base price",
    label: "Base price",
    short:
      "The headline price per sq.ft the builder advertises — before all the extra charges and taxes get added.",
    category: "Money",
  },
  {
    term: "landing cost",
    label: "True (landing) cost",
    short:
      "What the home REALLY costs you all-in: price + taxes + registration + parking + interiors + everything.",
    long: "The advertised price is almost never the final price. The landing cost adds GST, stamp duty, registration, parking, club charges, interiors and more. This app's main job is to show you this honest number.",
    aliases: ["total cost", "all-in cost"],
    category: "Money",
  },
  {
    term: "oc",
    label: "Occupancy Certificate (OC)",
    short:
      "A government certificate saying the building is safe and legal to live in. Don't move in without it.",
    category: "Legal & Safety",
  },
  {
    term: "khata",
    label: "Khata",
    short:
      "A local property record (common in Bengaluru) showing you as the owner for tax purposes. 'A Khata' is the clean, preferred kind.",
    category: "Legal & Safety",
  },
  {
    term: "encumbrance certificate",
    label: "Encumbrance Certificate (EC)",
    short:
      "A document proving the property has no pending loans or legal dues against it.",
    category: "Legal & Safety",
  },
  {
    term: "rental yield",
    label: "Rental yield",
    short:
      "How much yearly rent you'd earn compared to the price — a quick gauge of an investment's return.",
    category: "Money",
  },
  {
    term: "appreciation",
    label: "Appreciation",
    short: "How much the property's value is expected to grow over time.",
    category: "Money",
  },
  {
    term: "micro-market",
    label: "Micro-market",
    short:
      "A specific neighbourhood or pocket of the city (e.g. Whitefield), used to compare similar areas.",
    category: "Basics",
  },
  {
    term: "far",
    label: "FAR",
    short:
      "A rule for how much you're allowed to build on a plot of land. Matters most when buying plots.",
    category: "Legal & Safety",
  },
];

const GLOSSARY_INDEX: Record<string, GlossaryEntry> = (() => {
  const idx: Record<string, GlossaryEntry> = {};
  for (const e of GLOSSARY) {
    idx[e.term.toLowerCase()] = e;
    for (const a of e.aliases ?? []) idx[a.toLowerCase()] = e;
  }
  return idx;
})();

export function lookupTerm(term: string): GlossaryEntry | undefined {
  return GLOSSARY_INDEX[term.toLowerCase()];
}

// ─── Property-type configuration ─────────────────────────────────────────────
// Apartments, villas and plots are genuinely different purchases. The UI should
// speak the right language and show the right fields for each.

export interface PropertyTypeConfig {
  type: ProjectType;
  /** Friendly singular noun, e.g. "Apartment". */
  noun: string;
  /** Plural, e.g. "Apartments". */
  nounPlural: string;
  icon: LucideIcon;
  /** One-line description shown in the "choose type" step. */
  tagline: string;
  /** Tailwind-ish accent color hex for chips/illustrations. */
  accent: string;
  /** Does this type have a BHK layout (bedrooms)? Plots don't. */
  hasBHK: boolean;
  /** Does it have an internal carpet area? Plots don't. */
  hasCarpetArea: boolean;
  /** Does it sit in a tower (vs. standalone / on land)? */
  hasTowers: boolean;
  /** Word used for the headline size measure. */
  sizeLabel: string;
  /** Things a beginner should especially check for this type. */
  watchOuts: string[];
}

export const PROPERTY_TYPES: Record<
  Exclude<ProjectType, "Mixed Use" | "Unknown">,
  PropertyTypeConfig
> = {
  Apartment: {
    type: "Apartment",
    noun: "Apartment",
    nounPlural: "Apartments",
    icon: Building2,
    tagline: "A flat in a shared building or gated community.",
    accent: "#2563EB",
    hasBHK: true,
    hasCarpetArea: true,
    hasTowers: true,
    sizeLabel: "Super built-up area",
    watchOuts: [
      "Check carpet area, not just the advertised size",
      "Confirm parking is included and where it is",
      "Ask about monthly maintenance per sq.ft",
    ],
  },
  Villa: {
    type: "Villa",
    noun: "Villa",
    nounPlural: "Villas",
    icon: Home,
    tagline: "An independent or row house, usually with its own bit of land.",
    accent: "#0891B2",
    hasBHK: true,
    hasCarpetArea: true,
    hasTowers: false,
    sizeLabel: "Built-up area",
    watchOuts: [
      "Check both the land area and the built-up area",
      "Confirm who maintains roads, parks and security",
      "Ask if the land is clear-title and the Khata is in order",
    ],
  },
  Plot: {
    type: "Plot",
    noun: "Plot",
    nounPlural: "Plots",
    icon: Trees,
    tagline: "A piece of land to build on later or hold as an investment.",
    accent: "#16A34A",
    hasBHK: false,
    hasCarpetArea: false,
    hasTowers: false,
    sizeLabel: "Plot area",
    watchOuts: [
      "Verify clear title, EC and approved layout before anything",
      "Check the road width and how easy it is to reach",
      "Understand how much you're allowed to build (FAR)",
    ],
  },
};

export function getPropertyConfig(type: ProjectType): PropertyTypeConfig {
  if (type === "Apartment" || type === "Villa" || type === "Plot") {
    return PROPERTY_TYPES[type];
  }
  // Mixed Use / Unknown fall back to the apartment vocabulary.
  return PROPERTY_TYPES.Apartment;
}

// ─── The buyer journey ───────────────────────────────────────────────────────
// A simple, encouraging path that maps the (many) internal statuses down to a
// handful of stages a normal person understands.

import type { ProjectStatus } from "@/types";

export interface JourneyStage {
  key: string;
  label: string;
  blurb: string;
}

export const JOURNEY_STAGES: JourneyStage[] = [
  { key: "discover", label: "Discover", blurb: "Add homes you're curious about" },
  { key: "visit", label: "Visit", blurb: "See them in person" },
  { key: "compare", label: "Compare", blurb: "Line up the real costs" },
  { key: "decide", label: "Decide", blurb: "Pick your favourite" },
  { key: "buy", label: "Buy & track", blurb: "Payments until you get the keys" },
];

const STATUS_TO_STAGE: Record<ProjectStatus, number> = {
  "New Lead": 0,
  "Data Pending": 0,
  "Site Visit Planned": 0,
  "Site Visited": 1,
  "Under Comparison": 2,
  "Family Review Required": 2,
  "Financial Review Required": 2,
  "Legal Review Required": 2,
  "Watchlist": 2,
  "Shortlisted": 3,
  "Strong Shortlist": 3,
  "Negotiation": 3,
  "Booking Ready": 3,
  "Booked": 4,
  "Loan In Progress": 4,
  "Payment Tracking": 4,
  "Registration Pending": 4,
  "Registered": 4,
  "Possession Pending": 4,
  "Possession Received": 4,
  "Rejected": 0,
  "On Hold": 0,
  "Closed": 4,
};

export function stageIndexForStatus(status: ProjectStatus): number {
  return STATUS_TO_STAGE[status] ?? 0;
}
