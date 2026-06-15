# 22_SUPABASE_RLS_POLICIES.md

# Real Estate Decision Portal — Supabase RLS Policies

## 1. Purpose

This document defines Row Level Security policies for the Real Estate Decision Portal Supabase backend.

RLS is the primary access-control mechanism for the application.

The backend stores sensitive data including:

* Property purchase options
* Builder quotations
* Negotiation details
* Site visit observations
* Legal/RERA documents
* Payment schedules
* Family decision notes
* Personal financial assumptions
* Uploaded media and documents

Therefore, every user-owned table must enforce workspace isolation.

No authenticated user should be able to access data outside their workspace unless they are explicitly added as a workspace member.

---

## 2. Core RLS Principle

Every major table is scoped by:

```sql
workspace_id uuid not null
```

Core rule:

```text
A user can access a record only if they are an active member of the record's workspace.
```

Role-based permissions:

| Role      | SELECT |             INSERT |             UPDATE |       DELETE | Manage Members |
| --------- | -----: | -----------------: | -----------------: | -----------: | -------------: |
| `owner`   |    Yes |                Yes |                Yes |          Yes |            Yes |
| `editor`  |    Yes |                Yes |                Yes | Limited / No |             No |
| `viewer`  |    Yes |                 No |                 No |           No |             No |
| `advisor` |    Yes | Limited future use | Limited future use |           No |             No |

Version 1 rule:

```text
advisor behaves like viewer unless specific advisor workflows are added later.
```

---

## 3. Role Model

The schema uses these workspace roles:

```sql
owner
editor
viewer
advisor
```

Do not use `member` as a role.

Any old draft using:

```sql
role in ('owner', 'member')
```

must be changed to:

```sql
role in ('owner', 'editor')
```

---

# 4. Helper Functions

Migration file:

```text
/supabase/migrations/0007_rls_policies.sql
```

These helper functions should be created before policies are applied.

## 4.1 Security Notes

Use `security definer` carefully.

Each helper function should:

* Set `search_path = public`
* Return simple role/membership checks
* Avoid dynamic SQL
* Be owned by a privileged database role
* Be granted only to authenticated users where needed

---

## 4.2 get_user_workspace_ids()

Returns all active workspace IDs for the current authenticated user.

```sql
create or replace function public.get_user_workspace_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select wm.workspace_id
  from public.workspace_members wm
  where wm.user_id = auth.uid()
    and wm.status = 'active';
$$;
```

---

## 4.3 is_workspace_member()

Checks whether the current user is an active member of a specific workspace.

```sql
create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.status = 'active'
  );
$$;
```

---

## 4.4 has_workspace_role()

Checks whether the current user has one of the allowed roles in a workspace.

```sql
create or replace function public.has_workspace_role(
  target_workspace_id uuid,
  allowed_roles public.workspace_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = auth.uid()
      and wm.status = 'active'
      and wm.role = any(allowed_roles)
  );
$$;
```

---

## 4.5 is_workspace_owner()

Convenience helper for owner-only actions.

```sql
create or replace function public.is_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_workspace_role(
    target_workspace_id,
    array['owner']::public.workspace_role[]
  );
$$;
```

---

## 4.6 can_edit_workspace()

Convenience helper for owner/editor write access.

```sql
create or replace function public.can_edit_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_workspace_role(
    target_workspace_id,
    array['owner', 'editor']::public.workspace_role[]
  );
$$;
```

---

## 4.7 Helper Function Grants

```sql
revoke all on function public.get_user_workspace_ids() from public;
revoke all on function public.is_workspace_member(uuid) from public;
revoke all on function public.has_workspace_role(uuid, public.workspace_role[]) from public;
revoke all on function public.is_workspace_owner(uuid) from public;
revoke all on function public.can_edit_workspace(uuid) from public;

grant execute on function public.get_user_workspace_ids() to authenticated;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.has_workspace_role(uuid, public.workspace_role[]) to authenticated;
grant execute on function public.is_workspace_owner(uuid) to authenticated;
grant execute on function public.can_edit_workspace(uuid) to authenticated;
```

---

# 5. Standard Workspace Table Policy Pattern

For most workspace-owned tables, use this pattern.

## 5.1 SELECT Policy

Any active workspace member can read records.

```sql
create policy "workspace members can select TABLE_NAME"
on public.TABLE_NAME
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);
```

---

## 5.2 INSERT Policy

Only owners and editors can insert records.

```sql
create policy "owners and editors can insert TABLE_NAME"
on public.TABLE_NAME
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);
```

---

## 5.3 UPDATE Policy

Only owners and editors can update records.

