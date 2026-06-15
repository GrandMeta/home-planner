// Auth helper for Edge Functions.
// Verifies the JWT from the Authorization header and checks workspace membership.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getAdminClient } from "./supabaseAdmin.ts";
import { errorResponse } from "./cors.ts";

export interface AuthContext {
  userId: string;
  workspaceId: string;
  role: "owner" | "member" | "viewer";
}

/**
 * Validates the Authorization header and workspace membership.
 * Throws a Response on failure — catch it and return directly.
 */
export async function requireAuth(
  req: Request,
  body?: Record<string, unknown>,
): Promise<AuthContext> {
  // 1. Extract bearer token
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw errorResponse("Missing Authorization header", "UNAUTHORIZED", 401);
  }
  const token = authHeader.replace("Bearer ", "");

  // 2. Verify token with anon client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    token,
  );

  if (authError || !user) {
    throw errorResponse("Invalid or expired token", "UNAUTHORIZED", 401);
  }

  // 3. Resolve workspace_id from body or header
  const workspaceId =
    (body?.workspace_id as string) ??
    req.headers.get("x-workspace-id");

  if (!workspaceId) {
    throw errorResponse(
      "workspace_id is required in request body",
      "BAD_REQUEST",
      400,
    );
  }

  // 4. Verify membership using admin client
  const admin = getAdminClient();
  const { data: membership, error: memberError } = await admin
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single();

  if (memberError || !membership) {
    throw errorResponse(
      "You are not a member of this workspace",
      "FORBIDDEN",
      403,
    );
  }

  return {
    userId: user.id,
    workspaceId,
    role: membership.role as AuthContext["role"],
  };
}

/**
 * Like requireAuth but additionally enforces owner or member role (not viewer).
 */
export async function requireWriteAccess(
  req: Request,
  body?: Record<string, unknown>,
): Promise<AuthContext> {
  const ctx = await requireAuth(req, body);
  if (ctx.role === "viewer") {
    throw errorResponse(
      "Viewers cannot perform write operations",
      "FORBIDDEN",
      403,
    );
  }
  return ctx;
}
