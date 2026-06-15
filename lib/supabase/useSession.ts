"use client";

/**
 * useSession — manages the Supabase anonymous auth session.
 *
 * On first visit the user is signed in anonymously. Supabase persists the
 * session in localStorage, so the same anonymous user is restored on every
 * return visit. Their data (workspace, projects, …) lives in Supabase and is
 * scoped to their anonymous uid via RLS policies.
 *
 * If you later add real email/Google auth you can call
 * `supabase.auth.linkIdentity()` to attach an identity without losing data.
 */

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createBrowserClient } from "./client";

export interface SessionState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    session: null,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const supabase = createBrowserClient();
    let mounted = true;

    async function init() {
      try {
        // Check for existing session first.
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          if (mounted) setState({ session, user: session.user, loading: false, error: null });
          return;
        }

        // No session — sign in anonymously.
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
        if (mounted) setState({ session: data.session, user: data.user, loading: false, error: null });
      } catch (err) {
        if (mounted) setState((s) => ({ ...s, loading: false, error: (err as Error).message }));
      }
    }

    init();

    // Keep state in sync when session changes (e.g. token refresh).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState({ session, user: session?.user ?? null, loading: false, error: null });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