```sql
create policy "owners and editors can update TABLE_NAME"
on public.TABLE_NAME
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);
```

---

## 5.4 DELETE Policy

Default delete rule:

```text
Only owners can delete important records.
```

```sql
create policy "owners can delete TABLE_NAME"
on public.TABLE_NAME
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

# 6. Tables Using Standard Owner/Editor Write Pattern

Apply standard SELECT / INSERT / UPDATE policies to these tables.

Apply owner-only DELETE unless specified otherwise.

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
site_visits
checklist_items
documents
payment_milestones
negotiations
score_snapshots
quote_snapshots
backup_records
```

Important:

Every table listed above must have RLS enabled.

```sql
alter table public.TABLE_NAME enable row level security;
```

---

# 7. Special Table Policies

## 7.1 profiles

Profiles are linked to `auth.users`.

Users should be able to read and update their own profile.

Users may also need to see basic profile details of members in their shared workspaces.

### Enable RLS

```sql
alter table public.profiles enable row level security;
```

### User can select own profile

```sql
create policy "users can select own profile"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
);
```

### Users can select profiles in shared workspaces

```sql
create policy "users can select profiles in shared workspaces"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.workspace_members wm_self
    join public.workspace_members wm_other
      on wm_other.workspace_id = wm_self.workspace_id
    where wm_self.user_id = auth.uid()
      and wm_self.status = 'active'
      and wm_other.user_id = profiles.id
      and wm_other.status = 'active'
  )
);
```

### User can update own profile

```sql
create policy "users can update own profile"
on public.profiles
for update
to authenticated
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
);
```

### Insert profile

Profile creation should happen via trigger after signup or via service role.

No client-side insert policy is required for Version 1.

---

## 7.2 workspaces

Workspaces are readable by active workspace members.

Only owners can update or delete a workspace.

Authenticated users can create a workspace for themselves.

### Enable RLS

```sql
alter table public.workspaces enable row level security;
```

### Members can select workspaces

```sql
create policy "members can select workspaces"
on public.workspaces
for select
to authenticated
using (
  public.is_workspace_member(id)
);
```

### Authenticated users can create own workspace

```sql
create policy "authenticated users can create own workspace"
on public.workspaces
for insert
to authenticated
with check (
  owner_id = auth.uid()
);
```

### Owners can update workspace

```sql
create policy "owners can update workspaces"
on public.workspaces
for update
to authenticated
using (
  owner_id = auth.uid()
)
with check (
  owner_id = auth.uid()
);
```

### Owners can delete workspace

```sql
create policy "owners can delete workspaces"
on public.workspaces
for delete
to authenticated
using (
  owner_id = auth.uid()
);
```

---

## 7.3 workspace_members

This table is sensitive because it controls access.

Rules:

* Members can view the roster of workspaces they belong to.
* Owners can add members.
* Owners can update roles/status.
* Owners can remove members.
* Users can view their own membership records.

### Enable RLS

```sql
alter table public.workspace_members enable row level security;
```

### Members can select roster

```sql
create policy "members can select workspace roster"
on public.workspace_members
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);
```

### Users can select own membership

```sql
create policy "users can select own workspace memberships"
on public.workspace_members
for select
to authenticated
using (
  user_id = auth.uid()
);
```

### Owners can insert members

```sql
create policy "owners can insert workspace members"
on public.workspace_members
for insert
to authenticated
with check (
  public.is_workspace_owner(workspace_id)
);
```

### Owners can update members

```sql
create policy "owners can update workspace members"
on public.workspace_members
for update
to authenticated
using (
  public.is_workspace_owner(workspace_id)
)
with check (
  public.is_workspace_owner(workspace_id)
);
```

### Owners can delete members

```sql
create policy "owners can delete workspace members"
on public.workspace_members
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

Important:

A user should not be able to make themselves owner unless an existing owner performs the change.

---

## 7.4 app_settings

Settings are readable by all workspace members.

Only owners and editors can update settings.

### Enable RLS

```sql
alter table public.app_settings enable row level security;
```

### Members can select settings

```sql
create policy "members can select app settings"
on public.app_settings
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);
```

### Owners and editors can insert settings

```sql
create policy "owners and editors can insert app settings"
on public.app_settings
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);
```

### Owners and editors can update settings

```sql
create policy "owners and editors can update app settings"
on public.app_settings
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);
```

### Owners can delete settings

```sql
create policy "owners can delete app settings"
on public.app_settings
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

# 8. Workflow-Specific Policies

## 8.1 follow_ups

Follow-ups are workflow items.

Rules:

* Workspace members can read.
* Owners and editors can create/update.
* Creator can delete their own follow-up.
* Owner can delete any follow-up.

