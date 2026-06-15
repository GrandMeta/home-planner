-- ============================================================
-- Migration 0007: Row Level Security Policies
-- Applied to all public schema tables
-- ============================================================

-- ============================================================
-- PROFILES
-- Users can only read and update their own profile
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================
-- WORKSPACES
-- ============================================================

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select_workspace"
  ON workspaces FOR SELECT
  TO authenticated
  USING (id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "authenticated_can_create_workspace"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspace_owner_update_workspace"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspace_owner_delete_workspace"
  ON workspaces FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- ============================================================
-- WORKSPACE_MEMBERS
-- ============================================================

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select_roster"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "workspace_owner_manage_members"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (is_workspace_owner(workspace_id));

CREATE POLICY "workspace_owner_update_member_roles"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (is_workspace_owner(workspace_id))
  WITH CHECK (is_workspace_owner(workspace_id));

CREATE POLICY "workspace_owner_remove_members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (is_workspace_owner(workspace_id));

-- ============================================================
-- APP_SETTINGS
-- ============================================================

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select_settings"
  ON app_settings FOR SELECT
  TO authenticated
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "workspace_owner_manage_settings"
  ON app_settings FOR INSERT
  TO authenticated
  WITH CHECK (is_workspace_owner(workspace_id));

CREATE POLICY "workspace_writer_update_settings"
  ON app_settings FOR UPDATE
  TO authenticated
  USING (is_workspace_writer(workspace_id))
  WITH CHECK (is_workspace_writer(workspace_id));

-- ============================================================
-- ACTIVITY_LOG  (insert + select; no update/delete for users)
-- ============================================================

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select_activity"
  ON activity_log FOR SELECT
  TO authenticated
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "workspace_writer_insert_activity"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (SELECT get_user_workspace_ids())
    AND user_id = auth.uid()
  );

-- ============================================================
-- BUILDERS
-- ============================================================

ALTER TABLE builders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select_builders"
  ON builders FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "workspace_writer_insert_builders"
  ON builders FOR INSERT TO authenticated
  WITH CHECK (is_workspace_writer(workspace_id));

CREATE POLICY "workspace_writer_update_builders"
  ON builders FOR UPDATE TO authenticated
  USING (is_workspace_writer(workspace_id))
  WITH CHECK (is_workspace_writer(workspace_id));

CREATE POLICY "workspace_owner_delete_builders"
  ON builders FOR DELETE TO authenticated
  USING (is_workspace_owner(workspace_id));

-- ============================================================
-- PROJECTS
-- ============================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select_projects"
  ON projects FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "workspace_writer_insert_projects"
  ON projects FOR INSERT TO authenticated
  WITH CHECK (is_workspace_writer(workspace_id));

CREATE POLICY "workspace_writer_update_projects"
  ON projects FOR UPDATE TO authenticated
  USING (is_workspace_writer(workspace_id))
  WITH CHECK (is_workspace_writer(workspace_id));

CREATE POLICY "workspace_owner_delete_projects"
  ON projects FOR DELETE TO authenticated
  USING (is_workspace_owner(workspace_id));

-- ============================================================
-- UNITS
-- ============================================================

ALTER TABLE units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select_units"
  ON units FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "workspace_writer_insert_units"
  ON units FOR INSERT TO authenticated
  WITH CHECK (is_workspace_writer(workspace_id));

CREATE POLICY "workspace_writer_update_units"
  ON units FOR UPDATE TO authenticated
  USING (is_workspace_writer(workspace_id))
  WITH CHECK (is_workspace_writer(workspace_id));

CREATE POLICY "workspace_writer_delete_units"
  ON units FOR DELETE TO authenticated
  USING (is_workspace_writer(workspace_id));

-- ============================================================
-- SUB-TABLES: Apply standard 4-policy set to each
-- space_details, cost_breakups, statutory_charges,
-- maintenance_possession_costs, post_possession_budgets,
-- parking_details, amenities, project_images, project_videos
-- ============================================================

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'space_details', 'cost_breakups', 'statutory_charges',
    'maintenance_possession_costs', 'post_possession_budgets',
    'parking_details', 'amenities', 'project_images', 'project_videos'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format(
      'CREATE POLICY "ws_members_select_%1$s" ON %1$I FOR SELECT TO authenticated
       USING (workspace_id IN (SELECT get_user_workspace_ids()))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "ws_writer_insert_%1$s" ON %1$I FOR INSERT TO authenticated
       WITH CHECK (is_workspace_writer(workspace_id))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "ws_writer_update_%1$s" ON %1$I FOR UPDATE TO authenticated
       USING (is_workspace_writer(workspace_id))
       WITH CHECK (is_workspace_writer(workspace_id))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "ws_writer_delete_%1$s" ON %1$I FOR DELETE TO authenticated
       USING (is_workspace_writer(workspace_id))',
      t
    );
  END LOOP;
END $$;

-- ============================================================
-- SITE_VISITS, CHECKLIST_ITEMS, FOLLOW_UPS, DOCUMENTS
-- ============================================================

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'site_visits', 'checklist_items', 'follow_ups', 'documents',
    'payment_milestones', 'negotiations', 'score_snapshots', 'quote_snapshots'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format(
      'CREATE POLICY "ws_members_select_%1$s" ON %1$I FOR SELECT TO authenticated
       USING (workspace_id IN (SELECT get_user_workspace_ids()))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "ws_writer_insert_%1$s" ON %1$I FOR INSERT TO authenticated
       WITH CHECK (is_workspace_writer(workspace_id))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "ws_writer_update_%1$s" ON %1$I FOR UPDATE TO authenticated
       USING (is_workspace_writer(workspace_id))
       WITH CHECK (is_workspace_writer(workspace_id))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "ws_writer_delete_%1$s" ON %1$I FOR DELETE TO authenticated
       USING (is_workspace_writer(workspace_id))',
      t
    );
  END LOOP;
END $$;

-- ============================================================
-- DECISION_STATUS_HISTORY (append-only; no update/delete)
-- ============================================================

ALTER TABLE decision_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ws_members_select_decision_history"
  ON decision_status_history FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT get_user_workspace_ids()));

CREATE POLICY "ws_writer_insert_decision_history"
  ON decision_status_history FOR INSERT TO authenticated
  WITH CHECK (is_workspace_writer(workspace_id));

-- ============================================================
-- IMPORT/EXPORT JOBS, BACKUP_RECORDS
-- ============================================================

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY['import_jobs', 'export_jobs', 'backup_records'];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format(
      'CREATE POLICY "ws_members_select_%1$s" ON %1$I FOR SELECT TO authenticated
       USING (workspace_id IN (SELECT get_user_workspace_ids()))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "ws_writer_insert_%1$s" ON %1$I FOR INSERT TO authenticated
       WITH CHECK (is_workspace_writer(workspace_id))',
      t
    );
  END LOOP;
END $$;

-- ============================================================
-- AUDIT_LOG (service role only; no user policies)
-- ============================================================

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- No policies added — only accessible via service role (Edge Functions)
