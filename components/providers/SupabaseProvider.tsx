"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSession } from "@/lib/supabase/useSession";
import { useWorkspace } from "@/lib/supabase/useWorkspace";
import { useSupabaseStore } from "@/store/useSupabaseStore";

type StoreType = ReturnType<typeof useSupabaseStore>;

const StoreContext = createContext<StoreType | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { user, loading: sessionLoading } = useSession();
  const { workspaceId, loading: workspaceLoading } = useWorkspace(user);
  const store = useSupabaseStore(workspaceId);

  const isBooting = sessionLoading || workspaceLoading || store.loading;

  if (isBooting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-cyan-500 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <p className="text-sm text-slate-500">Setting up your workspace…</p>
        </div>
      </div>
    );
  }

  if (store.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
        <div className="bg-white rounded-2xl border border-red-200 p-6 max-w-sm text-center">
          <p className="font-semibold text-red-700 mb-1">Could not connect to Supabase</p>
          <p className="text-sm text-slate-500">{store.error}</p>
          <p className="text-xs text-slate-400 mt-2">Check your .env.local and Supabase project settings.</p>
        </div>
      </div>
    );
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useAppStore<T>(selector: (state: StoreType) => T): T {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useAppStore must be used inside <SupabaseProvider>");
  return selector(store);
}
