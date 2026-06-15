-- 0002_enums.sql
-- All enum types. Values use lowercase_snake_case.
-- Frontend maps these to display labels.

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
