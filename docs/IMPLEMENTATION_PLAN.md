# Implementation Plan: go-chassis-client

## Overview
Implement the Vue 3 + Vite frontend application for the go-chassis demo API as specified in `docs/SPEC.md`.

## Phase 1: Project Scaffolding

Create Vite project with Vue 3 + TypeScript:
```bash
npm create vite@latest . -- --template vue-ts
npm install
npm install vue-router@4 pinia
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure:
- `tailwind.config.js` - content paths
- `src/style.css` - Tailwind directives
- `vite.config.ts` - API proxy for `/api` → `localhost:8080`

## Phase 2: Core Infrastructure

**Files to create:**

1. `src/types/index.ts` - TypeScript interfaces (User, Session, Org, OrgMember, Job, CacheEntry)

2. `src/api/client.ts` - Fetch wrapper with:
   - `credentials: 'include'` for cookies
   - Form-encoded POST bodies
   - Error handling

3. `src/stores/auth.ts` - Pinia auth store:
   - `isAuthenticated`, `userId` state
   - `login()`, `logout()`, `checkSession()` actions

4. `src/stores/orgs.ts` - Pinia orgs store:
   - `orgs` state
   - `fetchOrgs()`, `createOrg()`, `fetchMembers()` actions

## Phase 3: Router & Layout

1. `src/router/index.ts` - Vue Router with:
   - 7 routes (/, /login, /orgs, /orgs/:id, /cache, /jobs, /email)
   - Navigation guards for protected routes

2. `src/components/AppHeader.vue` - Navigation links
3. `src/components/AppLayout.vue` - Layout wrapper
4. `src/components/ProtectedRoute.vue` - Auth guard component

5. Update `src/App.vue` - Use AppLayout, RouterView

## Phase 4: Views

1. `src/views/HomeView.vue` - Landing/dashboard
2. `src/views/LoginView.vue` - Email/password form → redirect to /orgs
3. `src/views/OrgsView.vue` - List orgs + create form
4. `src/views/OrgDetailView.vue` - Show org members
5. `src/views/CacheView.vue` - Get/set cache demo
6. `src/views/JobsView.vue` - List jobs + enqueue form
7. `src/views/EmailView.vue` - Send email form

## Phase 5: Wiring

- `src/main.ts` - Initialize Pinia, Router, check session on load

## Files to Modify
- `index.html` (title)
- `vite.config.ts` (proxy)
- `tailwind.config.js` (content)
- `src/style.css` (Tailwind directives)
- `src/main.ts` (Pinia, Router setup)
- `src/App.vue` (layout)

## Files to Create
- `src/types/index.ts`
- `src/api/client.ts`
- `src/stores/auth.ts`
- `src/stores/orgs.ts`
- `src/router/index.ts`
- `src/components/AppHeader.vue`
- `src/components/AppLayout.vue`
- `src/components/ProtectedRoute.vue`
- `src/views/HomeView.vue`
- `src/views/LoginView.vue`
- `src/views/OrgsView.vue`
- `src/views/OrgDetailView.vue`
- `src/views/CacheView.vue`
- `src/views/JobsView.vue`
- `src/views/EmailView.vue`

## Verification
1. `npm run dev` - starts on port 5173
2. `npm run type-check` - no TypeScript errors
3. Navigate to each route manually
4. Test login flow (requires go-chassis backend running on 8080)
