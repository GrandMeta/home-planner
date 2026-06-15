// parse-cost-sheet Edge Function
// Downloads a cost sheet file from storage and attempts to extract
// structured cost data via text parsing heuristics.
// Returns parsed data for user review — does NOT auto-save to the database.

import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { requireAuth } from "../_shared/auth.ts";
import { getAdminClient } from "../_shared/supabaseAdmin.ts";
import { parseBody, validateRequiredFields } from "../_shared/validation.ts";

interface ParsedCostData {
  bsp_per_sqft?: number;
  floor_rise_per_sqft?: number;
  plc_amount?: number;
  club_membership?: number;
  infra_development_charge?: number;
  power_backup_charge?: number;
  gst_percentage?: number;
  stamp_duty_percentage?: number;
  registration_percentage?: number;
  total_quoted?: number;
  confidence: "high" | "medium" | "low";
  raw_lines: string[];
  parse_warnings: string[];
}

/**
 * Simple heuristic parser for common cost sheet text formats.
 * Looks for INR amounts next to known keywords.
 */
function parseCostSheetText(text: string): ParsedCostData {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const result: ParsedCostData = {
    confidence: "low",
    raw_lines: lines.slice(0, 50), // first 50 lines for debugging
    parse_warnings: [],
  };

  const matchINR = (pattern: RegExp, line: string): number | undefined => {
    const match = line.match(pattern);
    if (match) {
      const numStr = match[1].replace(/[,\s]/g, "");
      const num = parseFloat(numStr);
      return isNaN(num) ? undefined : num;
    }
    return undefined;
  };

  let fieldsFound = 0;

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (/basic\s*(selling\s*)?price|bsp/.test(lower)) {
      const v = matchINR(/[\₹Rs\.]?\s*([\d,]+(?:\.\d+)?)\s*(?:\/sq\.?ft?|psf)?/i, line);
      if (v && v < 50000) { result.bsp_per_sqft = v; fieldsFound++; }
      else if (v) { result.total_quoted = v; fieldsFound++; }
    }

    if (/floor\s*rise|floor\s*prem/.test(lower)) {
      const v = matchINR(/[\₹Rs\.]?\s*([\d,]+(?:\.\d+)?)/i, line);
      if (v) { result.floor_rise_per_sqft = v; fieldsFound++; }
    }

    if (/plc|preferential\s*loc/.test(lower)) {
      const v = matchINR(/[\₹Rs\.]?\s*([\d,]+(?:\.\d+)?)/i, line);
      if (v) { result.plc_amount = v; fieldsFound++; }
    }

    if (/club|amenity/.test(lower) && !/corpus|maintenance/.test(lower)) {
      const v = matchINR(/[\₹Rs\.]?\s*([\d,]+(?:\.\d+)?)/i, line);
      if (v) { result.club_membership = v; fieldsFound++; }
    }

    if (/infra|idc|development\s*charge/.test(lower)) {
      const v = matchINR(/[\₹Rs\.]?\s*([\d,]+(?:\.\d+)?)/i, line);
      if (v) { result.infra_development_charge = v; fieldsFound++; }
    }

    if (/power\s*backup|dg\s*charge/.test(lower)) {
      const v = matchINR(/[\₹Rs\.]?\s*([\d,]+(?:\.\d+)?)/i, line);
      if (v) { result.power_backup_charge = v; fieldsFound++; }
    }

    if (/gst/.test(lower)) {
      const v = matchINR(/([\d.]+)\s*%/, line);
      if (v && v <= 18) { result.gst_percentage = v; fieldsFound++; }
    }

    if (/stamp\s*duty/.test(lower)) {
      const v = matchINR(/([\d.]+)\s*%/, line);
      if (v && v <= 10) { result.stamp_duty_percentage = v; fieldsFound++; }
    }

    if (/registration/.test(lower)) {
      const v = matchINR(/([\d.]+)\s*%/, line);
      if (v && v <= 5) { result.registration_percentage = v; fieldsFound++; }
    }
  }

  result.confidence = fieldsFound >= 5 ? "high" : fieldsFound >= 2 ? "medium" : "low";

  if (fieldsFound === 0) {
    result.parse_warnings.push(
      "No recognizable cost fields found. The document may be image-only or use a non-standard format.",
    );
  }

  return result;
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
    ctx = await requireAuth(req, body);
  } catch (res) {
    return res as Response;
  }

  const admin = getAdminClient();
  const storagePath = body.storage_path as string;

  try {
    const { data: fileData, error: downloadError } = await admin.storage
      .from("cost-sheets")
      .download(storagePath);

    if (downloadError || !fileData) {
      return errorResponse("Could not download cost sheet: " + downloadError?.message, "NOT_FOUND", 404);
    }

    const text = await fileData.text();
    const parsed = parseCostSheetText(text);

    return jsonResponse({
      parsed,
      storage_path: storagePath,
      note: "Review the parsed values below before saving. None of this has been saved to the database.",
    });
  } catch (err) {
    console.error("parse-cost-sheet error:", err);
    return errorResponse(
      "Parse failed: " + (err instanceof Error ? err.message : String(err)),
      "INTERNAL_ERROR",
      500,
    );
  }
});

// Import parseBody for use in the handler
async function parseBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text();
    if (!text) return {};
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}