### Enable RLS

```sql
alter table public.follow_ups enable row level security;
```

### Members can select follow-ups

```sql
create policy "members can select follow ups"
on public.follow_ups
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);
```

### Owners and editors can insert follow-ups

```sql
create policy "owners and editors can insert follow ups"
on public.follow_ups
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);
```

### Owners and editors can update follow-ups

```sql
create policy "owners and editors can update follow ups"
on public.follow_ups
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);
```

### Owners or creators can delete follow-ups

```sql
create policy "owners or creators can delete follow ups"
on public.follow_ups
for delete
to authenticated
using (
  created_by = auth.uid()
  or public.is_workspace_owner(workspace_id)
);
```

---

## 8.2 checklist_items

Checklist items are editable by owners and editors.

Deletion should be owner-only by default.

```sql
alter table public.checklist_items enable row level security;

create policy "members can select checklist items"
on public.checklist_items
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert checklist items"
on public.checklist_items
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners and editors can update checklist items"
on public.checklist_items
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete checklist items"
on public.checklist_items
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

## 8.3 site_visits

Site visits are editable by owners and editors.

Owners can delete.

```sql
alter table public.site_visits enable row level security;

create policy "members can select site visits"
on public.site_visits
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert site visits"
on public.site_visits
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners and editors can update site visits"
on public.site_visits
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete site visits"
on public.site_visits
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

# 9. Immutable / Append-Only Tables

Some tables should not be freely updated or deleted.

## 9.1 decision_status_history

Decision history should be append-only.

Rules:

* Workspace members can read.
* Owners and editors can insert.
* No update.
* No delete.

```sql
alter table public.decision_status_history enable row level security;

create policy "members can select decision history"
on public.decision_status_history
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert decision history"
on public.decision_status_history
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);
```

Do not create update or delete policies.

---

## 9.2 quote_snapshots

Quote snapshots should be mostly append-only.

Rules:

* Workspace members can read.
* Owners and editors can insert.
* Owners can delete if needed.
* Updates should be avoided.

```sql
alter table public.quote_snapshots enable row level security;

create policy "members can select quote snapshots"
on public.quote_snapshots
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert quote snapshots"
on public.quote_snapshots
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete quote snapshots"
on public.quote_snapshots
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

Do not create update policy unless explicitly required later.

---

## 9.3 score_snapshots

Score snapshots should also be mostly append-only.

Rules:

* Workspace members can read.
* Owners and editors can insert.
* Owners can delete.
* Updates should be avoided.

```sql
alter table public.score_snapshots enable row level security;

create policy "members can select score snapshots"
on public.score_snapshots
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert score snapshots"
on public.score_snapshots
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete score snapshots"
on public.score_snapshots
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

Do not create update policy unless explicitly required later.

---

## 9.4 audit_log

Audit log should not be readable or writable from normal client sessions.

Rules:

* No client SELECT.
* No client INSERT.
* No client UPDATE.
* No client DELETE.
* Service role can bypass RLS.

```sql
alter table public.audit_log enable row level security;
```

Do not create user-side policies.

Audit log should be written by:

* Database triggers
* Edge Functions using service role
* Server-side trusted operations

---

## 9.5 activity_log

Activity log can be visible to workspace members but should not be freely editable.

Rules:

* Workspace members can read.
* Owners and editors can insert lightweight activities if needed.
* No update.
* Owner can delete if cleanup required.

```sql
alter table public.activity_log enable row level security;

create policy "members can select activity log"
on public.activity_log
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert activity log"
on public.activity_log
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete activity log"
on public.activity_log
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

No update policy.

---

# 10. Import / Export / Backup Policies

## 10.1 import_jobs

Import jobs are sensitive because they may create many records.

Rules:

* Workspace members can read import job status.
* Owners and editors can create import jobs.
* Only owners can delete import job records.
* Actual bulk import should be performed by Edge Function using service role after validating workspace access.

```sql
alter table public.import_jobs enable row level security;

create policy "members can select import jobs"
on public.import_jobs
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert import jobs"
on public.import_jobs
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners and editors can update import jobs"
on public.import_jobs
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete import jobs"
on public.import_jobs
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

## 10.2 export_jobs

Export jobs may expose full workspace data.

Rules:

* Workspace members can view export job metadata.
* Owners and editors can create export jobs.
* Only owner/editor should trigger actual export.
* Owners can delete export jobs.

