# 25_SUPABASE_EDGE_FUNCTIONS.md

# Real Estate Decision Portal — Supabase Edge Functions

## 1. Purpose

This document defines the Supabase Edge Functions layer for the Real Estate Decision Portal.

Edge Functions are used for operations that should not run directly from the browser, especially operations that require:

* Service role access
* Cross-table orchestration
* Bulk import/export
* Backup generation
* Signed URL generation for sensitive exports
* Server-side validation
* Storage operations
* Future document extraction
* Future AI-assisted parsing

Edge Functions must never be used as a replacement for normal CRUD where Supabase PostgREST and RLS are sufficient.

---

## 2. Core Principle

The frontend should use Supabase directly for simple RLS-safe operations.

Use Edge Functions only when the operation requires backend control.

```text
Simple CRUD → Supabase client + RLS
Privileged / bulk / sensitive workflow → Edge Function
```

---

# 3. When to Use Edge Functions

| Use Edge Function                  | Use Supabase Directly              |
| ---------------------------------- | ---------------------------------- |
| Bulk import with validation        | Fetching projects                  |
| Full workspace export              | Fetching units                     |
| Project backup generation          | Updating project notes             |
| Storage write to exports/backups   | Creating follow-up task            |
| Server-side signed URL generation  | Reading documents metadata         |
| Parsing uploaded cost sheet        | Updating site visit checklist item |
| Multi-table transactional workflow | Adding a unit                      |
| Audit-heavy sensitive operation    | Editing cost input                 |
| AI/OCR document extraction         | Filtering dashboard rows           |

---

# 4. Edge Function Inventory

Required Version 1 functions:

| Function                  | Auth Required | Role Required     | Purpose                                                 |
| ------------------------- | ------------: | ----------------- | ------------------------------------------------------- |
| `health-check`            |            No | None              | Confirm Edge runtime is alive                           |
| `export-project-pack`     |           Yes | `owner`, `editor` | Export full workspace data                              |
| `import-project-pack`     |           Yes | `owner`, `editor` | Import validated Project Pack JSON                      |
| `create-project-backup`   |           Yes | `owner`, `editor` | Create backup for one project                           |
| `create-workspace-backup` |           Yes | `owner`, `editor` | Create full workspace backup                            |
| `get-secure-download-url` |           Yes | Workspace member  | Generate short-lived signed URL                         |
| `parse-cost-sheet`        |           Yes | `owner`, `editor` | Extract structured data from cost sheet for user review |

Future functions:

| Function                      | Auth Required | Role Required     | Purpose                                    |
| ----------------------------- | ------------: | ----------------- | ------------------------------------------ |
| `extract-document-fields`     |           Yes | `owner`, `editor` | Extract metadata from legal/RERA documents |
| `generate-site-visit-summary` |           Yes | `owner`, `editor` | Summarize site visit notes/checklist       |
| `rera-enrichment`             |           Yes | `owner`, `editor` | Fetch or parse RERA data                   |
| `market-benchmark-enrichment` |           Yes | `owner`, `editor` | Add area/rental benchmark data             |
| `notify-follow-up-due`        |        System | System            | Notify pending follow-ups                  |

---

# 5. Edge Function Folder Structure

```text
/supabase
  /functions
    /_shared
      cors.ts
      responses.ts
      supabaseAdmin.ts
      supabaseUser.ts
      auth.ts
      validation.ts
      storage.ts
      projectPack.ts
      errors.ts
      logger.ts
      types.ts

    /health-check
      index.ts

    /export-project-pack
      index.ts

    /import-project-pack
      index.ts

    /create-project-backup
      index.ts

    /create-workspace-backup
      index.ts

    /get-secure-download-url
      index.ts

    /parse-cost-sheet
      index.ts
```

---

# 6. Edge Function Environment Variables

Required Supabase function secrets:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
APP_ENV=local
APP_URL=http://localhost:3000
```

Optional future secrets:

```env
AI_EXTRACTION_API_KEY=
OCR_API_KEY=
NOTIFICATION_WEBHOOK_URL=
```

Rules:

```text
SUPABASE_SERVICE_ROLE_KEY must only be used inside Edge Functions, server routes, or trusted backend scripts.
Never expose it to browser/client-side code.
```

---

# 7. Supabase Function Configuration

Recommended function config:

```toml
# supabase/config.toml

