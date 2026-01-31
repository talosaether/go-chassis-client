import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, ApiError } from '@/api/client'

// TODO: Backend should return JSON for /login and /protected endpoints
function parseUserId(response: unknown): string | null {
  if (typeof response !== 'string') return null
  // Parse "User ID: <uuid>" from text response
  const match = response.match(/User ID:\s*([^\s]+)/)
  return match ? match[1] : null
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const userId = ref<string | null>(null)
  const isLoading = ref(false)
  const isReady = ref(false)
  const error = ref<string | null>(null)

  let readyResolve: (() => void) | null = null
  const readyPromise = new Promise<void>((resolve) => {
    readyResolve = resolve
  })

  async function login(email: string, password: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await authApi.login(email, password)
      isAuthenticated.value = true
      // Fetch user info from /protected endpoint
      const session = await authApi.checkSession()
      userId.value = parseUserId(session)
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Login failed'
      error.value = message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch {
      // Ignore logout errors - clear local state regardless
    } finally {
      isAuthenticated.value = false
      userId.value = null
    }
  }

  async function checkSession(): Promise<void> {
    try {
      const response = await authApi.checkSession()
      isAuthenticated.value = true
      userId.value = parseUserId(response)
    } catch {
      isAuthenticated.value = false
      userId.value = null
    } finally {
      isReady.value = true
      if (readyResolve) {
        readyResolve()
        readyResolve = null
      }
    }
  }

  function waitUntilReady(): Promise<void> {
    return readyPromise
  }

  return {
    isAuthenticated,
    userId,
    isLoading,
    isReady,
    error,
    login,
    logout,
    checkSession,
    waitUntilReady
  }
})