```sql
alter table public.export_jobs enable row level security;

create policy "members can select export jobs"
on public.export_jobs
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert export jobs"
on public.export_jobs
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners and editors can update export jobs"
on public.export_jobs
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete export jobs"
on public.export_jobs
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

## 10.3 backup_records

Backups may contain full workspace data.

Rules:

* Workspace members can see that backups exist.
* Owners and editors can create backups.
* Only owner can delete backup records.
* Actual file download should be controlled through signed URLs or Edge Functions.

```sql
alter table public.backup_records enable row level security;

create policy "members can select backup records"
on public.backup_records
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert backup records"
on public.backup_records
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete backup records"
on public.backup_records
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

No update policy unless required later.

---

# 11. Documents and Media Policies

## 11.1 documents

Document metadata is workspace-owned.

Files are stored separately in Supabase Storage.

```sql
alter table public.documents enable row level security;

create policy "members can select documents"
on public.documents
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert documents"
on public.documents
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners and editors can update documents"
on public.documents
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete documents"
on public.documents
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

## 11.2 media_assets

Media assets include:

* Builder logos
* Project hero images
* Gallery images
* Elevation renders
* Floor plans
* Master plans
* Amenity photos
* Site visit photos
* Walkthrough videos
* Progress videos

Media metadata is workspace-owned.

```sql
alter table public.media_assets enable row level security;

create policy "members can select media assets"
on public.media_assets
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert media assets"
on public.media_assets
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners and editors can update media assets"
on public.media_assets
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete media assets"
on public.media_assets
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

# 12. Storage RLS Overview

Detailed storage setup should be defined in:

```text
/docs/23_SUPABASE_STORAGE_AND_DOCUMENTS.md
```

But the RLS principle is:

```text
Users can access storage objects only when the object path belongs to a workspace where they are an active member.
```

Recommended private buckets:

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

Storage object paths should begin with:

```text
workspace/{workspace_id}/...
```

Storage policies should extract the workspace ID from the path and check membership.

Example concept:

```sql
public.is_workspace_member(
  ((storage.foldername(name))[2])::uuid
)
```

The exact storage path parser must match the final path convention from the storage document.

---

# 13. Owner-Only Delete Tables

For these tables, delete should be owner-only:

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
site_visits
checklist_items
documents
payment_milestones
negotiations
quote_snapshots
score_snapshots
backup_records
import_jobs
export_jobs
activity_log
```

Reason:

Deletion can damage historical decision records.

Editors should normally update status, close tasks, or soft-delete through app workflows instead of hard deleting.

---

# 14. Soft Delete and RLS

Many tables use:

```sql
deleted_at timestamptz
```

RLS controls access.
The application controls whether deleted rows are shown.

Default frontend queries should include:

```sql
deleted_at is null
```

Do not rely on RLS to hide soft-deleted records unless a separate policy is intentionally added.

If strict hiding is required, SELECT policies can add:

```sql
deleted_at is null
```

But this prevents users from viewing deleted records for restore/audit workflows.

Recommended Version 1:

```text
Filter deleted records in app queries.
Keep RLS focused on workspace isolation.
```

---

# 15. Standard Policy Application List

The following tables should have RLS enabled:

```sql
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.app_settings enable row level security;

alter table public.builders enable row level security;
alter table public.projects enable row level security;
alter table public.units enable row level security;
alter table public.space_details enable row level security;
alter table public.cost_breakups enable row level security;
alter table public.cost_components enable row level security;
alter table public.statutory_charges enable row level security;
alter table public.maintenance_possession_costs enable row level security;
alter table public.post_possession_budgets enable row level security;
alter table public.parking_details enable row level security;
alter table public.parking_slots enable row level security;
alter table public.legal_records enable row level security;
alter table public.location_records enable row level security;
alter table public.amenities enable row level security;
alter table public.media_assets enable row level security;

alter table public.documents enable row level security;
alter table public.site_visits enable row level security;
alter table public.checklist_items enable row level security;
alter table public.follow_ups enable row level security;
alter table public.payment_milestones enable row level security;
alter table public.negotiations enable row level security;
alter table public.decision_status_history enable row level security;
alter table public.score_snapshots enable row level security;
alter table public.quote_snapshots enable row level security;

alter table public.import_jobs enable row level security;
alter table public.export_jobs enable row level security;
alter table public.backup_records enable row level security;
alter table public.activity_log enable row level security;
alter table public.audit_log enable row level security;
```

---

# 16. Full Standard Policy Generation Template

For each standard table, generate policies using this structure.

Replace `TABLE_NAME`.

```sql
alter table public.TABLE_NAME enable row level security;

create policy "members can select TABLE_NAME"
on public.TABLE_NAME
for select
to authenticated
using (
  public.is_workspace_member(workspace_id)
);

