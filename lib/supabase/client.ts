// Browser-side Supabase client for Client Components.
// Supports both SUPABASE_ANON_KEY and SUPABASE_PUBLISHABLE_KEY naming
// (newer Supabase versions use the publishable key name).

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Singleton so we don't create a new client on every render.
let _client: ReturnType<typeof _createBrowserClient<Database>> | null = null;

export function createBrowserClient() {
  if (!_client) {
    _client = _createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY);
  }
  return _client;
}

// Untyped client for use in the store layer where the hand-written
// database.types.ts diverges from the actual migration schema.
// Once `supabase gen types` is run against the live project this can be removed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createUntypedClient(): ReturnType<typeof _createBrowserClient<any>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _createBrowserClient<any>(SUPABASE_URL, SUPABASE_KEY);
}
