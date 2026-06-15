// Shared CORS headers and preflight handler for all Edge Functions

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-workspace-id",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

/**
 * Returns a CORS preflight response if the request is OPTIONS,
 * otherwise returns null (proceed with normal handling).
 */
export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return null;
}

/**
 * Wrap a response body with CORS headers.
 */
export function jsonResponse(
  data: unknown,
  status = 200,
): Response {
  return new Response(JSON.stringify({ data, error: null }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Wrap an error response with CORS headers.
 */
export function errorResponse(
  message: string,
  code: string,
  status: number,
): Response {
  return new Response(
    JSON.stringify({ data: null, error: { code, message } }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}
