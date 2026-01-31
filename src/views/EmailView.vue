<script setup lang="ts">
import { ref } from 'vue'
import { emailApi } from '@/api/client'

const to = ref('')
const subject = ref('')
const body = ref('')
const isLoading = ref(false)
const error = ref('')
const success = ref(false)

async function handleSend() {
  if (!to.value.trim() || !subject.value.trim()) return

  isLoading.value = true
  error.value = ''
  success.value = false

  try {
    await emailApi.send(to.value.trim(), subject.value.trim(), body.value)
    success.value = true
    to.value = ''
    subject.value = ''
    body.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to send email'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Send Email</h1>

    <div class="max-w-2xl bg-white rounded-lg shadow p-6">
      <form @submit.prevent="handleSend" class="space-y-4">
        <div>
          <label for="to" class="block text-sm font-medium text-gray-700 mb-1">
            To
          </label>
          <input
            id="to"
            v-model="to"
            type="email"
            required
            placeholder="recipient@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            id="subject"
            v-model="subject"
            type="text"
            required
            placeholder="Email subject"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="body" class="block text-sm font-medium text-gray-700 mb-1">
            Body
          </label>
          <textarea
            id="body"
            v-model="body"
            rows="6"
            placeholder="Email content..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading || !to.trim() || !subject.trim()"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Sending...' : 'Send Email' }}
        </button>
      </form>

      <div v-if="success" class="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
        Email sent successfully!
      </div>

      <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
        {{ error }}
      </div>
    </div>
  </div>
</template>
