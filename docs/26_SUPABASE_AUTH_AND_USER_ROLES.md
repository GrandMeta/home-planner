# 26_SUPABASE_AUTH_AND_USER_ROLES.md

# Real Estate Decision Portal — Supabase Auth and User Roles

## 1. Purpose

This document defines the authentication, session management, workspace membership, and user role model for the Real Estate Decision Portal.

The portal stores sensitive personal decision data, including:

* Real estate shortlists
* Unit cost details
* Legal/RERA records
* Payment schedules
* Site visit notes
* Family decision notes
* Uploaded documents
* Private media and evidence
* Negotiation history

Authentication and authorization must therefore be designed carefully from the beginning.

---

## 2. Auth Strategy

## 2.1 Version 1 Auth Methods

Version 1 should support:

```text
Email + password sign-up
Email + password sign-in
Password reset
Magic link fallback
```

Do not add OAuth providers in Version 1 unless required.

---

## 2.2 Future Auth Methods

Future versions may support:

```text
Google OAuth
Phone OTP
WhatsApp OTP, if supported and appropriate
Multi-factor authentication
```

These can be added later without changing the core workspace schema.

---

## 2.3 Local vs Production Email Confirmation

For local development:

```toml
# supabase/config.toml
[auth.email]
enable_confirmations = false
```

For production:

```text
Email confirmation should be enabled.
```

Reason:

Production accounts should verify email ownership before accessing private real estate records.

---

# 3. Session Management

## 3.1 Package Decision

Use:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Do not use:

```text
@supabase/auth-helpers-nextjs
```

The app should use `@supabase/ssr` for cookie-based auth sessions compatible with Next.js App Router.

---

## 3.2 Why Cookie-Based Sessions?

Next.js App Router uses both:

```text
Server Components
Client Components
Route Handlers
Middleware / Proxy
Server Actions
```

Browser `localStorage` is not available on the server.

Cookie-based sessions allow server-side code to identify the user without waiting for client-side hydration.

---

## 3.3 Supabase Client Types

Create these files:

```text
/src/lib/supabase/client.ts
/src/lib/supabase/server.ts
/src/lib/supabase/middleware.ts
/src/lib/supabase/auth.ts
/src/lib/supabase/workspaces.ts
/src/lib/supabase/admin.ts
```

| Client            | File                              | Used In                                           |
| ----------------- | --------------------------------- | ------------------------------------------------- |
| Browser client    | `/src/lib/supabase/client.ts`     | Client Components                                 |
| Server client     | `/src/lib/supabase/server.ts`     | Server Components, Server Actions, Route Handlers |
| Middleware client | `/src/lib/supabase/middleware.ts` | Root middleware                                   |
| Admin client      | `/src/lib/supabase/admin.ts`      | Server-only trusted code                          |

---

# 4. Environment Variables

## 4.1 Local Environment

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=local
```

If the Supabase project uses newer publishable keys, use:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

instead of:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Keep naming consistent across the codebase.

---

## 4.2 Security Rules

Allowed in browser:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Never expose in browser:

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SECRET_KEY
```

The service role key may only be used in:

```text
Supabase Edge Functions
Next.js Route Handlers
Next.js Server Actions
Backend admin scripts
```

Never use service role in:

```text
Client Components
Browser JavaScript
NEXT_PUBLIC_* environment variables
```

---

# 5. User and Workspace Model

There is no global application role in Version 1.

All permissions are workspace-scoped.

## 5.1 Core Relationship

```text
auth.users
  → profiles
  → workspace_members
  → workspaces
```

## 5.2 Tables

Required tables:

```text
profiles
workspaces
workspace_members
app_settings
```

## 5.3 Workspace Ownership

Every workspace has:

```text
owner_id
```

The owner is also inserted into:

```text
workspace_members
```

with role:

```text
owner
```

---

# 6. Workspace Roles

The canonical roles are:

```text
owner
editor
viewer
advisor
```

Do not use:

```text
member
```

The old `member` role has been replaced by `editor`.

---

## 6.1 Role Permission Matrix

