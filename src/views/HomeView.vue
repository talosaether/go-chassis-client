<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="text-center">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">go-chassis Demo</h1>
    <p class="text-gray-600 mb-8 max-w-2xl mx-auto">
      A Vue 3 frontend client for the go-chassis demo API. Explore the various
      features including authentication, organizations, caching, job queues, and email.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <RouterLink
        to="/cache"
        class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Cache</h2>
        <p class="text-gray-600">Get and set cached key-value pairs</p>
      </RouterLink>

      <RouterLink
        to="/jobs"
        class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Jobs</h2>
        <p class="text-gray-600">View pending jobs and enqueue new ones</p>
      </RouterLink>

      <RouterLink
        to="/email"
        class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Email</h2>
        <p class="text-gray-600">Send emails via the API</p>
      </RouterLink>

      <RouterLink
        v-if="authStore.isAuthenticated"
        to="/orgs"
        class="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Organizations</h2>
        <p class="text-gray-600">Manage your organizations and members</p>
      </RouterLink>

      <RouterLink
        v-else
        to="/login"
        class="block p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition-shadow border-2 border-blue-200"
      >
        <h2 class="text-xl font-semibold text-blue-800 mb-2">Login</h2>
        <p class="text-blue-600">Sign in to access protected features</p>
      </RouterLink>
    </div>
  </div>
</template>
