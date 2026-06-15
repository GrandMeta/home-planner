-- ============================================================
-- Migration 0008: Triggers and Functions
-- ============================================================

-- ============================================================
-- Trigger: auto-create profile + workspace on auth.users INSERT
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id  UUID := uuid_generate_v4();
  user_display_name TEXT;
  workspace_slug    TEXT;
BEGIN
  -- Derive display name from metadata or email
  user_display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Create profile row
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, user_display_name)
  ON CONFLICT (id) DO NOTHING;

  -- Generate workspace slug from user id prefix
  workspace_slug := 'ws-' || replace(NEW.id::text, '-', '')[:12];

  -- Create personal workspace
  INSERT INTO public.workspaces (id, name, slug, owner_id)
  VALUES (
    new_workspace_id,
    user_display_name || '''s Home Search',
    workspace_slug,
    NEW.id
  )
  ON CONFLICT (slug) DO UPDATE
    SET slug = workspace_slug || '-' || substr(uuid_generate_v4()::text, 1, 4);

  -- Add as owner
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner')
  ON CONFLICT (workspace_id, user_id) DO NOTHING;

  -- Create default settings
  INSERT INTO public.app_settings (workspace_id)
  VALUES (new_workspace_id)
  ON CONFLICT (workspace_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Trigger: auto-log project status changes to history table
-- ============================================================

CREATE OR REPLACE FUNCTION log_project_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if status actually changed
  IF OLD.project_status IS DISTINCT FROM NEW.project_status THEN
    INSERT INTO public.decision_status_history (
      workspace_id,
      project_id,
      from_status,
      to_status,
      changed_by
    ) VALUES (
      NEW.workspace_id,
      NEW.id,
      OLD.project_status,
      NEW.project_status,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER project_status_change_history
  AFTER UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_project_status_change();

-- ============================================================
-- Trigger: prevent deletion of workspace if it has active projects
-- (soft guard — actual cascade is on the FK, but this logs a warning)
-- ============================================================

CREATE OR REPLACE FUNCTION check_workspace_has_projects()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  project_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO project_count
  FROM projects
  WHERE workspace_id = OLD.id;

  IF project_count > 0 THEN
    RAISE NOTICE 'Deleting workspace % with % projects. All data will be cascade-deleted.',
      OLD.id, project_count;
  END IF;

  RETURN OLD;
END;
$$;

CREATE TRIGGER before_workspace_delete
  BEFORE DELETE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION check_workspace_has_projects();

-- ============================================================
-- Function: get_workspace_summary
-- Returns aggregate stats for a workspace
-- ============================================================

CREATE OR REPLACE FUNCTION get_workspace_summary(p_workspace_id UUID)
RETURNS TABLE (
  total_projects       BIGINT,
  shortlisted_projects BIGINT,
  total_units          BIGINT,
  open_follow_ups      BIGINT,
  total_documents      BIGINT,
  rera_registered      BIGINT
)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(DISTINCT p.id)                                              AS total_projects,
    COUNT(DISTINCT p.id) FILTER (
      WHERE p.project_status IN ('Shortlisted', 'Strong Shortlist')
    )                                                                 AS shortlisted_projects,
    COUNT(DISTINCT u.id)                                              AS total_units,
    COUNT(DISTINCT f.id) FILTER (WHERE f.status = 'Open')            AS open_follow_ups,
    COUNT(DISTINCT d.id)                                              AS total_documents,
    COUNT(DISTINCT p.id) FILTER (WHERE p.rera_status = 'Registered') AS rera_registered
  FROM workspaces ws
  LEFT JOIN projects   p ON p.workspace_id = ws.id
  LEFT JOIN units      u ON u.workspace_id = ws.id
  LEFT JOIN follow_ups f ON f.workspace_id = ws.id
  LEFT JOIN documents  d ON d.workspace_id = ws.id
  WHERE ws.id = p_workspace_id;
$$;

-- ============================================================
-- Function: search_projects
-- Full-text + trigram search across project names
-- ============================================================

CREATE OR REPLACE FUNCTION search_projects(
  p_workspace_id UUID,
  p_query        TEXT
)
RETURNS SETOF projects
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM projects
  WHERE workspace_id = p_workspace_id
    AND (
      to_tsvector('english', project_name) @@ plainto_tsquery('english', p_query)
      OR project_name ILIKE '%' || p_query || '%'
      OR micro_market ILIKE '%' || p_query || '%'
      OR locality     ILIKE '%' || p_query || '%'
    )
  ORDER BY
    ts_rank(to_tsvector('english', project_name), plainto_tsquery('english', p_query)) DESC,
    project_name ASC;
$$;
