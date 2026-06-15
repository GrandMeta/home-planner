// export-project-pack Edge Function
// Exports all workspace data as a structured JSON bundle, uploads to storage,
// and returns a signed download URL.

import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";
import { getAdminClient } from "../_shared/supabaseAdmin.ts";
import { parseBody, validateRequiredFields } from "../_shared/validation.ts";

const EXPORT_SCHEMA_VERSION = "1.0.0";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Parse body
  const body = await parseBody(req);
  if (!body) return errorResponse("Invalid JSON body", "BAD_REQUEST", 400);

  const validationError = validateRequiredFields(body, ["workspace_id"]);
  if (validationError) return errorResponse(validationError, "BAD_REQUEST", 400);

  // Auth check
  let ctx;
  try {
    ctx = await requireAuth(req, body);
  } catch (res) {
    return res as Response;
  }

  const admin = getAdminClient();
  const { workspaceId } = ctx;

  try {
    // Fetch all workspace data in parallel
    const [
      { data: workspace },
      { data: builders },
      { data: projects },
      { data: units },
      { data: siteVisits },
      { data: followUps },
      { data: documents },
      { data: paymentMilestones },
    ] = await Promise.all([
      admin.from("workspaces").select("*").eq("id", workspaceId).single(),
      admin.from("builders").select("*").eq("workspace_id", workspaceId),
      admin.from("projects").select("*").eq("workspace_id", workspaceId),
      admin.from("units").select("*").eq("workspace_id", workspaceId),
      admin.from("site_visits").select("*").eq("workspace_id", workspaceId),
      admin.from("follow_ups").select("*").eq("workspace_id", workspaceId),
      admin.from("documents").select("*").eq("workspace_id", workspaceId),
      admin.from("payment_milestones").select("*").eq("workspace_id", workspaceId),
    ]);

    // Build export bundle
    const exportBundle = {
      schema_version: EXPORT_SCHEMA_VERSION,
      exported_at: new Date().toISOString(),
      workspace_id: workspaceId,
      workspace_name: workspace?.name ?? "Unknown",
      data: {
        builders: builders ?? [],
        projects: projects ?? [],
        units: units ?? [],
        site_visits: siteVisits ?? [],
        follow_ups: followUps ?? [],
        documents: documents ?? [],
        payment_milestones: paymentMilestones ?? [],
      },
      summary: {
        builders: builders?.length ?? 0,
        projects: projects?.length ?? 0,
        units: units?.length ?? 0,
        site_visits: siteVisits?.length ?? 0,
        follow_ups: followUps?.length ?? 0,
        documents: documents?.length ?? 0,
        payment_milestones: paymentMilestones?.length ?? 0,
      },
    };

    const json = JSON.stringify(exportBundle, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const storagePath = `${workspaceId}/export-${timestamp}.json`;

    // Upload to exports bucket
    const { error: uploadError } = await admin.storage
      .from("exports")
      .upload(storagePath, new TextEncoder().encode(json), {
        contentType: "application/json",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Create signed URL (valid 1 hour)
    const { data: signedData, error: signError } = await admin.storage
      .from("exports")
      .createSignedUrl(storagePath, 3600);

    if (signError) throw signError;

    // Record export job
    await admin.from("export_jobs").insert({
      workspace_id: workspaceId,
      status: "completed",
      storage_path: storagePath,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      created_by: ctx.userId,
    });

    return jsonResponse({
      storage_path: storagePath,
      signed_url: signedData.signedUrl,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
      summary: exportBundle.summary,
    });
  } catch (err) {
    console.error("export-project-pack error:", err);
    return errorResponse(
      "Export failed: " + (err instanceof Error ? err.message : String(err)),
      "INTERNAL_ERROR",
      500,
    );
  }
});
