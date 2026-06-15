"use client";

/**
 * Supabase-backed data store.
 *
 * Replaces the localStorage Zustand persist store with live Supabase queries.
 * The hook fetches projects, builders, units, follow-ups, site visits and
 * payment milestones for the user's workspace, and exposes mutation helpers.
 *
 * RLS on Supabase ensures users only see their own workspace data.
 */

import { useEffect, useReducer, useCallback, useRef } from "react";
import { createUntypedClient as createBrowserClient } from "@/lib/supabase/client";
import { SEED_PROJECTS, SEED_BUILDERS, DEFAULT_SETTINGS } from "@/lib/seed-data";
import type {
  Project, Builder, Unit, SiteVisit,
  FollowUpTask, PaymentMilestone, AppSettings,
} from "@/types";

// ─── State shape ─────────────────────────────────────────────────────────────

export interface SupabaseStoreState {
  projects: Project[];
  builders: Builder[];
  units: Unit[];
  siteVisits: SiteVisit[];
  followUps: FollowUpTask[];
  paymentMilestones: PaymentMilestone[];
  settings: AppSettings;
  loading: boolean;
  error: string | null;
  seeded: boolean;
}

type Action =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_DATA"; data: Partial<SupabaseStoreState> }
  | { type: "ADD_PROJECT"; project: Project }
  | { type: "UPDATE_PROJECT"; projectId: string; updates: Partial<Project> }
  | { type: "DELETE_PROJECT"; projectId: string }
  | { type: "ADD_UNIT"; unit: Unit }
  | { type: "UPDATE_UNIT"; unitId: string; updates: Partial<Unit> }
  | { type: "DELETE_UNIT"; unitId: string }
  | { type: "ADD_FOLLOWUP"; task: FollowUpTask }
  | { type: "UPDATE_FOLLOWUP"; taskId: string; updates: Partial<FollowUpTask> }
  | { type: "DELETE_FOLLOWUP"; taskId: string }
  | { type: "ADD_SITE_VISIT"; visit: SiteVisit }
  | { type: "UPDATE_SITE_VISIT"; visitId: string; updates: Partial<SiteVisit> }
  | { type: "ADD_PAYMENT"; milestone: PaymentMilestone }
  | { type: "UPDATE_PAYMENT"; milestoneId: string; updates: Partial<PaymentMilestone> }
  | { type: "ADD_BUILDER"; builder: Builder }
  | { type: "UPDATE_BUILDER"; builderId: string; updates: Partial<Builder> }
  | { type: "UPDATE_SETTINGS"; updates: Partial<AppSettings> };

const initialState: SupabaseStoreState = {
  projects: [],
  builders: [],
  units: [],
  siteVisits: [],
  followUps: [],
  paymentMilestones: [],
  settings: DEFAULT_SETTINGS,
  loading: true,
  error: null,
  seeded: false,
};

