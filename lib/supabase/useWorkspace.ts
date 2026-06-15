"use client";

/**
 * useWorkspace — ensures the authenticated user has a personal workspace.
 *
 * On first sign-in the workspace row doesn't exist yet, so we create it.
 * Subsequent visits just fetch it. Returns the workspace id that every
 * Supabase query needs.
 */

import { useEffect, useState } from "react";
import { createUntypedClient as createBrowserClient } from "./client";
import type { User } from "@supabase/supabase-js";

export interface WorkspaceState {
  workspaceId: string | null;
  loading: boolean;
  error: string | null;
}

export function useWorkspace(user: User | null): WorkspaceState {
  const [state, setState] = useState<WorkspaceState>({
    workspaceId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => setState({ workspaceId: null, loading: false, error: null }), 0);
      return () => clearTimeout(t);
    }

    let mounted = true;
    const supabase = createBrowserClient();
    const uid = user.id;

    async function bootstrap() {
      try {
        // Look for an existing personal workspace owned by this user.
        const { data: existing, error: fetchErr } = await supabase
          .from("workspaces")
          .select("id")
          .eq("owner_id", uid)
          .eq("is_personal", true)
          .maybeSingle();

        if (fetchErr) throw fetchErr;

        if (existing) {
          if (mounted) setState({ workspaceId: existing.id, loading: false, error: null });
          return;
        }

        // First visit — create a personal workspace.
        const slug = `ws-${uid.slice(0, 8)}`;
        const { data: created, error: createErr } = await supabase
          .from("workspaces")
          .insert({
            name: "My Home Search",
            slug,
            owner_id: uid,
            is_personal: true,
            default_city: "Bangalore",
            default_city_zone: "east",
          })
          .select("id")
          .single();

        if (createErr) throw createErr;

        // Add the owner as a workspace member.
        await supabase.from("workspace_members").insert({
          workspace_id: created.id,
          user_id: uid,
          role: "owner",
          status: "active",
        });

        if (mounted) setState({ workspaceId: created.id, loading: false, error: null });
      } catch (err) {
        if (mounted) setState({ workspaceId: null, loading: false, error: (err as Error).message });
      }
    }

    bootstrap();
    return () => { mounted = false; };
  }, [user]);

  return state;
}
