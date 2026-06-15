// Read (SELECT) query helpers
// All queries are workspace-scoped and go through the anon client (RLS enforced).

import { createBrowserClient } from "./client";
import type { Database } from "@/types/database.types";

type Tables = Database["public"]["Tables"];
type Project = Tables["projects"]["Row"];
type Unit = Tables["units"]["Row"];
type Builder = Tables["builders"]["Row"];
type FollowUp = Tables["follow_ups"]["Row"];
type SiteVisit = Tables["site_visits"]["Row"];
type Document = Tables["documents"]["Row"];
type PaymentMilestone = Tables["payment_milestones"]["Row"];
type AppSettings = Tables["app_settings"]["Row"];

// ---- Projects ----

export async function getProjects(workspaceId: string): Promise<Project[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProject(
  workspaceId: string,
  projectId: string,
): Promise<Project | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("id", projectId)
    .single();
  if (error) return null;
  return data;
}

export async function getProjectWithRelated(
  workspaceId: string,
  projectId: string,
) {
  const supabase = createBrowserClient();
  const [
    { data: project },
    { data: images },
    { data: videos },
    { data: amenities },
    { data: units },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).eq("workspace_id", workspaceId).single(),
    supabase.from("project_images").select("*").eq("project_id", projectId),
    supabase.from("project_videos").select("*").eq("project_id", projectId),
    supabase.from("amenities").select("*").eq("project_id", projectId),
    supabase.from("units").select("*").eq("project_id", projectId),
  ]);
  return { project, images: images ?? [], videos: videos ?? [], amenities: amenities ?? [], units: units ?? [] };
}

// ---- Builders ----

export async function getBuilders(workspaceId: string): Promise<Builder[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("builders")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

// ---- Units ----

export async function getUnitsForProject(
  workspaceId: string,
  projectId: string,
): Promise<Unit[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("units")
    .select("*, space_details(*), cost_breakups(*), statutory_charges(*), parking_details(*)")
    .eq("project_id", projectId)
    .eq("workspace_id", workspaceId);
  if (error) throw error;
  return data ?? [];
}

// ---- Follow-ups ----

export async function getFollowUps(
  workspaceId: string,
  filters?: { status?: string; projectId?: string },
): Promise<FollowUp[]> {
  const supabase = createBrowserClient();
  let query = supabase
    .from("follow_ups")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("due_date", { ascending: true, nullsFirst: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.projectId) query = query.eq("project_id", filters.projectId);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ---- Site visits ----

export async function getSiteVisits(
  workspaceId: string,
  projectId?: string,
): Promise<SiteVisit[]> {
  const supabase = createBrowserClient();
  let query = supabase
    .from("site_visits")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("visit_date", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ---- Documents ----

export async function getDocuments(
  workspaceId: string,
  projectId?: string,
): Promise<Document[]> {
  const supabase = createBrowserClient();
  let query = supabase
    .from("documents")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ---- Payment milestones ----

export async function getPaymentMilestones(
  workspaceId: string,
  unitId?: string,
): Promise<PaymentMilestone[]> {
  const supabase = createBrowserClient();
  let query = supabase
    .from("payment_milestones")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("sort_order");

  if (unitId) query = query.eq("unit_id", unitId);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ---- App settings ----

export async function getAppSettings(
  workspaceId: string,
): Promise<AppSettings | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .eq("workspace_id", workspaceId)
    .single();
  if (error) return null;
  return data;
}

// ---- Dashboard summary ----

export async function getDashboardSummary(workspaceId: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.rpc("get_workspace_summary", {
    p_workspace_id: workspaceId,
  });
  if (error) throw error;
  return data;
}
