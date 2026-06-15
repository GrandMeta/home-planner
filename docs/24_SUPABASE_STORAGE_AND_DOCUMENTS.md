# 24_SUPABASE_STORAGE_AND_DOCUMENTS.md

# Real Estate Decision Portal — Supabase Storage and Documents

## 1. Purpose

This document defines the Supabase Storage architecture for the Real Estate Decision Portal.

The portal will store or reference sensitive real estate files, including:

* Builder brochures
* Floor plans
* Master plans
* Cost sheets
* RERA certificates
* Legal documents
* Agreement drafts
* Payment receipts
* Site visit photos
* Site visit videos
* Project gallery images
* Builder logos
* Project logos
* Export backups
* Import packages

All files must be protected by workspace-level access rules.

No uploaded file should be publicly accessible by default.

---

## 2. Storage Architecture Decision

Supabase Storage will be used for binary file storage.

Supabase Postgres will store metadata.

The frontend should never rely only on a storage object existing. Every important uploaded file should also have a matching metadata row in one of these tables:

```text
documents
media_assets
import_jobs
export_jobs
backup_records
```

Storage is for file bytes.

Postgres is for:

* File identity
* Workspace ownership
* Project/unit/site visit link
* Review status
* Verification status
* Source and confidence
* Document category
* Media category
* Signed URL generation context
* Auditability

---

# 3. Storage Buckets

All buckets must be private.

No public buckets in Version 1.

| Bucket                | Purpose                                                            | Uploaded By             |
| --------------------- | ------------------------------------------------------------------ | ----------------------- |
| `project-documents`   | Brochures, master plans, general project PDFs                      | Owners/editors          |
| `site-visit-evidence` | Site visit photos/videos                                           | Owners/editors          |
| `cost-sheets`         | Builder cost sheets, quote screenshots, price PDFs                 | Owners/editors          |
| `legal-documents`     | RERA certificates, title docs, agreement drafts                    | Owners/editors          |
| `media-assets`        | Hero images, galleries, floor plans, logos, walkthrough thumbnails | Owners/editors          |
| `imports`             | JSON/ZIP import packages                                           | Owners/editors          |
| `exports`             | Generated exports and reports                                      | Edge Functions / server |
| `backups`             | Full Project Pack backups                                          | Edge Functions / server |

---

# 4. Bucket Configuration

Migration file:

```text
/supabase/migrations/0006_storage_buckets_and_policies.sql
```

## 4.1 Create Private Buckets

```sql
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values
  (
    'project-documents',
    'project-documents',
    false,
    52428800,
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  ),
  (
    'site-visit-evidence',
    'site-visit-evidence',
    false,
    104857600,
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
      'video/quicktime'
    ]
  ),
  (
    'cost-sheets',
    'cost-sheets',
    false,
    52428800,
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  ),
  (
    'legal-documents',
    'legal-documents',
    false,
    52428800,
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  ),
  (
    'media-assets',
    'media-assets',
    false,
    52428800,
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/quicktime'
    ]
  ),
  (
    'imports',
    'imports',
    false,
    52428800,
    array[
      'application/json',
      'application/zip'
    ]
  ),
  (
    'exports',
    'exports',
    false,
    104857600,
    array[
      'application/json',
      'application/zip',
      'application/pdf',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  ),
  (
    'backups',
    'backups',
    false,
    104857600,
    array[
      'application/json',
      'application/zip'
    ]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
```

---

## 4.2 File Size Guidance

| Bucket                | Recommended Max Size | Notes                                    |
| --------------------- | -------------------: | ---------------------------------------- |
| `project-documents`   |                50 MB | Brochures, master plans, general PDFs    |
| `site-visit-evidence` |               100 MB | Site videos can be larger                |
| `cost-sheets`         |                50 MB | PDFs/screenshots                         |
| `legal-documents`     |                50 MB | Legal PDFs/images                        |
| `media-assets`        |                50 MB | Images, floor plans, logos, short videos |
| `imports`             |                50 MB | JSON or ZIP import packages              |
| `exports`             |               100 MB | Full export bundles                      |
| `backups`             |               100 MB | Full workspace backups                   |

