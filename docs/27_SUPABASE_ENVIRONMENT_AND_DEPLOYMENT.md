# 27_SUPABASE_ENVIRONMENT_AND_DEPLOYMENT.md

# Real Estate Decision Portal — Supabase Environment and Deployment

## 1. Purpose

This document defines the environment setup, local development workflow, migration workflow, deployment process, GitHub Actions, secrets, and production readiness requirements for the Supabase backend.

The Real Estate Decision Portal uses Supabase for:

* Auth
* Postgres
* Row Level Security
* Storage
* Edge Functions
* Database migrations
* Type generation
* Local development
* Production deployment

The goal is to keep local, staging, and production environments predictable and safe.

---

# 2. Required Packages

Install Supabase client packages:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Install Supabase CLI as a development dependency if preferred:

```bash
npm install --save-dev supabase
```

Recommended CLI installation on macOS:

```bash
brew install supabase/tap/supabase
```

Verify CLI:

```bash
supabase --version
```

---

# 3. Required Project Folders

The project should include:

```text
/project-root
  /docs
    20_MEDIA_ASSETS_AND_GALLERY.md
    21_SUPABASE_DATABASE_SCHEMA.md
    22_SUPABASE_RLS_POLICIES.md
    24_SUPABASE_STORAGE_AND_DOCUMENTS.md
    25_SUPABASE_EDGE_FUNCTIONS.md
    26_SUPABASE_AUTH_AND_USER_ROLES.md
    27_SUPABASE_ENVIRONMENT_AND_DEPLOYMENT.md

  /supabase
    config.toml

    /migrations
      0001_extensions_and_helpers.sql
      0002_enums.sql
      0003_auth_workspace_schema.sql
      0004_real_estate_core_schema.sql
      0005_site_visit_documents_payments_schema.sql
      0006_storage_buckets_and_policies.sql
      0007_rls_policies.sql
      0008_triggers_and_functions.sql
      0009_seed_initial_data.sql

    /functions
      /_shared
      /health-check
      /export-project-pack
      /import-project-pack
      /create-project-backup
      /create-workspace-backup
      /get-secure-download-url
      /parse-cost-sheet

  /src
    /lib
      /supabase
        client.ts
        server.ts
        middleware.ts
        admin.ts
        auth.ts
        workspaces.ts
        functions.ts
        storage.ts

    /types
      database.types.ts

  .env.local.example
  .env.production.example
```

---

# 4. Environment Files

## 4.1 `.env.local.example`

Create this file in the repo root:

```env
# Supabase Local Development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only. Never expose this to the browser.
SUPABASE_SERVICE_ROLE_KEY=

# Required only when linking/deploying to a remote project.
SUPABASE_PROJECT_REF=
SUPABASE_ACCESS_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=local
```

---

## 4.2 `.env.production.example`

Create this file in the repo root:

```env
# Supabase Cloud Project
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only. Never expose this to the browser.
SUPABASE_SERVICE_ROLE_KEY=

# Deployment
SUPABASE_PROJECT_REF=
SUPABASE_ACCESS_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_ENV=production
```

---

## 4.3 Optional Publishable Key Naming

If the Supabase project uses newer publishable key naming, the app may use:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

instead of:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Important:

Choose one convention and keep it consistent across the codebase.

For this project, recommended Version 1 convention:

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

# 5. Environment Security Rules

## 5.1 Safe for Browser

These may be exposed to the browser:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_ENV
```

Reason:

Access is protected by:

```text
Supabase Auth
RLS policies
Storage policies
Edge Function role checks
```

---

## 5.2 Never Expose to Browser

These must never appear in browser/client code:

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ACCESS_TOKEN
SUPABASE_PROJECT_REF, if not required client-side
```

---

## 5.3 Allowed Use of Service Role Key

The service role key may be used only in:

```text
Supabase Edge Functions
Next.js Route Handlers
Next.js Server Actions
Server-only admin scripts
/src/lib/supabase/admin.ts
```

It must never be used in:

