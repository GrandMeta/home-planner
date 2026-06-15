-- 0004_real_estate_core_schema.sql
-- Tables: builders, projects, units, space_details,
--         cost_breakups, cost_components, statutory_charges,
--         maintenance_possession_costs, post_possession_budgets,
--         parking_details, parking_slots, legal_records,
--         location_records, amenities, media_assets

-- ---- builders ----
create table public.builders (
  id                               uuid primary key default gen_random_uuid(),
  workspace_id                     uuid not null references public.workspaces(id) on delete cascade,

  builder_name                     text not null,
  display_name                     text,
  builder_group_name               text,
  legal_name                       text,
  established_year                 smallint,

  logo_url                         text,
  logo_initials                    text,
  logo_color                       text default '#2563EB',
  brand_website_hero_url           text,

  website                          text,
  phone                            text,
  email                            text,
  office_address                   text,

  primary_sales_contact_name       text,
  primary_sales_contact_phone      text,
  primary_sales_contact_email      text,
  secondary_contact_name           text,
  secondary_contact_phone          text,
  secondary_contact_email          text,

  credibility_rating               numeric(3,1) check (credibility_rating between 0 and 10),
  past_projects_count              smallint,
  past_projects_delivered_on_time  smallint,
  litigation_history               boolean default false,
  litigation_notes                 text,
  brand_notes                      text,
  credibility_notes                text,
  past_projects_notes              text,

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

create index builders_workspace_id_idx on public.builders(workspace_id);
create index builders_name_idx on public.builders(builder_name);

create trigger builders_set_updated_at
  before update on public.builders
  for each row execute function public.trigger_set_updated_at();

-- ---- projects ----
create table public.projects (
  id                             uuid primary key default gen_random_uuid(),
  workspace_id                   uuid not null references public.workspaces(id) on delete cascade,
  builder_id                     uuid references public.builders(id) on delete set null,

  project_name                   text not null,
  display_name                   text,
  short_name                     text,
  builder_name                   text,

  project_status                 public.project_status not null default 'new_lead',
  project_purpose                public.project_purpose not null default 'undecided',
  project_type                   public.project_type not null default 'apartment',
  recommendation_status          public.recommendation_status,

  city                           text not null default 'Bangalore',
  city_zone                      public.city_zone not null default 'east',
  micro_market                   text,
  locality                       text,
  address                        text,
  pin_code                       text,
  landmark                       text,

  total_land_area_acres          numeric(10,2),
  total_units                    integer,
  total_towers                   integer,
  total_floors                   integer,
  available_bhks                 text[] not null default '{}'::text[],
  open_space_percent             numeric(7,4),
  density_notes                  text,

  price_range_min_per_sqft       numeric(14,2),
  price_range_max_per_sqft       numeric(14,2),
  indicative_price_min           numeric(14,2),
  indicative_price_max           numeric(14,2),

  possession_date_builder        date,
  possession_date_rera           date,
  possession_notes               text,

  rera_number                    text,
  rera_status                    text,
  rera_url                       text,

  project_logo_url               text,
  project_brand_color            text,

  brochure_collected             boolean not null default false,
  floor_plans_collected          boolean not null default false,
  master_plan_collected          boolean not null default false,
  rera_certificate_collected     boolean not null default false,
  cost_sheet_collected           boolean not null default false,

  project_highlights             text[] not null default '{}'::text[],
  sales_contact_name             text,
  sales_contact_phone            text,
  sales_contact_email            text,

  shortlisted_at                 timestamptz,
  rejected_at                    timestamptz,
  rejection_reason               text,

  overall_risk_level             public.risk_level not null default 'unknown',
  next_action                    text,
  source_of_lead                 text,

  source_type                    public.source_type not null default 'user_entry',
  source_name                    text,
  source_date                    date,
  confidence                     public.data_confidence not null default 'unknown',
  notes                          text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index projects_workspace_id_idx   on public.projects(workspace_id);
create index projects_builder_id_idx     on public.projects(builder_id);
create index projects_status_idx         on public.projects(project_status);
create index projects_purpose_idx        on public.projects(project_purpose);
create index projects_city_zone_idx      on public.projects(city_zone);
create index projects_micro_market_idx   on public.projects(micro_market);
create index projects_name_fts_idx       on public.projects using gin (to_tsvector('english', project_name));

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.trigger_set_updated_at();

-- ---- units ----
create table public.units (
  id                         uuid primary key default gen_random_uuid(),
  workspace_id               uuid not null references public.workspaces(id) on delete cascade,
  project_id                 uuid not null references public.projects(id) on delete cascade,

  unit_label                 text,
  bhk_configuration          text not null,
  tower                      text,
  wing                       text,
  floor_number               integer,
  unit_number                text,
  facing                     text,
  floor_preference           text,
  vastu_notes                text,

  base_selling_price         numeric(14,2),
  bsp_per_sqft               numeric(14,2),

  unit_status                public.project_status not null default 'data_pending',
  recommendation_status      public.recommendation_status,

  selected_for_comparison    boolean not null default false,
  is_shortlisted             boolean not null default false,

  possession_date_expected   date,
  possession_date_committed  date,

  overall_risk_level         public.risk_level not null default 'unknown',
  next_action                text,

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

create index units_workspace_id_idx   on public.units(workspace_id);
create index units_project_id_idx     on public.units(project_id);
create index units_bhk_idx            on public.units(bhk_configuration);
create index units_selected_idx       on public.units(selected_for_comparison);

create trigger units_set_updated_at
  before update on public.units
  for each row execute function public.trigger_set_updated_at();

-- ---- space_details ----
create table public.space_details (
  id                           uuid primary key default gen_random_uuid(),
  workspace_id                 uuid not null references public.workspaces(id) on delete cascade,
  unit_id                      uuid not null unique references public.units(id) on delete cascade,

  super_built_up_area_sqft     numeric(10,2),
  built_up_area_sqft           numeric(10,2),
  carpet_area_rera_sqft        numeric(10,2),
  carpet_area_actual_sqft      numeric(10,2),
  balcony_area_sqft            numeric(10,2),
  utility_area_sqft            numeric(10,2),
  exclusive_open_area_sqft     numeric(10,2),
  uds_sqft                     numeric(10,2),

  efficiency_percent_override  numeric(7,4),
  layout_rating                numeric(5,2) check (layout_rating between 0 and 10),
  ventilation_rating           numeric(5,2) check (ventilation_rating between 0 and 10),
  natural_light_rating         numeric(5,2) check (natural_light_rating between 0 and 10),
  privacy_rating               numeric(5,2) check (privacy_rating between 0 and 10),
  layout_notes                 text,

  source_type   public.source_type not null default 'user_entry',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index space_details_workspace_id_idx on public.space_details(workspace_id);
create index space_details_unit_id_idx      on public.space_details(unit_id);

create trigger space_details_set_updated_at
  before update on public.space_details
  for each row execute function public.trigger_set_updated_at();

-- ---- cost_breakups ----
create table public.cost_breakups (
  id                                   uuid primary key default gen_random_uuid(),
  workspace_id                         uuid not null references public.workspaces(id) on delete cascade,
  unit_id                              uuid not null unique references public.units(id) on delete cascade,

  quote_name                           text,
  quote_date                           date,
  quote_valid_until                    date,

  base_rate_per_sqft                   numeric(14,2),
  basic_flat_cost_amount               numeric(14,2),
  builder_quoted_total_amount          numeric(14,2),
  agreement_value_override_amount      numeric(14,2),
  total_landing_cost_override_amount   numeric(14,2),

  floor_rise_start_floor               integer,
  floor_rise_rate_per_sqft             numeric(14,2),
  floor_rise_chargeable_floors         integer,
  floor_rise_amount_override           numeric(14,2),
  floor_rise_treatment                 public.cost_treatment not null default 'unknown',

  plc_amount                           numeric(14,2),
  plc_treatment                        public.cost_treatment not null default 'unknown',
  plc_notes                            text,

  club_membership_amount               numeric(14,2),
  club_treatment                       public.cost_treatment not null default 'unknown',

  infrastructure_charge_amount         numeric(14,2),
  infrastructure_treatment             public.cost_treatment not null default 'unknown',

  power_backup_amount                  numeric(14,2),
  power_backup_treatment               public.cost_treatment not null default 'unknown',

  discount_amount                      numeric(14,2),
  discount_notes                       text,

  cost_sheet_received                  boolean not null default false,
  final_cost_sheet_received            boolean not null default false,

  source_type   public.source_type not null default 'builder_cost_sheet',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index cost_breakups_workspace_id_idx on public.cost_breakups(workspace_id);
create index cost_breakups_unit_id_idx      on public.cost_breakups(unit_id);

create trigger cost_breakups_set_updated_at
  before update on public.cost_breakups
  for each row execute function public.trigger_set_updated_at();

-- ---- cost_components ----
create table public.cost_components (
  id                              uuid primary key default gen_random_uuid(),
  workspace_id                    uuid not null references public.workspaces(id) on delete cascade,
  cost_breakup_id                 uuid not null references public.cost_breakups(id) on delete cascade,
  unit_id                         uuid not null references public.units(id) on delete cascade,

  component_category              public.cost_component_category not null default 'other',
  component_name                  text not null,
  description                     text,

  amount                          numeric(14,2),
  rate_per_sqft                   numeric(14,2),
  quantity                        numeric(14,2),
  percentage                      numeric(7,4),

  treatment                       public.cost_treatment not null default 'unknown',
  calculation_method              text,
  is_taxable                      boolean not null default false,
  included_in_agreement_value     boolean not null default true,
  included_in_landing_cost        boolean not null default true,
  is_refundable                   boolean not null default false,

  sort_order                      integer not null default 0,

  source_type   public.source_type not null default 'builder_cost_sheet',
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

create index cost_components_workspace_id_idx    on public.cost_components(workspace_id);
create index cost_components_cost_breakup_id_idx on public.cost_components(cost_breakup_id);
create index cost_components_unit_id_idx         on public.cost_components(unit_id);
create index cost_components_category_idx        on public.cost_components(component_category);

create trigger cost_components_set_updated_at
  before update on public.cost_components
  for each row execute function public.trigger_set_updated_at();

-- ---- statutory_charges ----
create table public.statutory_charges (
  id                                        uuid primary key default gen_random_uuid(),
  workspace_id                              uuid not null references public.workspaces(id) on delete cascade,
  unit_id                                   uuid not null unique references public.units(id) on delete cascade,

  gst_applicable                            boolean,
  gst_percent                               numeric(7,4),
  gst_amount_override                       numeric(14,2),
  gst_treatment                             public.cost_treatment not null default 'unknown',

  tds_applicable                            boolean,
  tds_percent                               numeric(7,4),
  tds_amount_override                       numeric(14,2),
  tds_notes                                 text,

  stamp_duty_percent                        numeric(7,4),
  stamp_duty_amount_override                numeric(14,2),

  sale_deed_registration_percent            numeric(7,4),
  sale_deed_registration_amount_override    numeric(14,2),

  agreement_registration_amount             numeric(14,2),
  franking_or_estamping_amount              numeric(14,2),
  khata_transfer_amount                     numeric(14,2),
  mutation_amount                           numeric(14,2),

  mortgage_registration_amount              numeric(14,2),
  modt_percent                              numeric(7,4),
  modt_amount_override                      numeric(14,2),

  bank_legal_technical_amount               numeric(14,2),
  bank_processing_fee_amount                numeric(14,2),

  cess_or_surcharge_amount                  numeric(14,2),
  other_government_charges_amount           numeric(14,2),

  statutory_notes                           text,

  source_type   public.source_type not null default 'user_entry',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index statutory_charges_workspace_id_idx on public.statutory_charges(workspace_id);
create index statutory_charges_unit_id_idx      on public.statutory_charges(unit_id);

create trigger statutory_charges_set_updated_at
  before update on public.statutory_charges
  for each row execute function public.trigger_set_updated_at();

-- ---- maintenance_possession_costs ----
create table public.maintenance_possession_costs (
  id                                       uuid primary key default gen_random_uuid(),
  workspace_id                             uuid not null references public.workspaces(id) on delete cascade,
  unit_id                                  uuid not null unique references public.units(id) on delete cascade,

  corpus_fund_amount                       numeric(14,2),
  corpus_rate_per_sqft                     numeric(14,2),

  maintenance_rate_per_sqft_per_month      numeric(14,2),
  maintenance_tenure_months                integer,
  advance_maintenance_amount_override      numeric(14,2),
  maintenance_gst_percent                  numeric(7,4),

  clubhouse_maintenance_amount             numeric(14,2),
  sinking_fund_amount                      numeric(14,2),

  gas_connection_amount                    numeric(14,2),
  water_meter_amount                       numeric(14,2),
  electricity_meter_amount                 numeric(14,2),
  generator_power_backup_amount            numeric(14,2),
  legal_possession_charges_amount          numeric(14,2),
  association_formation_charges_amount     numeric(14,2),
  other_possession_charges_amount          numeric(14,2),

  possession_notes                         text,

  source_type   public.source_type not null default 'builder_cost_sheet',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index maintenance_possession_workspace_id_idx on public.maintenance_possession_costs(workspace_id);
create index maintenance_possession_unit_id_idx      on public.maintenance_possession_costs(unit_id);

create trigger maintenance_possession_set_updated_at
  before update on public.maintenance_possession_costs
  for each row execute function public.trigger_set_updated_at();

-- ---- post_possession_budgets ----
create table public.post_possession_budgets (
  id                               uuid primary key default gen_random_uuid(),
  workspace_id                     uuid not null references public.workspaces(id) on delete cascade,
  unit_id                          uuid not null unique references public.units(id) on delete cascade,

  interiors_budget_amount          numeric(14,2),
  appliances_budget_amount         numeric(14,2),
  furniture_budget_amount          numeric(14,2),
  lighting_electrical_budget_amount numeric(14,2),
  civil_modification_budget_amount numeric(14,2),
  move_in_budget_amount            numeric(14,2),
  rental_readiness_budget_amount   numeric(14,2),
  contingency_budget_amount        numeric(14,2),

  budget_notes                     text,

  source_type   public.source_type not null default 'user_entry',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'user_estimate',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index post_possession_budgets_workspace_id_idx on public.post_possession_budgets(workspace_id);
create index post_possession_budgets_unit_id_idx      on public.post_possession_budgets(unit_id);

create trigger post_possession_budgets_set_updated_at
  before update on public.post_possession_budgets
  for each row execute function public.trigger_set_updated_at();

-- ---- parking_details ----
-- One summary row per unit
create table public.parking_details (
  id                                     uuid primary key default gen_random_uuid(),
  workspace_id                           uuid not null references public.workspaces(id) on delete cascade,
  unit_id                                uuid not null unique references public.units(id) on delete cascade,

  parking_included                       boolean,
  number_of_car_parks                    integer,
  parking_allocation_status              text,

  additional_parking_available           boolean,
  additional_parking_cost_amount         numeric(14,2),

  visitor_parking_available              boolean,
  ev_charging_ready                      boolean,

  parking_clarity_notes                  text,
  written_confirmation_received          boolean not null default false,
  written_confirmation_document_id       uuid,

  risk_level    public.risk_level not null default 'unknown',

  source_type   public.source_type not null default 'builder_cost_sheet',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index parking_details_workspace_id_idx on public.parking_details(workspace_id);
create index parking_details_unit_id_idx      on public.parking_details(unit_id);
create index parking_details_risk_level_idx   on public.parking_details(risk_level);

create trigger parking_details_set_updated_at
  before update on public.parking_details
  for each row execute function public.trigger_set_updated_at();

-- ---- parking_slots ----
-- One row per specific parking slot
create table public.parking_slots (
  id                    uuid primary key default gen_random_uuid(),
  workspace_id          uuid not null references public.workspaces(id) on delete cascade,
  unit_id               uuid not null references public.units(id) on delete cascade,
  parking_detail_id     uuid references public.parking_details(id) on delete cascade,

  slot_number           text,
  parking_type          public.parking_type not null default 'unknown',
  parking_level         text,
  parking_dimensions    text,

  is_independent        boolean,
  is_tandem             boolean,
  is_mechanical         boolean,
  is_included           boolean,
  price                 numeric(14,2),

  notes                 text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index parking_slots_workspace_id_idx on public.parking_slots(workspace_id);
create index parking_slots_unit_id_idx      on public.parking_slots(unit_id);

create trigger parking_slots_set_updated_at
  before update on public.parking_slots
  for each row execute function public.trigger_set_updated_at();

-- ---- legal_records ----
create table public.legal_records (
  id                                  uuid primary key default gen_random_uuid(),
  workspace_id                        uuid not null references public.workspaces(id) on delete cascade,
  project_id                          uuid not null references public.projects(id) on delete cascade,
  unit_id                             uuid references public.units(id) on delete cascade,

  rera_number                         text,
  rera_verified                       boolean not null default false,
  rera_project_name                   text,
  rera_phase                          text,
  rera_possession_date                date,
  rera_url                            text,

  land_title_status                   text,
  title_verified                      boolean not null default false,

  approved_plan_status                text,
  commencement_certificate_status     text,
  occupancy_certificate_status        text,
  completion_certificate_status       text,
  khata_status                        text,

  bank_approval_status                text,
  approved_banks                      jsonb not null default '[]'::jsonb,

  litigation_disclosed                boolean,
  litigation_notes                    text,

  draft_agreement_received            boolean not null default false,
  cancellation_policy_received        boolean not null default false,
  delay_penalty_clause_available      boolean not null default false,

  legal_review_status                 public.document_review_status not null default 'not_reviewed',
  legal_risk_level                    public.risk_level not null default 'unknown',
  legal_notes                         text,

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

create index legal_records_workspace_id_idx on public.legal_records(workspace_id);
create index legal_records_project_id_idx   on public.legal_records(project_id);
create index legal_records_unit_id_idx      on public.legal_records(unit_id);
create index legal_records_rera_number_idx  on public.legal_records(rera_number);
create index legal_records_risk_idx         on public.legal_records(legal_risk_level);

create trigger legal_records_set_updated_at
  before update on public.legal_records
  for each row execute function public.trigger_set_updated_at();

-- ---- location_records ----
create table public.location_records (
  id                                 uuid primary key default gen_random_uuid(),
  workspace_id                       uuid not null references public.workspaces(id) on delete cascade,
  project_id                         uuid not null unique references public.projects(id) on delete cascade,

  latitude                           numeric(10,7),
  longitude                          numeric(10,7),
  pin_confidence                     public.data_confidence not null default 'unknown',
  pin_notes                          text,

  city                               text not null default 'Bangalore',
  city_zone                          public.city_zone not null default 'east',
  micro_market                       text,
  locality                           text,
  address                            text,
  landmark                           text,

  distance_to_residence_km           numeric(10,2),
  distance_to_workplace_km           numeric(10,2),
  peak_commute_minutes               integer,
  non_peak_commute_minutes           integer,

  nearest_metro_name                 text,
  distance_to_nearest_metro_km       numeric(10,2),
  metro_status                       text,

  distance_to_school_km              numeric(10,2),
  distance_to_hospital_km            numeric(10,2),
  distance_to_airport_km             numeric(10,2),
  distance_to_outer_ring_road_km     numeric(10,2),

  road_width_notes                   text,
  traffic_bottleneck_notes           text,
  flooding_risk_notes                text,
  waterlogging_risk_level            public.risk_level not null default 'unknown',

  social_infra_rating                numeric(5,2) check (social_infra_rating between 0 and 10),
  rental_demand_rating               numeric(5,2) check (rental_demand_rating between 0 and 10),
  future_growth_rating               numeric(5,2) check (future_growth_rating between 0 and 10),

  location_notes                     text,

  source_type   public.source_type not null default 'user_entry',
  source_name   text,
  source_date   date,
  confidence    public.data_confidence not null default 'unknown',
  notes         text,

  created_by    uuid references auth.users(id),
  updated_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index location_records_workspace_id_idx  on public.location_records(workspace_id);
create index location_records_project_id_idx    on public.location_records(project_id);
create index location_records_city_zone_idx     on public.location_records(city_zone);
create index location_records_micro_market_idx  on public.location_records(micro_market);

create trigger location_records_set_updated_at
  before update on public.location_records
  for each row execute function public.trigger_set_updated_at();

-- ---- amenities ----
create table public.amenities (
  id                       uuid primary key default gen_random_uuid(),
  workspace_id             uuid not null references public.workspaces(id) on delete cascade,
  project_id               uuid not null references public.projects(id) on delete cascade,

  amenity_name             text not null,
  amenity_category         text,
  availability_status      text,
  is_important_to_user     boolean not null default false,
  readiness_notes          text,
  maintenance_burden_notes text,

  source_type   public.source_type not null default 'builder_cost_sheet',
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

create index amenities_workspace_id_idx on public.amenities(workspace_id);
create index amenities_project_id_idx   on public.amenities(project_id);

create trigger amenities_set_updated_at
  before update on public.amenities
  for each row execute function public.trigger_set_updated_at();

-- ---- media_assets ----
-- Single table replacing project_images + project_videos.
-- Covers: logos, hero images, galleries, floor plans, videos, site photos.
create table public.media_assets (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references public.workspaces(id) on delete cascade,

  builder_id       uuid references public.builders(id) on delete cascade,
  project_id       uuid references public.projects(id) on delete cascade,
  unit_id          uuid references public.units(id) on delete cascade,
  site_visit_id    uuid,   -- FK added after site_visits table in migration 0005
  document_id      uuid,   -- FK added after documents table in migration 0005

  asset_type       public.media_asset_type not null default 'image',
  category         public.media_category not null default 'gallery',

  title            text,
  caption          text,
  alt_text         text,
  description      text,

  external_url     text,
  storage_bucket   text,
  storage_path     text,

  raw_video_url    text,
  embed_url        text,
  video_platform   public.video_platform not null default 'unknown',
  thumbnail_url    text,
  duration_seconds integer,

  unit_type        text,
  tower_name       text,

  is_cover         boolean not null default false,
  sort_order       integer not null default 0,

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

create index media_assets_workspace_id_idx  on public.media_assets(workspace_id);
create index media_assets_builder_id_idx    on public.media_assets(builder_id);
create index media_assets_project_id_idx    on public.media_assets(project_id);
create index media_assets_unit_id_idx       on public.media_assets(unit_id);
create index media_assets_type_idx          on public.media_assets(asset_type);
create index media_assets_category_idx      on public.media_assets(category);
create index media_assets_cover_idx         on public.media_assets(project_id, is_cover);

create trigger media_assets_set_updated_at
  before update on public.media_assets
  for each row execute function public.trigger_set_updated_at();
