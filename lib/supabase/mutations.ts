// Write (INSERT / UPDATE / DELETE) mutation helpers
// All mutations go through the anon client (RLS enforced).

import { createBrowserClient } from "./client";
import type { Database } from "@/types/database.types";

type Tables = Database["public"]["Tables"];
type ProjectInsert = Tables["projects"]["Insert"];
type ProjectUpdate = Tables["projects"]["Update"];
type UnitInsert = Tables["units"]["Insert"];
type UnitUpdate = Tables["units"]["Update"];
type FollowUpInsert = Tables["follow_ups"]["Insert"];
type FollowUpUpdate = Tables["follow_ups"]["Update"];
type SiteVisitInsert = Tables["site_visits"]["Insert"];
type BuilderInsert = Tables["builders"]["Insert"];
type BuilderUpdate = Tables["builders"]["Update"];
type AppSettingsUpdate = Tables["app_settings"]["Update"];

// ---- Projects ----

export async function createProject(project: ProjectInsert) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(
  projectId: string,
  updates: ProjectUpdate,
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(projectId: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);
  if (error) throw error;
}

// ---- Builders ----

export async function createBuilder(builder: BuilderInsert) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("builders")
    .insert(builder)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBuilder(
  builderId: string,
  updates: BuilderUpdate,
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("builders")
    .update(updates)
    .eq("id", builderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Units ----

export async function createUnit(unit: UnitInsert) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("units")
    .insert(unit)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUnit(unitId: string, updates: UnitUpdate) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("units")
    .update(updates)
    .eq("id", unitId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteUnit(unitId: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase.from("units").delete().eq("id", unitId);
  if (error) throw error;
}

// ---- Follow-ups ----

export async function createFollowUp(followUp: FollowUpInsert) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .insert(followUp)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateFollowUp(
  followUpId: string,
  updates: FollowUpUpdate,
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("follow_ups")
    .update(updates)
    .eq("id", followUpId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFollowUp(followUpId: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("follow_ups")
    .delete()
    .eq("id", followUpId);
  if (error) throw error;
}

// ---- Site visits ----

export async function createSiteVisit(visit: SiteVisitInsert) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("site_visits")
    .insert(visit)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- App settings ----

export async function updateAppSettings(
  workspaceId: string,
  updates: AppSettingsUpdate,
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("app_settings")
    .update(updates)
    .eq("workspace_id", workspaceId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---- Workspace members ----

export async function inviteMember(
  workspaceId: string,
  userId: string,
  role: "member" | "viewer",
  invitedBy: string,
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .insert({ workspace_id: workspaceId, user_id: userId, role, invited_by: invitedBy })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  role: "member" | "viewer",
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeMember(workspaceId: string, userId: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId);
  if (error) throw error;
}
