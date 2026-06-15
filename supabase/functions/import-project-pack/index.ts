// import-project-pack Edge Function
// Reads a JSON bundle from the imports bucket and upserts its contents
// into the workspace's tables.

import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { requireWriteAccess } from "../_shared/auth.ts";
import { getAdminClient } from "../_shared/supabaseAdmin.ts";
import { parseBody, validateRequiredFields, isValidUUID } from "../_shared/validation.ts";

const SUPPORTED_SCHEMA_VERSIONS = ["1.0.0"];

interface ExportBundle {
  schema_version: string;
  workspace_id: string;
  data: {
    builders: Record<string, unknown>[];
    projects: Record<string, unknown>[];
    units: Record<string, unknown>[];
    site_visits: Record<string, unknown>[];
    follow_ups: Record<string, unknown>[];
    documents: Record<string, unknown>[];
    payment_milestones: Record<string, unknown>[];
  };
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const body = await parseBody(req);
  if (!body) return errorResponse("Invalid JSON body", "BAD_REQUEST", 400);

  const validationError = validateRequiredFields(body, ["workspace_id", "storage_path"]);
  if (validationError) return errorResponse(validationError, "BAD_REQUEST", 400);

  let ctx;
  try {
    ctx = await requireWriteAccess(req, body);
  } catch (res) {
    return res as Response;
  }

  const admin = getAdminClient();
  const { workspaceId } = ctx;
  const storagePath = body.storage_path as string;

  try {
    // Download the import file from storage
    const { data: fileData, error: downloadError } = await admin.storage
      .from("imports")
      .download(storagePath);

    if (downloadError || !fileData) {
      return errorResponse("Could not download import file: " + downloadError?.message, "NOT_FOUND", 404);
    }

    const text = await fileData.text();
    let bundle: ExportBundle;
    try {
      bundle = JSON.parse(text);
    } catch {
      return errorResponse("Import file is not valid JSON", "BAD_REQUEST", 400);
    }

    // Validate schema version
    if (!SUPPORTED_SCHEMA_VERSIONS.includes(bundle.schema_version)) {
      return errorResponse(
        `Unsupported schema version: ${bundle.schema_version}. Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(", ")}`,
        "UNSUPPORTED_VERSION",
        400,
      );
    }

    // Record import job start
    const { data: jobRow } = await admin.from("import_jobs").insert({
      workspace_id: workspaceId,
      status: "running",
      storage_path: storagePath,
      started_at: new Date().toISOString(),
      created_by: ctx.userId,
    }).select("id").single();

    const counts: Record<string, number> = {};

    // Upsert each table. Override workspace_id with the current one to prevent
    // cross-workspace injection.
    const tables: Array<{ key: keyof ExportBundle["data"]; table: string }> = [
      { key: "builders", table: "builders" },
      { key: "projects", table: "projects" },
      { key: "units", table: "units" },
      { key: "site_visits", table: "site_visits" },
      { key: "follow_ups", table: "follow_ups" },
      { key: "documents", table: "documents" },
      { key: "payment_milestones", table: "payment_milestones" },
    ];

    for (const { key, table } of tables) {
      const rows = bundle.data[key] ?? [];
      if (rows.length === 0) { counts[table] = 0; continue; }

      // Override workspace_id on every row
      const sanitized = rows.map((row) => ({
        ...row,
        workspace_id: workspaceId,
        created_by: ctx.userId,
      }));

      const { error } = await admin.from(table).upsert(sanitized, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      if (error) {
        console.error(`Error upserting ${table}:`, error.message);
        // Continue with other tables; report partial success
        counts[table] = -1;
      } else {
        counts[table] = rows.length;
      }
    }

    // Update job record
    if (jobRow?.id) {
      await admin.from("import_jobs").update({
        status: "completed",
        completed_at: new Date().toISOString(),
        records_inserted: Object.values(counts).filter(v => v > 0).reduce((a, b) => a + b, 0),
      }).eq("id", jobRow.id);
    }

    return jsonResponse({ imported: counts, workspace_id: workspaceId });
  } catch (err) {
    console.error("import-project-pack error:", err);
    return errorResponse(
      "Import failed: " + (err instanceof Error ? err.message : String(err)),
      "INTERNAL_ERROR",
      500,
    );
  }
});
