// Supabase service-role admin client
// ⚠️  SERVER-SIDE ONLY — never import this in Client Components or files
//     that might be bundled for the browser.
// ⚠️  This bypasses Row Level Security entirely.
// Use only in Route Handlers (/app/api/**) that run on the server.

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let _adminClient: ReturnType<typeof createClient<Database>> | undefined;

export function getAdminClient() {
  if (_adminClient) return _adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for admin operations",
    );
  }

  _adminClient = createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _adminClient;
}
