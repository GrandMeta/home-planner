# 20_SUPABASE_BACKEND_ARCHITECTURE.md

# Real Estate Decision Portal — Supabase Backend Architecture

## 1. Purpose

This document defines the backend architecture for hosting the Real Estate Decision Portal on Supabase.

The previous version of the portal was designed as a local-first browser application. This backend plan upgrades the system to a cloud-backed architecture using Supabase while preserving the product principles already defined in the `/docs` folder.

Supabase will provide:

* Authentication
* Postgres database
* Row Level Security
* Private file storage
* Edge Functions
* Import/export backend workflows
* Future multi-user collaboration

The backend must support the complete real estate journey:

```text
Project discovery
→ Project intake
→ Unit comparison
→ Cost normalization
→ Site visits
→ Legal/RERA tracking
→ Documents
→ Follow-ups
→ Payments
→ Scoring
→ Booking readiness
→ Possession tracking
```

---

## 2. Backend Architecture Decision

The selected backend stack is:

```text
Supabase Auth
Supabase Postgres
Supabase Row Level Security
Supabase Storage
Supabase Edge Functions
Supabase CLI migrations
Next.js Supabase SSR client
```

The frontend remains:

```text
Next.js
TypeScript
Tailwind CSS
Zustand / React state
```

The backend source of truth becomes:

```text
Supabase Postgres
+
Supabase Storage
```

JSON Project Pack import/export remains as backup and migration format.

---

## 3. Backend Design Principles

The backend must follow these principles:

1. Use Supabase Postgres as canonical cloud database.
2. Use Row Level Security on every user-owned table.
3. Use workspace-based data ownership.
4. Avoid single-user hardcoding.
5. Keep all project data scoped to a workspace.
6. Support future family/advisor collaboration.
7. Keep document files private.
8. Keep service role key server-only.
9. Use migrations instead of manual dashboard-only schema changes.
10. Keep formulas in application code unless database-side calculation is explicitly required.
11. Keep generated score snapshots optional, not primary source of truth.
12. Use JSONB only where flexible nested metadata is useful.
13. Use relational tables for major entities.
14. Support import/export through Edge Functions.
15. Preserve auditability for important updates.

---

## 4. Workspace Model

The backend should use a workspace model.

Reason:

The portal may later be shared with:

* Spouse
* Family member
* Legal advisor
* Banker
* Broker
* Interior vendor

A workspace owns projects and related data.

### Core relationship

```text
auth.users
  → profiles
  → workspace_members
  → workspaces
  → projects
  → units
```

Every major real estate table should include:

```text
workspace_id uuid not null
created_by uuid
updated_by uuid
created_at timestamptz
updated_at timestamptz
```

---

## 5. User Roles

Workspace roles:

```text
owner
editor
viewer
advisor
```

### owner

Can:

* Manage workspace
* Invite members
* Add/edit/delete projects
* Upload documents
* Export data
* Delete workspace data

### editor

Can:

* Add/edit projects
* Add/edit units
* Add site visits
* Add follow-ups
* Upload documents
* Update payments

### viewer

Can:

* View projects
* View units
* View documents metadata
* View dashboards

### advisor

Can:

* View selected projects/documents
* Add notes
* Mark legal/financial review status if allowed

---

## 6. Database Table Groups

## 6.1 Identity and Workspace

Required tables:

```text
profiles
workspaces
workspace_members
app_settings
activity_log
```

## 6.2 Real Estate Master Data

Required tables:

```text
builders
projects
units
space_details
cost_breakups
statutory_charges
maintenance_possession_costs
post_possession_budgets
parking_details
legal_records
location_records
amenities
```

## 6.3 Workflow Data

Required tables:

```text
site_visits
checklist_items
follow_ups
documents
payment_milestones
negotiations
decision_status_history
```

## 6.4 Analytical / Snapshot Data

Optional but recommended:

```text
score_snapshots
quote_snapshots
backup_records
```

## 6.5 Import / Export Data

Required for backend workflows:

```text
import_jobs
export_jobs
```

---

## 7. Storage Buckets

Required private buckets:

```text
project-documents
site-visit-evidence
cost-sheets
legal-documents
imports
exports
```

Storage should not be public.

Every stored file should have a matching record in the `documents`, `import_jobs`, `export_jobs`, or `backup_records` table.

---

## 8. Row Level Security Strategy

RLS must be enabled on all workspace-owned tables.

General policy:

```text
A user can select workspace data only if they are a member of that workspace.
A user can insert/update workspace data only if they are owner or editor.
A user can delete workspace data only if they are owner, or if explicitly allowed.
```

Use helper functions:

```text
is_workspace_member(workspace_id)
has_workspace_role(workspace_id, roles[])
```

All policies should use these helper functions.

---

## 9. Data Ownership Fields

Every major table should include:

```sql
workspace_id uuid not null references public.workspaces(id) on delete cascade,
created_by uuid references auth.users(id),
updated_by uuid references auth.users(id),
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

Important records should also include:

```sql
source_type text
source_name text
source_date date
confidence text
notes text
```

---

## 10. Source and Confidence Model

The backend should preserve source/confidence metadata.

Recommended confidence values:

```text
unknown
user_estimate
online_source
builder_provided
site_visit_confirmed
written_confirmation
document_verified
legal_verified
manual_override
```

This is important for conflict resolution and decision confidence.

---

## 11. Backend Calculation Strategy

In Version 1 of Supabase backend:

Financial formulas should remain in application TypeScript.

Database stores source inputs.

Application calculates:

* Agreement value
* GST
* Stamp duty
* Registration
* Total landing cost
* True SBA cost
* True carpet cost
* EMI
* Rental yield
* Scores

Optional future improvement:

Store calculated snapshots in:

```text
score_snapshots
quote_snapshots
```

This preserves values at important decision moments.

---

## 12. Import / Export Strategy

The app should continue supporting JSON Project Pack import/export.

Backend import/export should be handled through Edge Functions.

Required functions:

```text
import-project-pack
export-project-pack
create-project-backup
```

Import should:

```text
Validate JSON
Check workspace access
Detect conflicts
Protect verified data
Create import job record
Write records into tables
Return summary
```

Export should:

```text
Check workspace access
Collect workspace records
Create Project Pack JSON
Store export file in private exports bucket
Return signed download link or export metadata
```

---

## 13. Edge Functions

Required Edge Functions:

```text
health-check
import-project-pack
export-project-pack
create-project-backup
```

Future Edge Functions:

```text
parse-cost-sheet
extract-document-fields
generate-site-visit-summary
rera-enrichment
market-benchmark-enrichment
```

---

## 14. Frontend Supabase Integration

Required frontend/backend integration files:

```text
/src/lib/supabase/client.ts
/src/lib/supabase/server.ts
/src/lib/supabase/middleware.ts
/src/lib/supabase/admin.ts
/src/lib/supabase/queries.ts
/src/lib/supabase/mutations.ts
/src/lib/supabase/storage.ts
/src/lib/supabase/auth.ts
/src/types/database.types.ts
```

`database.types.ts` should be generated from Supabase schema.

---

## 15. Environment Variables

Required local environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROJECT_REF=
SUPABASE_ACCESS_TOKEN=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=local
```

Service role key must never be used in browser code.

---

## 16. Migration Files Required

Create these migration files:

```text
0001_extensions_and_helpers.sql
0002_enums.sql
0003_auth_workspace_schema.sql
0004_real_estate_core_schema.sql
0005_site_visit_documents_payments_schema.sql
0006_storage_buckets_and_policies.sql
0007_rls_policies.sql
0008_triggers_and_functions.sql
0009_seed_initial_data.sql
```

Migrations should be committed to version control.

---

## 17. Backend Acceptance Criteria

Backend is ready when:

1. Supabase project is created.
2. Local Supabase CLI works.
3. Migrations run successfully.
4. Auth works.
5. User profile is created.
6. Default workspace is created.
7. RLS is enabled on all user-owned tables.
8. User can only access their workspace data.
9. Projects can be created.
10. Units can be created.
11. Site visits can be created.
12. Follow-ups can be created.
13. Documents metadata can be created.
14. Private storage upload works.
15. JSON export works.
16. JSON import works.
17. Service role key is not exposed to frontend.
18. Next.js SSR Supabase client works.
19. Database types are generated.
20. Backend passes RLS tests.

---

## 18. Final Backend Principle

The backend should protect the decision data.

This portal will contain:

* Property costs
* Negotiation details
* Personal financial assumptions
* Legal documents
* Site visit observations
* Family decision notes
* Payment schedules

Therefore, the backend must be designed with:

```text
Security
RLS
Private storage
Auditability
Backups
Schema discipline
```

Supabase should not be treated as just a database.

It should be treated as the secure operating layer for the real estate decision cockpit.
