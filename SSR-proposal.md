# SSR Migration Plan

## Goal
Move from client-side rendering to SSR-first approach while keeping localStorage-based auth (proxy approach).

## Constraints
- Auth tokens remain in localStorage (no backend changes)
- Server components cannot access localStorage directly
- Protected pages need client-side auth checks

## Architecture Decision

**Public pages** → Full SSR (server components)
**Protected pages** → Hybrid: Server components for layout, client components for auth-gated content

---

## Files to Modify

### 1. Create Server-Side API Layer
**New file:** `web-ui/src/lib/api-server.ts`
- Server-side fetch functions that accept token as parameter
- Used by server actions for authenticated requests
- No localStorage/window dependencies

### 2. Create Server Actions
**New file:** `web-ui/src/app/actions.ts`
- `getMyProjects(token: string)` - fetch user's projects
- `getMyProject(id: string, token: string)` - fetch single project
- These run on server but receive token from client

### 3. Convert `/my-projects` Page
**File:** `web-ui/src/app/my-projects/page.tsx`
- Remove `"use client"`
- Create server component that renders layout/shell
- Extract `ProjectsList` to client component that:
  - Handles auth check via `useAuth()`
  - Calls server action with token
  - Renders project list

**New file:** `web-ui/src/app/my-projects/ProjectsList.tsx`
- `"use client"` component
- Contains auth logic + data fetching via server actions

### 4. Convert `/my-projects/[id]` Page
**File:** `web-ui/src/app/my-projects/[id]/page.tsx`
- Same pattern: server shell + client component for auth content

**New file:** `web-ui/src/app/my-projects/[id]/ProjectDetail.tsx`
- Client component for authenticated content

### 5. Slim Down Auth Context
**File:** `web-ui/src/contexts/auth.tsx`
- Keep as-is for login/register/logout
- Add `getToken()` method to expose token for server actions

### 6. Update Navigation
**File:** `web-ui/src/components/Navigation.tsx`
- Stays client component (needs auth state for UI)
- No changes needed

---

## Resulting Request Pattern

**Before (21+ requests on /my-projects):**
```
Browser → Next.js (JS chunks, CSS, fonts)
Browser → Django (/api/auth/me)
Browser → Django (/api/my/projects)
+ duplicate requests from re-renders
```

**After:**
```
Browser → Next.js (initial HTML with shell, fewer JS chunks)
Browser → Next.js Server Action → Django (/api/my/projects)
```

Key improvement: Less client JS, single data fetch triggered after auth check.

---

## Implementation Order

1. Create `api-server.ts` with server-safe fetch functions
2. Create `actions.ts` with server actions
3. Add `getToken()` to auth context
4. Convert `/my-projects/page.tsx`:
   - Extract `ProjectsList` client component
   - Make page a server component
5. Convert `/my-projects/[id]/page.tsx`:
   - Extract `ProjectDetail` client component
   - Make page a server component
6. Test auth flow and data loading

---

## What Stays Client-Side

- `/login/page.tsx` - form with interactivity
- `/register/page.tsx` - form with interactivity
- `/submit/page.tsx` - form with interactivity
- `Navigation.tsx` - auth state display
- `auth.tsx` context - manages auth state

---

## Future Enhancement (out of scope)
To achieve full SSR for protected pages, would need:
- Backend sets httpOnly cookie on login
- Middleware reads cookie for auth redirect
- Server components read cookie for API calls
