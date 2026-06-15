-- 0001_extensions_and_helpers.sql
-- Enable required extensions and define shared trigger helper.

-- Extensions
create extension if not exists pgcrypto;

-- Optional later if geospatial queries become important:
-- create extension if not exists postgis;

-- ============================================================
-- Shared trigger: auto-update updated_at on row change
-- ============================================================

create or replace function public.trigger_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