```text
Client Components
Browser JavaScript
NEXT_PUBLIC_* variables
Frontend upload utilities
Frontend auth pages
```

---

# 6. `.gitignore` Requirements

Add this to `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production
.env.production.local

# Supabase local state
.supabase/

# Optional local raw/reference files
/data/raw/*.xlsx
/data/raw/*.pdf
/data/reference/*.xlsx
/data/reference/*.pdf

# Generated backups/exports
/data/exports/
.data/
```

Commit:

```text
.env.local.example
.env.production.example
```

Do not commit:

```text
.env.local
.env.production
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ACCESS_TOKEN
```

---

# 7. Local Development Setup

## 7.1 Prerequisites

Required:

```text
Node.js 20+
npm / pnpm / yarn
Docker Desktop
Supabase CLI
```

Supabase local development uses Docker.

Ensure Docker is running before:

```bash
supabase start
```

---

## 7.2 First-Time Setup

From project root:

```bash
supabase init
```

Start the local Supabase stack:

```bash
supabase start
```

The command output provides:

```text
API URL
GraphQL URL
DB URL
Studio URL
Inbucket URL
JWT secret
anon key
service_role key
```

Copy the local API URL, anon key, and service role key into:

```text
.env.local
```

Typical local Studio URL:

```text
http://localhost:54323
```

---

# 8. Supabase Config

File:

```text
/supabase/config.toml
```

Important local auth setting:

```toml
[auth.email]
enable_confirmations = false
```

Production rule:

```text
Email confirmation must be enabled in production from Supabase Dashboard Auth settings.
```

Edge Function config:

```toml
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

# 9. Migration Workflow

## 9.1 Migration Folder

All SQL migrations live in:

```text
/supabase/migrations
```

Initial migration sequence:

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

Future migrations:

```text
0010_add_workspace_invitations.sql
0011_add_rera_enrichment_tables.sql
0012_add_market_benchmarks.sql
```

---

## 9.2 Migration Rules

Follow these rules:

1. Use sequential numbering.
2. Never edit a migration that has already been applied to production.
3. Add a new migration for every production schema change.
4. Commit migration files to Git.
5. Regenerate database types after schema changes.
6. Test locally before pushing to production.
7. Do not use Supabase Dashboard manual changes as the source of truth.

---

## 9.3 Reset Local Database

To reset the local database and apply all migrations:

```bash
supabase db reset
```

Use this during development when migrations change.

Warning:

```text
This resets local database data.
```

---

## 9.4 Apply New Local Migrations

When local stack is already running and you only need to apply pending migrations:

```bash
supabase migration up
```

If there are migration conflicts, use:

```bash
supabase db reset
```

---

# 10. Type Generation

After every schema change, regenerate TypeScript types.

Recommended output path:

```text
/src/types/database.types.ts
```

Local types:

```bash
supabase gen types typescript --local > src/types/database.types.ts
```

Remote production types:

```bash
supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/types/database.types.ts
```

Commit generated types with the migration that changed the schema.

Rule:

```text
Migration file and database.types.ts should be committed together.
```

---

# 11. Running Edge Functions Locally

Serve all functions:

```bash
supabase functions serve
```

Serve specific function:

```bash
supabase functions serve health-check --no-verify-jwt
```

Serve with debug:

```bash
supabase functions serve export-project-pack --debug
```

Typical local function URL:

```text
http://localhost:54321/functions/v1/health-check
```

---

# 12. Edge Function Secrets

Set local function secrets if needed:

```bash
supabase secrets set SUPABASE_URL=http://127.0.0.1:54321
supabase secrets set SUPABASE_ANON_KEY=<local-anon-key>
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
supabase secrets set APP_ENV=local
supabase secrets set APP_URL=http://localhost:3000
```

For production:

```bash
supabase secrets set SUPABASE_URL=https://<project-ref>.supabase.co --project-ref <project-ref>
supabase secrets set SUPABASE_ANON_KEY=<production-anon-key> --project-ref <project-ref>
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<production-service-role-key> --project-ref <project-ref>
supabase secrets set APP_ENV=production --project-ref <project-ref>
supabase secrets set APP_URL=https://yourdomain.com --project-ref <project-ref>
```

---

# 13. Linking to Production Supabase Project

## 13.1 Login

```bash
supabase login
```

## 13.2 Link Local Project to Remote

```bash
supabase link --project-ref <your-project-ref>
```

The project ref is available in Supabase Dashboard project settings.

---

## 13.3 Check Remote Diff

Before pushing migrations:

```bash
supabase db diff
```

Review the diff carefully.

---

## 13.4 Push Migrations to Remote

```bash
supabase db push
```

Important:

Do not run production migration commands casually.

Always review:

```text
Which migration is being applied?
Does it modify existing tables?
Does it drop or rename anything?
Can it affect user data?
```

---

# 14. Deployment Environments

Recommended environments:

| Environment | Purpose                | Supabase                    |
| ----------- | ---------------------- | --------------------------- |
| Local       | Development            | Local Supabase Docker stack |
| Staging     | Pre-production testing | Separate Supabase project   |
| Production  | Real use               | Production Supabase project |

Minimum acceptable setup:

```text
Local + Production
```

Recommended setup:

```text
Local + Staging + Production
```

Use separate environment variables for each environment.

---

# 15. Hosting Frontend

Recommended hosting options:

```text
Vercel
Netlify
AWS Amplify
Self-hosted Node
```

For simplest Next.js deployment:

```text
Vercel
```

Required hosting environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_ENV=production
```

