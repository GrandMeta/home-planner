// Shared types and helpers for Supabase integration

import type { Database } from "@/types/database.types";

// Convenience re-exports of row types
export type Tables = Database["public"]["Tables"];

export type ProfileRow = Tables["profiles"]["Row"];
export type WorkspaceRow = Tables["workspaces"]["Row"];
export type WorkspaceMemberRow = Tables["workspace_members"]["Row"];
export type AppSettingsRow = Tables["app_settings"]["Row"];
export type ProjectRow = Tables["projects"]["Row"];
export type UnitRow = Tables["units"]["Row"];
export type BuilderRow = Tables["builders"]["Row"];
export type FollowUpRow = Tables["follow_ups"]["Row"];
export type SiteVisitRow = Tables["site_visits"]["Row"];
export type DocumentRow = Tables["documents"]["Row"];
export type PaymentMilestoneRow = Tables["payment_milestones"]["Row"];
export type AmenityRow = Tables["amenities"]["Row"];
export type ProjectImageRow = Tables["project_images"]["Row"];
export type ProjectVideoRow = Tables["project_videos"]["Row"];
export type SpaceDetailsRow = Tables["space_details"]["Row"];
export type CostBreakupRow = Tables["cost_breakups"]["Row"];
export type StatutoryChargesRow = Tables["statutory_charges"]["Row"];
export type ParkingDetailsRow = Tables["parking_details"]["Row"];

// Insert types
export type ProjectInsert = Tables["projects"]["Insert"];
export type UnitInsert = Tables["units"]["Insert"];
export type BuilderInsert = Tables["builders"]["Insert"];
export type FollowUpInsert = Tables["follow_ups"]["Insert"];
export type SiteVisitInsert = Tables["site_visits"]["Insert"];
export type DocumentInsert = Tables["documents"]["Insert"];

// Enums (as TypeScript types from the DB)
export type DbProjectStatus = Database["public"]["Enums"]["project_status"];
export type DbProjectPurpose = Database["public"]["Enums"]["project_purpose"];
export type DbBhkConfig = Database["public"]["Enums"]["bhk_config"];
export type DbReraStatus = Database["public"]["Enums"]["rera_status"];
export type DbRiskLevel = Database["public"]["Enums"]["risk_level"];
export type DbWorkspaceRole = Database["public"]["Enums"]["workspace_role"];
export type DbFollowupStatus = Database["public"]["Enums"]["followup_status"];
export type DbFollowupPriority = Database["public"]["Enums"]["followup_priority"];
export type DbPaymentMilestoneStatus = Database["public"]["Enums"]["payment_milestone_status"];
export type DbDocumentAssetType = Database["public"]["Enums"]["document_asset_type"];
export type DbImageCategory = Database["public"]["Enums"]["image_category"];
export type DbVideoType = Database["public"]["Enums"]["video_type"];

// ---- Supabase error handling helper ----
export function getSupabaseErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";
  if (typeof error === "object" && error !== null) {
    const e = error as { message?: string; details?: string; code?: string };
    if (e.message) return e.message;
    if (e.details) return e.details;
  }
  return String(error);
}
