<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.isAuthenticated">
    <slot />
  </div>
  <div v-else class="text-center py-12">
    <p class="text-gray-600 mb-4">You need to be logged in to view this page.</p>
    <RouterLink
      to="/login"
      class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
    >
      Login
    </RouterLink>
  </div>
</template>