If using Edge Functions and CI/CD:

```env
SUPABASE_PROJECT_REF=
SUPABASE_ACCESS_TOKEN=
```

---

# 16. Supabase Auth Production Settings

Before production launch, configure Supabase Dashboard Auth settings.

## 16.1 Site URL

Set Site URL to:

```text
https://yourdomain.com
```

## 16.2 Redirect URLs

Add redirect URLs:

```text
https://yourdomain.com/auth/confirm
https://yourdomain.com/auth/callback
https://yourdomain.com/auth/reset-password
```

For local development, add:

```text
http://localhost:3000/auth/confirm
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
```

## 16.3 Email Confirmation

Production:

```text
Enable email confirmation.
```

Local:

```text
Can be disabled for faster development.
```

## 16.4 Password Rules

Recommended:

```text
Minimum length: 8+
Require secure passwords where possible
Enable password reset
Enable magic link fallback
```

---

# 17. GitHub Secrets

For CI/CD, add these GitHub repository secrets:

| Secret                          | Purpose                           |
| ------------------------------- | --------------------------------- |
| `SUPABASE_PROJECT_REF`          | Supabase project reference        |
| `SUPABASE_ACCESS_TOKEN`         | Supabase personal access token    |
| `SUPABASE_DB_PASSWORD`          | Optional, if required by workflow |
| `NEXT_PUBLIC_SUPABASE_URL`      | Optional for frontend CI          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional for frontend CI          |

Do not add:

```text
SUPABASE_SERVICE_ROLE_KEY
```

to GitHub unless a workflow explicitly needs it.

For migration/function deployment, usually:

```text
SUPABASE_PROJECT_REF
SUPABASE_ACCESS_TOKEN
```

are sufficient.

---

# 18. GitHub Actions — Supabase Deploy

Create:

```text
/.github/workflows/supabase-deploy.yml
```

```yaml
name: Deploy Supabase Backend

on:
  push:
    branches:
      - main
    paths:
      - "supabase/migrations/**"
      - "supabase/functions/**"
      - "supabase/config.toml"
      - ".github/workflows/supabase-deploy.yml"

  workflow_dispatch:

jobs:
  deploy-migrations:
    name: Deploy database migrations
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Link Supabase project
        run: supabase link --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

      - name: Push database migrations
        run: supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  deploy-functions:
    name: Deploy Edge Functions
    runs-on: ubuntu-latest
    needs:
      - deploy-migrations

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Deploy Edge Functions
        run: |
          supabase functions deploy health-check --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}" --no-verify-jwt
          supabase functions deploy export-project-pack --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"
          supabase functions deploy import-project-pack --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"
          supabase functions deploy create-project-backup --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"
          supabase functions deploy create-workspace-backup --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"
          supabase functions deploy get-secure-download-url --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"
          supabase functions deploy parse-cost-sheet --project-ref "${{ secrets.SUPABASE_PROJECT_REF }}"
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

---

# 19. Optional GitHub Actions — Supabase CI Check

Create:

```text
/.github/workflows/supabase-ci.yml
```

```yaml
name: Supabase CI

