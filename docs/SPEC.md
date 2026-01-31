# go-chassis-client Specification

A Vue 3 + Vite frontend application for the go-chassis demo API.

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **HTTP Client**: Native fetch (with composable wrapper)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
go-chassis-client/
├── src/
│   ├── api/
│   │   └── client.ts          # API client with fetch wrapper
│   ├── composables/
│   │   ├── useAuth.ts         # Auth state and methods
│   │   └── useApi.ts          # Generic API fetch composable
│   ├── stores/
│   │   ├── auth.ts            # Auth store (user session)
│   │   └── orgs.ts            # Organizations store
│   ├── views/
│   │   ├── HomeView.vue       # Landing page / dashboard
│   │   ├── LoginView.vue      # Login form
│   │   ├── OrgsView.vue       # Organizations list & create
│   │   ├── OrgDetailView.vue  # Org members view
│   │   ├── CacheView.vue      # Cache get/set demo
│   │   ├── JobsView.vue       # Queue jobs list & enqueue
│   │   └── EmailView.vue      # Send email form
│   ├── components/
│   │   ├── AppHeader.vue      # Navigation header
│   │   ├── AppLayout.vue      # Main layout wrapper
│   │   └── ProtectedRoute.vue # Auth guard wrapper
│   ├── router/
│   │   └── index.ts           # Route definitions
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   ├── App.vue
│   └── main.ts
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## API Integration

Base URL: `http://localhost:8080` (configurable via env)

### Endpoints to Implement

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/login` | POST | No | Login with email/password |
| `/logout` | POST | Yes | End session |
| `/protected` | GET | Yes | Verify session is valid |
| `/orgs` | GET | Yes | List user's organizations |
| `/orgs` | POST | Yes | Create new organization |
| `/orgs/members` | GET | Yes | List org members |
| `/cache` | GET | No | Get cached value by key |
| `/cache` | POST | No | Set cache key/value |
| `/jobs` | GET | No | List pending jobs |
| `/jobs` | POST | No | Enqueue new job |
| `/email` | POST | No | Send email |

### API Client Design

```typescript
// src/api/client.ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, string>
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body } = options

  const config: RequestInit = {
    method,
    credentials: 'include', // Send cookies for auth
  }

  if (body) {
    config.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    config.body = new URLSearchParams(body)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error)
  }

  return response.text() as T
}
```

## TypeScript Interfaces

```typescript
// src/types/index.ts
export interface User {
  id: string
  email: string
}

export interface Session {
  userId: string
  sessionId: string
  expiresAt: string
}

export interface Org {
  id: string
  name: string
  role: string
}

export interface OrgMember {
  userId: string
  role: string
}

export interface Job {
  id: string
  type: string
}

export interface CacheEntry {
  key: string
  value: string
}
```

## Routes

| Path | View | Auth Required | Description |
|------|------|---------------|-------------|
| `/` | HomeView | No | Landing / dashboard |
| `/login` | LoginView | No | Login form |
| `/orgs` | OrgsView | Yes | Organizations |
| `/orgs/:id` | OrgDetailView | Yes | Org members |
| `/cache` | CacheView | No | Cache demo |
| `/jobs` | JobsView | No | Queue demo |
| `/email` | EmailView | No | Email demo |

## Auth Flow

1. User submits login form with email/password
2. POST to `/login` with form data
3. Server sets `session` cookie on success
4. Store auth state in Pinia (check `/protected` on app load)
5. Cookie is sent automatically with `credentials: 'include'`
6. Logout calls POST `/logout` and clears local state

## Stores

### Auth Store (`stores/auth.ts`)

```typescript
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userId = ref<string | null>(null)

  async function login(email: string, password: string): Promise<void>
  async function logout(): Promise<void>
  async function checkSession(): Promise<void>

  return { isAuthenticated, userId, login, logout, checkSession }
})
```

### Orgs Store (`stores/orgs.ts`)

```typescript
export const useOrgsStore = defineStore('orgs', () => {
  const orgs = ref<Org[]>([])

  async function fetchOrgs(): Promise<void>
  async function createOrg(name: string): Promise<void>
  async function fetchMembers(orgId: string): Promise<OrgMember[]>

  return { orgs, fetchOrgs, createOrg, fetchMembers }
})
```

## Views

### LoginView

- Email input field
- Password input field
- Submit button
- Error message display
- Redirect to `/orgs` on success

### OrgsView

- List of user's organizations (name, role)
- "Create Organization" form (name input)
- Click org to navigate to detail view

### OrgDetailView

- Org name header
- List of members (user ID, role)
- Back link to orgs list

### CacheView

- "Get" section: key input + fetch button + value display
- "Set" section: key input + value input + save button
- Success/error feedback

### JobsView

- List of pending jobs (ID, type)
- "Enqueue" form: type input + data input + submit button
- Auto-refresh or manual refresh button

### EmailView

- To input
- Subject input
- Body textarea
- Send button
- Success message

## Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## Environment Variables

```env
VITE_API_URL=http://localhost:8080
```

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint
```

## CORS Considerations

The go-chassis demo server needs CORS headers for cross-origin requests. Either:

1. **Proxy through Vite** (dev only) - configured above
2. **Add CORS middleware to Go server** - for production

Recommended: Add CORS to the Go demo server:

```go
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}
```

## Implementation Order

1. Project scaffolding (Vite + Vue + TypeScript + Tailwind)
2. API client and types
3. Auth store and login flow
4. Router with auth guards
5. Layout and navigation components
6. LoginView
7. OrgsView and OrgDetailView
8. CacheView, JobsView, EmailView
9. Polish and error handling
