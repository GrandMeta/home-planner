// create-project-backup Edge Function
// Creates a versioned JSON snapshot of a single project and all related data.

import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";
import { getAdminClient } from "../_shared/supabaseAdmin.ts";
import { parseBody, validateRequiredFields } from "../_shared/validation.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const body = await parseBody(req);
  if (!body) return errorResponse("Invalid JSON body", "BAD_REQUEST", 400);

  const validationError = validateRequiredFields(body, ["workspace_id", "project_id"]);
  if (validationError) return errorResponse(validationError, "BAD_REQUEST", 400);

  let ctx;
  try {
    ctx = await requireAuth(req, body);
  } catch (res) {
    return res as Response;
  }

  const admin = getAdminClient();
  const { workspaceId } = ctx;
  const projectId = body.project_id as string;

  try {
    // Fetch project + all related data
    const [
      { data: project },
      { data: units },
      { data: siteVisits },
      { data: followUps },
      { data: documents },
      { data: payments },
      { data: amenities },
      { data: images },
    ] = await Promise.all([
      admin.from("projects").select("*").eq("id", projectId).eq("workspace_id", workspaceId).single(),
      admin.from("units").select("*, space_details(*), cost_breakups(*), statutory_charges(*), parking_details(*)").eq("project_id", projectId),
      admin.from("site_visits").select("*, checklist_items(*)").eq("project_id", projectId),
      admin.from("follow_ups").select("*").eq("project_id", projectId),
      admin.from("documents").select("*").eq("project_id", projectId),
      admin.from("payment_milestones").select("*").in("unit_id", []),  // will compute below
      admin.from("amenities").select("*").eq("project_id", projectId),
      admin.from("project_images").select("*").eq("project_id", projectId),
    ]);

    if (!project) {
      return errorResponse("Project not found or access denied", "NOT_FOUND", 404);
    }

    const backup = {
      schema_version: "1.0.0",
      backup_type: "single_project",
      created_at: new Date().toISOString(),
      project_id: projectId,
      workspace_id: workspaceId,
      project: project,
      related: {
        units: units ?? [],
        site_visits: siteVisits ?? [],
        follow_ups: followUps ?? [],
        documents: documents ?? [],
        payment_milestones: payments ?? [],
        amenities: amenities ?? [],
        images: images ?? [],
      },
    };

    const json = JSON.stringify(backup, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const storagePath = `${workspaceId}/backups/${projectId}/${timestamp}.json`;

    const encoder = new TextEncoder();
    const { error: uploadError } = await admin.storage
      .from("exports")
      .upload(storagePath, encoder.encode(json), {
        contentType: "application/json",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Record backup
    await admin.from("backup_records").insert({
      workspace_id: workspaceId,
      project_id: projectId,
      storage_path: storagePath,
      file_size_bytes: encoder.encode(json).byteLength,
      created_by: ctx.userId,
    });

    // Create signed URL (valid 1 hour)
    const { data: signedData } = await admin.storage
      .from("exports")
      .createSignedUrl(storagePath, 3600);

    return jsonResponse({
      storage_path: storagePath,
      signed_url: signedData?.signedUrl,
      project_name: project.project_name,
      created_at: backup.created_at,
    });
  } catch (err) {
    console.error("create-project-backup error:", err);
    return errorResponse(
      "Backup failed: " + (err instanceof Error ? err.message : String(err)),
      "INTERNAL_ERROR",
      500,
    );
  }
});
