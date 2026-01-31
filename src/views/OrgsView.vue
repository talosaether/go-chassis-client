<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrgsStore } from '@/stores/orgs'

const orgsStore = useOrgsStore()
const newOrgName = ref('')
const createError = ref('')

onMounted(() => {
  orgsStore.fetchOrgs()
})

async function handleCreateOrg() {
  createError.value = ''
  if (!newOrgName.value.trim()) return

  try {
    await orgsStore.createOrg(newOrgName.value.trim())
    newOrgName.value = ''
  } catch (e) {
    createError.value = e instanceof Error ? e.message : 'Failed to create organization'
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Organizations</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Create Organization</h2>
      <form @submit.prevent="handleCreateOrg" class="flex gap-3">
        <input
          v-model="newOrgName"
          type="text"
          placeholder="Organization name"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          :disabled="orgsStore.isLoading || !newOrgName.trim()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create
        </button>
      </form>
      <div v-if="createError" class="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
        {{ createError }}
      </div>
    </div>

    <div v-if="orgsStore.isLoading" class="text-center py-8 text-gray-600">
      Loading...
    </div>

    <div v-else-if="orgsStore.error" class="p-4 bg-red-50 text-red-700 rounded-lg">
      {{ orgsStore.error }}
    </div>

    <div v-else-if="orgsStore.orgs.length === 0" class="text-center py-8 text-gray-600">
      No organizations yet. Create one above!
    </div>

    <div v-else class="space-y-3">
      <RouterLink
        v-for="org in orgsStore.orgs"
        :key="org.id"
        :to="`/orgs/${org.id}`"
        class="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ org.name }}</h3>
            <p class="text-sm text-gray-500">ID: {{ org.id }}</p>
          </div>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {{ org.role }}
          </span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