The frontend should validate file size before upload and show user-friendly errors.

---

# 5. Storage Path Convention

All storage object paths must include the workspace ID.

Use this convention:

```text
workspace/{workspace_id}/{resource_group}/{resource_id}/{file_context}/{filename}
```

This makes storage RLS predictable.

---

## 5.1 Project Documents

```text
workspace/{workspace_id}/projects/{project_id}/documents/{document_id}/{filename}
```

Example:

```text
workspace/9a2f.../projects/3d91.../documents/77aa.../brochure-v2.pdf
```

---

## 5.2 Unit Documents

```text
workspace/{workspace_id}/projects/{project_id}/units/{unit_id}/documents/{document_id}/{filename}
```

Example:

```text
workspace/9a2f.../projects/3d91.../units/441c.../documents/bb62.../cost-sheet.pdf
```

---

## 5.3 Site Visit Evidence

```text
workspace/{workspace_id}/site-visits/{site_visit_id}/evidence/{document_id_or_media_asset_id}/{filename}
```

Example:

```text
workspace/9a2f.../site-visits/557e.../evidence/913a.../parking-basement-photo.jpg
```

---

## 5.4 Media Assets

```text
workspace/{workspace_id}/projects/{project_id}/media/{media_asset_id}/{filename}
```

Example:

```text
workspace/9a2f.../projects/3d91.../media/8aac.../hero-image.webp
```

---

## 5.5 Builder Logos

```text
workspace/{workspace_id}/builders/{builder_id}/logos/{media_asset_id}/{filename}
```

Example:

```text
workspace/9a2f.../builders/5c70.../logos/2df4.../dsr-logo.svg
```

---

## 5.6 Imports

```text
workspace/{workspace_id}/imports/{import_job_id}/{filename}
```

Example:

```text
workspace/9a2f.../imports/08df.../project-pack-import.json
```

---

## 5.7 Exports

```text
workspace/{workspace_id}/exports/{export_job_id}/{filename}
```

Example:

```text
workspace/9a2f.../exports/7bd1.../project-pack-export.json
```

---

## 5.8 Backups

```text
workspace/{workspace_id}/backups/{backup_record_id}/{filename}
```

Example:

```text
workspace/9a2f.../backups/ba72.../full-backup-2026-06-15.json
```

---

# 6. Storage Path Rules

## 6.1 Required Rules

1. Every object path must start with `workspace/`.
2. The second folder segment must be the `workspace_id`.
3. File names must be sanitized.
4. File paths should include the related record ID.
5. Do not upload files directly to bucket root.
6. Do not use user email or phone number in file path.
7. Do not use raw builder/project names as the primary security boundary.
8. Use UUIDs in paths for security and consistency.
9. Store the final path in Postgres metadata tables.
10. Never make private real estate documents public.

---

## 6.2 Sanitized Filename Rule

The frontend should sanitize names before upload.

Example:

```text
Original: DSR Courtyard Cost Sheet (Final) - 3BHK.pdf
Sanitized: dsr-courtyard-cost-sheet-final-3bhk.pdf
```

Recommended filename function:

```text
lowercase
replace spaces with hyphens
remove unsafe symbols
preserve extension
limit length
```

---

# 7. Storage RLS Helper

The object path convention is:

```text
workspace/{workspace_id}/...
```

Therefore, the workspace ID is the second folder segment.

Create helper function:

```sql
create or replace function public.storage_object_workspace_id(object_name text)
returns uuid
language plpgsql
stable
security definer
set search_path = public, storage
as $$
declare
  parts text[];
  workspace_text text;
begin
  parts := storage.foldername(object_name);

  if array_length(parts, 1) < 2 then
    return null;
  end if;

  if parts[1] <> 'workspace' then
    return null;
  end if;

  workspace_text := parts[2];

  begin
    return workspace_text::uuid;
  exception when others then
    return null;
  end;
end;
$$;
```