on:
  pull_request:
    branches:
      - main
    paths:
      - "supabase/**"

jobs:
  validate-supabase:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Supabase CLI
        uses: supabase/setup-cli@v1
        with:
          version: latest

      - name: Start local Supabase
        run: supabase start

      - name: Reset local database with migrations
        run: supabase db reset

      - name: Generate types
        run: supabase gen types typescript --local > src/types/database.types.ts

      - name: Stop Supabase
        if: always()
        run: supabase stop
```

This workflow checks whether migrations apply cleanly before merge.

---

# 20. Deployment Order

Use this deployment sequence:

```text
1. Confirm local app builds.
2. Confirm Supabase local starts.
3. Run supabase db reset locally.
4. Confirm all migrations apply.
5. Confirm RLS tests pass.
6. Confirm storage buckets exist locally.
7. Confirm Edge Functions serve locally.
8. Generate database.types.ts.
9. Commit migrations and generated types.
10. Push to GitHub.
11. Deploy migrations to production.
12. Deploy Edge Functions.
13. Set production function secrets.
14. Deploy frontend.
15. Configure Supabase Auth production URLs.
16. Run production smoke tests.
```

---

# 21. Production Checklist Before First Deploy

## 21.1 Supabase Project

Check:

```text
Supabase project created.
Database region selected appropriately.
Project ref copied.
API keys copied.
Service role key stored securely.
```

---

## 21.2 Environment Variables

Check frontend hosting has:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_ENV
```

Check server-only environment has:

```text
SUPABASE_SERVICE_ROLE_KEY
```

Check GitHub has:

```text
SUPABASE_PROJECT_REF
SUPABASE_ACCESS_TOKEN
```

---

## 21.3 Auth

Check:

```text
Email confirmation enabled in production.
Site URL configured.
Redirect URLs configured.
Password reset URL configured.
Magic link redirect URL configured.
```

---

## 21.4 Database

Check:

```text
All migrations applied.
All tables exist.
All enums exist.
All updated_at triggers exist.
New user trigger works.
RLS enabled on all workspace tables.
RLS helper functions exist.
```

---

## 21.5 Storage

Check:

```text
All buckets exist.
All buckets are private.
Storage RLS policies exist.
Allowed MIME types are correct.
File size limits are correct.
Signed URLs work.
```

---

## 21.6 Edge Functions

Check:

```text
Functions deployed.
Function secrets set.
health-check works.
export-project-pack works.
import-project-pack validate_only works.
get-secure-download-url works.
parse-cost-sheet returns safe review data.
```

---

## 21.7 Frontend

Check:

```text
Frontend deployed.
Auth pages work.
Protected routes redirect correctly.
Dashboard loads after login.
Active workspace resolves.
Project creation works.
Document upload works.
Media upload works.
Export works.
```

---

# 22. Production Smoke Test

After production deployment, run this smoke test:

```text
1. Open production app.
2. Register new user.
3. Confirm email.
4. Login.
5. Verify profile created.
6. Verify workspace created.
7. Verify app_settings created.
8. Add builder.
9. Add project.
10. Add unit.
11. Add cost details.
12. Upload document.
13. Upload media asset.
14. Create site visit.
15. Create follow-up.
16. Export Project Pack.
17. Generate signed URL.
18. Logout.
19. Login again.
20. Verify data persists.
```

---

# 23. RLS Production Smoke Test

Create:

```text
User A
User B
```

Test:

```text
User A creates workspace and project.
User B logs in separately.
User B should not see User A project.
User A adds User B as viewer.
User B can now see project.
User B cannot edit project.
User A changes User B to editor.
User B can edit project.
User B still cannot delete project if delete is owner-only.
User A removes User B.
User B loses access.
```

---

# 24. Edge Function Production Smoke Test

Test:

```bash
curl -i https://<project-ref>.supabase.co/functions/v1/health-check
```

Expected:

```json
{
  "data": {
    "status": "ok"
  },
  "error": null
}
```

For authenticated functions, test through the app or with a valid user JWT.

Expected behavior:

```text
No token → 401
Wrong workspace → 403
Viewer on owner/editor function → 403
Owner/editor → success
```

---

# 25. Common Problems and Fixes

## 25.1 App Cannot Connect to Supabase

Check:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
Supabase project status
Network access
```

---

## 25.2 Auth Redirect Fails

Check:

```text
Supabase Auth Site URL
Redirect URLs
/auth/confirm route
/auth/callback route
NEXT_PUBLIC_APP_URL
```

---

## 25.3 RLS Returns Empty Rows

Check:

```text
User is authenticated.
workspace_members row exists.
workspace_members.status = active.
Query includes correct workspace_id.
RLS helper functions work.
```

---

## 25.4 Edge Function Returns 401

Check:

```text
JWT is sent.
Function verify_jwt config is correct.
Authorization header exists.
User session is valid.
```

---

## 25.5 Edge Function Returns 403

Check:

```text
workspace_id is sent.
User is active workspace member.
Role is owner/editor for restricted function.
```

---

## 25.6 Storage Upload Fails

Check:

```text
Bucket exists.
Bucket is private.
MIME type allowed.
File size within limit.
Storage path starts with workspace/{workspace_id}/.
Storage RLS policies exist.
User role is owner/editor.
```

---

## 25.7 Types Are Outdated

Run:

```bash
supabase gen types typescript --local > src/types/database.types.ts
```

or:

```bash
supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/types/database.types.ts
```

---

# 26. Supabase Dashboard Areas

Useful dashboard sections:

| Area                   | Purpose                          |
| ---------------------- | -------------------------------- |
| Table Editor           | Inspect data                     |
| SQL Editor             | Run SQL manually                 |
| Auth Users             | Manage users                     |
| Auth URL Configuration | Site URL and redirect URLs       |
| Storage Buckets        | Buckets and files                |
| Edge Functions         | Function status                  |
| Logs Explorer          | Debug API/function/database logs |
| API Settings           | Project URL and API keys         |
| Database Settings      | Connection strings and pooling   |
| Project Settings       | Project ref and general config   |

---

# 27. Deployment Acceptance Criteria

Environment and deployment setup is ready when:

1. Supabase CLI is installed.
2. Local Supabase starts successfully.
3. `.env.local` is configured.
4. `.env.production.example` exists.
5. Migrations apply locally with `supabase db reset`.
6. Storage buckets are created by migration.
7. RLS policies are applied by migration.
8. Edge Functions serve locally.
9. Database types generate successfully.
10. Production Supabase project is linked.
11. GitHub secrets are configured.
12. GitHub deploy workflow exists.
13. Production migrations deploy successfully.
14. Edge Functions deploy successfully.
15. Frontend hosting environment variables are set.
16. Production Auth URLs are configured.
17. Production email confirmation is enabled.
18. Production smoke test passes.
19. RLS smoke test passes.
20. No secret keys are exposed in client code.

---

# 28. Final Deployment Principle

Deployment must be boring, repeatable, and safe.

The app will contain private financial, legal, and decision data. Therefore:

```text
Do not deploy schema changes manually.
Do not expose secrets.
Do not bypass RLS casually.
Do not rely on frontend-only security.
Do not keep production-only changes outside Git.
```

The correct operating model is:

```text
Migration files
+ generated types
+ private env secrets
+ automated deployment
+ production smoke tests
```

The backend should be treated as a controlled decision-data system, not just a development database.
