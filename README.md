# go-chassis-client

Vue 3 frontend client for the [go-chassis](https://github.com/talosaether/go-chassis) demo API.

## Tech Stack

- Vue 3 (Composition API with `<script setup>`)
- Vite
- TypeScript
- Pinia (state management)
- Vue Router 4
- Tailwind CSS v4

## Prerequisites

- Node.js 18+
- [go-chassis](https://github.com/talosaether/go-chassis) backend running on `localhost:8080`

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on http://localhost:5173 with API proxy to `localhost:8080`.

## Build

```bash
npm run build
npm run preview  # preview production build
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript validation |

## Project Structure

```
src/
├── api/          # API client with fetch wrapper
├── components/   # Shared components (AppHeader, AppLayout, ProtectedRoute)
├── router/       # Vue Router configuration
├── stores/       # Pinia stores (auth, orgs)
├── types/        # TypeScript interfaces
└── views/        # Route components
```

## Views

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Home/dashboard | No |
| `/login` | Login form | No |
| `/orgs` | Organizations list | Yes |
| `/orgs/:id` | Organization members | Yes |
| `/cache` | Cache get/set demo | No |
| `/jobs` | Job queue demo | No |
| `/email` | Send email demo | No |

## Environment Variables

```env
VITE_API_URL=  # Leave empty to use Vite proxy (dev), or set backend URL (prod)
```