create policy "owners and editors can insert TABLE_NAME"
on public.TABLE_NAME
for insert
to authenticated
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners and editors can update TABLE_NAME"
on public.TABLE_NAME
for update
to authenticated
using (
  public.can_edit_workspace(workspace_id)
)
with check (
  public.can_edit_workspace(workspace_id)
);

create policy "owners can delete TABLE_NAME"
on public.TABLE_NAME
for delete
to authenticated
using (
  public.is_workspace_owner(workspace_id)
);
```

---

# 17. Tables That Should Not Use Standard Policy Template

Do not blindly apply the standard template to:

```text
profiles
workspaces
workspace_members
decision_status_history
score_snapshots
quote_snapshots
audit_log
activity_log
import_jobs
export_jobs
backup_records
follow_ups
```

These tables require special policies defined above.

---

# 18. Service Role Bypass

The Supabase service role bypasses RLS.

This is intentional for:

* Edge Functions
* Import Project Pack
* Export Project Pack
* Backup creation
* Storage maintenance
* Admin seed operations
* Audit log writes
* Data repair scripts

Critical rule:

```text
SUPABASE_SERVICE_ROLE_KEY must never be used in Client Components or browser code.
```

Allowed locations:

```text
Supabase Edge Functions
Next.js Server Actions
Next.js Route Handlers
Backend admin scripts
```

Disallowed locations:

```text
Client Components
Browser JavaScript
Public environment variables
NEXT_PUBLIC_* variables
```

---

# 19. RLS Testing Plan

RLS must be tested before production use.

## 19.1 Test Users

Create:

```text
user_a_owner
user_b_editor
user_c_viewer
user_d_outsider
```

Create:

```text
workspace_a
workspace_b
```

Memberships:

```text
user_a_owner → owner of workspace_a
user_b_editor → editor of workspace_a
user_c_viewer → viewer of workspace_a
user_d_outsider → no access to workspace_a
```

---

## 19.2 Expected Access Matrix

| Scenario                             | Expected Result     |
| ------------------------------------ | ------------------- |
| Owner selects workspace records      | Allowed             |
| Editor selects workspace records     | Allowed             |
| Viewer selects workspace records     | Allowed             |
| Outsider selects workspace records   | 0 rows              |
| Owner inserts project                | Allowed             |
| Editor inserts project               | Allowed             |
| Viewer inserts project               | Denied              |
| Outsider inserts project             | Denied              |
| Owner updates project                | Allowed             |
| Editor updates project               | Allowed             |
| Viewer updates project               | Denied              |
| Owner deletes project                | Allowed             |
| Editor deletes project               | Denied              |
| Viewer deletes project               | Denied              |
| Creator deletes own follow-up        | Allowed             |
| Non-creator editor deletes follow-up | Denied unless owner |
| Audit log select from client         | Denied              |

---

## 19.3 SQL Test Strategy

Best testing approach:

1. Use Supabase local development.
2. Create test users.
3. Generate authenticated client sessions.
4. Test queries using anon key with JWTs.
5. Verify returned rows and denied mutations.

Do not rely only on service-role SQL editor tests, because service role bypasses RLS.

---

## 19.4 Application-Level RLS Test Cases

Test from the app or a test script:

```text
As owner:
- Create project
- Create unit
- Upload document
- Delete project

As editor:
- Create project
- Create unit
- Update cost
- Try deleting project, expect denied

As viewer:
- Read project
- Try creating project, expect denied
- Try updating cost, expect denied

As outsider:
- Query project list, expect zero rows
- Directly request known project ID, expect zero rows
```

---

# 20. RLS Acceptance Criteria

RLS is ready when:

1. Every user-owned table has RLS enabled.
2. Workspace helper functions exist.
3. Owner/editor/viewer role behavior works.
4. Outsiders cannot read workspace data.
5. Viewers cannot insert or update data.
6. Editors cannot delete critical records.
7. Owners can manage workspace data.
8. Workspace members can read only their workspace records.
9. Profiles are protected.
10. Workspace membership management is owner-only.
11. Decision status history is append-only.
12. Audit log is service-only.
13. Media metadata is workspace protected.
14. Document metadata is workspace protected.
15. Storage policies are aligned with workspace ownership.
16. Service role key is never exposed to frontend.
17. RLS tests pass with real authenticated sessions.

---

# 21. Final RLS Principle

The backend must protect the workspace boundary.

The app may display rich dashboards, maps, galleries, legal records, and financial analysis, but none of that matters if one user can accidentally or maliciously access another user’s data.

RLS must guarantee:

```text
My workspace data is visible only to my workspace members.
```

Everything else builds on that.
