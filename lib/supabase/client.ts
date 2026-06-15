// Browser-side Supabase client
// Use this in Client Components ("use client" files)
// Safe to use in the browser — ANON_KEY + RLS enforces access control

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

export function createBrowserClient() {
  return _createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
