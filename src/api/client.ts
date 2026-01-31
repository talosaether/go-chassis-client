// Use /api prefix in dev to go through Vite proxy (avoids CORS)
// In production, set VITE_API_URL to the actual backend URL
const API_BASE = import.meta.env.VITE_API_URL || '/api'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, string>
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function api<T = string>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body } = options

  const config: RequestInit = {
    method,
    credentials: 'include',
  }

  if (body) {
    config.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    config.body = new URLSearchParams(body)
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)

  if (!response.ok) {
    const error = await response.text()
    throw new ApiError(error || response.statusText, response.status)
  }

  const text = await response.text()

  try {
    return JSON.parse(text) as T
  } catch {
    return text as T
  }
}

export const authApi = {
  login: (email: string, password: string) =>
    api('/login', { method: 'POST', body: { email, password } }),

  logout: () =>
    api('/logout', { method: 'POST' }),

  checkSession: () =>
    api('/protected'),
}

export const orgsApi = {
  list: () =>
    api<{ id: string; name: string; role: string }[]>('/orgs'),

  create: (name: string) =>
    api('/orgs', { method: 'POST', body: { name } }),

  getMembers: (orgId: string) =>
    api<{ userId: string; role: string }[]>(`/orgs/members?org_id=${orgId}`),
}

export const cacheApi = {
  get: (key: string) =>
    api(`/cache?key=${encodeURIComponent(key)}`),

  set: (key: string, value: string) =>
    api('/cache', { method: 'POST', body: { key, value } }),
}

export const jobsApi = {
  list: (status: 'all' | 'pending' | 'completed' = 'all') =>
    api<{ id: string; type: string; status: string }[]>(`/jobs?status=${status}`),

  get: (id: string) =>
    api<{ id: string; type: string; status: string }>(`/jobs/${id}`),

  enqueue: (type: string, data: string) =>
    api<{ id: string; type: string; status: string }>('/jobs', { method: 'POST', body: { type, data } }),
}

export const emailApi = {
  send: (to: string, subject: string, body: string) =>
    api('/email', { method: 'POST', body: { to, subject, body } }),
}