Grant execute:

```sql
revoke all on function public.storage_object_workspace_id(text) from public;
grant execute on function public.storage_object_workspace_id(text) to authenticated;
```

---

# 8. Storage RLS Policies

Policies are applied on:

```sql
storage.objects
```

Important:

The policy must check both:

```text
bucket_id
+
workspace membership from path
```

---

## 8.1 Enable RLS on Storage Objects

Supabase Storage uses RLS policies on `storage.objects`.

```sql
alter table storage.objects enable row level security;
```

---

## 8.2 Workspace Members Can Download

All active workspace members can read files from private buckets if the file path belongs to their workspace.

```sql
create policy "workspace members can download workspace files"
on storage.objects
for select
to authenticated
using (
  bucket_id in (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'media-assets',
    'imports',
    'exports',
    'backups'
  )
  and public.is_workspace_member(
    public.storage_object_workspace_id(name)
  )
);
```

---

## 8.3 Owners and Editors Can Upload User Files

Owners and editors can upload files to user-managed buckets.

```sql
create policy "owners and editors can upload workspace files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'media-assets',
    'imports'
  )
  and public.can_edit_workspace(
    public.storage_object_workspace_id(name)
  )
);
```

---

## 8.4 Owners and Editors Can Update User Files

This allows metadata updates or replacement workflows when explicitly used.

```sql
create policy "owners and editors can update workspace files"
on storage.objects
for update
to authenticated
using (
  bucket_id in (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'media-assets',
    'imports'
  )
  and public.can_edit_workspace(
    public.storage_object_workspace_id(name)
  )
)
with check (
  bucket_id in (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'media-assets',
    'imports'
  )
  and public.can_edit_workspace(
    public.storage_object_workspace_id(name)
  )
);
```

---

## 8.5 Owners Can Delete Files

Only owners can delete storage objects.

This is stricter than normal editing because deleting files can destroy evidence.

```sql
create policy "owners can delete workspace files"
on storage.objects
for delete
to authenticated
using (
  bucket_id in (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'media-assets',
    'imports',
    'exports',
    'backups'
  )
  and public.is_workspace_owner(
    public.storage_object_workspace_id(name)
  )
);
```

---

## 8.6 Service Role Buckets

These buckets should normally be written by Edge Functions or server-side trusted code:

```text
exports
backups
```

Owners/editors may request export/backup creation, but the file write should happen through:

```text
Edge Function
Next.js Route Handler
Server Action
```

using the service role.

Do not allow browser-side uploads directly into `exports` or `backups` in Version 1.

---

# 9. Document Metadata Model

The `documents` table stores document metadata.

Storage stores the file.

A document record should be created for:

* Brochure
* Cost sheet
* RERA certificate
* Legal document
* Agreement draft
* Payment receipt
* Master plan PDF
* Floor plan PDF
* Bank document
* Export reference, if needed

---

## 9.1 Document Record Fields

The document table should include:

```text
id
workspace_id
project_id
unit_id
site_visit_id
follow_up_id
payment_milestone_id
document_name
document_category
document_status
review_status
storage_bucket
storage_path
external_url
file_name
file_mime_type
file_size_bytes
collected_date
reviewed_date
reviewed_by
extracted_data
review_notes
source_type
source_name
source_date
confidence
notes
created_by
updated_by
created_at
updated_at
deleted_at
```

---

## 9.2 Document Categories

Recommended document categories:

```text
brochure
floor_plan_pdf
master_plan_pdf
cost_sheet
rera_certificate
legal_document
title_document
encumbrance_certificate
khata
agreement_draft
payment_receipt
bank_document
tax_receipt
handover_document
other
```

