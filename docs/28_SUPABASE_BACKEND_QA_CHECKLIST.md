# 28_SUPABASE_BACKEND_QA_CHECKLIST.md

# Real Estate Decision Portal — Supabase Backend QA Checklist

## 1. Purpose

This document defines the QA checklist for the Supabase backend.

Use this checklist before marking any backend milestone as complete.

The backend is considered production-ready only when all critical checks pass across:

* Migrations
* Schema correctness
* RLS policies
* Auth
* Workspace roles
* Storage
* Documents
* Media assets
* Edge Functions
* Frontend integration
* Performance
* Data integrity
* Security
* Production smoke testing

---

# 2. QA Execution Rule

Run each section independently.

Do not mark the backend as ready only because the app appears to work visually.

Backend QA must confirm:

```text
The schema is correct.
The data is protected.
The storage is private.
The functions are authorized.
The user cannot access another workspace.
The service role key is not exposed.
```

---

# 3. Migration QA

## 3.1 Migration Execution

Check:

```text
[ ] `supabase db reset` exits successfully.
[ ] All migrations apply cleanly from scratch.
[ ] No migration fails halfway.
[ ] No migration depends on manual dashboard changes.
[ ] `supabase migration list` shows expected applied migrations.
[ ] Local Supabase Studio opens after reset.
```

Required initial migrations:

```text
[ ] 0001_extensions_and_helpers.sql
[ ] 0002_enums.sql
[ ] 0003_auth_workspace_schema.sql
[ ] 0004_real_estate_core_schema.sql
[ ] 0005_site_visit_documents_payments_schema.sql
[ ] 0006_storage_buckets_and_policies.sql
[ ] 0007_rls_policies.sql
[ ] 0008_triggers_and_functions.sql
[ ] 0009_seed_initial_data.sql
```

---

## 3.2 Schema Correctness

Check:

```text
[ ] All tables use `id uuid primary key default gen_random_uuid()` where applicable.
[ ] `pgcrypto` extension is enabled.
[ ] No table uses `uuid_generate_v4()` unless `uuid-ossp` is intentionally enabled.
[ ] All workspace-owned user data tables have `workspace_id uuid not null`.
[ ] All workspace-owned tables reference `public.workspaces(id)`.
[ ] All major editable tables have `created_at`.
[ ] All major editable tables have `updated_at`.
[ ] All major editable tables have `created_by`.
[ ] All major editable tables have `updated_by`.
[ ] Soft-deletable tables have `deleted_at`.
[ ] Source-aware tables have `source_type`.
[ ] Source-aware tables have `source_name`.
[ ] Source-aware tables have `source_date`.
[ ] Source-aware tables have `confidence`.
[ ] Source-aware tables have `notes`.
[ ] Money columns use `numeric(14,2)`.
[ ] Percentage columns use `numeric(7,4)`.
[ ] Area columns use `numeric(10,2)`.
[ ] JSONB columns have safe defaults.
```

---

## 3.3 Enum QA

Check:

```text
[ ] `workspace_role` contains owner, editor, viewer, advisor.
[ ] No enum uses old `member` role.
[ ] `project_status` matches frontend status mapping.
[ ] `project_purpose` matches frontend purpose mapping.
[ ] `risk_level` matches frontend risk mapping.
[ ] `data_confidence` matches frontend confidence mapping.
[ ] `source_type` supports user entry, builder documents, RERA, legal, import, manual override.
[ ] `cost_treatment` supports separate, included, bundled, not applicable, unknown, estimated, manual override.
[ ] `media_asset_type` exists.
[ ] `media_category` exists.
[ ] `job_status` exists.
```

---

## 3.4 Table Coverage

Check all required tables exist.

Auth and workspace:

```text
[ ] profiles
[ ] workspaces
[ ] workspace_members
[ ] app_settings
```

Real estate core:

```text
[ ] builders
[ ] projects
[ ] units
[ ] space_details
[ ] cost_breakups
[ ] cost_components
[ ] statutory_charges
[ ] maintenance_possession_costs
[ ] post_possession_budgets
[ ] parking_details
[ ] parking_slots
[ ] legal_records
[ ] location_records
[ ] amenities
[ ] media_assets
```