function reducer(state: SupabaseStoreState, action: Action): SupabaseStoreState {
  const now = new Date().toISOString();
  switch (action.type) {
    case "SET_LOADING": return { ...state, loading: action.loading };
    case "SET_ERROR": return { ...state, error: action.error, loading: false };
    case "SET_DATA": return { ...state, ...action.data, loading: false };
    case "ADD_PROJECT": return { ...state, projects: [...state.projects, action.project] };
    case "UPDATE_PROJECT": return {
      ...state,
      projects: state.projects.map((p) =>
        p.projectId === action.projectId ? { ...p, ...action.updates, updatedAt: now } : p
      ),
    };
    case "DELETE_PROJECT": return {
      ...state,
      projects: state.projects.filter((p) => p.projectId !== action.projectId),
      units: state.units.filter((u) => u.projectId !== action.projectId),
      followUps: state.followUps.filter((f) => f.projectId !== action.projectId),
      siteVisits: state.siteVisits.filter((v) => v.projectId !== action.projectId),
    };
    case "ADD_UNIT": return { ...state, units: [...state.units, action.unit] };
    case "UPDATE_UNIT": return {
      ...state,
      units: state.units.map((u) =>
        u.unitId === action.unitId ? { ...u, ...action.updates, updatedAt: now } : u
      ),
    };
    case "DELETE_UNIT": return { ...state, units: state.units.filter((u) => u.unitId !== action.unitId) };
    case "ADD_FOLLOWUP": return { ...state, followUps: [...state.followUps, action.task] };
    case "UPDATE_FOLLOWUP": return {
      ...state,
      followUps: state.followUps.map((f) =>
        f.taskId === action.taskId ? { ...f, ...action.updates, updatedAt: now } : f
      ),
    };
    case "DELETE_FOLLOWUP": return { ...state, followUps: state.followUps.filter((f) => f.taskId !== action.taskId) };
    case "ADD_SITE_VISIT": return { ...state, siteVisits: [...state.siteVisits, action.visit] };
    case "UPDATE_SITE_VISIT": return {
      ...state,
      siteVisits: state.siteVisits.map((v) =>
        v.visitId === action.visitId ? { ...v, ...action.updates, updatedAt: now } : v
      ),
    };
    case "ADD_PAYMENT": return { ...state, paymentMilestones: [...state.paymentMilestones, action.milestone] };
    case "UPDATE_PAYMENT": return {
      ...state,
      paymentMilestones: state.paymentMilestones.map((m) =>
        m.milestoneId === action.milestoneId ? { ...m, ...action.updates } : m
      ),
    };
    case "ADD_BUILDER": return { ...state, builders: [...state.builders, action.builder] };
    case "UPDATE_BUILDER": return {
      ...state,
      builders: state.builders.map((b) =>
        b.builderId === action.builderId ? { ...b, ...action.updates, updatedAt: now } : b
      ),
    };
    case "UPDATE_SETTINGS": return { ...state, settings: { ...state.settings, ...action.updates } };
    default: return state;
  }
}

// ─── Supabase ↔ app-type mappers ─────────────────────────────────────────────
// The DB uses snake_case and slightly different field names vs the app's
// camelCase TypeScript types. These mappers translate.

