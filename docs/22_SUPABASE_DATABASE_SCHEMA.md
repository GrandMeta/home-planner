# 22_SUPABASE_DATABASE_SCHEMA.md

# Real Estate Decision Portal — Supabase Database Schema

## 1. Purpose

This document defines the canonical Supabase Postgres database schema for the Real Estate Decision Portal.

The database must support:

* Supabase Auth-linked user profiles
* Workspace-based ownership
* Multi-user collaboration
* Builders
* Projects
* Units
* Cost normalization
* Statutory charges
* Maintenance and possession costs
* Parking details
* Legal/RERA tracking
* Location intelligence
* Amenities
* Media assets and project gallery
* Documents
* Site visits
* Checklist items
* Follow-ups
* Payment milestones
* Negotiations
* Score snapshots
* Quote snapshots
* Import/export jobs
* Backups
* Audit logs

The schema should be secure, normalized, RLS-ready, and suitable for long-term real estate decision tracking.

---

## 2. Backend Source of Truth

The backend source of truth is:

```text
Supabase Postgres
+
Supabase Storage
```

The app should not treat Excel as the long-term data source.

Excel may only be used as:

* Initial reference
* Migration source
* Export format
* Backup format

The canonical data flow should be:

```text
Supabase tables
→ Application calculations
→ Dashboard / comparison / score views
```

JSON Project Pack import/export should remain available as backup and migration format.

---

## 3. Major Schema Groups

## 3.1 Auth and Workspace

| Table               | Purpose                                    |
| ------------------- | ------------------------------------------ |
| `profiles`          | One row per Supabase Auth user             |
| `workspaces`        | A personal or household decision workspace |
| `workspace_members` | Users linked to workspaces with roles      |
| `app_settings`      | Workspace-level defaults and assumptions   |
| `activity_log`      | Lightweight activity history               |
| `audit_log`         | Detailed mutation audit trail              |

---

## 3.2 Real Estate Core

| Table                          | Purpose                                                 |
| ------------------------------ | ------------------------------------------------------- |
| `builders`                     | Builder/developer master data                           |
| `projects`                     | Main apartment project record                           |
| `units`                        | Individual flats/units being evaluated                  |
| `space_details`                | SBA, carpet, balcony, UDS, layout ratings               |
| `cost_breakups`                | Main unit quote/cost-sheet header                       |
| `cost_components`              | Flexible builder cost line items                        |
| `statutory_charges`            | GST, TDS, stamp duty, registration, khata, MODT         |
| `maintenance_possession_costs` | Corpus, advance maintenance, possession charges         |
| `post_possession_budgets`      | Interiors, appliances, move-in budget                   |
| `parking_details`              | Unit-level parking summary                              |
| `parking_slots`                | Individual parking slot records                         |
| `legal_records`                | RERA, title, approvals, litigation, agreement           |
| `location_records`             | Coordinates, commute, metro, micro-market               |
| `amenities`                    | Amenity list and readiness                              |
| `media_assets`                 | Project images, videos, logos, floor plans, site photos |

---

## 3.3 Workflow

| Table                     | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `site_visits`             | Scheduled and completed visits            |
| `checklist_items`         | Structured site visit checklist responses |
| `follow_ups`              | Builder/legal/bank/family follow-up tasks |
| `documents`               | Uploaded or linked documents              |
| `payment_milestones`      | Payment schedule and receipt tracking     |
| `negotiations`            | Quote revisions and commitments           |
| `decision_status_history` | Status transition history                 |
| `score_snapshots`         | Point-in-time living/investment scores    |
| `quote_snapshots`         | Point-in-time financial quote snapshots   |

---

## 3.4 Jobs and Backups

| Table            | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `import_jobs`    | JSON/Excel import job tracking                  |
| `export_jobs`    | JSON/CSV export job tracking                    |
| `backup_records` | Full workspace backup records                   |
| `audit_log`      | Immutable or semi-immutable data mutation trail |

---

# 4. Data Type Conventions

## 4.1 UUID

Use `gen_random_uuid()` from `pgcrypto`.

```sql
id uuid primary key default gen_random_uuid()
```

Use `gen_random_uuid()` instead of `uuid_generate_v4()` unless the project explicitly enables `uuid-ossp`.

---

## 4.2 Timestamps

Use timezone-aware timestamps.

```sql
created_at timestamptz not null default now(),
updated_at timestamptz not null default now(),
deleted_at timestamptz
```

---

## 4.3 Money

Store INR amounts as numbers.

```sql
numeric(14,2)
```

Do not store formatted strings such as:

```text
₹1,83,26,994
```

Formatting belongs in the frontend.

---

## 4.4 Percentages

Store percentage values as numeric percentage.

```sql
numeric(7,4)
```

Example:

```text
5.0000 means 5%
```

Do not store `0.05` unless explicitly documented.

---

## 4.5 Areas

Use:

```sql
numeric(10,2)
```

for square feet and acres.

---

## 4.6 Flexible Metadata

Use `jsonb` only where flexibility is required.

Good JSONB use cases:

* Score breakdown payload
* Import/export summaries
* Extracted document data
* Gallery metadata
* UI display preferences
* Interior budget assumptions

Avoid hiding core searchable/filterable fields inside JSONB.

---

# 5. Required Extensions

Migration file:

```text
/supabase/migrations/0001_extensions_and_helpers.sql
```

```sql
create extension if not exists pgcrypto;

-- Optional later if geospatial queries become important:
-- create extension if not exists postgis;
```

---

# 6. Required Enums

Migration file:

```text
/supabase/migrations/0002_enums.sql
```

Use lowercase snake_case enum values. Frontend should map these to display labels.