Store category as text in Version 1 for flexibility.

Later, convert to enum only if categories stabilize.

---

## 9.3 Document Status

Use existing enum:

```text
required
requested
collected
reviewed
pending
not_applicable
risk
```

---

## 9.4 Review Status

Use existing enum:

```text
not_reviewed
in_review
cleared
risk
not_applicable
```

---

# 10. Media Asset Metadata Model

The `media_assets` table stores images, videos, logos, floor plans, gallery images, and site photos.

A media asset record should be created for:

* Builder logo
* Project logo
* Hero image
* Project gallery image
* Elevation render
* Floor plan image
* Master plan image
* Amenity photo
* Site visit photo
* Walkthrough video
* Progress video
* Document preview image

---

## 10.1 Media Asset Fields

The media asset table should include:

```text
id
workspace_id
builder_id
project_id
unit_id
site_visit_id
document_id
asset_type
category
title
caption
alt_text
description
external_url
storage_bucket
storage_path
raw_video_url
embed_url
video_platform
thumbnail_url
duration_seconds
unit_type
tower_name
is_cover
sort_order
source_type
source_name
source_date
confidence
notes
created_by
updated_by
created_at
updated_at
deleted_at
```

---

## 10.2 Media Asset Types

Use enum:

```text
image
video
logo
floor_plan
master_plan
document_preview
site_photo
other
```

---

## 10.3 Media Categories

Use enum:

```text
hero
gallery
elevation
floor_plan
master_plan
amenity_photo
site_photo
document_preview
builder_logo
project_logo
walkthrough
aerial_view
progress_update
other
```

---

## 10.4 External URL Support

Not every image/video must be uploaded.

The portal should support:

* External image URL
* Google Drive link
* YouTube URL
* Vimeo URL
* Builder website image URL
* Supabase Storage path

For external media:

```text
external_url is populated
storage_bucket/storage_path may be null
```

For uploaded media:

```text
storage_bucket and storage_path are populated
external_url may be null
```

For videos:

```text
raw_video_url and embed_url should be populated where possible
```

---

# 11. Upload Flow — Document

## 11.1 Document Upload Lifecycle

```text
1. User selects file.
2. Frontend validates file size and MIME type.
3. Frontend creates or prepares a document record ID.
4. Frontend builds storage path using workspace/project/unit/document IDs.
5. File uploads to Supabase Storage.
6. Documents table row is inserted.
7. Project/unit/document completeness updates.
8. User can open signed URL.
```

---

## 11.2 Frontend Document Upload Utility

File:

```text
/src/lib/supabase/storage.ts
```

