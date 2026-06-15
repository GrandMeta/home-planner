// health-check Edge Function
// No JWT verification required (verify_jwt = false in config.toml)
// Used to confirm the Edge Function runtime is reachable.

import { corsHeaders, handleCors, jsonResponse } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return jsonResponse({
    status: "ok",
    service: "home-decision-cockpit",
    timestamp: new Date().toISOString(),
    region: Deno.env.get("SUPABASE_REGION") ?? "unknown",
  });
});