```sql
create type public.workspace_role as enum (
  'owner',
  'editor',
  'viewer',
  'advisor'
);

create type public.membership_status as enum (
  'invited',
  'active',
  'removed'
);

create type public.project_status as enum (
  'new_lead',
  'data_pending',
  'site_visit_planned',
  'site_visited',
  'under_comparison',
  'family_review_required',
  'financial_review_required',
  'legal_review_required',
  'shortlisted',
  'strong_shortlist',
  'negotiation',
  'booking_ready',
  'booked',
  'loan_in_progress',
  'payment_tracking',
  'registration_pending',
  'registered',
  'possession_pending',
  'possession_received',
  'rejected',
  'watchlist',
  'on_hold',
  'closed'
);

create type public.project_purpose as enum (
  'living',
  'investment',
  'both',
  'undecided'
);

create type public.project_type as enum (
  'apartment',
  'villa',
  'plot',
  'row_house',
  'other'
);

create type public.city_zone as enum (
  'east',
  'north',
  'south',
  'west',
  'central',
  'other',
  'unknown'
);

create type public.risk_level as enum (
  'low',
  'medium',
  'high',
  'critical',
  'unknown'
);

create type public.data_confidence as enum (
  'unknown',
  'user_estimate',
  'online_source',
  'builder_provided',
  'site_visit_confirmed',
  'written_confirmation',
  'document_verified',
  'legal_verified',
  'manual_override'
);

create type public.source_type as enum (
  'unknown',
  'user_entry',
  'builder_cost_sheet',
  'builder_whatsapp',
  'builder_email',
  'site_visit',
  'rera',
  'legal_document',
  'bank_document',
  'online_source',
  'manual_override',
  'imported_json',
  'imported_excel'
);

create type public.cost_treatment as enum (
  'separate',
  'included',
  'bundled',
  'not_applicable',
  'unknown',
  'estimated',
  'manual_override'
);

create type public.cost_component_category as enum (
  'basic_flat_cost',
  'parking',
  'clubhouse',
  'amenities',
  'infrastructure',
  'bwssb',
  'bescom',
  'power_backup',
  'ev_charging',
  'plc',
  'corner_premium',
  'facing_premium',
  'floor_rise',
  'legal',
  'maintenance',
  'corpus',
  'possession',
  'interiors',
  'other'
);

create type public.parking_type as enum (
  'covered',
  'basement',
  'stilt',
  'open',
  'mechanical',
  'tandem',
  'independent',
  'unknown'
);

create type public.checklist_status as enum (
  'not_checked',
  'checked',
  'needs_follow_up',
  'risk',
  'not_applicable'
);

create type public.follow_up_status as enum (
  'open',
  'in_progress',
  'waiting_for_builder',
  'waiting_for_legal_review',
  'waiting_for_bank',
  'waiting_for_family',
  'closed',
  'dropped'
);

create type public.priority_level as enum (
  'low',
  'medium',
  'high',
  'critical'
);

create type public.document_status as enum (
  'required',
  'requested',
  'collected',
  'reviewed',
  'pending',
  'not_applicable',
  'risk'
);

create type public.document_review_status as enum (
  'not_reviewed',
  'in_review',
  'cleared',
  'risk',
  'not_applicable'
);

create type public.payment_status as enum (
  'upcoming',
  'due',
  'paid',
  'overdue',
  'not_applicable',
  'unknown'
);

create type public.recommendation_status as enum (
  'strong_shortlist',
  'shortlist',
  'revisit',
  'watchlist',
  'avoid_for_now',
  'rejected',
  'on_hold',
  'data_pending',
  'legal_review_required',
  'financial_review_required'
);

create type public.media_asset_type as enum (
  'image',
  'video',
  'logo',
  'floor_plan',
  'master_plan',
  'document_preview',
  'site_photo',
  'other'
);

create type public.media_category as enum (
  'hero',
  'gallery',
  'elevation',
  'floor_plan',
  'master_plan',
  'amenity_photo',
  'site_photo',
  'document_preview',
  'builder_logo',
  'project_logo',
  'walkthrough',
  'aerial_view',
  'progress_update',
  'other'
);

create type public.video_platform as enum (
  'youtube',
  'vimeo',
  'other',
  'unknown'
);

create type public.job_status as enum (
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled'
);
```

---

# 7. Common Column Patterns

## 7.1 Workspace-Owned Table Columns

Most user-owned tables should include:

```sql
workspace_id uuid not null references public.workspaces(id) on delete cascade,
created_by uuid references auth.users(id),
updated_by uuid references auth.users(id),
created_at timestamptz not null default now(),
updated_at timestamptz not null default now(),
deleted_at timestamptz
```

---

## 7.2 Source-Aware Columns

Important decision data should include:

```sql
source_type public.source_type not null default 'unknown',
source_name text,
source_date date,
confidence public.data_confidence not null default 'unknown',
notes text
```

---

# 8. Auth and Workspace Schema

Migration file:

```text
/supabase/migrations/0003_auth_workspace_schema.sql
```

## 8.1 profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  display_name text,
  avatar_url text,
  phone text,
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles(email);
```

---

## 8.2 workspaces

```sql
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  owner_id uuid not null references auth.users(id),
  default_city text not null default 'Bangalore',
  default_city_zone public.city_zone not null default 'east',
  default_currency text not null default 'INR',
  is_personal boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index workspaces_owner_id_idx on public.workspaces(owner_id);
create index workspaces_slug_idx on public.workspaces(slug);
```

---

## 8.3 workspace_members

```sql
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'viewer',
  status public.membership_status not null default 'active',
  invited_by uuid references auth.users(id),
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint workspace_members_unique unique (workspace_id, user_id)
);

