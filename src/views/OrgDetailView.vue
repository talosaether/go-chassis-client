<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrgsStore } from '@/stores/orgs'
import type { OrgMember } from '@/types'

const route = useRoute()
const orgsStore = useOrgsStore()

const members = ref<OrgMember[]>([])
const isLoading = ref(true)
const error = ref('')

const orgId = computed(() => route.params.id as string)
const org = computed(() => orgsStore.orgs.find(o => o.id === orgId.value))

onMounted(async () => {
  if (orgsStore.orgs.length === 0) {
    await orgsStore.fetchOrgs()
  }

  try {
    members.value = await orgsStore.fetchMembers(orgId.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load members'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <RouterLink to="/orgs" class="text-blue-600 hover:text-blue-500 mb-4 inline-block">
      &larr; Back to Organizations
    </RouterLink>

    <div v-if="org" class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">{{ org.name }}</h1>
      <p class="text-gray-500">ID: {{ orgId }} | Your role: {{ org.role }}</p>
    </div>
    <div v-else class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Organization {{ orgId }}</h1>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-800">Members</h2>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-gray-600">
        Loading members...
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 text-red-700">
        {{ error }}
      </div>

      <div v-else-if="members.length === 0" class="p-8 text-center text-gray-600">
        No members found.
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="member in members"
          :key="member.userId"
          class="p-4 flex justify-between items-center"
        >
          <span class="text-gray-800">{{ member.userId }}</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {{ member.role }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
