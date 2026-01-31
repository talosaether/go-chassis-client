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

export type JobStatus = 'pending' | 'completed' | 'all'

export interface Job {
  id: string
  type: string
  status: 'pending' | 'completed'
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface JobsResponse {
  jobs: Job[]
  pagination: Pagination
}

export interface CacheEntry {
  key: string
  value: string
}