create index workspace_members_workspace_id_idx on public.workspace_members(workspace_id);
create index workspace_members_user_id_idx on public.workspace_members(user_id);
create index workspace_members_role_idx on public.workspace_members(role);
```

---

## 8.4 app_settings

```sql
create table public.app_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,

  default_city text not null default 'Bangalore',
  default_city_zone public.city_zone not null default 'east',
  default_currency text not null default 'INR',
  locale text not null default 'en-IN',

  residence_latitude numeric(10,7),
  residence_longitude numeric(10,7),
  residence_label text,

  workplace_latitude numeric(10,7),
  workplace_longitude numeric(10,7),
  workplace_label text,

  default_gst_percent numeric(7,4),
  default_tds_percent numeric(7,4),
  default_stamp_duty_percent numeric(7,4),
  default_registration_percent numeric(7,4),
  default_agreement_registration_amount numeric(14,2),
  default_franking_amount numeric(14,2),
  default_khata_transfer_amount numeric(14,2),
  default_mutation_amount numeric(14,2),
  default_modt_percent numeric(7,4),

  default_loan_to_value_percent numeric(7,4),
  default_interest_rate_percent numeric(7,4),
  default_loan_tenure_months integer,

  interior_budget_by_bhk jsonb not null default '{}'::jsonb,
  living_score_weights jsonb not null default '{}'::jsonb,
  investment_score_weights jsonb not null default '{}'::jsonb,
  media_preferences jsonb not null default '{}'::jsonb,
  display_preferences jsonb not null default '{}'::jsonb,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Important:

Do not permanently hardcode legal/statutory assumptions in frontend code. Store them as editable settings.

---

# 9. Real Estate Core Schema

Migration file:

```text
/supabase/migrations/0004_real_estate_core_schema.sql
```

---

## 9.1 builders

```sql
create table public.builders (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  builder_name text not null,
  display_name text,
  builder_group_name text,
  legal_name text,
  established_year smallint,

  logo_url text,
  logo_initials text,
  logo_color text default '#2563EB',
  brand_website_hero_url text,

  website text,
  phone text,
  email text,
  office_address text,

  primary_sales_contact_name text,
  primary_sales_contact_phone text,
  primary_sales_contact_email text,
  secondary_contact_name text,
  secondary_contact_phone text,
  secondary_contact_email text,

  credibility_rating numeric(3,1) check (credibility_rating between 0 and 10),
  past_projects_count smallint,
  past_projects_delivered_on_time smallint,
  litigation_history boolean default false,
  litigation_notes text,
  brand_notes text,
  credibility_notes text,
  past_projects_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index builders_workspace_id_idx on public.builders(workspace_id);
create index builders_name_idx on public.builders(builder_name);
```

---

## 9.2 projects

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  builder_id uuid references public.builders(id) on delete set null,

  project_name text not null,
  display_name text,
  short_name text,
  builder_name text,

  project_status public.project_status not null default 'new_lead',
  project_purpose public.project_purpose not null default 'undecided',
  project_type public.project_type not null default 'apartment',
  recommendation_status public.recommendation_status,

  city text not null default 'Bangalore',
  city_zone public.city_zone not null default 'east',
  micro_market text,
  locality text,
  address text,
  pin_code text,
  landmark text,

  total_land_area_acres numeric(10,2),
  total_units integer,
  total_towers integer,
  total_floors integer,
  available_bhks text[] not null default '{}'::text[],
  open_space_percent numeric(7,4),
  density_notes text,

  price_range_min_per_sqft numeric(14,2),
  price_range_max_per_sqft numeric(14,2),
  indicative_price_min numeric(14,2),
  indicative_price_max numeric(14,2),

  possession_date_builder date,
  possession_date_rera date,
  possession_notes text,

  rera_number text,
  rera_status text,
  rera_url text,

  project_logo_url text,
  project_brand_color text,

  brochure_collected boolean not null default false,
  floor_plans_collected boolean not null default false,
  master_plan_collected boolean not null default false,
  rera_certificate_collected boolean not null default false,
  cost_sheet_collected boolean not null default false,

  project_highlights text[] not null default '{}'::text[],
  sales_contact_name text,
  sales_contact_phone text,
  sales_contact_email text,

  shortlisted_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text,

  overall_risk_level public.risk_level not null default 'unknown',
  next_action text,
  source_of_lead text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index projects_workspace_id_idx on public.projects(workspace_id);