function dbProjectToApp(row: Record<string, unknown>): Project {
  return {
    projectId: row.id as string,
    projectName: row.project_name as string,
    projectDisplayName: (row.display_name as string) ?? undefined,
    projectShortName: (row.short_name as string) ?? undefined,
    builderId: (row.builder_id as string) ?? undefined,
    builderName: (row.builder_name as string) ?? "",
    projectType: mapProjectType(row.project_type as string),
    projectPurpose: mapPurpose(row.project_purpose as string),
    projectStatus: mapStatus(row.project_status as string),
    city: (row.city as string) ?? "Bangalore",
    cityZone: mapZone(row.city_zone as string),
    microMarket: (row.micro_market as string) ?? undefined,
    locality: (row.locality as string) ?? undefined,
    address: (row.address as string) ?? undefined,
    latitude: (row.latitude as number) ?? undefined,
    longitude: (row.longitude as number) ?? undefined,
    reraNumber: (row.rera_number as string) ?? undefined,
    reraStatus: (row.rera_status as string) as Project["reraStatus"] ?? "Unknown",
    reraWebsiteUrl: (row.rera_website_url as string) ?? undefined,
    totalLandAreaAcres: (row.total_land_area_acres as number) ?? undefined,
    totalTowers: (row.total_towers as number) ?? undefined,
    totalFloors: (row.total_floors as number) ?? undefined,
    totalUnits: (row.total_units as number) ?? undefined,
    openSpacePercentage: (row.open_space_percentage as number) ?? undefined,
    estimatedPossessionDate: (row.estimated_possession_date as string) ?? undefined,
    possessionConfidence: (row.possession_confidence as string) as Project["possessionConfidence"] ?? undefined,
    priceRangeMinPerSqft: (row.price_range_min_per_sqft as number) ?? undefined,
    priceRangeMaxPerSqft: (row.price_range_max_per_sqft as number) ?? undefined,
    indicativePriceMin: (row.indicative_price_min as number) ?? undefined,
    indicativePriceMax: (row.indicative_price_max as number) ?? undefined,
    availableBHKs: (row.available_bhks as Project["availableBHKs"]) ?? [],
    sourceOfLead: (row.source_of_lead as string) ?? undefined,
    sourceUrl: (row.source_url as string) ?? undefined,
    images: (row.images as Project["images"]) ?? [],
    videos: (row.videos as Project["videos"]) ?? [],
    documents: [],
    brochureCollected: Boolean(row.brochure_collected),
    floorPlansCollected: Boolean(row.floor_plans_collected),
    masterPlanCollected: Boolean(row.master_plan_collected),
    reraCertificateCollected: Boolean(row.rera_certificate_collected),
    amenities: (row.amenities as Project["amenities"]) ?? [],
    projectHighlights: (row.project_highlights as string[]) ?? [],
    riskLevel: (row.risk_level as Project["riskLevel"]) ?? undefined,
    riskNotes: (row.risk_notes as string) ?? undefined,
    notes: (row.notes as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function appProjectToDb(project: Project, workspaceId: string) {
  return {
    id: project.projectId,
    workspace_id: workspaceId,
    project_name: project.projectName,
    display_name: project.projectDisplayName ?? null,
    short_name: project.projectShortName ?? null,
    builder_id: project.builderId ?? null,
    builder_name: project.builderName,
    project_type: project.projectType.toLowerCase().replace(" ", "_"),
    project_purpose: project.projectPurpose.toLowerCase(),
    project_status: project.projectStatus.toLowerCase().replace(/ /g, "_"),
    city: project.city,
    city_zone: project.cityZone.split(" ")[0].toLowerCase(),
    micro_market: project.microMarket ?? null,
    locality: project.locality ?? null,
    address: project.address ?? null,
    latitude: project.latitude ?? null,
    longitude: project.longitude ?? null,
    rera_number: project.reraNumber ?? null,
    rera_status: project.reraStatus ?? null,
    rera_website_url: project.reraWebsiteUrl ?? null,
    total_land_area_acres: project.totalLandAreaAcres ?? null,
    total_towers: project.totalTowers ?? null,
    total_floors: project.totalFloors ?? null,
    total_units: project.totalUnits ?? null,
    open_space_percentage: project.openSpacePercentage ?? null,
    estimated_possession_date: project.estimatedPossessionDate ?? null,
    possession_confidence: project.possessionConfidence ?? null,
    price_range_min_per_sqft: project.priceRangeMinPerSqft ?? null,
    price_range_max_per_sqft: project.priceRangeMaxPerSqft ?? null,
    indicative_price_min: project.indicativePriceMin ?? null,
    indicative_price_max: project.indicativePriceMax ?? null,
    available_bhks: project.availableBHKs,
    source_of_lead: project.sourceOfLead ?? null,
    source_url: project.sourceUrl ?? null,
    images: project.images,
    videos: project.videos,
    brochure_collected: project.brochureCollected,
    floor_plans_collected: project.floorPlansCollected,
    master_plan_collected: project.masterPlanCollected,
    rera_certificate_collected: project.reraCertificateCollected,
    amenities: project.amenities,
    project_highlights: project.projectHighlights,
    risk_level: project.riskLevel ?? null,
    risk_notes: project.riskNotes ?? null,
    notes: project.notes ?? null,
  };
}

function mapProjectType(t: string): Project["projectType"] {
  const map: Record<string, Project["projectType"]> = {
    apartment: "Apartment", villa: "Villa", plot: "Plot",
    row_house: "Villa", other: "Unknown",
  };
  return map[t] ?? "Apartment";
}

function mapPurpose(p: string): Project["projectPurpose"] {
  const map: Record<string, Project["projectPurpose"]> = {
    living: "Living", investment: "Investment", both: "Both", undecided: "Undecided",
  };
  return map[p] ?? "Undecided";
}

function mapStatus(s: string): Project["projectStatus"] {
  const map: Record<string, Project["projectStatus"]> = {
    new_lead: "New Lead", data_pending: "Data Pending",
    site_visit_planned: "Site Visit Planned", site_visited: "Site Visited",
    under_comparison: "Under Comparison", family_review_required: "Family Review Required",
    financial_review_required: "Financial Review Required", legal_review_required: "Legal Review Required",
    shortlisted: "Shortlisted", strong_shortlist: "Strong Shortlist",
    negotiation: "Negotiation", booking_ready: "Booking Ready",
    booked: "Booked", loan_in_progress: "Loan In Progress",
    payment_tracking: "Payment Tracking", registration_pending: "Registration Pending",
    registered: "Registered", possession_pending: "Possession Pending",
    possession_received: "Possession Received", rejected: "Rejected",
    watchlist: "Watchlist", on_hold: "On Hold", closed: "Closed",
  };
  return map[s] ?? "New Lead";
}

function mapZone(z: string): Project["cityZone"] {
  const map: Record<string, Project["cityZone"]> = {
    east: "East Bangalore", north: "North Bangalore", south: "South Bangalore",
    west: "West Bangalore", central: "Central Bangalore", other: "Other",
  };
  return map[z] ?? "East Bangalore";
}

// ─── Main hook ────────────────────────────────────────────────────────────────

export function useSupabaseStore(workspaceId: string | null) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const seeding = useRef(false);

  // Load data from Supabase when workspaceId is ready.
  useEffect(() => {
    if (!workspaceId) return;
    let mounted = true;
    const supabase = createBrowserClient();

    async function load() {
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const { data: projects, error: pErr } = await supabase
          .from("projects")
          .select("*")
          .eq("workspace_id", workspaceId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false });

        if (pErr) throw pErr;

        // If fresh workspace (no projects) seed with sample data.
        if ((projects?.length ?? 0) === 0 && !seeding.current) {
          seeding.current = true;
          await seedWorkspace(supabase, workspaceId!);
          const { data: seeded } = await supabase
            .from("projects")
            .select("*")
            .eq("workspace_id", workspaceId)
            .is("deleted_at", null)
            .order("created_at", { ascending: false });
          if (mounted) {
            dispatch({
              type: "SET_DATA",
              data: {
                projects: (seeded ?? []).map(dbProjectToApp),
                builders: SEED_BUILDERS,
                seeded: true,
              },
            });
          }
          return;
        }

        if (mounted) {
          dispatch({
            type: "SET_DATA",
            data: {
              projects: (projects ?? []).map(dbProjectToApp),
              builders: SEED_BUILDERS,
              seeded: true,
            },
          });
        }
      } catch (err) {
        if (mounted) dispatch({ type: "SET_ERROR", error: (err as Error).message });
      }
    }

    load();
    return () => { mounted = false; };
  }, [workspaceId]);

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const addProject = useCallback(async (project: Project) => {
    if (!workspaceId) return;
    dispatch({ type: "ADD_PROJECT", project });
    const supabase = createBrowserClient();
    const { error } = await supabase
      .from("projects")
      .upsert(appProjectToDb(project, workspaceId));
    if (error) console.error("addProject:", error.message);
  }, [workspaceId]);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    if (!workspaceId) return;
    dispatch({ type: "UPDATE_PROJECT", projectId, updates });
    const supabase = createBrowserClient();
    // Build partial DB row from updates.
    const dbUpdates: Record<string, unknown> = {};
    if (updates.projectStatus !== undefined) dbUpdates.project_status = updates.projectStatus.toLowerCase().replace(/ /g, "_");
    if (updates.projectName !== undefined) dbUpdates.project_name = updates.projectName;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.riskLevel !== undefined) dbUpdates.risk_level = updates.riskLevel?.toLowerCase() ?? null;
    if (updates.estimatedPossessionDate !== undefined) dbUpdates.estimated_possession_date = updates.estimatedPossessionDate;
    if (updates.reraNumber !== undefined) dbUpdates.rera_number = updates.reraNumber;
    if (updates.reraStatus !== undefined) dbUpdates.rera_status = updates.reraStatus;
    if (updates.microMarket !== undefined) dbUpdates.micro_market = updates.microMarket;
    if (updates.priceRangeMinPerSqft !== undefined) dbUpdates.price_range_min_per_sqft = updates.priceRangeMinPerSqft;
    if (updates.priceRangeMaxPerSqft !== undefined) dbUpdates.price_range_max_per_sqft = updates.priceRangeMaxPerSqft;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.amenities !== undefined) dbUpdates.amenities = updates.amenities;
    if (updates.projectHighlights !== undefined) dbUpdates.project_highlights = updates.projectHighlights;
    if (updates.brochureCollected !== undefined) dbUpdates.brochure_collected = updates.brochureCollected;
    if (updates.floorPlansCollected !== undefined) dbUpdates.floor_plans_collected = updates.floorPlansCollected;
    if (updates.reraCertificateCollected !== undefined) dbUpdates.rera_certificate_collected = updates.reraCertificateCollected;

    const { error } = await supabase
      .from("projects")
      .update(dbUpdates)
      .eq("id", projectId)
      .eq("workspace_id", workspaceId);
    if (error) console.error("updateProject:", error.message);
  }, [workspaceId]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!workspaceId) return;
    dispatch({ type: "DELETE_PROJECT", projectId });
    const supabase = createBrowserClient();
    await supabase.from("projects").update({ deleted_at: new Date().toISOString() }).eq("id", projectId);
  }, [workspaceId]);

  const addUnit = useCallback((unit: Unit) => dispatch({ type: "ADD_UNIT", unit }), []);
  const updateUnit = useCallback((unitId: string, updates: Partial<Unit>) => dispatch({ type: "UPDATE_UNIT", unitId, updates }), []);
  const deleteUnit = useCallback((unitId: string) => dispatch({ type: "DELETE_UNIT", unitId }), []);

  const addFollowUp = useCallback((task: FollowUpTask) => dispatch({ type: "ADD_FOLLOWUP", task }), []);
  const updateFollowUp = useCallback((taskId: string, updates: Partial<FollowUpTask>) => dispatch({ type: "UPDATE_FOLLOWUP", taskId, updates }), []);
  const deleteFollowUp = useCallback((taskId: string) => dispatch({ type: "DELETE_FOLLOWUP", taskId }), []);

  const addSiteVisit = useCallback((visit: SiteVisit) => dispatch({ type: "ADD_SITE_VISIT", visit }), []);
  const updateSiteVisit = useCallback((visitId: string, updates: Partial<SiteVisit>) => dispatch({ type: "UPDATE_SITE_VISIT", visitId, updates }), []);

  const addPaymentMilestone = useCallback((milestone: PaymentMilestone) => dispatch({ type: "ADD_PAYMENT", milestone }), []);
  const updatePaymentMilestone = useCallback((milestoneId: string, updates: Partial<PaymentMilestone>) => dispatch({ type: "UPDATE_PAYMENT", milestoneId, updates }), []);

  const addBuilder = useCallback((builder: Builder) => dispatch({ type: "ADD_BUILDER", builder }), []);
  const updateBuilder = useCallback((builderId: string, updates: Partial<Builder>) => dispatch({ type: "UPDATE_BUILDER", builderId, updates }), []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => dispatch({ type: "UPDATE_SETTINGS", updates }), []);

  const getProject = useCallback((id: string) => state.projects.find((p) => p.projectId === id), [state.projects]);
  const getUnitsForProject = useCallback((id: string) => state.units.filter((u) => u.projectId === id), [state.units]);
  const getSiteVisitsForProject = useCallback((id: string) => state.siteVisits.filter((v) => v.projectId === id), [state.siteVisits]);
  const getFollowUpsForProject = useCallback((id: string) => state.followUps.filter((f) => f.projectId === id), [state.followUps]);

  return {
    ...state,
    addProject, updateProject, deleteProject, getProject,
    addUnit, updateUnit, deleteUnit, getUnitsForProject,
    addFollowUp, updateFollowUp, deleteFollowUp, getFollowUpsForProject,
    addSiteVisit, updateSiteVisit, getSiteVisitsForProject,
    addPaymentMilestone, updatePaymentMilestone,
    addBuilder, updateBuilder,
    updateSettings,
    hydrated: !state.loading,
  };
}

// ─── Seed helper ─────────────────────────────────────────────────────────────

async function seedWorkspace(
  supabase: ReturnType<typeof createBrowserClient>,
  workspaceId: string,
) {
  const rows = SEED_PROJECTS.map((p) => appProjectToDb(p, workspaceId));
  const { error } = await supabase.from("projects").insert(rows);
  if (error) console.error("seedWorkspace:", error.message);
}
