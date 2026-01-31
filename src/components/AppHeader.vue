<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="bg-gray-800 text-white">
    <nav class="max-w-6xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-6">
          <RouterLink to="/" class="text-xl font-bold hover:text-gray-300">
            go-chassis
          </RouterLink>
          <div class="flex space-x-4">
            <RouterLink to="/cache" class="hover:text-gray-300">Cache</RouterLink>
            <RouterLink to="/jobs" class="hover:text-gray-300">Jobs</RouterLink>
            <RouterLink to="/email" class="hover:text-gray-300">Email</RouterLink>
            <RouterLink
              v-if="authStore.isAuthenticated"
              to="/orgs"
              class="hover:text-gray-300"
            >
              Orgs
            </RouterLink>
          </div>
        </div>
        <div>
          <template v-if="authStore.isAuthenticated">
            <span class="mr-4 text-gray-300">{{ authStore.userId }}</span>
            <button
              @click="handleLogout"
              class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </template>
          <RouterLink
            v-else
            to="/login"
            class="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
          >
            Login
          </RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>