```typescript
import { createBrowserClient } from "@supabase/ssr";

type UploadDocumentInput = {
  workspaceId: string;
  projectId?: string;
  unitId?: string;
  siteVisitId?: string;
  followUpId?: string;
  paymentMilestoneId?: string;
  file: File;
  documentName: string;
  documentCategory: string;
  bucketName:
    | "project-documents"
    | "site-visit-evidence"
    | "cost-sheets"
    | "legal-documents";
};

function sanitizeFileName(fileName: string): string {
  const parts = fileName.split(".");
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
  const base = parts.join(".") || "file";

  const safeBase = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);

  return ext ? `${safeBase}.${ext}` : safeBase;
}

export async function uploadDocument(input: UploadDocumentInput) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    workspaceId,
    projectId,
    unitId,
    siteVisitId,
    followUpId,
    paymentMilestoneId,
    file,
    documentName,
    documentCategory,
    bucketName,
  } = input;

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("User is not authenticated.");
  }

  const documentId = crypto.randomUUID();
  const safeFileName = sanitizeFileName(file.name);

  let storagePath: string;

  if (projectId && unitId) {
    storagePath =
      `workspace/${workspaceId}/projects/${projectId}/units/${unitId}/documents/${documentId}/${safeFileName}`;
  } else if (projectId) {
    storagePath =
      `workspace/${workspaceId}/projects/${projectId}/documents/${documentId}/${safeFileName}`;
  } else if (siteVisitId) {
    storagePath =
      `workspace/${workspaceId}/site-visits/${siteVisitId}/evidence/${documentId}/${safeFileName}`;
  } else {
    storagePath =
      `workspace/${workspaceId}/documents/${documentId}/${safeFileName}`;
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: insertError } = await supabase.from("documents").insert({
    id: documentId,
    workspace_id: workspaceId,
    project_id: projectId ?? null,
    unit_id: unitId ?? null,
    site_visit_id: siteVisitId ?? null,
    follow_up_id: followUpId ?? null,
    payment_milestone_id: paymentMilestoneId ?? null,
    document_name: documentName,
    document_category: documentCategory,
    document_status: "collected",
    review_status: "not_reviewed",
    storage_bucket: bucketName,
    storage_path: uploadData.path,
    file_name: file.name,
    file_mime_type: file.type,
    file_size_bytes: file.size,
    collected_date: new Date().toISOString().slice(0, 10),
    source_type: "user_entry",
    confidence: "user_estimate",
    created_by: userData.user.id,
    updated_by: userData.user.id,
  });

  if (insertError) {
    await supabase.storage.from(bucketName).remove([uploadData.path]);
    throw insertError;
  }

  return {
    documentId,
    storagePath: uploadData.path,
    bucketName,
  };
}
```

---

# 12. Upload Flow — Media Asset

## 12.1 Media Upload Lifecycle

```text
1. User selects image/video.
2. Frontend validates size and MIME type.
3. Frontend creates media asset ID.
4. File uploads to `media-assets`.
5. `media_assets` row is inserted.
6. Project gallery, floor plan, or site visit gallery updates.
```

---

## 12.2 Frontend Media Upload Utility

```typescript
type UploadMediaInput = {
  workspaceId: string;
  builderId?: string;
  projectId?: string;
  unitId?: string;
  siteVisitId?: string;
  file: File;
  assetType:
    | "image"
    | "video"
    | "logo"
    | "floor_plan"
    | "master_plan"
    | "document_preview"
    | "site_photo"
    | "other";
  category:
    | "hero"
    | "gallery"
    | "elevation"
    | "floor_plan"
    | "master_plan"
    | "amenity_photo"
    | "site_photo"
    | "document_preview"
    | "builder_logo"
    | "project_logo"
    | "walkthrough"
    | "aerial_view"
    | "progress_update"
    | "other";
  title?: string;
  caption?: string;
  altText?: string;
  isCover?: boolean;
};

export async function uploadMediaAsset(input: UploadMediaInput) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("User is not authenticated.");
  }

  const mediaAssetId = crypto.randomUUID();
  const safeFileName = sanitizeFileName(input.file.name);

  let storagePath: string;

  if (input.builderId) {
    storagePath =
      `workspace/${input.workspaceId}/builders/${input.builderId}/logos/${mediaAssetId}/${safeFileName}`;
  } else if (input.projectId) {
    storagePath =
      `workspace/${input.workspaceId}/projects/${input.projectId}/media/${mediaAssetId}/${safeFileName}`;
  } else if (input.siteVisitId) {
    storagePath =
      `workspace/${input.workspaceId}/site-visits/${input.siteVisitId}/evidence/${mediaAssetId}/${safeFileName}`;
  } else {
    storagePath =
      `workspace/${input.workspaceId}/media/${mediaAssetId}/${safeFileName}`;
  }

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("media-assets")
    .upload(storagePath, input.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: input.file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: insertError } = await supabase.from("media_assets").insert({
    id: mediaAssetId,
    workspace_id: input.workspaceId,
    builder_id: input.builderId ?? null,
    project_id: input.projectId ?? null,
    unit_id: input.unitId ?? null,
    site_visit_id: input.siteVisitId ?? null,
    asset_type: input.assetType,
    category: input.category,
    title: input.title ?? input.file.name,
    caption: input.caption ?? null,
    alt_text: input.altText ?? null,
    storage_bucket: "media-assets",
    storage_path: uploadData.path,
    is_cover: input.isCover ?? false,
    source_type: "user_entry",
    confidence: "user_estimate",
    created_by: userData.user.id,
    updated_by: userData.user.id,
  });

  if (insertError) {
    await supabase.storage.from("media-assets").remove([uploadData.path]);
    throw insertError;
  }

  return {
    mediaAssetId,
    storagePath: uploadData.path,
    bucketName: "media-assets",
  };
}
```

