// Auth helpers for the frontend
// Used in Client Components and Route Handlers

import { createBrowserClient } from "./client";

// ---- Sign in ----
export async function signIn(email: string, password: string) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// ---- Sign up ----
export async function signUp(
  email: string,
  password: string,
  fullName?: string,
) {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });
  if (error) throw error;
  return data;
}

// ---- Sign out ----
export async function signOut() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ---- Get current user (client-side) ----
export async function getCurrentUser() {
  const supabase = createBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

// ---- Send password reset email ----
export async function sendPasswordReset(
  email: string,
  redirectTo?: string,
) {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      redirectTo ??
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
  if (error) throw error;
}

// ---- Update password (after reset link) ----
export async function updatePassword(newPassword: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

// ---- Get first workspace for current user ----
export async function getActiveWorkspace() {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, slug)")
    .order("joined_at", { ascending: true })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}
