-- 0005_site_visit_documents_payments_schema.sql
-- Tables: documents, site_visits, checklist_items, follow_ups,
--         payment_milestones, negotiations,
--         decision_status_history, score_snapshots, quote_snapshots,
--         import_jobs, export_jobs, backup_records
-- Also: adds FK constraints back to media_assets

-- ---- documents ----
create table public.documents (
  id                      uuid primary key default gen_random_uuid(),
  workspace_id            uuid not null references public.workspaces(id) on delete cascade,
  project_id              uuid references public.projects(id) on delete cascade,
  unit_id                 uuid references public.units(id) on delete cascade,
  site_visit_id           uuid,   -- FK set after site_visits created below
  follow_up_id            uuid,   -- FK set after follow_ups created below
  payment_milestone_id    uuid,

  document_name           text not null,
  document_category       text not null,
  document_status         public.document_status not null default 'requested',
  review_status           public.document_review_status not null default 'not_reviewed',

  storage_bucket          text,
  storage_path            text,
  external_url            text,
  file_name               text,
  file_mime_type          text,
  file_size_bytes         bigint,

  collected_date          date,
  reviewed_date           date,
  reviewed_by             uuid references auth.users(id),

  extracted_data          jsonb not null default '{}'::jsonb,
  review_notes            text,

  source_type   public.source_type not null default 'user_entry',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,

  constraint documents_has_file_or_url check (
    storage_path is not null
    or external_url is not null
    or document_status in ('required', 'requested', 'pending', 'not_applicable')
  )
);

create index documents_workspace_id_idx    on public.documents(workspace_id);
create index documents_project_id_idx      on public.documents(project_id);
create index documents_unit_id_idx         on public.documents(unit_id);
create index documents_status_idx          on public.documents(document_status);
create index documents_review_status_idx   on public.documents(review_status);
create index documents_category_idx        on public.documents(document_category);

create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function public.trigger_set_updated_at();