---

# 13. External Document / Media Link Flow

Not all files need to be uploaded.

The portal should also support external links.

Examples:

* Google Drive brochure link
* Builder website image URL
* YouTube walkthrough URL
* Vimeo walkthrough URL
* Publicly accessible floor plan image
* Builder-hosted RERA document

---

## 13.1 External Document Record

For external documents:

```text
documents.external_url is populated
documents.storage_bucket is null
documents.storage_path is null
```

No Supabase Storage object exists.

---

## 13.2 External Media Record

For external media:

```text
media_assets.external_url is populated
media_assets.storage_bucket is null
media_assets.storage_path is null
```

For YouTube/Vimeo videos:

```text
raw_video_url is populated
embed_url is populated
video_platform is populated
```

---

# 14. Signed URL Strategy

All buckets are private.

The frontend should access files using signed URLs.

## 14.1 Signed URL Utility

```typescript
export async function getSignedUrl({
  bucketName,
  storagePath,
  expiresInSeconds = 3600,
}: {
  bucketName: string;
  storagePath: string;
  expiresInSeconds?: number;
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}
```

---

## 14.2 Recommended Expiry Durations

| Use Case                 |     Expiry |
| ------------------------ | ---------: |
| Document preview         |     1 hour |
| Image gallery preview    |     1 hour |
| Payment receipt download | 30 minutes |
| Export download          |  5 minutes |
| Backup download          |  5 minutes |
| Legal document download  | 15 minutes |

---

## 14.3 Do Not Persist Signed URLs

Signed URLs are temporary.

Do not store signed URLs in the database.

Store only:

```text
storage_bucket
storage_path
```

Generate signed URLs when needed.

---

# 15. Download Flow

## 15.1 Document Download Flow

```text
1. User clicks Open / Download.
2. App checks document metadata.
3. If external_url exists, open external URL.
4. If storage_path exists, generate signed URL.
5. Open signed URL in new tab.
```

---

## 15.2 Media Display Flow

```text
1. Query media_assets for project/unit/site_visit.
2. If external_url exists, render it.
3. If storage_path exists, generate signed URL.
4. Cache signed URL in UI state only.
5. Render gallery, image, video, or preview.
```

---

# 16. Delete Flow

Deletion should protect decision evidence.

## 16.1 Soft Delete Metadata First

Recommended app behavior:

```text
1. Set documents.deleted_at or media_assets.deleted_at.
2. Hide from default UI.
3. Keep storage object unless owner confirms permanent delete.
```

## 16.2 Permanent Delete

Permanent delete should:

```text
1. Confirm user is owner.
2. Remove storage object.
3. Delete metadata row or mark permanently deleted.
4. Write activity/audit log.
```

## 16.3 Delete Failure Handling

If storage delete succeeds but DB delete fails, the app should show recovery warning.

If DB delete succeeds but storage delete fails, the app should show cleanup warning.

For important legal documents, prefer soft delete over hard delete.

---

# 17. Export Bucket Usage

The `exports` bucket is written by server-side trusted logic.

Typical flow:

```text
1. User requests export.
2. Edge Function validates workspace role.
3. Edge Function creates export_jobs row.
4. Edge Function collects workspace data.
5. Edge Function writes JSON/CSV/ZIP to exports bucket.
6. Edge Function updates export_jobs.
7. Frontend receives export job ID.
8. Frontend gets signed URL or Edge Function returns signed URL.
9. User downloads file.
```

The frontend should not directly upload files into the `exports` bucket.

---

# 18. Import Bucket Usage

The `imports` bucket stores uploaded Project Pack files or ZIPs before processing.

Typical flow:

```text
1. User uploads JSON/ZIP to imports bucket.
2. App creates import_jobs row.
3. Edge Function validates the import.
4. Edge Function parses file.
5. Edge Function shows/returns validation summary.
6. User confirms import.
7. Edge Function writes records.
8. Import job is marked completed or failed.
```

Owners and editors may upload import packages.

Actual import execution should happen through Edge Function.

---

# 19. Backup Bucket Usage

The `backups` bucket stores full workspace backups.

Typical flow:

```text
1. User requests backup.
2. Edge Function validates owner/editor role.
3. Edge Function creates backup_records row.
4. Edge Function generates Project Pack JSON.
5. Edge Function writes file to backups bucket.
6. Frontend offers short-lived signed download URL.
```

Backups may contain the entire workspace.

Use short signed URL expiry.

---

# 20. File Validation Rules

## 20.1 Client-Side Validation

Before upload, the frontend should validate:

```text
file exists
file size within bucket limit
MIME type allowed
filename is safe
workspace ID exists
user is authenticated
record context exists
```

Show human-readable errors.

Example:

```text
This file is too large for legal documents. Maximum allowed size is 50 MB.
```

---

## 20.2 Server-Side / Storage Validation

Supabase bucket configuration should enforce:

```text
allowed MIME types
file size limits
private access
RLS policies
```

Edge Functions should re-check access for import/export/backup workflows.

---

# 21. MIME Type Policy

## 21.1 Documents

Allowed:

```text
application/pdf
image/jpeg
image/png
image/webp
```

## 21.2 Legal Documents

Allowed:

```text
application/pdf
image/jpeg
image/png
image/webp
```

## 21.3 Site Visit Evidence

Allowed:

```text
image/jpeg
image/png
image/webp
video/mp4
video/quicktime
```

## 21.4 Media Assets

Allowed:

```text
image/jpeg
image/png
image/webp
image/svg+xml
video/mp4
video/quicktime
```

## 21.5 Imports

Allowed:

```text
application/json
application/zip
```

## 21.6 Exports and Backups

Allowed:

