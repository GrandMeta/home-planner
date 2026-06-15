// Supabase Storage helpers
// Upload, download, delete files, and generate signed URLs.

import { createBrowserClient } from "./client";

// ---- Path helpers ----

export function buildStoragePath(
  workspaceId: string,
  resourceType: "projects" | "site-visits" | "units" | "backups",
  resourceId: string,
  filename: string,
): string {
  return `${workspaceId}/${resourceType}/${resourceId}/${filename}`;
}

export function buildExportPath(
  workspaceId: string,
  filename: string,
): string {
  return `${workspaceId}/${filename}`;
}

// ---- Upload ----

export interface UploadOptions {
  workspaceId: string;
  resourceType: "projects" | "site-visits" | "units";
  resourceId: string;
  file: File;
  bucket?: string;
}

export async function uploadFile({
  workspaceId,
  resourceType,
  resourceId,
  file,
  bucket = "project-documents",
}: UploadOptions): Promise<string> {
  const supabase = createBrowserClient();

  const ext = file.name.split(".").pop();
  const slug = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()
    .slice(0, 40);
  const filename = `${slug}-${Date.now()}.${ext}`;
  const storagePath = buildStoragePath(workspaceId, resourceType, resourceId, filename);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;
  return storagePath;
}

// ---- Get signed URL ----

export async function getSignedUrl(
  bucket: string,
  storagePath: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}

// ---- Delete ----

export async function deleteFile(
  bucket: string,
  storagePath: string,
): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase.storage.from(bucket).remove([storagePath]);
  if (error) throw error;
}

// ---- List files for a project ----

export async function listProjectFiles(
  workspaceId: string,
  projectId: string,
  bucket = "project-documents",
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(`${workspaceId}/projects/${projectId}`, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

  if (error) throw error;
  return data ?? [];
}

// ---- Validate file before upload ----

const MAX_FILE_SIZES: Record<string, number> = {
  "project-documents": 50 * 1024 * 1024,
  "site-visit-evidence": 50 * 1024 * 1024,
  "cost-sheets": 50 * 1024 * 1024,
  "legal-documents": 50 * 1024 * 1024,
};

const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  "project-documents": ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  "site-visit-evidence": ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"],
  "cost-sheets": ["application/pdf", "image/jpeg", "image/png", "image/webp"],
  "legal-documents": ["application/pdf", "image/jpeg", "image/png"],
};

export function validateFile(
  file: File,
  bucket: string,
): { valid: boolean; error?: string } {
  const maxSize = MAX_FILE_SIZES[bucket];
  if (maxSize && file.size > maxSize) {
    const limitMb = Math.round(maxSize / 1024 / 1024);
    return { valid: false, error: `File is too large. Maximum size is ${limitMb} MB.` };
  }

  const allowedTypes = ALLOWED_MIME_TYPES[bucket];
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}