| Role      | SELECT |             INSERT |             UPDATE |       DELETE | Manage Members | Use Import/Export |
| --------- | -----: | -----------------: | -----------------: | -----------: | -------------: | ----------------: |
| `owner`   |    Yes |                Yes |                Yes |          Yes |            Yes |               Yes |
| `editor`  |    Yes |                Yes |                Yes | Limited / No |             No |               Yes |
| `viewer`  |    Yes |                 No |                 No |           No |             No |                No |
| `advisor` |    Yes | Limited future use | Limited future use |           No |             No |                No |

Version 1 rule:

```text
advisor behaves like viewer unless a specific advisor workflow is implemented later.
```

---

## 6.2 Owner

Owner can:

* Manage workspace
* Rename workspace
* Delete workspace
* Invite users
* Remove users
* Change member roles
* Add/edit/delete projects
* Add/edit/delete units
* Add/edit/delete documents
* Upload/delete files
* Create import/export jobs
* Create backups
* Manage settings

---

## 6.3 Editor

Editor can:

* Add projects
* Edit projects
* Add units
* Edit units
* Add cost data
* Edit cost data
* Upload documents
* Upload media
* Add site visits
* Add follow-ups
* Add payment milestones
* Create exports and backups if allowed by app policy

Editor cannot:

* Delete workspace
* Manage members
* Promote users
* Delete critical records unless specifically allowed
* Access data outside assigned workspaces

---

## 6.4 Viewer

Viewer can:

* View projects
* View units
* View dashboards
* View documents metadata
* Open documents if storage RLS allows
* View site visits
* View follow-ups
* View payment milestones

Viewer cannot:

* Create records
* Update records
* Delete records
* Upload documents
* Run imports
* Manage workspace settings

---

## 6.5 Advisor

Advisor is intended for future controlled access.

Possible future advisor use cases:

* Legal advisor reviews legal documents
* Banker reviews payment schedule
* Family advisor reviews shortlist
* Broker comments on availability

Version 1 behavior:

```text
advisor = viewer
```

Future behavior may allow advisor-specific comments or review status updates.

---

# 7. Auth Flows

## 7.1 Sign-Up Flow

```text
1. User opens /auth/register.
2. User enters email and password.
3. App calls supabase.auth.signUp().
4. Supabase creates auth user after the configured confirmation flow.
5. Database trigger creates profile.
6. Database trigger creates default workspace.
7. Database trigger adds user as owner in workspace_members.
8. Database trigger creates app_settings row.
9. User is redirected to the app after session is available.
```

---

## 7.2 Sign-In Flow

```text
1. User opens /auth/login.
2. User enters email and password.
3. App calls supabase.auth.signInWithPassword().
4. Supabase establishes cookie-based session via @supabase/ssr.
5. Middleware refreshes/validates session on protected requests.
6. App fetches user's workspaces.
7. App sets active workspace.
8. User enters dashboard.
```

---

## 7.3 Magic Link Flow

```text
1. User enters email.
2. App calls signInWithOtp().
3. Supabase sends magic link.
4. User opens link.
5. /auth/confirm handles code exchange.
6. Session is established.
7. User is redirected to dashboard.
```

---

## 7.4 Password Reset Flow

```text
1. User opens /auth/forgot-password.
2. User enters email.
3. App calls resetPasswordForEmail().
4. User receives password reset email.
5. User opens reset link.
6. /auth/reset-password allows new password entry.
7. App calls updateUser({ password }).
8. User is redirected to dashboard or login.
```

---

## 7.5 Sign-Out Flow

```text
1. User clicks Sign Out.
2. App calls supabase.auth.signOut().
3. Session cookies are cleared.
4. User is redirected to /auth/login.
```

---

# 8. Required Auth Routes

Create these routes:

```text
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
/auth/confirm
/auth/callback
```

| Route                   | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `/auth/login`           | Email/password sign-in                   |
| `/auth/register`        | Email/password sign-up                   |
| `/auth/forgot-password` | Request password reset                   |
| `/auth/reset-password`  | Set new password                         |
| `/auth/confirm`         | Handle email confirmation / OTP exchange |
| `/auth/callback`        | Generic callback for auth redirects      |

