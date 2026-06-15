-- ============================================================
-- Migration 0009: Seed Initial Data (LOCAL DEV ONLY)
-- This file seeds a single test workspace with 2 projects.
-- DO NOT run in production — guard with env check in CI/CD.
-- ============================================================

-- This seed is designed to be applied AFTER the schema is set up.
-- It creates a fake auth.users entry (only works locally).
-- On a real Supabase project, use supabase.auth.signUp() instead.

-- Seed only runs if no profiles exist yet (idempotent guard)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.profiles LIMIT 1) THEN
    RAISE NOTICE 'Seed already applied — skipping.';
    RETURN;
  END IF;

  -- ---- Create test user in auth.users (local only) ----
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    role, aud, created_at, updated_at,
    raw_user_meta_data, raw_app_meta_data, is_super_admin
  ) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'demo@homeplanner.local',
    crypt('demo1234', gen_salt('bf')),
    NOW(),
    'authenticated', 'authenticated',
    NOW(), NOW(),
    '{"full_name": "Demo User"}'::jsonb,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    false
  ) ON CONFLICT (id) DO NOTHING;

  -- The handle_new_user trigger will create profile, workspace, members, settings.
  -- Wait for trigger to complete (it fires synchronously).

  -- ---- Seed builder ----
  INSERT INTO public.builders (
    id, workspace_id,
    name, display_name, builder_group_name,
    logo_color, logo_initials,
    credibility_rating, past_projects_count, past_projects_delivered_on_time,
    website
  ) VALUES (
    'b0000000-0000-0000-0000-000000000001',
    (SELECT id FROM workspaces WHERE owner_id = 'a0000000-0000-0000-0000-000000000001' LIMIT 1),
    'DSR Infrastructure',
    'DSR',
    'DSR Group',
    '#1e40af', 'DSR',
    8.5, 12, 10,
    'https://dsrinfra.com'
  ) ON CONFLICT DO NOTHING;

  -- ---- Seed project 1 ----
  INSERT INTO public.projects (
    id, workspace_id, builder_id,
    project_name, project_display_name, project_short_name, builder_name,
    project_status, project_purpose, risk_level, project_type,
    city, city_zone, micro_market, locality,
    total_towers, total_floors, total_units,
    available_bhks,
    price_range_min_per_sqft, price_range_max_per_sqft,
    indicative_price_min, indicative_price_max,
    estimated_possession_date, possession_confidence,
    rera_status, rera_number,
    brochure_collected, floor_plans_collected, rera_certificate_collected,
    project_highlights,
    source_of_lead, notes,
    created_by
  ) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    (SELECT id FROM workspaces WHERE owner_id = 'a0000000-0000-0000-0000-000000000001' LIMIT 1),
    'b0000000-0000-0000-0000-000000000001',
    'DSR Courtyard', 'DSR Courtyard', 'DSR-CY', 'DSR Infrastructure',
    'Shortlisted', 'Both', 'Low', 'Apartment',
    'Bangalore', 'East Bangalore', 'Whitefield', 'Whitefield Main Road',
    3, 18, 312,
    ARRAY['2BHK','2.5BHK','3BHK']::bhk_config[],
    8200, 9500,
    7500000, 12000000,
    '2026-12-01', 'Likely',
    'Registered', 'PRM/KA/RERA/1251/446/PR/171115/001122',
    true, true, true,
    ARRAY['IGBC Pre-certified Green', 'Gated community', '3 acres open space', 'Metro connectivity'],
    'Builder website',
    'Good project with strong builder track record.',
    'a0000000-0000-0000-0000-000000000001'
  ) ON CONFLICT DO NOTHING;

  -- ---- Seed project 2 ----
  INSERT INTO public.projects (
    id, workspace_id, builder_id,
    project_name, project_display_name, builder_name,
    project_status, project_purpose, risk_level, project_type,
    city, city_zone, micro_market, locality,
    total_towers, total_floors, total_units,
    available_bhks,
    price_range_min_per_sqft, price_range_max_per_sqft,
    estimated_possession_date, possession_confidence,
    rera_status,
    brochure_collected, floor_plans_collected,
    project_highlights,
    source_of_lead,
    created_by
  ) VALUES (
    'c0000000-0000-0000-0000-000000000002',
    (SELECT id FROM workspaces WHERE owner_id = 'a0000000-0000-0000-0000-000000000001' LIMIT 1),
    'b0000000-0000-0000-0000-000000000001',
    'DSR The Address', 'DSR The Address', 'DSR Infrastructure',
    'Watchlist', 'Investment', 'Medium', 'Apartment',
    'Bangalore', 'East Bangalore', 'Sarjapur Road', 'Bellandur',
    4, 22, 480,
    ARRAY['2BHK','3BHK','3.5BHK']::bhk_config[],
    9800, 11500,
    '2027-06-01', 'At Risk',
    'Awaited',
    true, false,
    ARRAY['Close to Outer Ring Road', 'Premium amenities'],
    'Broker referral',
    'a0000000-0000-0000-0000-000000000001'
  ) ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Seed data applied successfully.';
END $$;
