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
