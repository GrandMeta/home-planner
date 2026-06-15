-- 0003_auth_workspace_schema.sql
-- Tables: profiles, workspaces, workspace_members, app_settings,
--         activity_log, audit_log

-- ---- profiles ----
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  full_name    text,
  display_name text,
  avatar_url   text,
  phone        text,
  timezone     text not null default 'Asia/Kolkata',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index profiles_email_idx on public.profiles(email);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.trigger_set_updated_at();

-- ---- workspaces ----
create table public.workspaces (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text unique,
  description          text,
  owner_id             uuid not null references auth.users(id),
  default_city         text not null default 'Bangalore',
  default_city_zone    public.city_zone not null default 'east',
  default_currency     text not null default 'INR',
  is_personal          boolean not null default true,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz
);

create index workspaces_owner_id_idx on public.workspaces(owner_id);
create index workspaces_slug_idx on public.workspaces(slug);

create trigger workspaces_set_updated_at
  before update on public.workspaces
  for each row execute function public.trigger_set_updated_at();

-- ---- workspace_members ----
create table public.workspace_members (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          public.workspace_role not null default 'viewer',
  status        public.membership_status not null default 'active',
  invited_by    uuid references auth.users(id),
  invited_at    timestamptz,
  joined_at     timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint workspace_members_unique unique (workspace_id, user_id)
);

create index workspace_members_workspace_id_idx on public.workspace_members(workspace_id);
create index workspace_members_user_id_idx on public.workspace_members(user_id);
create index workspace_members_role_idx on public.workspace_members(role);

create trigger workspace_members_set_updated_at
  before update on public.workspace_members
  for each row execute function public.trigger_set_updated_at();

-- ---- app_settings ----
create table public.app_settings (
  id                                      uuid primary key default gen_random_uuid(),
  workspace_id                            uuid not null unique references public.workspaces(id) on delete cascade,

  default_city                            text not null default 'Bangalore',
  default_city_zone                       public.city_zone not null default 'east',
  default_currency                        text not null default 'INR',
  locale                                  text not null default 'en-IN',

  residence_latitude                      numeric(10,7),
  residence_longitude                     numeric(10,7),
  residence_label                         text,

  workplace_latitude                      numeric(10,7),
  workplace_longitude                     numeric(10,7),
  workplace_label                         text,

  default_gst_percent                     numeric(7,4),
  default_tds_percent                     numeric(7,4),
  default_stamp_duty_percent              numeric(7,4),
  default_registration_percent            numeric(7,4),
  default_agreement_registration_amount   numeric(14,2),
  default_franking_amount                 numeric(14,2),
  default_khata_transfer_amount           numeric(14,2),
  default_mutation_amount                 numeric(14,2),
  default_modt_percent                    numeric(7,4),

  default_loan_to_value_percent           numeric(7,4),
  default_interest_rate_percent           numeric(7,4),
  default_loan_tenure_months              integer,

  interior_budget_by_bhk                  jsonb not null default '{}'::jsonb,
  living_score_weights                    jsonb not null default '{}'::jsonb,
  investment_score_weights                jsonb not null default '{}'::jsonb,
  media_preferences                       jsonb not null default '{}'::jsonb,
  display_preferences                     jsonb not null default '{}'::jsonb,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger app_settings_set_updated_at
  before update on public.app_settings
  for each row execute function public.trigger_set_updated_at();

-- ---- activity_log ----
create table public.activity_log (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid references public.workspaces(id) on delete cascade,
  actor_user_id  uuid references auth.users(id),
  activity_type  text not null,
  title          text not null,
  description    text,
  entity_type    text,
  entity_id      uuid,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index activity_log_workspace_id_idx on public.activity_log(workspace_id);
create index activity_log_created_at_idx on public.activity_log(created_at);

-- ---- audit_log ----
create table public.audit_log (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid references public.workspaces(id) on delete cascade,
  actor_user_id  uuid references auth.users(id),
  action         text not null,
  entity_type    text,
  entity_id      uuid,
  old_data       jsonb,
  new_data       jsonb,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index audit_log_workspace_id_idx on public.audit_log(workspace_id);
create index audit_log_actor_user_id_idx on public.audit_log(actor_user_id);
create index audit_log_entity_idx on public.audit_log(entity_type, entity_id);
create index audit_log_created_at_idx on public.audit_log(created_at);
