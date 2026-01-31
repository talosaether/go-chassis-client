import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, ApiError } from '@/api/client'

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
      const response = await authApi.login(email, password)
      isAuthenticated.value = true
      userId.value = typeof response === 'string' ? response : null
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
    } finally {
      isAuthenticated.value = false
      userId.value = null
    }
  }

  async function checkSession(): Promise<void> {
    try {
      const response = await authApi.checkSession()
      isAuthenticated.value = true
      userId.value = typeof response === 'string' ? response : null
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
