<script setup lang="ts">
import { ref } from 'vue'
import { cacheApi } from '@/api/client'

const getKey = ref('')
const getValue = ref('')
const getError = ref('')
const getLoading = ref(false)

const setKey = ref('')
const setValue = ref('')
const setSuccess = ref(false)
const setError = ref('')
const setLoading = ref(false)

async function handleGet() {
  if (!getKey.value.trim()) return

  getLoading.value = true
  getValue.value = ''
  getError.value = ''

  try {
    const result = await cacheApi.get(getKey.value.trim())
    getValue.value = typeof result === 'string' ? result : JSON.stringify(result)
  } catch (e) {
    getError.value = e instanceof Error ? e.message : 'Failed to get value'
  } finally {
    getLoading.value = false
  }
}

async function handleSet() {
  if (!setKey.value.trim()) return

  setLoading.value = true
  setSuccess.value = false
  setError.value = ''

  try {
    await cacheApi.set(setKey.value.trim(), setValue.value)
    setSuccess.value = true
    setTimeout(() => { setSuccess.value = false }, 3000)
  } catch (e) {
    setError.value = e instanceof Error ? e.message : 'Failed to set value'
  } finally {
    setLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Cache Demo</h1>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Get Value</h2>
        <form @submit.prevent="handleGet" class="space-y-4">
          <div>
            <label for="get-key" class="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              id="get-key"
              v-model="getKey"
              type="text"
              placeholder="Enter cache key"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            :disabled="getLoading || !getKey.trim()"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ getLoading ? 'Loading...' : 'Get' }}
          </button>
        </form>

        <div v-if="getValue" class="mt-4 p-3 bg-gray-50 rounded-md">
          <p class="text-sm text-gray-500 mb-1">Value:</p>
          <p class="text-gray-800 font-mono break-all">{{ getValue }}</p>
        </div>

        <div v-if="getError" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {{ getError }}
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Set Value</h2>
        <form @submit.prevent="handleSet" class="space-y-4">
          <div>
            <label for="set-key" class="block text-sm font-medium text-gray-700 mb-1">
              Key
            </label>
            <input
              id="set-key"
              v-model="setKey"
              type="text"
              placeholder="Enter cache key"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="set-value" class="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              id="set-value"
              v-model="setValue"
              type="text"
              placeholder="Enter value"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            :disabled="setLoading || !setKey.trim()"
            class="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ setLoading ? 'Saving...' : 'Set' }}
          </button>
        </form>

        <div v-if="setSuccess" class="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          Value saved successfully!
        </div>

        <div v-if="setError" class="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {{ setError }}
        </div>
      </div>
    </div>
  </div>
</template>
