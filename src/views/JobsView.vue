<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { jobsApi } from '@/api/client'
import type { Job } from '@/types'

const jobs = ref<Job[]>([])
const isLoading = ref(false)
const error = ref('')

const jobType = ref('')
const jobData = ref('')
const enqueueLoading = ref(false)
const enqueueError = ref('')
const enqueueSuccess = ref(false)

async function fetchJobs() {
  isLoading.value = true
  error.value = ''

  try {
    const result = await jobsApi.list()
    jobs.value = Array.isArray(result) ? result : []
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch jobs'
    jobs.value = []
  } finally {
    isLoading.value = false
  }
}

async function handleEnqueue() {
  if (!jobType.value.trim()) return

  enqueueLoading.value = true
  enqueueError.value = ''
  enqueueSuccess.value = false

  try {
    await jobsApi.enqueue(jobType.value.trim(), jobData.value)
    enqueueSuccess.value = true
    jobType.value = ''
    jobData.value = ''
    await fetchJobs()
    setTimeout(() => { enqueueSuccess.value = false }, 3000)
  } catch (e) {
    enqueueError.value = e instanceof Error ? e.message : 'Failed to enqueue job'
  } finally {
    enqueueLoading.value = false
  }
}

onMounted(fetchJobs)
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Jobs Queue</h1>

    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Enqueue Job</h2>
      <form @submit.prevent="handleEnqueue" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="job-type" class="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <input
              id="job-type"
              v-model="jobType"
              type="text"
              placeholder="e.g., email, report, sync"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="job-data" class="block text-sm font-medium text-gray-700 mb-1">
              Data (optional)
            </label>
            <input
              id="job-data"
              v-model="jobData"
              type="text"
              placeholder="Job data payload"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          :disabled="enqueueLoading || !jobType.trim()"
          class="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ enqueueLoading ? 'Enqueueing...' : 'Enqueue Job' }}
        </button>
      </form>

      <div v-if="enqueueSuccess" class="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
        Job enqueued successfully!
      </div>

      <div v-if="enqueueError" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
        {{ enqueueError }}
      </div>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-800">Pending Jobs</h2>
        <button
          @click="fetchJobs"
          :disabled="isLoading"
          class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="isLoading && jobs.length === 0" class="p-8 text-center text-gray-600">
        Loading jobs...
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 text-red-700">
        {{ error }}
      </div>

      <div v-else-if="jobs.length === 0" class="p-8 text-center text-gray-600">
        No pending jobs.
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="job in jobs"
          :key="job.id"
          class="p-4 flex justify-between items-center"
        >
          <div>
            <p class="text-gray-800 font-medium">{{ job.type }}</p>
            <p class="text-sm text-gray-500">ID: {{ job.id }}</p>
          </div>
          <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            Pending
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
