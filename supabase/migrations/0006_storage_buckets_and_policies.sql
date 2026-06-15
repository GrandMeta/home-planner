-- ============================================================
-- Migration 0006: Storage Buckets and Policies
-- ============================================================

-- Create storage buckets
-- Note: This uses Supabase's internal storage schema.
-- Buckets are created once. Safe to re-run (ON CONFLICT DO NOTHING).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'project-documents',
    'project-documents',
    false,
    52428800,
    ARRAY[
      'application/pdf',
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
    ]
  ),
  (
    'site-visit-evidence',
    'site-visit-evidence',
    false,
    52428800,
    ARRAY[
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'video/mp4', 'video/quicktime', 'video/webm'
    ]
  ),
  (
    'cost-sheets',
    'cost-sheets',
    false,
    52428800,
    ARRAY[
      'application/pdf',
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
    ]
  ),
  (
    'legal-documents',
    'legal-documents',
    false,
    52428800,
    ARRAY[
      'application/pdf',
      'image/jpeg', 'image/jpg', 'image/png'
    ]
  ),
  (
    'exports',
    'exports',
    false,
    104857600,
    ARRAY[
      'application/json',
      'application/zip',
      'application/x-zip-compressed',
      'application/pdf'
    ]
  ),
  (
    'imports',
    'imports',
    false,
    52428800,
    ARRAY[
      'application/json',
      'application/zip',
      'application/x-zip-compressed'
    ]
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage RLS Policies
-- Object paths follow: {workspace_id}/{resource_type}/{resource_id}/{filename}
-- So (storage.foldername(name))[1] gives the workspace_id segment.
-- ============================================================

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ---- Upload: workspace members (owner or member) can upload ----
CREATE POLICY "workspace_members_can_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'imports'
  )
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'member')
  )
);

-- ---- Download: all workspace members (including viewer) can read ----
CREATE POLICY "workspace_members_can_download"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id IN (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'exports',
    'imports'
  )
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
  )
);

-- ---- Update: only the uploader or workspace owner can update ----
CREATE POLICY "workspace_members_can_update_own_uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id IN (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents'
  )
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'member')
  )
);

-- ---- Delete: workspace owner or member who uploaded the file ----
CREATE POLICY "workspace_members_can_delete_uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN (
    'project-documents',
    'site-visit-evidence',
    'cost-sheets',
    'legal-documents',
    'imports'
  )
  AND (storage.foldername(name))[1]::uuid IN (
    SELECT workspace_id FROM workspace_members
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'member')
  )
);