Workflow:

```text
[ ] documents
[ ] site_visits
[ ] checklist_items
[ ] follow_ups
[ ] payment_milestones
[ ] negotiations
[ ] decision_status_history
[ ] score_snapshots
[ ] quote_snapshots
```

Jobs and audit:

```text
[ ] import_jobs
[ ] export_jobs
[ ] backup_records
[ ] activity_log
[ ] audit_log
```

---

## 3.5 Foreign Key QA

Check:

```text
[ ] All FK constraints have explicit ON DELETE behavior.
[ ] Deleting a workspace cascades workspace-owned data.
[ ] Deleting a project cascades project-owned records.
[ ] Deleting a project does not delete builder.
[ ] Deleting a unit cascades unit detail records.
[ ] Document links use SET NULL where historical record should survive.
[ ] Receipt document references use SET NULL.
[ ] Media references use appropriate cascade or SET NULL.
[ ] No dangling references are possible after delete.
```

---

## 3.6 Index QA

Check indexes exist for common query patterns:

```text
[ ] Every workspace-owned table has workspace_id index.
[ ] projects has workspace_id index.
[ ] projects has builder_id index.
[ ] projects has project_status index.
[ ] projects has project_purpose index.
[ ] projects has city_zone index.
[ ] projects has full-text search index on project_name.
[ ] units has project_id index.
[ ] units has selected_for_comparison index.
[ ] follow_ups has status index.
[ ] follow_ups has due_date index.
[ ] documents has project_id index.
[ ] documents has document_status index.
[ ] documents has review_status index.
[ ] payment_milestones has due_date index.
[ ] media_assets has project_id index.
[ ] media_assets has category index.
[ ] media_assets has is_cover index.
```

---

## 3.7 Type Generation QA

Run:

```bash
supabase gen types typescript --local > src/types/database.types.ts
```

Check:

```text
[ ] Type generation succeeds.
[ ] `src/types/database.types.ts` is updated.
[ ] Generated types are committed with migration changes.
[ ] Frontend builds against generated types.
```

---

# 4. RLS Policy QA

## 4.1 RLS Coverage

Run a query to inspect RLS status.

Check:

```text
[ ] RLS is enabled on profiles.
[ ] RLS is enabled on workspaces.
[ ] RLS is enabled on workspace_members.
[ ] RLS is enabled on app_settings.
[ ] RLS is enabled on every workspace-owned real estate table.
[ ] RLS is enabled on documents.
[ ] RLS is enabled on media_assets.
[ ] RLS is enabled on import_jobs.
[ ] RLS is enabled on export_jobs.
[ ] RLS is enabled on backup_records.
[ ] RLS is enabled on activity_log.
[ ] RLS is enabled on audit_log.
```

Example inspection query:

