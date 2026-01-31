<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { jobsApi } from '@/api/client'
import type { Job } from '@/types'

const route = useRoute()

const job = ref<Job | null>(null)
const isLoading = ref(true)
const error = ref('')

const jobId = computed(() => route.params.id as string)

onMounted(async () => {
  try {
    const result = await jobsApi.get(jobId.value)
    job.value = result
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load job'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <RouterLink to="/jobs" class="text-blue-600 hover:text-blue-500 mb-4 inline-block">
      &larr; Back to Jobs
    </RouterLink>

    <div v-if="isLoading" class="text-center py-8 text-gray-600">
      Loading job...
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="!job" class="text-center py-8 text-gray-600">
      Job not found.
    </div>

    <div v-else class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ job.type }}</h1>
            <p class="text-sm text-gray-500 mt-1">ID: {{ job.id }}</p>
          </div>
          <span
            :class="[
              'px-3 py-1 rounded-full text-sm',
              job.status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            ]"
          >
            {{ job.status === 'completed' ? 'Completed' : 'Pending' }}
          </span>
        </div>
      </div>

      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>
        <dl class="grid grid-cols-1 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500">Job ID</dt>
            <dd class="mt-1 text-sm text-gray-900 font-mono">{{ job.id }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Type</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ job.type }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Status</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ job.status }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>
