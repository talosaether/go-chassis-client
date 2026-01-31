# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This is a **specification-only repository**. The `docs/SPEC.md` file contains the complete design - no implementation exists yet.

## Tech Stack

Vue 3 (Composition API with `<script setup>`) + Vite + TypeScript + Pinia + Vue Router 4 + Tailwind CSS

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server on port 5173
npm run build        # Production build
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
npm run lint         # Code linting
```

## Architecture Overview

**Frontend client for go-chassis demo API** (backend at `http://localhost:8080`)

### Key Patterns

- **API Client**: Native fetch wrapper with `credentials: 'include'` for cookie-based auth
- **State Management**: Pinia stores for auth (`isAuthenticated`, `userId`) and orgs
- **Auth Flow**: Login form → POST `/login` → cookie session → verify via `/protected` on app load
- **Protected Routes**: ProtectedRoute component wraps auth-required views

### Directory Structure (planned)

- `src/api/` - Fetch wrapper with error handling
- `src/stores/` - Pinia stores (auth, orgs)
- `src/composables/` - Reusable composition functions
- `src/views/` - Route components (7 views)
- `src/components/` - Shared components (AppHeader, AppLayout, ProtectedRoute)
- `src/router/` - Vue Router config with auth guards
- `src/types/` - TypeScript interfaces

### API Endpoints

Protected (require session cookie): `/logout`, `/protected`, `/orgs`, `/orgs/members`
Public: `/login`, `/cache`, `/jobs`, `/email`

## Implementation Order

Follow the 9-phase plan in `docs/SPEC.md`:
1. Project scaffolding (Vite + Vue + TypeScript + Tailwind)
2. API client and types
3. Auth store and login flow
4. Router with auth guards
5. Layout and navigation components
6. LoginView
7. OrgsView and OrgDetailView
8. CacheView, JobsView, EmailView
9. Polish and error handling

## Environment Variables

```env
VITE_API_URL=http://localhost:8080
```

## CORS

Dev: Vite proxy configured to forward `/api` to backend
Prod: Backend needs CORS middleware (example in `docs/SPEC.md`)