[functions.health-check]
verify_jwt = false

[functions.export-project-pack]
verify_jwt = true

[functions.import-project-pack]
verify_jwt = true

[functions.create-project-backup]
verify_jwt = true

[functions.create-workspace-backup]
verify_jwt = true

[functions.get-secure-download-url]
verify_jwt = true

[functions.parse-cost-sheet]
verify_jwt = true
```

---

# 8. Shared Utilities

## 8.1 `_shared/cors.ts`

```typescript
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-workspace-id",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  return null;
}
```

---

## 8.2 `_shared/responses.ts`

```typescript
import { corsHeaders } from "./cors.ts";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "STORAGE_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export function jsonSuccess<T>(
  data: T,
  status = 200,
): Response {
  return new Response(
    JSON.stringify({
      data,
      error: null,
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}

export function jsonError(
  code: ApiErrorCode,
  message: string,
  status = 400,
  details?: unknown,
): Response {
  return new Response(
    JSON.stringify({
      data: null,
      error: {
        code,
        message,
        details: details ?? null,
      },
    }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}
```

---

## 8.3 `_shared/errors.ts`

```typescript
export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
```

---

## 8.4 `_shared/supabaseAdmin.ts`

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function getAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
```

---

## 8.5 `_shared/supabaseUser.ts`

```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function getUserClient(token: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing Supabase user environment variables.");
  }

  return createClient(
    supabaseUrl,
    anonKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
```

---

## 8.6 `_shared/auth.ts`

```typescript
import { getAdminClient } from "./supabaseAdmin.ts";
import { getUserClient } from "./supabaseUser.ts";
import { HttpError } from "./errors.ts";

export type WorkspaceRole = "owner" | "editor" | "viewer" | "advisor";

export type AuthContext = {
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
};

export async function parseJsonBody(req: Request): Promise<Record<string, unknown>> {
  try {
    return await req.clone().json();
  } catch {
    return {};
  }
}

export async function requireAuthContext(
  req: Request,
  allowedRoles?: WorkspaceRole[],
): Promise<AuthContext> {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    throw new HttpError(401, "UNAUTHORIZED", "Missing Authorization bearer token.");
  }

  const body = await parseJsonBody(req);
  const workspaceId =
    typeof body.workspace_id === "string"
      ? body.workspace_id
      : req.headers.get("x-workspace-id");

  if (!workspaceId) {
    throw new HttpError(400, "BAD_REQUEST", "workspace_id is required.");
  }

  const userClient = getUserClient(token);
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser(token);

  if (userError || !user) {
    throw new HttpError(401, "UNAUTHORIZED", "Invalid or expired token.");
  }

  const admin = getAdminClient();

  const { data: membership, error: membershipError } = await admin
    .from("workspace_members")
    .select("role,status")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (membershipError) {
    throw new HttpError(
      500,
      "DATABASE_ERROR",
      "Unable to verify workspace membership.",
      membershipError,
    );
  }

  if (!membership) {
    throw new HttpError(403, "FORBIDDEN", "User is not a member of this workspace.");
  }

  const role = membership.role as WorkspaceRole;

  if (allowedRoles && !allowedRoles.includes(role)) {
    throw new HttpError(
      403,
      "FORBIDDEN",
      `Role '${role}' is not allowed for this operation.`,
    );
  }

  return {
    userId: user.id,
    workspaceId,
    role,
  };
}
```

---

## 8.7 `_shared/validation.ts`

```typescript
import { HttpError } from "./errors.ts";

export function requireStringField(
  body: Record<string, unknown>,
  fieldName: string,
): string {
  const value = body[fieldName];

  if (typeof value !== "string" || value.trim() === "") {
    throw new HttpError(
      400,
      "BAD_REQUEST",
      `Missing or invalid required field: ${fieldName}`,
    );
  }

  return value;
}

export function requireUuidField(
  body: Record<string, unknown>,
  fieldName: string,
): string {
  const value = requireStringField(body, fieldName);
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(value)) {
    throw new HttpError(
      400,
      "BAD_REQUEST",
      `Invalid UUID field: ${fieldName}`,
    );
  }

  return value;
}
```

---

## 8.8 `_shared/storage.ts`

```typescript
import { getAdminClient } from "./supabaseAdmin.ts";
import { HttpError } from "./errors.ts";

export async function downloadStorageText(
  bucket: string,
  path: string,
): Promise<string> {
  const admin = getAdminClient();

  const { data, error } = await admin.storage
    .from(bucket)
    .download(path);

  if (error || !data) {
    throw new HttpError(
      404,
      "STORAGE_ERROR",
      "Unable to download storage object.",
      error,
    );
  }

  return await data.text();
}

export async function uploadStorageJson(input: {
  bucket: string;
  path: string;
  payload: unknown;
  upsert?: boolean;
}) {
  const admin = getAdminClient();
  const json = JSON.stringify(input.payload, null, 2);

  const { data, error } = await admin.storage
    .from(input.bucket)
    .upload(input.path, new Blob([json], { type: "application/json" }), {
      contentType: "application/json",
      upsert: input.upsert ?? false,
    });

  if (error) {
    throw new HttpError(
      500,
      "STORAGE_ERROR",
      "Unable to upload JSON file.",
      error,
    );
  }

  return data;
}

export async function createSignedUrl(input: {
  bucket: string;
  path: string;
  expiresInSeconds: number;
}) {
  const admin = getAdminClient();

  const { data, error } = await admin.storage
    .from(input.bucket)
    .createSignedUrl(input.path, input.expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new HttpError(
      500,
      "STORAGE_ERROR",
      "Unable to create signed URL.",
      error,
    );
  }

  return data.signedUrl;
}
```

---

## 8.9 `_shared/logger.ts`

```typescript
export function logInfo(message: string, metadata?: unknown) {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      metadata: metadata ?? null,
      timestamp: new Date().toISOString(),
    }),
  );
}

export function logError(message: string, metadata?: unknown) {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      metadata: metadata ?? null,
      timestamp: new Date().toISOString(),
    }),
  );
}
```

---

# 9. Standard Edge Function Error Handling

Every function should use consistent response format.

## 9.1 Success Response

```json
{
  "data": {
    "message": "Success"
  },
  "error": null
}
```

## 9.2 Error Response

```json
{
  "data": null,
  "error": {
    "code": "FORBIDDEN",
    "message": "User is not a member of this workspace.",
    "details": null
  }
}
```

## 9.3 HTTP Status Codes

| Status | Meaning                          |
| -----: | -------------------------------- |
|  `200` | Success                          |
|  `201` | Created                          |
|  `400` | Bad request / missing fields     |
|  `401` | Unauthenticated                  |
|  `403` | Authenticated but not authorized |
|  `404` | Resource not found               |
|  `409` | Conflict                         |
|  `422` | Validation failed                |
|  `500` | Internal server error            |

---

# 10. Function: `health-check`

## 10.1 Purpose

Confirms that the Edge Function runtime is working.

## 10.2 Auth

```text
None
```

`verify_jwt = false`

## 10.3 Path

```text
/supabase/functions/health-check/index.ts
```

## 10.4 Implementation

```typescript
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { jsonSuccess } from "../_shared/responses.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return jsonSuccess({
    status: "ok",
    service: "real-estate-decision-portal",
    timestamp: new Date().toISOString(),
  });
});
```

---

# 11. Function: `export-project-pack`

## 11.1 Purpose

Exports all workspace data into a Project Pack JSON file.

This is used for:

* Backup
* Migration
* Offline copy
* Portability
* Manual archival

## 11.2 Auth

```text
Required
```

Allowed roles:

```text
owner
editor
```

## 11.3 Request

```json
{
  "workspace_id": "uuid",
  "include_documents": true,
  "include_media": true
}
```

## 11.4 Response

```json
{
  "data": {
    "export_job_id": "uuid",
    "storage_bucket": "exports",
    "storage_path": "workspace/{workspace_id}/exports/{export_job_id}/project-pack-export.json",
    "signed_url": "https://...",
    "expires_at": "2026-06-15T10:30:00.000Z",
    "summary": {
      "builders": 3,
      "projects": 5,
      "units": 12,
      "documents": 34,
      "media_assets": 18,
      "follow_ups": 9,
      "payment_milestones": 24
    }
  },
  "error": null
}
```

## 11.5 Exported Tables

The export should include:

```text
builders
projects
units
space_details
cost_breakups
cost_components
statutory_charges
maintenance_possession_costs
post_possession_budgets
parking_details
parking_slots
legal_records
location_records
amenities
media_assets
documents
site_visits
checklist_items
follow_ups
payment_milestones
negotiations
decision_status_history
score_snapshots
quote_snapshots
app_settings
```

Exclude by default:

```text
audit_log
activity_log
import_jobs
export_jobs
backup_records
```

These can be included only if explicitly required later.

## 11.6 Logic

```text
1. Handle CORS.
2. Parse request body.
3. Verify authenticated user.
4. Verify user is owner/editor of workspace.
5. Create export_jobs row with status = processing.
6. Query all workspace data using service role.
7. Build Project Pack JSON with schema_version.
8. Upload JSON to exports bucket.
9. Create signed URL with short expiry.
10. Update export_jobs row with completed status.
11. Return storage path, signed URL, and summary.
```

## 11.7 Storage Path

```text
workspace/{workspace_id}/exports/{export_job_id}/project-pack-export-{timestamp}.json
```

---

# 12. Function: `import-project-pack`

## 12.1 Purpose

Imports a Project Pack JSON file into a workspace.

The import should be controlled and auditable.

## 12.2 Auth

```text
Required
```

Allowed roles:

```text
owner
editor
```

## 12.3 Request

```json
{
  "workspace_id": "uuid",
  "storage_bucket": "imports",
  "storage_path": "workspace/{workspace_id}/imports/{import_job_id}/project-pack-import.json",
  "mode": "validate_only"
}
```

Supported modes:

```text
validate_only
merge
replace
```

Recommended Version 1:

```text
validate_only
merge
```

Use `replace` only after adding strong confirmation UI.

## 12.4 Response

```json
{
  "data": {
    "import_job_id": "uuid",
    "mode": "validate_only",
    "validation_summary": {
      "valid": true,
      "warnings": [],
      "errors": []
    },
    "import_summary": {
      "builders": 0,
      "projects": 0,
      "units": 0,
      "documents": 0,
      "media_assets": 0
    }
  },
  "error": null
}
```

## 12.5 Logic

```text
1. Handle CORS.
2. Parse request body.
3. Verify authenticated user.
4. Verify user is owner/editor of workspace.
5. Create import_jobs row with status = processing.
6. Download JSON from imports bucket.
7. Parse JSON.
8. Validate schema_version.
9. Validate record shape.
10. Check all imported records target the authorized workspace.
11. If validate_only, return summary without writing records.
12. If merge, upsert allowed records.
13. Protect document_verified/legal_verified/manual_override data from overwrite unless explicitly confirmed.
14. Update import_jobs row with completed or failed status.
15. Return validation and import summary.
```

## 12.6 Important Rules

Import must not:

```text
Overwrite verified data silently.
Import into another workspace.
Trust workspace_id from file without checking request workspace.
Create storage objects automatically unless package contains supported references.
Bypass user confirmation for destructive replace.
```

---

# 13. Function: `create-project-backup`

## 13.1 Purpose

Creates a backup JSON file for one project and its related records.

## 13.2 Auth

```text
Required
```

Allowed roles:

```text
owner
editor
```

## 13.3 Request

```json
{
  "workspace_id": "uuid",
  "project_id": "uuid"
}
```

## 13.4 Response

```json
{
  "data": {
    "backup_record_id": "uuid",
    "storage_bucket": "backups",
    "storage_path": "workspace/{workspace_id}/backups/{backup_record_id}/project-{project_id}-backup.json",
    "signed_url": "https://...",
    "expires_at": "2026-06-15T10:30:00.000Z",
    "summary": {
      "projects": 1,
      "units": 3,
      "documents": 8,
      "media_assets": 12
    }
  },
  "error": null
}
```

## 13.5 Logic

```text
1. Verify auth and owner/editor role.
2. Verify project belongs to workspace.
3. Create backup_records row.
4. Query project and all dependent records.
5. Generate backup JSON.
6. Upload to backups bucket.
7. Generate short-lived signed URL.
8. Return backup metadata.
```

## 13.6 Included Data

```text
project
builder
units
space_details
cost_breakups
cost_components
statutory_charges
maintenance_possession_costs
post_possession_budgets
parking_details
parking_slots
legal_records
location_records
amenities
media_assets
documents
site_visits
checklist_items
follow_ups
payment_milestones
negotiations
decision_status_history
score_snapshots
quote_snapshots
```

---

# 14. Function: `create-workspace-backup`

## 14.1 Purpose

Creates a full backup of a workspace.

This is similar to export, but the intent is backup and recovery.

## 14.2 Auth

```text
Required
```

Allowed roles:

```text
owner
editor
```

## 14.3 Request

```json
{
  "workspace_id": "uuid"
}
```

## 14.4 Response

```json
{
  "data": {
    "backup_record_id": "uuid",
    "storage_bucket": "backups",
    "storage_path": "workspace/{workspace_id}/backups/{backup_record_id}/workspace-backup.json",
    "signed_url": "https://...",
    "expires_at": "2026-06-15T10:30:00.000Z",
    "summary": {
      "projects": 5,
      "units": 12,
      "documents": 34,
      "media_assets": 18
    }
  },
  "error": null
}
```

---

# 15. Function: `get-secure-download-url`

## 15.1 Purpose

Generates a signed URL for a private storage object.

Use this when the app needs stricter control over sensitive files.

The browser can also generate signed URLs directly if storage RLS allows it. However, this function is recommended for:

* Legal documents
* Full exports
* Backups
* Payment receipts
* Temporary controlled access

## 15.2 Auth

```text
Required
```

Allowed roles:

```text
owner
editor
viewer
advisor
```

## 15.3 Request

```json
{
  "workspace_id": "uuid",
  "storage_bucket": "legal-documents",
  "storage_path": "workspace/{workspace_id}/projects/{project_id}/documents/{document_id}/agreement.pdf",
  "expires_in_seconds": 900
}
```

## 15.4 Response

```json
{
  "data": {
    "signed_url": "https://...",
    "expires_at": "2026-06-15T10:30:00.000Z"
  },
  "error": null
}
```

## 15.5 Security Rules

The function must verify:

```text
User is an active workspace member.
storage_path starts with workspace/{workspace_id}/.
Bucket is allowed.
Expiry is within allowed max.
```

Recommended maximum expiry:

| Bucket              | Max Expiry |
| ------------------- | ---------: |
| `legal-documents`   | 15 minutes |
| `exports`           |  5 minutes |
| `backups`           |  5 minutes |
| `payment receipts`  | 30 minutes |
| `project-documents` |     1 hour |
| `media-assets`      |     1 hour |

---

# 16. Function: `parse-cost-sheet`

## 16.1 Purpose

Extracts structured cost data from an uploaded builder cost sheet.

This function must not automatically update cost fields in Version 1.

It should return extracted data for user review.

## 16.2 Auth

```text
Required
```

Allowed roles:

```text
owner
editor
```

## 16.3 Request

```json
{
  "workspace_id": "uuid",
  "project_id": "uuid",
  "unit_id": "uuid",
  "document_id": "uuid"
}
```

## 16.4 Response

```json
{
  "data": {
    "document_id": "uuid",
    "extraction_status": "completed",
    "requires_user_review": true,
    "extracted_fields": {
      "base_rate_per_sqft": 11500,
      "basic_flat_cost_amount": 18326994,
      "parking_amount": 750000,
      "club_membership_amount": 300000,
      "gst_percent": 5,
      "stamp_duty_percent": null,
      "registration_percent": null
    },
    "line_items": [
      {
        "component_name": "Basic Flat Cost",
        "amount": 18326994,
        "confidence": "medium"
      }
    ],
    "warnings": [
      "Registration charges not found in document."
    ]
  },
  "error": null
}
```

## 16.5 Logic

```text
1. Verify auth and owner/editor role.
2. Verify document belongs to workspace.
3. Verify document belongs to project/unit if provided.
4. Download file from storage.
5. Extract text if possible.
6. Apply heuristic parsing.
7. Return structured fields.
8. Store extraction result in documents.extracted_data.
9. Do not update cost_breakups or statutory_charges automatically.
```

## 16.6 Version 1 Extraction Scope

Extract if available:

```text
base rate per sqft
basic flat cost
floor rise
PLC
parking
clubhouse
amenities
infrastructure
BWSSB
BESCOM
power backup
EV charging
GST
stamp duty
registration
corpus
maintenance
legal charges
other charges
payment schedule
```

## 16.7 Important Rule

```text
AI/OCR/heuristic extraction is advisory only.
User must review and confirm before data enters financial calculations.
```

---

# 17. Project Pack Structure

Project Pack JSON should use this high-level shape:

```json
{
  "schema_version": "1.0.0",
  "exported_at": "2026-06-15T10:00:00.000Z",
  "workspace": {},
  "app_settings": {},
  "builders": [],
  "projects": [],
  "units": [],
  "space_details": [],
  "cost_breakups": [],
  "cost_components": [],
  "statutory_charges": [],
  "maintenance_possession_costs": [],
  "post_possession_budgets": [],
  "parking_details": [],
  "parking_slots": [],
  "legal_records": [],
  "location_records": [],
  "amenities": [],
  "media_assets": [],
  "documents": [],
  "site_visits": [],
  "checklist_items": [],
  "follow_ups": [],
  "payment_milestones": [],
  "negotiations": [],
  "decision_status_history": [],
  "score_snapshots": [],
  "quote_snapshots": []
}
```

Do not include service-role-only data by default:

```text
audit_log
activity_log
import_jobs
export_jobs
backup_records
```

---

# 18. Function Implementation Template

Every function should follow this structure.

```typescript
import { handleCors } from "../_shared/cors.ts";
import { jsonError, jsonSuccess } from "../_shared/responses.ts";
import { HttpError } from "../_shared/errors.ts";
import { requireAuthContext } from "../_shared/auth.ts";
import { logError, logInfo } from "../_shared/logger.ts";

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    if (req.method !== "POST") {
      throw new HttpError(405, "BAD_REQUEST", "Method not allowed.");
    }

    const auth = await requireAuthContext(req, ["owner", "editor"]);

    logInfo("Function started.", {
      userId: auth.userId,
      workspaceId: auth.workspaceId,
    });

    // Function-specific logic here.

    return jsonSuccess({
      message: "Completed successfully.",
    });
  } catch (error) {
    logError("Function failed.", error);

    if (error instanceof HttpError) {
      return jsonError(
        error.code as never,
        error.message,
        error.status,
        error.details,
      );
    }

    return jsonError(
      "INTERNAL_ERROR",
      "Unexpected server error.",
      500,
    );
  }
});
```

---

# 19. Transactions and Consistency

Supabase Edge Functions may orchestrate multiple operations.

Important workflows should be designed to avoid partial failure.

## 19.1 Recommended Strategy

For multi-step workflows:

```text
1. Create job row with status = processing.
2. Perform operations.
3. Update job row with completed or failed.
4. Store error_message on failure.
5. Return consistent response.
```

## 19.2 Import Consistency

Import should use:

```text
validate_only first
then merge after user confirmation
```

If full transactional integrity is required later, create a Postgres RPC function and call it from the Edge Function.

---

# 20. Security Rules

## 20.1 Service Role Usage

Service role may be used only after:

```text
User JWT is verified.
Workspace membership is verified.
Role is verified.
Operation input is validated.
```

## 20.2 Forbidden Practices

Do not:

```text
Use service role before checking user access.
Trust workspace_id from uploaded JSON.
Return service role errors directly to user.
Expose service role key.
Create permanent public URLs.
Auto-save AI extraction results into financial tables.
Allow import into unauthorized workspace.
Allow outsider storage path access.
```

---

# 21. Deployment Commands

## 21.1 Local Serve

```bash
supabase functions serve health-check --no-verify-jwt
supabase functions serve export-project-pack
supabase functions serve import-project-pack
supabase functions serve create-project-backup
supabase functions serve create-workspace-backup
supabase functions serve get-secure-download-url
supabase functions serve parse-cost-sheet
```

## 21.2 Deploy

```bash
supabase functions deploy health-check --no-verify-jwt
supabase functions deploy export-project-pack
supabase functions deploy import-project-pack
supabase functions deploy create-project-backup
supabase functions deploy create-workspace-backup
supabase functions deploy get-secure-download-url
supabase functions deploy parse-cost-sheet
```

## 21.3 Set Secrets

```bash
supabase secrets set SUPABASE_URL=...
supabase secrets set SUPABASE_ANON_KEY=...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set APP_ENV=production
supabase secrets set APP_URL=https://your-app-domain.com
```

---

# 22. Frontend Invocation Pattern

File:

```text
/src/lib/supabase/functions.ts
```

```typescript
import { createBrowserClient } from "@supabase/ssr";

export async function callEdgeFunction<TRequest, TResponse>(
  functionName: string,
  body: TRequest,
): Promise<TResponse> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
  });

  if (error) {
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error.message);
  }

  return data.data as TResponse;
}
```

Example:

```typescript
const result = await callEdgeFunction<
  { workspace_id: string },
  { signed_url: string; storage_path: string }
>("export-project-pack", {
  workspace_id: workspaceId,
});
```

---

# 23. Edge Function QA Checklist

## 23.1 General QA

Check:

```text
CORS works.
OPTIONS request returns 200.
Unauthorized request returns 401.
Outsider workspace request returns 403.
Viewer restricted operation returns 403.
Owner/editor operation succeeds.
Errors follow standard shape.
Service role key is not exposed.
```

---

## 23.2 Export QA

Check:

```text
Export creates export_jobs row.
Export includes all required tables.
Export includes documents metadata.
Export includes media_assets metadata.
Export excludes audit_log by default.
Export file is written to exports bucket.
Signed URL works.
Signed URL expires.
```

---

## 23.3 Import QA

Check:

```text
Invalid JSON fails safely.
Wrong schema_version returns validation error.
Outsider cannot import into workspace.
validate_only does not write records.
merge writes expected records.
Verified data is not silently overwritten.
Import job status updates correctly.
```

---

## 23.4 Backup QA

Check:

```text
Project backup includes project-related records.
Workspace backup includes all workspace records.
Backup file is written to backups bucket.
Signed URL expiry is short.
Backup record is created.
```

---

## 23.5 Parse Cost Sheet QA

Check:

```text
Only owner/editor can run.
Document must belong to workspace.
Extraction does not auto-save into cost tables.
Extraction result is stored in documents.extracted_data.
Warnings appear for missing fields.
User review is required.
```

---

# 24. Edge Function Acceptance Criteria

Edge Function layer is ready when:

1. Shared utilities exist.
2. CORS works.
3. Auth context verifies user and workspace role.
4. Service role is used only after authorization.
5. Health check works.
6. Export Project Pack works.
7. Import Project Pack supports validate-only.
8. Import Project Pack supports merge.
9. Project backup works.
10. Workspace backup works.
11. Secure signed URL generation works.
12. Parse cost sheet returns reviewable structured data.
13. Functions return consistent response format.
14. Job rows track processing/completed/failed status.
15. Storage paths follow workspace convention.
16. Outsiders cannot invoke workspace operations.
17. Viewers cannot invoke owner/editor functions.
18. Service role key is never exposed to frontend.
19. Edge Function QA passes.

---

# 25. Final Edge Function Principle

Edge Functions should protect sensitive operations.

They should not replace normal RLS-safe CRUD.

Use them when the app needs:

```text
authority
validation
orchestration
auditability
controlled storage access
bulk processing
```

Every Edge Function must follow this sequence:

```text
Authenticate user.
Validate workspace access.
Validate role.
Validate inputs.
Perform privileged operation.
Record job/audit state.
Return safe response.
```

The Edge layer is the trusted backend execution layer for the real estate decision cockpit.
