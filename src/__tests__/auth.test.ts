import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import * as client from '@/api/client'

vi.mock('@/api/client', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    checkSession: vi.fn()
  },
  ApiError: class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
      super(message)
      this.status = status
    }
  }
}))

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('checkSession', () => {
    it('sets isAuthenticated true on success', async () => {
      vi.mocked(client.authApi.checkSession).mockResolvedValue(
        'Welcome! User ID: abc-123 Session ID: xyz'
      )

      const store = useAuthStore()
      await store.checkSession()

      expect(store.isAuthenticated).toBe(true)
      expect(store.userId).toBe('abc-123')
      expect(store.isReady).toBe(true)
    })

    it('sets isAuthenticated false on failure', async () => {
      vi.mocked(client.authApi.checkSession).mockRejectedValue(new Error('Unauthorized'))

      const store = useAuthStore()
      await store.checkSession()

      expect(store.isAuthenticated).toBe(false)
      expect(store.userId).toBeNull()
      expect(store.isReady).toBe(true)
    })

    it('resolves waitUntilReady after checkSession', async () => {
      vi.mocked(client.authApi.checkSession).mockResolvedValue('User ID: test-id')

      const store = useAuthStore()
      const checkPromise = store.checkSession()
      const readyPromise = store.waitUntilReady()

      await checkPromise
      await expect(readyPromise).resolves.toBeUndefined()
    })
  })

  describe('login', () => {
    it('sets isAuthenticated and fetches user info', async () => {
      vi.mocked(client.authApi.login).mockResolvedValue('Login successful')
      vi.mocked(client.authApi.checkSession).mockResolvedValue('User ID: user-123')

      const store = useAuthStore()
      await store.login('test@example.com', 'password')

      expect(client.authApi.login).toHaveBeenCalledWith('test@example.com', 'password')
      expect(store.isAuthenticated).toBe(true)
      expect(store.userId).toBe('user-123')
      expect(store.isLoading).toBe(false)
    })

    it('sets error on failure', async () => {
      const apiError = new client.ApiError('Invalid credentials', 401)
      vi.mocked(client.authApi.login).mockRejectedValue(apiError)

      const store = useAuthStore()

      await expect(store.login('test@example.com', 'wrong')).rejects.toThrow()
      expect(store.error).toBe('Invalid credentials')
      expect(store.isAuthenticated).toBe(false)
      expect(store.isLoading).toBe(false)
    })

    it('sets isLoading during request', async () => {
      let resolveLogin: (value: string) => void
      vi.mocked(client.authApi.login).mockImplementation(
        () => new Promise((resolve) => { resolveLogin = resolve })
      )

      const store = useAuthStore()
      const loginPromise = store.login('test@example.com', 'password')

      expect(store.isLoading).toBe(true)

      vi.mocked(client.authApi.checkSession).mockResolvedValue('User ID: x')
      resolveLogin!('ok')
      await loginPromise

      expect(store.isLoading).toBe(false)
    })
  })

  describe('logout', () => {
    it('clears auth state', async () => {
      vi.mocked(client.authApi.checkSession).mockResolvedValue('User ID: user-123')
      vi.mocked(client.authApi.logout).mockResolvedValue('Logged out')

      const store = useAuthStore()
      await store.checkSession()
      expect(store.isAuthenticated).toBe(true)

      await store.logout()

      expect(client.authApi.logout).toHaveBeenCalled()
      expect(store.isAuthenticated).toBe(false)
      expect(store.userId).toBeNull()
    })

    it('clears auth state even if logout API fails', async () => {
      vi.mocked(client.authApi.checkSession).mockResolvedValue('User ID: user-123')
      vi.mocked(client.authApi.logout).mockRejectedValue(new Error('Network error'))

      const store = useAuthStore()
      await store.checkSession()

      // logout() doesn't re-throw, just clears state in finally
      await store.logout()

      expect(store.isAuthenticated).toBe(false)
      expect(store.userId).toBeNull()
    })
  })
})