---

# 9. Protected Routes

All app routes should require authentication:

```text
/
 /projects
 /projects/[projectId]
 /compare
 /map
 /site-visits
 /site-visits/[siteVisitId]
 /financials
 /payments
 /documents
 /follow-ups
 /settings
```

Public routes:

```text
/auth/*
```

Optional future public route:

```text
/shared/*
```

No public sharing should exist in Version 1.

---

# 10. Supabase Client Files

## 10.1 Browser Client

File:

```text
/src/lib/supabase/client.ts
```

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

If using publishable key naming:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

Choose one key convention and use it consistently.

---

## 10.2 Server Client

File:

```text
/src/lib/supabase/server.ts
```

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always write cookies.
            // Middleware should refresh sessions where required.
          }
        },
      },
    },
  );
}
```

---

## 10.3 Middleware Client Utility

File:

```text
/src/lib/supabase/middleware.ts
```

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    supabaseResponse,
    user,
  };
}
```

---

## 10.4 Admin Client

File:

```text
/src/lib/supabase/admin.ts
```

Server-only.

```typescript
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

---

# 11. Root Middleware

File:

```text
/middleware.ts
```

```typescript
import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/confirm",
  "/auth/callback",
];

function isAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;
  const isAuth = isAuthRoute(pathname);

  if (!user && !isAuth) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set(
      "redirectTo",
      request.nextUrl.pathname + request.nextUrl.search,
    );

    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

Important:

Do not skip session refresh in middleware.

---

# 12. Auth Actions

Recommended file:

```text
/src/lib/supabase/auth.ts
```

## 12.1 Register

```typescript
import { createClient } from "@/lib/supabase/client";

export async function registerWithEmail(input: {
  email: string;
  password: string;
  fullName?: string;
}) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName ?? null,
      },
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });
}
```

---

## 12.2 Login

```typescript
import { createClient } from "@/lib/supabase/client";

export async function loginWithEmail(input: {
  email: string;
  password: string;
}) {
  const supabase = createClient();

  return supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });
}
```

---

## 12.3 Magic Link

```typescript
import { createClient } from "@/lib/supabase/client";

export async function sendMagicLink(email: string) {
  const supabase = createClient();

  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/confirm`,
    },
  });
}
```

---

## 12.4 Request Password Reset

```typescript
import { createClient } from "@/lib/supabase/client";

export async function requestPasswordReset(email: string) {
  const supabase = createClient();

  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
}
```

---

## 12.5 Update Password

```typescript
import { createClient } from "@/lib/supabase/client";

export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  return supabase.auth.updateUser({
    password: newPassword,
  });
}
```

---

## 12.6 Logout

```typescript
import { createClient } from "@/lib/supabase/client";

export async function logout() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
```

---

# 13. Auth Callback / Confirm Route

Route:

```text
/auth/confirm
```

Purpose:

Handles magic link, email confirmation, and password reset redirects when a code must be exchanged for a session.

Example route handler:

```typescript
// /src/app/auth/confirm/route.ts

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") ?? "/";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
```

---

# 14. Database Trigger — New User Setup

Migration file:

```text
/supabase/migrations/0008_triggers_and_functions.sql
```

## 14.1 Trigger Function

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid := gen_random_uuid();
  profile_name text;
  workspace_name text;
begin
  profile_name :=
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1),
      'User'
    );

  workspace_name := profile_name || '''s Home Search';

  insert into public.profiles (
    id,
    email,
    full_name,
    display_name
  )
  values (
    new.id,
    new.email,
    profile_name,
    profile_name
  )
  on conflict (id) do nothing;

  insert into public.workspaces (
    id,
    name,
    slug,
    owner_id,
    default_city,
    default_city_zone,
    default_currency,
    is_personal
  )
  values (
    new_workspace_id,
    workspace_name,
    'ws-' || replace(left(new.id::text, 8), '-', ''),
    new.id,
    'Bangalore',
    'east',
    'INR',
    true
  );

  insert into public.workspace_members (
    workspace_id,
    user_id,
    role,
    status,
    joined_at
  )
  values (
    new_workspace_id,
    new.id,
    'owner',
    'active',
    now()
  );

  insert into public.app_settings (
    workspace_id,
    default_city,
    default_city_zone,
    default_currency,
    locale,
    created_by,
    updated_by
  )
  values (
    new_workspace_id,
    'Bangalore',
    'east',
    'INR',
    'en-IN',
    new.id,
    new.id
  );

  return new;
end;
$$;
```