create index projects_builder_id_idx on public.projects(builder_id);
create index projects_status_idx on public.projects(project_status);
create index projects_purpose_idx on public.projects(project_purpose);
create index projects_city_zone_idx on public.projects(city_zone);
create index projects_micro_market_idx on public.projects(micro_market);
create index projects_name_fts_idx on public.projects using gin (to_tsvector('english', project_name));
```

---

## 9.3 units

```sql
create table public.units (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,

  unit_label text,
  bhk_configuration text not null,
  tower text,
  wing text,
  floor_number integer,
  unit_number text,
  facing text,
  floor_preference text,
  vastu_notes text,

  base_selling_price numeric(14,2),
  bsp_per_sqft numeric(14,2),

  unit_status public.project_status not null default 'data_pending',
  recommendation_status public.recommendation_status,

  selected_for_comparison boolean not null default false,
  is_shortlisted boolean not null default false,

  possession_date_expected date,
  possession_date_committed date,

  overall_risk_level public.risk_level not null default 'unknown',
  next_action text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index units_workspace_id_idx on public.units(workspace_id);
create index units_project_id_idx on public.units(project_id);
create index units_bhk_idx on public.units(bhk_configuration);
create index units_selected_idx on public.units(selected_for_comparison);
```

---

## 9.4 space_details

```sql
create table public.space_details (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  unit_id uuid not null unique references public.units(id) on delete cascade,

  super_built_up_area_sqft numeric(10,2),
  built_up_area_sqft numeric(10,2),
  carpet_area_rera_sqft numeric(10,2),
  carpet_area_actual_sqft numeric(10,2),
  balcony_area_sqft numeric(10,2),
  utility_area_sqft numeric(10,2),
  exclusive_open_area_sqft numeric(10,2),
  uds_sqft numeric(10,2),

  efficiency_percent_override numeric(7,4),
  layout_rating numeric(5,2) check (layout_rating between 0 and 10),
  ventilation_rating numeric(5,2) check (ventilation_rating between 0 and 10),
  natural_light_rating numeric(5,2) check (natural_light_rating between 0 and 10),
  privacy_rating numeric(5,2) check (privacy_rating between 0 and 10),

  layout_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index space_details_workspace_id_idx on public.space_details(workspace_id);
create index space_details_unit_id_idx on public.space_details(unit_id);
```

---

# 10. Cost and Financial Schema

## 10.1 cost_breakups

```sql
create table public.cost_breakups (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  unit_id uuid not null unique references public.units(id) on delete cascade,

  quote_name text,
  quote_date date,
  quote_valid_until date,

  base_rate_per_sqft numeric(14,2),
  basic_flat_cost_amount numeric(14,2),
  builder_quoted_total_amount numeric(14,2),
  agreement_value_override_amount numeric(14,2),
  total_landing_cost_override_amount numeric(14,2),

  floor_rise_start_floor integer,
  floor_rise_rate_per_sqft numeric(14,2),
  floor_rise_chargeable_floors integer,
  floor_rise_amount_override numeric(14,2),
  floor_rise_treatment public.cost_treatment not null default 'unknown',

  plc_amount numeric(14,2),
  plc_treatment public.cost_treatment not null default 'unknown',
  plc_notes text,

  club_membership_amount numeric(14,2),
  club_treatment public.cost_treatment not null default 'unknown',

  infrastructure_charge_amount numeric(14,2),
  infrastructure_treatment public.cost_treatment not null default 'unknown',

  power_backup_amount numeric(14,2),
  power_backup_treatment public.cost_treatment not null default 'unknown',

  discount_amount numeric(14,2),
  discount_notes text,

  cost_sheet_received boolean not null default false,
  final_cost_sheet_received boolean not null default false,

  source_type public.source_type not null default 'builder_cost_sheet',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cost_breakups_workspace_id_idx on public.cost_breakups(workspace_id);
create index cost_breakups_unit_id_idx on public.cost_breakups(unit_id);
```

---

## 10.2 cost_components

This is required because every builder uses a different cost-sheet format.

```sql
create table public.cost_components (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  cost_breakup_id uuid not null references public.cost_breakups(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,

  component_category public.cost_component_category not null default 'other',
  component_name text not null,
  description text,

  amount numeric(14,2),
  rate_per_sqft numeric(14,2),
  quantity numeric(14,2),
  percentage numeric(7,4),

  treatment public.cost_treatment not null default 'unknown',
  calculation_method text,
  is_taxable boolean not null default false,
  included_in_agreement_value boolean not null default true,
  included_in_landing_cost boolean not null default true,
  is_refundable boolean not null default false,

  sort_order integer not null default 0,

  source_type public.source_type not null default 'builder_cost_sheet',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index cost_components_workspace_id_idx on public.cost_components(workspace_id);
create index cost_components_cost_breakup_id_idx on public.cost_components(cost_breakup_id);
create index cost_components_unit_id_idx on public.cost_components(unit_id);
create index cost_components_category_idx on public.cost_components(component_category);
```

---

## 10.3 statutory_charges

```sql
create table public.statutory_charges (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  unit_id uuid not null unique references public.units(id) on delete cascade,

  gst_applicable boolean,
  gst_percent numeric(7,4),
  gst_amount_override numeric(14,2),
  gst_treatment public.cost_treatment not null default 'unknown',

  tds_applicable boolean,
  tds_percent numeric(7,4),
  tds_amount_override numeric(14,2),
  tds_notes text,

  stamp_duty_percent numeric(7,4),
  stamp_duty_amount_override numeric(14,2),

  sale_deed_registration_percent numeric(7,4),
  sale_deed_registration_amount_override numeric(14,2),

  agreement_registration_amount numeric(14,2),
  franking_or_estamping_amount numeric(14,2),
  khata_transfer_amount numeric(14,2),
  mutation_amount numeric(14,2),

  mortgage_registration_amount numeric(14,2),
  modt_percent numeric(7,4),
  modt_amount_override numeric(14,2),

  bank_legal_technical_amount numeric(14,2),
  bank_processing_fee_amount numeric(14,2),

  cess_or_surcharge_amount numeric(14,2),
  other_government_charges_amount numeric(14,2),

  statutory_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index statutory_charges_workspace_id_idx on public.statutory_charges(workspace_id);
create index statutory_charges_unit_id_idx on public.statutory_charges(unit_id);
```

---

## 10.4 maintenance_possession_costs

```sql
create table public.maintenance_possession_costs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  unit_id uuid not null unique references public.units(id) on delete cascade,

  corpus_fund_amount numeric(14,2),
  corpus_rate_per_sqft numeric(14,2),

  maintenance_rate_per_sqft_per_month numeric(14,2),
  maintenance_tenure_months integer,
  advance_maintenance_amount_override numeric(14,2),
  maintenance_gst_percent numeric(7,4),

  clubhouse_maintenance_amount numeric(14,2),
  sinking_fund_amount numeric(14,2),

  gas_connection_amount numeric(14,2),
  water_meter_amount numeric(14,2),
  electricity_meter_amount numeric(14,2),
  generator_power_backup_amount numeric(14,2),
  legal_possession_charges_amount numeric(14,2),
  association_formation_charges_amount numeric(14,2),
  other_possession_charges_amount numeric(14,2),

  possession_notes text,

  source_type public.source_type not null default 'builder_cost_sheet',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index maintenance_possession_workspace_id_idx on public.maintenance_possession_costs(workspace_id);
create index maintenance_possession_unit_id_idx on public.maintenance_possession_costs(unit_id);
```

---

## 10.5 post_possession_budgets

```sql
create table public.post_possession_budgets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  unit_id uuid not null unique references public.units(id) on delete cascade,

  interiors_budget_amount numeric(14,2),
  appliances_budget_amount numeric(14,2),
  furniture_budget_amount numeric(14,2),
  lighting_electrical_budget_amount numeric(14,2),
  civil_modification_budget_amount numeric(14,2),
  move_in_budget_amount numeric(14,2),
  rental_readiness_budget_amount numeric(14,2),
  contingency_budget_amount numeric(14,2),

  budget_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'user_estimate',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index post_possession_budgets_workspace_id_idx on public.post_possession_budgets(workspace_id);
create index post_possession_budgets_unit_id_idx on public.post_possession_budgets(unit_id);
```

---

# 11. Parking, Legal, Location, Amenities

## 11.1 parking_details

One row per unit as summary.

```sql
create table public.parking_details (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  unit_id uuid not null unique references public.units(id) on delete cascade,

  parking_included boolean,
  number_of_car_parks integer,
  parking_allocation_status text,

  additional_parking_available boolean,
  additional_parking_cost_amount numeric(14,2),

  visitor_parking_available boolean,
  ev_charging_ready boolean,

  parking_clarity_notes text,
  written_confirmation_received boolean not null default false,
  written_confirmation_document_id uuid,

  risk_level public.risk_level not null default 'unknown',

  source_type public.source_type not null default 'builder_cost_sheet',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index parking_details_workspace_id_idx on public.parking_details(workspace_id);
create index parking_details_unit_id_idx on public.parking_details(unit_id);
create index parking_details_risk_level_idx on public.parking_details(risk_level);
```

---

## 11.2 parking_slots

Use this table when a unit has one or more specific parking slots.

```sql
create table public.parking_slots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  unit_id uuid not null references public.units(id) on delete cascade,
  parking_detail_id uuid references public.parking_details(id) on delete cascade,

  slot_number text,
  parking_type public.parking_type not null default 'unknown',
  parking_level text,
  parking_dimensions text,

  is_independent boolean,
  is_tandem boolean,
  is_mechanical boolean,
  is_included boolean,
  price numeric(14,2),

  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index parking_slots_workspace_id_idx on public.parking_slots(workspace_id);
create index parking_slots_unit_id_idx on public.parking_slots(unit_id);
```

---

## 11.3 legal_records

```sql
create table public.legal_records (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,

  rera_number text,
  rera_verified boolean not null default false,
  rera_project_name text,
  rera_phase text,
  rera_possession_date date,
  rera_url text,

  land_title_status text,
  title_verified boolean not null default false,

  approved_plan_status text,
  commencement_certificate_status text,
  occupancy_certificate_status text,
  completion_certificate_status text,
  khata_status text,

  bank_approval_status text,
  approved_banks jsonb not null default '[]'::jsonb,

  litigation_disclosed boolean,
  litigation_notes text,

  draft_agreement_received boolean not null default false,
  cancellation_policy_received boolean not null default false,
  delay_penalty_clause_available boolean not null default false,

  legal_review_status public.document_review_status not null default 'not_reviewed',
  legal_risk_level public.risk_level not null default 'unknown',
  legal_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index legal_records_workspace_id_idx on public.legal_records(workspace_id);
create index legal_records_project_id_idx on public.legal_records(project_id);
create index legal_records_unit_id_idx on public.legal_records(unit_id);
create index legal_records_rera_number_idx on public.legal_records(rera_number);
create index legal_records_risk_idx on public.legal_records(legal_risk_level);
```

---

## 11.4 location_records

```sql
create table public.location_records (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null unique references public.projects(id) on delete cascade,

  latitude numeric(10,7),
  longitude numeric(10,7),
  pin_confidence public.data_confidence not null default 'unknown',
  pin_notes text,

  city text not null default 'Bangalore',
  city_zone public.city_zone not null default 'east',
  micro_market text,
  locality text,
  address text,
  landmark text,

  distance_to_residence_km numeric(10,2),
  distance_to_workplace_km numeric(10,2),
  peak_commute_minutes integer,
  non_peak_commute_minutes integer,

  nearest_metro_name text,
  distance_to_nearest_metro_km numeric(10,2),
  metro_status text,

  distance_to_school_km numeric(10,2),
  distance_to_hospital_km numeric(10,2),
  distance_to_airport_km numeric(10,2),
  distance_to_outer_ring_road_km numeric(10,2),

  road_width_notes text,
  traffic_bottleneck_notes text,
  flooding_risk_notes text,
  waterlogging_risk_level public.risk_level not null default 'unknown',

  social_infra_rating numeric(5,2) check (social_infra_rating between 0 and 10),
  rental_demand_rating numeric(5,2) check (rental_demand_rating between 0 and 10),
  future_growth_rating numeric(5,2) check (future_growth_rating between 0 and 10),

  location_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index location_records_workspace_id_idx on public.location_records(workspace_id);
create index location_records_project_id_idx on public.location_records(project_id);
create index location_records_city_zone_idx on public.location_records(city_zone);
create index location_records_micro_market_idx on public.location_records(micro_market);
```

---

## 11.5 amenities

```sql
create table public.amenities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,

  amenity_name text not null,
  amenity_category text,
  availability_status text,
  is_important_to_user boolean not null default false,
  readiness_notes text,
  maintenance_burden_notes text,

  source_type public.source_type not null default 'builder_cost_sheet',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index amenities_workspace_id_idx on public.amenities(workspace_id);
create index amenities_project_id_idx on public.amenities(project_id);
```

---

# 12. Media Assets and Gallery Schema

This replaces separate `project_images` and `project_videos` tables with a single stronger `media_assets` table.

It supports:

* Builder logos
* Project logos
* Hero images
* Gallery images
* Elevation images
* Floor plans
* Master plans
* Amenity photos
* Site visit photos
* Document preview images
* YouTube/Vimeo walkthrough videos
* Progress videos

## 12.1 media_assets

```sql
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  builder_id uuid references public.builders(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  site_visit_id uuid references public.site_visits(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,

  asset_type public.media_asset_type not null default 'image',
  category public.media_category not null default 'gallery',

  title text,
  caption text,
  alt_text text,
  description text,

  external_url text,
  storage_bucket text,
  storage_path text,

  raw_video_url text,
  embed_url text,
  video_platform public.video_platform not null default 'unknown',
  thumbnail_url text,
  duration_seconds integer,

  unit_type text,
  tower_name text,

  is_cover boolean not null default false,
  sort_order integer not null default 0,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint media_assets_has_parent check (
    builder_id is not null
    or project_id is not null
    or unit_id is not null
    or site_visit_id is not null
    or document_id is not null
  ),

  constraint media_assets_has_location check (
    external_url is not null
    or storage_path is not null
    or raw_video_url is not null
    or embed_url is not null
  )
);

create index media_assets_workspace_id_idx on public.media_assets(workspace_id);
create index media_assets_builder_id_idx on public.media_assets(builder_id);
create index media_assets_project_id_idx on public.media_assets(project_id);
create index media_assets_unit_id_idx on public.media_assets(unit_id);
create index media_assets_site_visit_id_idx on public.media_assets(site_visit_id);
create index media_assets_type_idx on public.media_assets(asset_type);
create index media_assets_category_idx on public.media_assets(category);
create index media_assets_cover_idx on public.media_assets(project_id, is_cover);
```

## 12.2 Derived Hero Image Rule

The frontend should determine hero image as:

```text
first media_assets row where is_cover = true
OR first media_assets row where category = 'hero'
OR first project image
OR default placeholder
```

## 12.3 Media Completeness

Completeness logic should check:

| Asset                     | Importance |
| ------------------------- | ---------- |
| Hero image                | Medium     |
| Builder logo              | Low        |
| Floor plan image          | High       |
| Brochure document         | High       |
| RERA certificate document | High       |
| Master plan               | Medium     |
| Site visit photos         | Medium     |
| Walkthrough video         | Low        |

---

# 13. Documents Schema

Migration file:

```text
/supabase/migrations/0005_site_visit_documents_payments_schema.sql
```

## 13.1 documents

```sql
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  site_visit_id uuid references public.site_visits(id) on delete set null,
  follow_up_id uuid references public.follow_ups(id) on delete set null,
  payment_milestone_id uuid,

  document_name text not null,
  document_category text not null,
  document_status public.document_status not null default 'requested',
  review_status public.document_review_status not null default 'not_reviewed',

  storage_bucket text,
  storage_path text,
  external_url text,
  file_name text,
  file_mime_type text,
  file_size_bytes bigint,

  collected_date date,
  reviewed_date date,
  reviewed_by uuid references auth.users(id),

  extracted_data jsonb not null default '{}'::jsonb,
  review_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,

  constraint documents_has_file_or_url check (
    storage_path is not null
    or external_url is not null
    or document_status in ('required', 'requested', 'pending', 'not_applicable')
  )
);

create index documents_workspace_id_idx on public.documents(workspace_id);
create index documents_project_id_idx on public.documents(project_id);
create index documents_unit_id_idx on public.documents(unit_id);
create index documents_status_idx on public.documents(document_status);
create index documents_review_status_idx on public.documents(review_status);
create index documents_category_idx on public.documents(document_category);
```

---

# 14. Site Visits and Checklist Schema

## 14.1 site_visits

```sql
create table public.site_visits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete set null,

  visit_title text,
  visit_type text,
  visit_datetime timestamptz,
  visited_by uuid references auth.users(id),

  salesperson_name text,
  salesperson_phone text,
  salesperson_email text,

  accompanied_by text,
  visit_purpose text,
  family_members_present text,

  overall_rating smallint check (overall_rating between 1 and 10),
  overall_impression text,
  key_positives text,
  key_concerns text,
  visit_outcome text,
  recommended_next_action text,

  follow_ups_created_count integer not null default 0,
  documents_collected_count integer not null default 0,

  source_type public.source_type not null default 'site_visit',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'site_visit_confirmed',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index site_visits_workspace_id_idx on public.site_visits(workspace_id);
create index site_visits_project_id_idx on public.site_visits(project_id);
create index site_visits_unit_id_idx on public.site_visits(unit_id);
create index site_visits_visit_datetime_idx on public.site_visits(visit_datetime);
```

---

## 14.2 checklist_items

```sql
create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  site_visit_id uuid not null references public.site_visits(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete set null,

  category text not null,
  item_name text not null,
  item_description text,

  status public.checklist_status not null default 'not_checked',
  priority public.priority_level not null default 'medium',

  notes text,
  follow_up_required boolean not null default false,
  evidence_required boolean not null default false,
  evidence_received boolean not null default false,

  generated_follow_up_id uuid,
  linked_document_id uuid,

  sort_order integer not null default 0,

  source_type public.source_type not null default 'site_visit',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'site_visit_confirmed',

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index checklist_items_workspace_id_idx on public.checklist_items(workspace_id);
create index checklist_items_site_visit_id_idx on public.checklist_items(site_visit_id);
create index checklist_items_project_id_idx on public.checklist_items(project_id);
create index checklist_items_status_idx on public.checklist_items(status);
create index checklist_items_priority_idx on public.checklist_items(priority);
```

---

# 15. Follow-Ups, Payments, Negotiations

## 15.1 follow_ups

```sql
create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  site_visit_id uuid references public.site_visits(id) on delete set null,
  checklist_item_id uuid references public.checklist_items(id) on delete set null,

  title text not null,
  description text,
  category text,

  priority public.priority_level not null default 'medium',
  status public.follow_up_status not null default 'open',

  owner_user_id uuid references auth.users(id),
  external_owner_name text,

  due_date date,
  completed_at timestamptz,
  closed_by uuid references auth.users(id),

  written_confirmation_required boolean not null default false,
  evidence_required boolean not null default false,
  evidence_document_id uuid,

  next_action text,
  closure_notes text,

  source_type public.source_type not null default 'user_entry',
  source_name text,
  source_date date,
  confidence public.data_confidence not null default 'unknown',
  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index follow_ups_workspace_id_idx on public.follow_ups(workspace_id);
create index follow_ups_project_id_idx on public.follow_ups(project_id);
create index follow_ups_unit_id_idx on public.follow_ups(unit_id);
create index follow_ups_status_idx on public.follow_ups(status);
create index follow_ups_priority_idx on public.follow_ups(priority);
create index follow_ups_due_date_idx on public.follow_ups(due_date);
```

---

## 15.2 payment_milestones

```sql
create table public.payment_milestones (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,

  milestone_name text not null,
  milestone_description text,
  milestone_order integer not null default 0,

  percentage numeric(7,4),
  base_amount numeric(14,2),
  calculated_amount_override numeric(14,2),

  gst_amount numeric(14,2),
  tds_amount numeric(14,2),

  own_contribution_amount numeric(14,2),
  loan_disbursement_amount numeric(14,2),

  due_date date,
  paid_amount numeric(14,2),
  paid_date date,
  payment_status public.payment_status not null default 'upcoming',

  receipt_document_id uuid references public.documents(id) on delete set null,
  receipt_status text,

  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index payment_milestones_workspace_id_idx on public.payment_milestones(workspace_id);
create index payment_milestones_project_id_idx on public.payment_milestones(project_id);
create index payment_milestones_unit_id_idx on public.payment_milestones(unit_id);
create index payment_milestones_due_date_idx on public.payment_milestones(due_date);
create index payment_milestones_status_idx on public.payment_milestones(payment_status);
```

---

## 15.3 negotiations

```sql
create table public.negotiations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,

  negotiation_date date not null default current_date,
  negotiation_status text,

  original_quote_amount numeric(14,2),
  revised_quote_amount numeric(14,2),
  discount_amount numeric(14,2),
  discount_percent numeric(7,4),

  commitments_text text,
  validity_date date,
  written_confirmation_received boolean not null default false,
  confirmation_document_id uuid references public.documents(id) on delete set null,

  notes text,

  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index negotiations_workspace_id_idx on public.negotiations(workspace_id);
create index negotiations_project_id_idx on public.negotiations(project_id);
create index negotiations_unit_id_idx on public.negotiations(unit_id);
```

---

# 16. Decision, Score, and Quote Snapshots

## 16.1 decision_status_history

```sql
create table public.decision_status_history (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,

  entity_type text not null,
  previous_status text,
  new_status text not null,
  reason text,

  changed_by uuid references auth.users(id),
  changed_at timestamptz not null default now(),

  metadata jsonb not null default '{}'::jsonb
);

create index decision_status_history_workspace_id_idx on public.decision_status_history(workspace_id);
create index decision_status_history_project_id_idx on public.decision_status_history(project_id);
create index decision_status_history_unit_id_idx on public.decision_status_history(unit_id);
```

---

## 16.2 score_snapshots

```sql
create table public.score_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,

  snapshot_name text,

  living_score numeric(7,4),
  investment_score numeric(7,4),
  financial_score numeric(7,4),
  location_score numeric(7,4),
  parking_score numeric(7,4),
  legal_score numeric(7,4),
  data_completeness_score numeric(7,4),

  overall_risk_level public.risk_level not null default 'unknown',
  recommendation_status public.recommendation_status,

  score_confidence text,
  positive_contributors jsonb not null default '[]'::jsonb,
  negative_contributors jsonb not null default '[]'::jsonb,
  missing_inputs jsonb not null default '[]'::jsonb,
  risk_caps_applied jsonb not null default '[]'::jsonb,
  full_score_payload jsonb not null default '{}'::jsonb,

  generated_at timestamptz not null default now(),
  generated_by uuid references auth.users(id),
  notes text
);

create index score_snapshots_workspace_id_idx on public.score_snapshots(workspace_id);
create index score_snapshots_project_id_idx on public.score_snapshots(project_id);
create index score_snapshots_unit_id_idx on public.score_snapshots(unit_id);
```

---

## 16.3 quote_snapshots

```sql
create table public.quote_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,

  snapshot_name text not null,
  snapshot_date date not null default current_date,

  builder_quoted_total_amount numeric(14,2),
  agreement_value_amount numeric(14,2),
  total_sunk_acquisition_cost_amount numeric(14,2),
  total_possession_cost_amount numeric(14,2),
  total_landing_cost_amount numeric(14,2),
  true_sba_cost_amount numeric(14,2),
  true_carpet_cost_amount numeric(14,2),

  quote_payload jsonb not null default '{}'::jsonb,

  source_document_id uuid references public.documents(id) on delete set null,
  notes text,

  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index quote_snapshots_workspace_id_idx on public.quote_snapshots(workspace_id);
create index quote_snapshots_project_id_idx on public.quote_snapshots(project_id);
create index quote_snapshots_unit_id_idx on public.quote_snapshots(unit_id);
```

---

# 17. Jobs, Backups, and Audit

## 17.1 import_jobs

```sql
create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  job_status public.job_status not null default 'pending',
  import_type text not null,
  file_name text,
  storage_bucket text,
  storage_path text,

  validation_summary jsonb not null default '{}'::jsonb,
  import_summary jsonb not null default '{}'::jsonb,
  error_message text,

  started_at timestamptz,
  completed_at timestamptz,

  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index import_jobs_workspace_id_idx on public.import_jobs(workspace_id);
create index import_jobs_status_idx on public.import_jobs(job_status);
```

---

## 17.2 export_jobs

```sql
create table public.export_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  job_status public.job_status not null default 'pending',
  export_type text not null,
  export_filters jsonb not null default '{}'::jsonb,

  file_name text,
  storage_bucket text,
  storage_path text,

  export_summary jsonb not null default '{}'::jsonb,
  error_message text,

  started_at timestamptz,
  completed_at timestamptz,

  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index export_jobs_workspace_id_idx on public.export_jobs(workspace_id);
create index export_jobs_status_idx on public.export_jobs(job_status);
```

---

## 17.3 backup_records

```sql
create table public.backup_records (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,

  backup_name text not null,
  backup_type text not null default 'manual',
  storage_bucket text,
  storage_path text,
  file_size_bytes bigint,
  checksum text,

  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  notes text
);

create index backup_records_workspace_id_idx on public.backup_records(workspace_id);
create index backup_records_created_at_idx on public.backup_records(created_at);
```

---

## 17.4 activity_log

```sql
create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,

  actor_user_id uuid references auth.users(id),
  activity_type text not null,
  title text not null,
  description text,

  entity_type text,
  entity_id uuid,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index activity_log_workspace_id_idx on public.activity_log(workspace_id);
create index activity_log_created_at_idx on public.activity_log(created_at);
```

---

## 17.5 audit_log

```sql
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,

  actor_user_id uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,

  old_data jsonb,
  new_data jsonb,
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

create index audit_log_workspace_id_idx on public.audit_log(workspace_id);
create index audit_log_actor_user_id_idx on public.audit_log(actor_user_id);
create index audit_log_entity_idx on public.audit_log(entity_type, entity_id);
create index audit_log_created_at_idx on public.audit_log(created_at);
```

---

# 18. Relationship Summary

## 18.1 Workspace Ownership

```text
auth.users
  → profiles
  → workspace_members
  → workspaces
```

## 18.2 Project Model

```text
workspaces
  → builders
  → projects
  → units
```

## 18.3 Unit Detail Model

```text
units
  → space_details
  → cost_breakups
  → cost_components
  → statutory_charges
  → maintenance_possession_costs
  → post_possession_budgets
  → parking_details
  → parking_slots
```

## 18.4 Project Support Model

```text
projects
  → legal_records
  → location_records
  → amenities
  → media_assets
  → documents
  → site_visits
  → follow_ups
```

## 18.5 Workflow Model

```text
site_visits
  → checklist_items
  → follow_ups
  → documents
  → media_assets
```

---

# 19. Supabase Storage Path Convention

Storage paths should include workspace and entity context.

```text
workspace/{workspace_id}/builders/{builder_id}/logos/{filename}

workspace/{workspace_id}/projects/{project_id}/media/{media_asset_id}/{filename}

workspace/{workspace_id}/projects/{project_id}/documents/{document_id}/{filename}

workspace/{workspace_id}/projects/{project_id}/units/{unit_id}/documents/{document_id}/{filename}

workspace/{workspace_id}/site-visits/{site_visit_id}/evidence/{document_id}/{filename}

workspace/{workspace_id}/imports/{import_job_id}/{filename}

workspace/{workspace_id}/exports/{export_job_id}/{filename}

workspace/{workspace_id}/backups/{backup_record_id}/{filename}
```

All buckets should be private.

---

# 20. Recommended Storage Buckets

Create private buckets:

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

---

# 21. Migration Mapping

## 21.1 0001_extensions_and_helpers.sql

```text
pgcrypto
updated_at trigger function
optional PostGIS
helper function placeholders
```

## 21.2 0002_enums.sql

```text
All enums listed in this document
```

## 21.3 0003_auth_workspace_schema.sql

```text
profiles
workspaces
workspace_members
app_settings
```

## 21.4 0004_real_estate_core_schema.sql

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
```

## 21.5 0005_site_visit_documents_payments_schema.sql

```text
documents
site_visits
checklist_items
follow_ups
payment_milestones
negotiations
decision_status_history
score_snapshots
quote_snapshots
import_jobs
export_jobs
backup_records
activity_log
audit_log
```

## 21.6 0006_storage_buckets_and_policies.sql

```text
private storage buckets
storage access policies
```

## 21.7 0007_rls_policies.sql

```text
RLS enabled on all workspace-owned tables
select/insert/update/delete policies
workspace role helper functions
```

## 21.8 0008_triggers_and_functions.sql

```text
updated_at triggers
profile creation trigger
default workspace creation trigger
audit log trigger
```

## 21.9 0009_seed_initial_data.sql

```text
optional seed workspace data
optional seed projects
optional demo media placeholders
```

---

# 22. Index Strategy

Every workspace-owned table should have:

```sql
create index table_name_workspace_id_idx on public.table_name(workspace_id);
```

Important dashboard indexes:

```text
projects.project_status
projects.project_purpose
projects.overall_risk_level
units.selected_for_comparison
units.is_shortlisted
follow_ups.status
follow_ups.priority
follow_ups.due_date
payment_milestones.payment_status
payment_milestones.due_date
documents.document_status
documents.review_status
media_assets.project_id
media_assets.category
media_assets.is_cover
```

---

# 23. Soft Delete Rule

Most user-facing records should use:

```sql
deleted_at timestamptz
```

The app should filter by default:

```sql
where deleted_at is null
```

Hard delete should be reserved for:

* Workspace deletion
* Admin cleanup
* Permanent user-requested delete

---

# 24. Frontend Type Generation

After migrations are applied, generate database types:

```bash
supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > src/types/database.types.ts
```

The frontend should use generated database types for Supabase queries.

---

# 25. Database Acceptance Criteria

The database schema is ready when:

1. All enums are created.
2. Workspace tables exist.
3. Core real estate tables exist.
4. Cost tables support builder-specific cost formats.
5. Parking summary and individual parking slots are supported.
6. Legal/RERA records are supported.
7. Location and map records are supported.
8. Media assets support hero images, gallery, floor plans, master plans, site photos, and videos.
9. Documents support both Supabase Storage and external URLs.
10. Site visits and checklist items are supported.
11. Follow-ups can link to projects, units, visits, and checklist items.
12. Payment milestones support percentage, GST, TDS, paid status, and receipts.
13. Negotiation history is supported.
14. Score snapshots are supported.
15. Quote snapshots are supported.
16. Import/export jobs are supported.
17. Backup records are supported.
18. Audit/activity logs are supported.
19. All workspace-owned tables have `workspace_id`.
20. RLS can be applied cleanly.
21. Supabase database types can be generated.
22. The schema supports future multi-user collaboration.

---

# 26. Final Schema Principle

The database should preserve decision truth.

It should clearly separate:

```text
Builder claim
User estimate
Site visit observation
Written confirmation
Document verified value
Legal verified value
Manual override
```

The schema should help the user answer:

```text
What did the builder say?
What did I observe?
What is written?
What is verified?
What is missing?
What is risky?
What changed?
What should I do next?
```

The backend is not just storage.

It is the trusted record system for the real estate decision cockpit.