-- ---- site_visits ----
create table public.site_visits (
  id                          uuid primary key default gen_random_uuid(),
  workspace_id                uuid not null references public.workspaces(id) on delete cascade,
  project_id                  uuid not null references public.projects(id) on delete cascade,
  unit_id                     uuid references public.units(id) on delete set null,

  visit_title                 text,
  visit_type                  text,
  visit_datetime              timestamptz,
  visited_by                  uuid references auth.users(id),

  salesperson_name            text,
  salesperson_phone           text,
  salesperson_email           text,

  accompanied_by              text,
  visit_purpose               text,
  family_members_present      text,

  overall_rating              smallint check (overall_rating between 1 and 10),
  overall_impression          text,
  key_positives               text,
  key_concerns                text,
  visit_outcome               text,
  recommended_next_action     text,

  follow_ups_created_count    integer not null default 0,
  documents_collected_count   integer not null default 0,

  source_type   public.source_type not null default 'site_visit',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'site_visit_confirmed',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index site_visits_workspace_id_idx      on public.site_visits(workspace_id);
create index site_visits_project_id_idx        on public.site_visits(project_id);
create index site_visits_unit_id_idx           on public.site_visits(unit_id);
create index site_visits_visit_datetime_idx    on public.site_visits(visit_datetime);

create trigger site_visits_set_updated_at
  before update on public.site_visits
  for each row execute function public.trigger_set_updated_at();

-- ---- Add deferred FKs now that both tables exist ----
alter table public.documents
  add constraint documents_site_visit_id_fkey
    foreign key (site_visit_id) references public.site_visits(id) on delete set null;

alter table public.media_assets
  add constraint media_assets_site_visit_id_fkey
    foreign key (site_visit_id) references public.site_visits(id) on delete cascade;

alter table public.media_assets
  add constraint media_assets_document_id_fkey
    foreign key (document_id) references public.documents(id) on delete set null;

-- ---- checklist_items ----
create table public.checklist_items (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references public.workspaces(id) on delete cascade,
  site_visit_id         uuid not null references public.site_visits(id) on delete cascade,
  project_id            uuid not null references public.projects(id) on delete cascade,
  unit_id               uuid references public.units(id) on delete set null,

  category              text not null,
  item_name             text not null,
  item_description      text,

  status                public.checklist_status not null default 'not_checked',
  priority              public.priority_level not null default 'medium',

  notes                 text,
  follow_up_required    boolean not null default false,
  evidence_required     boolean not null default false,
  evidence_received     boolean not null default false,

  generated_follow_up_id  uuid,
  linked_document_id      uuid references public.documents(id) on delete set null,

  sort_order            integer not null default 0,

  source_type   public.source_type not null default 'site_visit',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'site_visit_confirmed',

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index checklist_items_workspace_id_idx   on public.checklist_items(workspace_id);
create index checklist_items_site_visit_id_idx  on public.checklist_items(site_visit_id);
create index checklist_items_project_id_idx     on public.checklist_items(project_id);
create index checklist_items_status_idx         on public.checklist_items(status);
create index checklist_items_priority_idx       on public.checklist_items(priority);

create trigger checklist_items_set_updated_at
  before update on public.checklist_items
  for each row execute function public.trigger_set_updated_at();

-- ---- follow_ups ----
create table public.follow_ups (
  id                              uuid primary key default gen_random_uuid(),
  workspace_id                    uuid not null references public.workspaces(id) on delete cascade,
  project_id                      uuid references public.projects(id) on delete cascade,
  unit_id                         uuid references public.units(id) on delete cascade,
  site_visit_id                   uuid references public.site_visits(id) on delete set null,
  checklist_item_id               uuid references public.checklist_items(id) on delete set null,

  title                           text not null,
  description                     text,
  category                        text,

  priority                        public.priority_level not null default 'medium',
  status                          public.follow_up_status not null default 'open',

  owner_user_id                   uuid references auth.users(id),
  external_owner_name             text,

  due_date                        date,
  completed_at                    timestamptz,
  closed_by                       uuid references auth.users(id),

  written_confirmation_required   boolean not null default false,
  evidence_required               boolean not null default false,
  evidence_document_id            uuid references public.documents(id) on delete set null,

  next_action                     text,
  closure_notes                   text,

  source_type   public.source_type not null default 'user_entry',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index follow_ups_workspace_id_idx  on public.follow_ups(workspace_id);
create index follow_ups_project_id_idx    on public.follow_ups(project_id);
create index follow_ups_unit_id_idx       on public.follow_ups(unit_id);
create index follow_ups_status_idx        on public.follow_ups(status);
create index follow_ups_priority_idx      on public.follow_ups(priority);
create index follow_ups_due_date_idx      on public.follow_ups(due_date);

create trigger follow_ups_set_updated_at
  before update on public.follow_ups
  for each row execute function public.trigger_set_updated_at();

-- Close deferred FK: checklist_items.generated_follow_up_id
alter table public.checklist_items
  add constraint checklist_items_generated_follow_up_id_fkey
    foreign key (generated_follow_up_id) references public.follow_ups(id) on delete set null;

-- Close deferred FK: documents.follow_up_id
alter table public.documents
  add constraint documents_follow_up_id_fkey
    foreign key (follow_up_id) references public.follow_ups(id) on delete set null;

-- ---- payment_milestones ----
create table public.payment_milestones (
  id                            uuid primary key default gen_random_uuid(),
  workspace_id                  uuid not null references public.workspaces(id) on delete cascade,
  project_id                    uuid not null references public.projects(id) on delete cascade,
  unit_id                       uuid references public.units(id) on delete cascade,

  milestone_name                text not null,
  milestone_description         text,
  milestone_order               integer not null default 0,

  percentage                    numeric(7,4),
  base_amount                   numeric(14,2),
  calculated_amount_override    numeric(14,2),

  gst_amount                    numeric(14,2),
  tds_amount                    numeric(14,2),

  own_contribution_amount       numeric(14,2),
  loan_disbursement_amount      numeric(14,2),

  due_date                      date,
  paid_amount                   numeric(14,2),
  paid_date                     date,
  payment_status                public.payment_status not null default 'upcoming',

  receipt_document_id           uuid references public.documents(id) on delete set null,
  receipt_status                text,

  notes                         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index payment_milestones_workspace_id_idx  on public.payment_milestones(workspace_id);
create index payment_milestones_project_id_idx    on public.payment_milestones(project_id);
create index payment_milestones_unit_id_idx       on public.payment_milestones(unit_id);
create index payment_milestones_due_date_idx      on public.payment_milestones(due_date);
create index payment_milestones_status_idx        on public.payment_milestones(payment_status);

create trigger payment_milestones_set_updated_at
  before update on public.payment_milestones
  for each row execute function public.trigger_set_updated_at();

-- ---- negotiations ----
create table public.negotiations (
  id                               uuid primary key default gen_random_uuid(),
  workspace_id                     uuid not null references public.workspaces(id) on delete cascade,
  project_id                       uuid not null references public.projects(id) on delete cascade,
  unit_id                          uuid references public.units(id) on delete cascade,

  negotiation_date                 date not null default current_date,
  negotiation_status               text,

  original_quote_amount            numeric(14,2),
  revised_quote_amount             numeric(14,2),
  discount_amount                  numeric(14,2),
  discount_percent                 numeric(7,4),

  commitments_text                 text,
  validity_date                    date,
  written_confirmation_received    boolean not null default false,
  confirmation_document_id         uuid references public.documents(id) on delete set null,

  notes                            text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index negotiations_workspace_id_idx  on public.negotiations(workspace_id);
create index negotiations_project_id_idx    on public.negotiations(project_id);
create index negotiations_unit_id_idx       on public.negotiations(unit_id);

create trigger negotiations_set_updated_at
  before update on public.negotiations
  for each row execute function public.trigger_set_updated_at();

-- ---- decision_status_history ----
create table public.decision_status_history (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,
  project_id      uuid references public.projects(id) on delete cascade,
  unit_id         uuid references public.units(id) on delete cascade,

  entity_type     text not null,
  previous_status text,
  new_status      text not null,
  reason          text,

  changed_by      uuid references auth.users(id),
  changed_at      timestamptz not null default now(),

  metadata        jsonb not null default '{}'::jsonb
);

create index decision_status_history_workspace_id_idx on public.decision_status_history(workspace_id);
create index decision_status_history_project_id_idx   on public.decision_status_history(project_id);
create index decision_status_history_unit_id_idx      on public.decision_status_history(unit_id);

-- ---- score_snapshots ----
create table public.score_snapshots (
  id                          uuid primary key default gen_random_uuid(),
  workspace_id                uuid not null references public.workspaces(id) on delete cascade,
  project_id                  uuid references public.projects(id) on delete cascade,
  unit_id                     uuid references public.units(id) on delete cascade,

  snapshot_name               text,

  living_score                numeric(7,4),
  investment_score            numeric(7,4),
  financial_score             numeric(7,4),
  location_score              numeric(7,4),
  parking_score               numeric(7,4),
  legal_score                 numeric(7,4),
  data_completeness_score     numeric(7,4),

  overall_risk_level          public.risk_level not null default 'unknown',
  recommendation_status       public.recommendation_status,

  score_confidence            text,
  positive_contributors       jsonb not null default '[]'::jsonb,
  negative_contributors       jsonb not null default '[]'::jsonb,
  missing_inputs              jsonb not null default '[]'::jsonb,
  risk_caps_applied           jsonb not null default '[]'::jsonb,
  full_score_payload          jsonb not null default '{}'::jsonb,

  generated_at    timestamptz not null default now(),
  generated_by    uuid references auth.users(id),
  notes           text
);

create index score_snapshots_workspace_id_idx on public.score_snapshots(workspace_id);
create index score_snapshots_project_id_idx   on public.score_snapshots(project_id);
create index score_snapshots_unit_id_idx      on public.score_snapshots(unit_id);

-- ---- quote_snapshots ----
create table public.quote_snapshots (
  id                                   uuid primary key default gen_random_uuid(),
  workspace_id                         uuid not null references public.workspaces(id) on delete cascade,
  project_id                           uuid not null references public.projects(id) on delete cascade,
  unit_id                              uuid references public.units(id) on delete cascade,

  snapshot_name                        text not null,
  snapshot_date                        date not null default current_date,

  builder_quoted_total_amount          numeric(14,2),
  agreement_value_amount               numeric(14,2),
  total_sunk_acquisition_cost_amount   numeric(14,2),
  total_possession_cost_amount         numeric(14,2),
  total_landing_cost_amount            numeric(14,2),
  true_sba_cost_amount                 numeric(14,2),
  true_carpet_cost_amount              numeric(14,2),

  quote_payload                        jsonb not null default '{}'::jsonb,

  source_document_id                   uuid references public.documents(id) on delete set null,
  notes                                text,

  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

create index quote_snapshots_workspace_id_idx on public.quote_snapshots(workspace_id);
create index quote_snapshots_project_id_idx   on public.quote_snapshots(project_id);
create index quote_snapshots_unit_id_idx      on public.quote_snapshots(unit_id);

-- ---- import_jobs ----
create table public.import_jobs (
  id                  uuid primary key default gen_random_uuid(),
  workspace_id        uuid not null references public.workspaces(id) on delete cascade,

  job_status          public.job_status not null default 'pending',
  import_type         text not null,
  file_name           text,
  storage_bucket      text,
  storage_path        text,

  validation_summary  jsonb not null default '{}'::jsonb,
  import_summary      jsonb not null default '{}'::jsonb,
  error_message       text,

  started_at          timestamptz,
  completed_at        timestamptz,

  created_by          uuid references auth.users(id),
  created_at          timestamptz not null default now()
);

create index import_jobs_workspace_id_idx on public.import_jobs(workspace_id);
create index import_jobs_status_idx       on public.import_jobs(job_status);

-- ---- export_jobs ----
create table public.export_jobs (
  id                  uuid primary key default gen_random_uuid(),
  workspace_id        uuid not null references public.workspaces(id) on delete cascade,

  job_status          public.job_status not null default 'pending',
  export_type         text not null,
  export_filters      jsonb not null default '{}'::jsonb,

  file_name           text,
  storage_bucket      text,
  storage_path        text,

  export_summary      jsonb not null default '{}'::jsonb,
  error_message       text,

  started_at          timestamptz,
  completed_at        timestamptz,

  created_by          uuid references auth.users(id),
  created_at          timestamptz not null default now()
);

create index export_jobs_workspace_id_idx on public.export_jobs(workspace_id);
create index export_jobs_status_idx       on public.export_jobs(job_status);

-- ---- backup_records ----
create table public.backup_records (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references public.workspaces(id) on delete cascade,

  backup_name     text not null,
  backup_type     text not null default 'manual',
  storage_bucket  text,
  storage_path    text,
  file_size_bytes bigint,
  checksum        text,

  created_by      uuid references auth.users(id),
  created_at      timestamptz not null default now(),
  notes           text
);

create index backup_records_workspace_id_idx  on public.backup_records(workspace_id);
create index backup_records_created_at_idx    on public.backup_records(created_at);