---

## 14.2 Attach Trigger to auth.users

```sql
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
```

---

## 14.3 Trigger Security Notes

The trigger function must be `security definer`.

Reason:

Normal client sessions should not directly create profile/workspace records outside the intended flow.

---

# 15. Workspace Context

After login, the app must resolve the active workspace.

## 15.1 Workspace Fetch Flow

```text
1. Fetch current user.
2. Query workspace_members where user_id = current user.
3. Join workspaces.
4. Filter status = active.
5. Use last selected workspace if available.
6. Otherwise use first active workspace.
7. Store activeWorkspaceId in app state.
```

---

## 15.2 Workspace Context Provider

Recommended files:

```text
/src/providers/workspace-provider.tsx
/src/hooks/use-active-workspace.ts
/src/lib/supabase/workspaces.ts
```

---

## 15.3 Workspace Query

```typescript
import { createClient } from "@/lib/supabase/client";

export async function getUserWorkspaces() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User is not authenticated.");
  }

  const { data, error } = await supabase
    .from("workspace_members")
    .select(`
      id,
      role,
      status,
      workspace:workspaces (
        id,
        name,
        slug,
        default_city,
        default_city_zone,
        default_currency
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    throw error;
  }

  return data;
}
```

---

## 15.4 Active Workspace Storage

Store active workspace ID in:

```text
localStorage
```

Recommended key:

```text
real-estate-active-workspace-id
```

Important:

The stored active workspace is only a convenience.

Security must always be enforced by RLS and Edge Function role checks.

---

# 16. Workspace Invitation Flow

## 16.1 Version 1 Recommendation

Version 1 can keep invitation flow simple.

Owner manually adds another registered user by email.

Workflow:

```text
1. Owner enters collaborator email.
2. App searches profile by email.
3. Owner selects role.
4. App inserts workspace_members row.
5. Collaborator sees workspace after login.
```

---

## 16.2 Future Invitation Flow

Future proper invitation flow:

```text
1. Owner enters email.
2. App creates invitation record.
3. App sends invitation email.
4. Invitee signs up or logs in.
5. App accepts invitation.
6. workspace_members row becomes active.
```

Future table:

```text
workspace_invitations
```

Not required in Version 1.

---

# 17. Role-Based UI Behavior

RLS protects backend access.

Frontend should still hide or disable actions based on role.

## 17.1 Owner UI

Show:

```text
Manage Members
Delete Workspace
Delete Project
Delete Unit
Delete Document
Import
Export
Backup
Settings
```

---

## 17.2 Editor UI

Show:

```text
Add/Edit Project
Add/Edit Unit
Upload Document
Upload Media
Create Site Visit
Create Follow-Up
Update Payments
Export / Backup if allowed
```

Hide or disable:

```text
Manage Members
Delete Workspace
Owner-only deletion
```

---

## 17.3 Viewer UI

Show:

```text
Dashboard
Projects
Units
Map
Documents
Site Visits
Follow-Ups
Payments
Comparison
```

Hide or disable:

```text
Add
Edit
Delete
Upload
Import
Backup
Settings edit
```

---

## 17.4 Advisor UI

Version 1:

```text
Same as viewer.
```

Future:

```text
Advisor review comments
Legal review status updates
Bank review status updates
```

---

# 18. Required Auth UI Pages

## 18.1 Login Page

Route:

```text
/auth/login
```

Fields:

```text
Email
Password
Remember session, optional
Submit
Forgot password link
Magic link option
Register link
```

---

## 18.2 Register Page

Route:

```text
/auth/register
```

Fields:

```text
Full name
Email
Password
Confirm password
Submit
Login link
```

Validation:

```text
Valid email
Password minimum length
Passwords match
```

---

## 18.3 Forgot Password Page

Route:

```text
/auth/forgot-password
```

Fields:

```text
Email
Submit
Back to login
```

---

## 18.4 Reset Password Page

Route:

```text
/auth/reset-password
```

Fields:

```text
New password
Confirm new password
Submit
```

---

## 18.5 Confirm Page

Route:

```text
/auth/confirm
```

Behavior:

```text
Exchange auth code for session
Show loading state
Redirect safely
Show error if confirmation fails
```

---

# 19. Security Rules

## 19.1 Server-Side User Validation

Server-side code should validate user identity using Supabase auth methods that verify the user/session.

Do not trust only client-provided user IDs.

---

## 19.2 Workspace ID Rule

Every query must include workspace context.

Do not query major tables without:

```text
workspace_id
```

Examples:

Good:

```typescript
.eq("workspace_id", activeWorkspaceId)
```

Bad:

```typescript
.from("projects").select("*")
```

RLS still protects data, but workspace filters improve performance and avoid accidental cross-workspace UI mixing.

---

## 19.3 Client-Side Role Is Not Security

The frontend can hide buttons based on role.

But security must be enforced by:

```text
RLS
Edge Function role checks
Storage policies
```

---

## 19.4 Redirect Safety

When using `redirectTo`, ensure the target path is internal.

Do not redirect to arbitrary external URLs from query parameters.

---

## 19.5 Service Role Rule

Never use service role in auth pages or client-side session logic.

Service role is for trusted backend operations only.

---

# 20. Auth QA Checklist

## 20.1 Sign-Up QA

Check:

```text
User can register.
Profile row is created.
Workspace row is created.
Workspace member row is created with owner role.
App settings row is created.
User lands on dashboard after confirmation/login.
```

---

## 20.2 Login QA

Check:

```text
User can sign in with email/password.
Invalid password shows safe error.
Middleware protects app routes.
Authenticated user cannot access login/register pages.
Session survives page refresh.
Expired session refresh works.
```

---

## 20.3 Logout QA

Check:

```text
User can sign out.
Protected routes redirect to login.
Session cookies are cleared.
```

---

## 20.4 Password Reset QA

Check:

```text
User can request reset email.
Reset link opens reset page.
New password can be set.
User can log in with new password.
```

---

## 20.5 Workspace QA

Check:

```text
New user gets default workspace.
Owner can see workspace.
Owner can invite/add editor/viewer/advisor.
Editor can create records.
Viewer cannot create records.
Advisor behaves as viewer.
Outsider cannot see workspace.
```

---

## 20.6 RLS Role QA

Check:

```text
Owner can select/insert/update/delete.
Editor can select/insert/update but not owner-only delete.
Viewer can select only.
Advisor can select only in Version 1.
Outsider gets zero rows.
```

---

# 21. Auth Acceptance Criteria

Auth is ready when:

1. Email/password sign-up works.
2. Email/password login works.
3. Magic link fallback works.
4. Password reset works.
5. Session works with Next.js App Router.
6. Middleware protects app routes.
7. Auth pages are accessible when logged out.
8. Authenticated users are redirected away from login/register.
9. New user trigger creates profile.
10. New user trigger creates workspace.
11. New user trigger creates owner membership.
12. New user trigger creates app settings.
13. Workspace role model uses owner/editor/viewer/advisor.
14. No `member` role remains.
15. Active workspace is resolved after login.
16. UI respects role permissions.
17. RLS enforces role permissions.
18. Service role is not exposed.
19. Production email confirmation is enabled.
20. Auth QA passes.

---

# 22. Final Auth Principle

Authentication answers:

```text
Who is the user?
```

Workspace membership answers:

```text
Which decision space can this user access?
```

Workspace role answers:

```text
What can this user do inside that decision space?
```

The portal must never rely only on frontend state for access control.

Security must be enforced at three layers:

```text
Supabase Auth
Row Level Security
Storage / Edge Function role checks
```

The result should be simple for the user, but strict in the backend.