```text
application/json
application/zip
application/pdf
text/csv
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

---

# 22. Security Rules

## 22.1 Never Public by Default

Do not create public buckets for:

* Legal documents
* Cost sheets
* Payment receipts
* Personal notes
* Site visit evidence
* Backups
* Exports

---

## 22.2 Never Store Service Role in Frontend

The service role key must not be used in:

```text
Client Components
Browser JavaScript
NEXT_PUBLIC_* variables
```

Allowed:

```text
Supabase Edge Functions
Next.js Route Handlers
Next.js Server Actions
Backend scripts
```

---

## 22.3 Protect Legal Documents

Legal documents should have stricter frontend behavior:

* Shorter signed URL expiry
* No public sharing
* Visible review status
* Audit log on upload/delete
* Prefer soft delete

---

## 22.4 Protect Export and Backup Files

Export and backup files may contain all workspace records.

Rules:

* Server-side creation only
* Short signed URL expiry
* Owner/editor only
* Audit log recommended
* Do not expose permanent URLs

---

# 23. Frontend File Structure

Recommended frontend files:

```text
/src/lib/supabase/storage.ts
/src/lib/supabase/document-uploads.ts
/src/lib/supabase/media-uploads.ts
/src/lib/supabase/signed-urls.ts
/src/lib/file-utils.ts
/src/lib/video-utils.ts
```

---

## 23.1 file-utils.ts

Should include:

```text
sanitizeFileName
getFileExtension
validateFileSize
validateMimeType
formatFileSize
buildDocumentStoragePath
buildMediaStoragePath
```

---

## 23.2 video-utils.ts

Should include:

```text
detectVideoPlatform
extractYouTubeVideoId
extractVimeoVideoId
buildYouTubeEmbedUrl
buildVimeoEmbedUrl
buildVideoThumbnailUrl
```

---

# 24. Document UI Requirements

The UI should support:

* Upload document
* Add external document link
* Show document status
* Show review status
* Open signed URL
* Replace document
* Soft delete document
* Link document to project/unit/site visit/follow-up/payment
* Show missing required documents
* Create follow-up from missing document

---

## 24.1 Document Card / Row Fields

Show:

```text
Document name
Category
Project
Unit
Status
Review status
Source
Confidence
Collected date
File type
File size
Actions
```

---

# 25. Media UI Requirements

The UI should support:

* Add project hero image
* Add builder logo
* Add project logo
* Add gallery images
* Add floor plan images
* Add master plan
* Add site visit photos
* Add walkthrough video URL
* Add external image URL
* Mark image as cover
* Sort gallery images
* Show missing media in completeness

---

## 25.1 Project Gallery Order

Show media in this order:

```text
Hero image
Elevation renders
General gallery
Master plan
Floor plans
Amenity photos
Site visit photos
Videos
```

---

## 25.2 Floor Plan UI

Floor plans should support:

```text
BHK type
Tower name
Unit type
Zoom / lightbox
Open original
Notes
```

---

## 25.3 Video UI

Video records should support:

```text
YouTube embed
Vimeo embed
Thumbnail
Title
Description
Duration
Open original URL
```

---

# 26. Storage QA Checklist

## 26.1 Bucket QA

Check:

```text
All buckets exist
All buckets are private
Allowed MIME types are set
File size limits are set
No public buckets exist
```

---

## 26.2 RLS QA

Check:

```text
Workspace member can download workspace file
Workspace outsider cannot download file
Viewer can download but cannot upload
Editor can upload
Editor cannot delete
Owner can delete
Exports are not browser-uploadable
Backups are not browser-uploadable
```

---

## 26.3 Document Upload QA

Check:

```text
Upload creates storage object
Upload creates documents row
Failed documents insert removes uploaded object
Signed URL opens file
External URL document opens correctly
Soft delete hides document
```

---

## 26.4 Media Upload QA

Check:

```text
Upload creates storage object
Upload creates media_assets row
Hero image displays
Gallery displays
Floor plan displays
Site visit photo displays
YouTube/Vimeo link embeds correctly
Signed URL is not persisted
```

---

# 27. Storage Acceptance Criteria

Supabase Storage is ready when:

1. All required buckets are created.
2. All buckets are private.
3. Storage object paths include workspace ID.
4. Storage RLS uses workspace membership.
5. Owners/editors can upload allowed files.
6. Viewers can download but cannot upload.
7. Owners can delete files.
8. Editors cannot delete files by default.
9. Documents table stores file metadata.
10. Media assets table stores gallery/media metadata.
11. Signed URLs work.
12. Signed URLs are not stored in database.
13. Legal documents are protected.
14. Exports and backups are server-generated.
15. Import files are handled through import jobs.
16. Site visit photos are supported.
17. Builder/project logos are supported.
18. Floor plans and master plans are supported.
19. External URLs are supported.
20. Storage QA tests pass.

---

# 28. Final Storage Principle

The portal should treat files as decision evidence.

A cost sheet, RERA certificate, parking confirmation, site visit photo, or legal document may directly affect a high-value real estate decision.

Therefore, the storage system must preserve:

```text
privacy
workspace isolation
document identity
source
confidence
review status
auditability
recoverability
```

Storage is not just file upload.

It is evidence management for the real estate decision cockpit.