```sql
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

---

## 4.2 Helper Function QA

Check these functions exist and work:

```text
[ ] public.get_user_workspace_ids()
[ ] public.is_workspace_member(uuid)
[ ] public.has_workspace_role(uuid, public.workspace_role[])
[ ] public.is_workspace_owner(uuid)
[ ] public.can_edit_workspace(uuid)
[ ] public.storage_object_workspace_id(text)
```

Check:

```text
[ ] Helper functions use `security definer`.
[ ] Helper functions set `search_path`.
[ ] Helper functions do not use unsafe dynamic SQL.
[ ] Execute grants are limited appropriately.
```

---

## 4.3 Role Matrix QA

Create test users:

```text
user_a_owner
user_b_editor
user_c_viewer
user_d_advisor
user_e_outsider
```

Create:

```text
workspace_a
workspace_b
```

Memberships:

```text
user_a_owner   → owner of workspace_a
user_b_editor  → editor of workspace_a
user_c_viewer  → viewer of workspace_a
user_d_advisor → advisor of workspace_a
user_e_outsider → no access to workspace_a
```

Expected access:

| Scenario                           | Expected                             |
| ---------------------------------- | ------------------------------------ |
| Owner selects workspace records    | Allowed                              |
| Editor selects workspace records   | Allowed                              |
| Viewer selects workspace records   | Allowed                              |
| Advisor selects workspace records  | Allowed                              |
| Outsider selects workspace records | 0 rows                               |
| Owner inserts project              | Allowed                              |
| Editor inserts project             | Allowed                              |
| Viewer inserts project             | Denied                               |
| Advisor inserts project            | Denied in Version 1                  |
| Outsider inserts project           | Denied                               |
| Owner updates project              | Allowed                              |
| Editor updates project             | Allowed                              |
| Viewer updates project             | Denied                               |
| Advisor updates project            | Denied in Version 1                  |
| Owner deletes project              | Allowed                              |
| Editor deletes project             | Denied unless specifically permitted |
| Viewer deletes project             | Denied                               |
| Advisor deletes project            | Denied                               |
| Outsider deletes project           | Denied                               |

---

## 4.4 Isolation Tests

Check:

```text
[ ] User outside workspace gets 0 rows from projects.
[ ] User outside workspace gets 0 rows from units.
[ ] User outside workspace gets 0 rows from documents.
[ ] User outside workspace gets 0 rows from media_assets.
[ ] User outside workspace cannot fetch record by known UUID.
[ ] Viewer can read but cannot insert.
[ ] Viewer can read but cannot update.
[ ] Viewer can read but cannot delete.
[ ] Editor can insert and update.
[ ] Editor cannot owner-delete critical records.
[ ] Owner can manage workspace records.
```

---

## 4.5 Append-Only Table QA

Check:

```text
[ ] decision_status_history has SELECT policy.
[ ] decision_status_history has INSERT policy.
[ ] decision_status_history has no UPDATE policy.
[ ] decision_status_history has no DELETE policy.
[ ] score_snapshots has no UPDATE policy.
[ ] quote_snapshots has no UPDATE policy.
[ ] audit_log has no client SELECT policy.
[ ] audit_log has no client INSERT policy.
[ ] audit_log has no client UPDATE policy.
[ ] audit_log has no client DELETE policy.
```

---

## 4.6 Service Role QA

Check:

```text
[ ] Service role can bypass RLS only in trusted server/Edge Function contexts.
[ ] Edge Functions verify user JWT before service role operations.
[ ] Service role key is not present in frontend bundle.
[ ] No client component imports admin client.
```

---

# 5. Auth QA

## 5.1 Sign-Up QA

Check:

```text
[ ] User can register with email/password.
[ ] Local email confirmation setting behaves as expected.
[ ] Production email confirmation is enabled.
[ ] Profile row is created in `profiles`.
[ ] Workspace row is created in `workspaces`.
[ ] Workspace member row is created with role = owner.
[ ] Workspace member status = active.
[ ] App settings row is created.
[ ] User can access dashboard after login/confirmation.
```

---

## 5.2 Sign-In QA

Check:

```text
[ ] User can sign in with email/password.
[ ] Invalid password shows safe error.
[ ] Magic link fallback works.
[ ] Auth cookies are set.
[ ] Session persists after page refresh.
[ ] Session refresh works through middleware.
[ ] Authenticated user is redirected away from /auth/login.
[ ] Unauthenticated user is redirected to /auth/login.
```

---

## 5.3 Sign-Out QA

Check:

```text
[ ] User can sign out.
[ ] Auth cookies are cleared.
[ ] User is redirected to /auth/login.
[ ] Protected routes are inaccessible after logout.
```

---

## 5.4 Password Reset QA

Check:

```text
[ ] User can request password reset.
[ ] Local reset email appears in Inbucket.
[ ] Reset URL opens reset page.
[ ] User can set new password.
[ ] User can login with new password.
```

Typical local Inbucket URL:

```text
http://localhost:54324
```

---

## 5.5 Workspace Context QA

Check:

```text
[ ] App resolves active workspace after login.
[ ] User with one workspace lands directly in it.
[ ] User with multiple workspaces can switch workspace.
[ ] Active workspace is persisted as convenience state.
[ ] RLS still enforces backend access regardless of stored workspace ID.
```

---

# 6. Storage QA

## 6.1 Bucket QA

Required buckets:

```text
project-documents
site-visit-evidence
cost-sheets
legal-documents
media-assets
imports
exports
backups
```

Check:

```text
[ ] All 8 buckets exist.
[ ] All buckets are private.
[ ] `public` column is false for all buckets.
[ ] File size limits are set.
[ ] MIME type restrictions are set.
[ ] No unplanned public bucket exists.
```

---

## 6.2 Storage RLS QA

Check:

```text
[ ] Workspace owner can upload allowed file.
[ ] Workspace editor can upload allowed file.
[ ] Workspace viewer cannot upload.
[ ] Workspace advisor cannot upload in Version 1.
[ ] Workspace member can download own workspace file.
[ ] Workspace outsider cannot download file.
[ ] Owner can delete file.
[ ] Editor cannot delete file by default.
[ ] Viewer cannot delete file.
[ ] Storage path parser extracts workspace_id correctly.
```

---

## 6.3 File Validation QA

Check:

```text
[ ] Oversized file upload fails.
[ ] Disallowed MIME type upload fails.
[ ] `.exe` upload fails.
[ ] PDF upload succeeds in document buckets.
[ ] Image upload succeeds in media-assets.
[ ] Video upload succeeds in site-visit-evidence if within size.
[ ] Filename is sanitized before upload.
[ ] File path starts with `workspace/{workspace_id}/`.
```

---

## 6.4 Signed URL QA

Check:

```text
[ ] Signed URL works for workspace member.
[ ] Signed URL expires.
[ ] Signed URL is not stored in database.
[ ] Legal document signed URL has short expiry.
[ ] Export signed URL has short expiry.
[ ] Backup signed URL has short expiry.
```

---

## 6.5 Document Upload QA

Check:

```text
[ ] Upload creates storage object.
[ ] Upload creates documents row.
[ ] documents.storage_bucket is populated.
[ ] documents.storage_path is populated.
[ ] documents.document_status = collected.
[ ] documents.review_status = not_reviewed.
[ ] Failed document row insert removes uploaded storage object.
[ ] External URL document can be created without storage_path.
[ ] Soft delete hides document in UI.
```

---

## 6.6 Media Upload QA

Check:

```text
[ ] Upload creates storage object.
[ ] Upload creates media_assets row.
[ ] Project hero image displays.
[ ] Builder logo displays.
[ ] Project gallery displays.
[ ] Floor plan image displays.
[ ] Master plan image displays.
[ ] Site visit photo displays.
[ ] YouTube/Vimeo external video embeds correctly.
[ ] External image URL displays correctly.
[ ] Cover image selection works.
```

---

# 7. Edge Function QA

## 7.1 General Edge Function QA

Check:

```text
[ ] CORS preflight works.
[ ] OPTIONS request returns 200.
[ ] Unauthorized request returns 401.
[ ] Non-member workspace request returns 403.
[ ] Viewer restricted operation returns 403.
[ ] Owner/editor operation succeeds.
[ ] Errors follow standard shape.
[ ] Service role key is used only after user access check.
[ ] Function logs contain useful metadata.
```

---

## 7.2 `health-check`

Check:

```text
[ ] GET or POST /functions/v1/health-check returns 200.
[ ] Response includes status = ok.
[ ] Response includes timestamp.
[ ] CORS headers are present.
[ ] Works without JWT.
```

---

## 7.3 `export-project-pack`

Check:

```text
[ ] Returns 401 without Authorization header.
[ ] Returns 400 without workspace_id.
[ ] Returns 403 for non-member workspace_id.
[ ] Returns 403 for viewer/advisor if restricted to owner/editor.
[ ] Creates export_jobs row.
[ ] Updates export_jobs status to completed.
[ ] Returns signed URL for valid request.
[ ] JSON export file exists in exports bucket.
[ ] JSON file contains schema_version.
[ ] JSON file contains workspace data.
[ ] JSON file contains projects.
[ ] JSON file contains units.
[ ] JSON file contains documents metadata.
[ ] JSON file contains media_assets metadata.
[ ] JSON file excludes audit_log by default.
```

---

## 7.4 `import-project-pack`

Check:

```text
[ ] Returns 401 without Authorization header.
[ ] Returns 400 without workspace_id.
[ ] Returns 400 without storage_path.
[ ] Returns 403 for non-member workspace_id.
[ ] Returns 403 for viewer/advisor.
[ ] Creates import_jobs row.
[ ] validate_only mode does not write records.
[ ] Invalid JSON fails safely.
[ ] Wrong schema_version returns validation error.
[ ] File workspace_id cannot override request workspace_id.
[ ] Merge mode writes records into correct workspace.
[ ] Duplicate records are handled according to merge rules.
[ ] Verified/legal/manual_override data is not silently overwritten.
[ ] import_jobs status becomes completed or failed.
```

---

## 7.5 `create-project-backup`

Check:

```text
[ ] Returns 401 without auth.
[ ] Returns 400 without workspace_id.
[ ] Returns 400 without project_id.
[ ] Returns 403 for non-member.
[ ] Returns 403 for viewer/advisor.
[ ] Verifies project belongs to workspace.
[ ] Creates backup_records row.
[ ] Creates file in backups bucket.
[ ] Storage path follows `workspace/{workspace_id}/backups/{backup_record_id}/...`.
[ ] Backup JSON includes project.
[ ] Backup JSON includes units.
[ ] Backup JSON includes cost data.
[ ] Backup JSON includes documents metadata.
[ ] Backup JSON includes media_assets metadata.
[ ] Signed URL works.
```

---

## 7.6 `create-workspace-backup`

Check:

```text
[ ] Returns 401 without auth.
[ ] Returns 403 for non-member.
[ ] Returns 403 for viewer/advisor.
[ ] Creates backup_records row.
[ ] Creates file in backups bucket.
[ ] Backup JSON includes all expected workspace data.
[ ] Signed URL expiry is short.
```

---

## 7.7 `get-secure-download-url`

Check:

```text
[ ] Returns 401 without auth.
[ ] Returns 400 without storage_bucket.
[ ] Returns 400 without storage_path.
[ ] Returns 403 for non-member workspace.
[ ] Rejects storage_path not starting with workspace/{workspace_id}/.
[ ] Rejects excessive expiry.
[ ] Returns signed URL for valid member.
[ ] Signed URL expires.
```

---

## 7.8 `parse-cost-sheet`

Check:

```text
[ ] Only owner/editor can run.
[ ] Document must belong to workspace.
[ ] Document must be cost sheet or supported document type.
[ ] Function downloads file safely.
[ ] Known test PDF returns structured JSON.
[ ] Known test image returns partial structured JSON or clear warning.
[ ] Unrecognized file returns warnings, not hard failure where possible.
[ ] Extraction result is stored in documents.extracted_data.
[ ] Cost tables are not updated automatically.
[ ] User review is required before saving extracted values.
```

---

# 8. Frontend Integration QA

## 8.1 Supabase Client QA

Check:

```text
[ ] /src/lib/supabase/client.ts uses createBrowserClient.
[ ] /src/lib/supabase/server.ts uses createServerClient.
[ ] /src/lib/supabase/middleware.ts refreshes session.
[ ] /src/lib/supabase/admin.ts is server-only.
[ ] Admin client is never imported in Client Components.
[ ] Auth pages do not import service role logic.
```

---

## 8.2 App Data Loading QA

Check:

```text
[ ] App loads data from Supabase after auth.
[ ] App does not rely on stale localStorage as primary source.
[ ] Active workspace is resolved before project queries.
[ ] Project queries include workspace_id filter.
[ ] Unit queries include workspace_id filter.
[ ] Dashboard queries are batched where possible.
[ ] Empty states work for a new workspace.
```

---

## 8.3 Mutation QA

Check:

```text
[ ] Project creation works.
[ ] Unit creation works.
[ ] Cost update works.
[ ] Parking update works.
[ ] Legal record update works.
[ ] Location update works.
[ ] Site visit creation works.
[ ] Checklist update works.
[ ] Follow-up creation works.
[ ] Document upload works.
[ ] Media upload works.
[ ] Payment milestone creation works.
[ ] Mutation errors show toast/message.
[ ] Failed optimistic updates roll back.
```

---

## 8.4 Generated Types QA

Check:

```text
[ ] database.types.ts is current.
[ ] Frontend imports generated types where useful.
[ ] No manual database type drift.
[ ] TypeScript build passes.
```

---

# 9. Performance QA

## 9.1 Database Query Performance

Run `EXPLAIN ANALYZE` for common queries.

Check:

```text
[ ] SELECT projects by workspace_id uses index.
[ ] SELECT units by project_id uses index.
[ ] SELECT follow_ups by workspace_id and status uses index.
[ ] SELECT payment_milestones by due_date uses index.
[ ] SELECT documents by project_id uses index.
[ ] SELECT media_assets by project_id and category uses index.
```

Example:

```sql
explain analyze
select *
from public.projects
where workspace_id = '<workspace_id>';
```

---

## 9.2 App Performance

Check:

```text
[ ] Projects list loads quickly on local Supabase.
[ ] Dashboard does not make excessive N+1 queries.
[ ] Project detail fetches related records efficiently.
[ ] Gallery does not request signed URLs one-by-one unnecessarily for large media sets.
[ ] Storage uploads show progress indicator.
[ ] Export/import functions show loading status.
```

---

# 10. Data Integrity QA

## 10.1 Cascade Behavior

Check:

```text
[ ] Deleting workspace removes workspace-owned data.
[ ] Deleting project removes units.
[ ] Deleting project removes project documents metadata.
[ ] Deleting project removes project media metadata.
[ ] Deleting project does not delete builder.
[ ] Deleting unit removes space_details.
[ ] Deleting unit removes cost_breakups.
[ ] Deleting unit removes cost_components through cost_breakup/unit relationship.
[ ] Deleting unit removes statutory_charges.
[ ] Deleting unit removes maintenance_possession_costs.
[ ] Deleting unit removes post_possession_budgets.
[ ] Deleting unit removes parking_details.
[ ] Deleting unit removes parking_slots.
```

---

## 10.2 History and Audit Integrity

Check:

```text
[ ] decision_status_history is append-only.
[ ] score_snapshots are not updated after creation.
[ ] quote_snapshots are not updated after creation.
[ ] audit_log is not readable by normal clients.
[ ] audit_log cannot be modified by normal clients.
[ ] activity_log is readable by workspace members.
```

Important:

If deleting projects cascades decision history, confirm this is intentional.

Recommended production posture:

```text
Soft-delete important records instead of hard-deleting them.
```

---

## 10.3 Financial Data Integrity

Check:

```text
[ ] Cost input tables store source values, not only calculated values.
[ ] TDS is tracked separately and not automatically added to landing cost.
[ ] Registration and stamp duty are separate fields.
[ ] Parking has separate records and is not hidden in miscellaneous charges.
[ ] Overrides are explicit.
[ ] Missing numeric fields remain null, not 0.
[ ] Imported data does not overwrite verified data silently.
```

---

# 11. Security QA

## 11.1 Secret Scanning

Check:

```text
[ ] SUPABASE_SERVICE_ROLE_KEY is not in frontend source.
[ ] SUPABASE_SERVICE_ROLE_KEY is not in committed files.
[ ] SUPABASE_ACCESS_TOKEN is not in committed files.
[ ] .env.local is gitignored.
[ ] .env.production is gitignored.
[ ] Only .env.example files are committed.
```

Search commands:

```bash
grep -R "SUPABASE_SERVICE_ROLE_KEY" .
grep -R "SUPABASE_ACCESS_TOKEN" .
grep -R "service_role" .
```

Review results carefully.

---

## 11.2 Client Bundle Secret Check

After build:

```bash
npm run build
```

Check generated client chunks:

```text
[ ] No service role key appears in `.next/static/chunks`.
[ ] No access token appears in `.next/static/chunks`.
[ ] No private env value appears in client bundle.
```

---

## 11.3 Authorization Check

Check:

```text
[ ] Frontend role checks are not treated as security.
[ ] RLS blocks unauthorized direct API access.
[ ] Edge Functions validate JWT.
[ ] Edge Functions validate workspace membership.
[ ] Edge Functions validate role.
[ ] Storage policies validate workspace path.
```

---

# 12. Production Deployment QA

## 12.1 Pre-Deploy

Check:

```text
[ ] Local migrations pass.
[ ] Local RLS tests pass.
[ ] Local storage tests pass.
[ ] Local Edge Functions pass.
[ ] database.types.ts is regenerated.
[ ] GitHub secrets are configured.
[ ] Supabase production project is linked.
[ ] Production Auth URLs are configured.
[ ] Production email confirmation is enabled.
```

---

## 12.2 Deploy

Check:

```text
[ ] Migrations deploy successfully.
[ ] Edge Functions deploy successfully.
[ ] Function secrets are set.
[ ] Frontend deployment has correct env variables.
[ ] Storage buckets exist in production.
[ ] RLS enabled in production.
```

---

## 12.3 Production Smoke Test

Run:

```text
[ ] Register new user.
[ ] Confirm email.
[ ] Login.
[ ] Verify profile row created.
[ ] Verify workspace row created.
[ ] Verify workspace_members owner row created.
[ ] Verify app_settings row created.
[ ] Add builder.
[ ] Add project.
[ ] Add unit.
[ ] Add cost details.
[ ] Add parking details.
[ ] Upload document.
[ ] Upload media asset.
[ ] Create site visit.
[ ] Create follow-up.
[ ] Create payment milestone.
[ ] Export Project Pack.
[ ] Generate signed URL.
[ ] Logout.
[ ] Login again.
[ ] Verify data persists.
```

---

# 13. Cross-Workspace Production Smoke Test

Create two users:

```text
user_a
user_b
```

Test:

```text
[ ] user_a creates project.
[ ] user_b cannot see user_a project.
[ ] user_b cannot access user_a project by known UUID.
[ ] user_a adds user_b as viewer.
[ ] user_b can see project.
[ ] user_b cannot edit project.
[ ] user_a changes user_b to editor.
[ ] user_b can edit project.
[ ] user_b cannot delete owner-only records.
[ ] user_a removes user_b.
[ ] user_b loses access.
```

---

# 14. Backend Sign-Off Matrix

| Section                 | Owner                      | Status  |
| ----------------------- | -------------------------- | ------- |
| Migration QA            | Backend developer          | Pending |
| Schema QA               | Backend developer          | Pending |
| RLS Policy QA           | Security reviewer          | Pending |
| Auth QA                 | Full-stack developer       | Pending |
| Workspace Role QA       | Full-stack developer       | Pending |
| Storage QA              | Backend developer          | Pending |
| Document QA             | Backend developer          | Pending |
| Media QA                | Frontend/backend developer | Pending |
| Edge Function QA        | Backend developer          | Pending |
| Frontend Integration QA | Frontend developer         | Pending |
| Performance QA          | Full-stack developer       | Pending |
| Data Integrity QA       | Backend developer          | Pending |
| Security QA             | Security reviewer          | Pending |
| Production Smoke Test   | Product owner / developer  | Pending |

---

# 15. Production Readiness Gate

The backend is not production-ready until all of these are true:

```text
[ ] All migrations apply from scratch.
[ ] All RLS policies pass role tests.
[ ] Auth flow creates profile/workspace/settings correctly.
[ ] Storage buckets are private.
[ ] Storage RLS blocks cross-workspace access.
[ ] Edge Functions reject unauthorized users.
[ ] Service role key is not exposed.
[ ] Documents and media uploads work.
[ ] Export/import/backup workflows work.
[ ] Frontend uses generated database types.
[ ] Production smoke test passes.
[ ] Cross-workspace test passes.
```

---

# 16. Final QA Principle

The backend must be tested as a security and evidence system, not just as a database.

The portal may guide a high-value apartment purchase decision.

Therefore, QA must confirm:

```text
No wrong user can access private data.
No viewer can modify records.
No verified data is overwritten silently.
No sensitive file is public.
No service key is exposed.
No critical workflow depends on manual dashboard changes.
```

Only then should the backend be considered ready.
