<script setup lang="ts">
import type { Pagination } from '@/types'

const props = defineProps<{
  pagination: Pagination
  loading?: boolean
}>()

const emit = defineEmits<{
  page: [page: number]
}>()

function goToPage(page: number) {
  if (page < 1 || page > props.pagination.totalPages) return
  emit('page', page)
}
</script>

<template>
  <div class="flex items-center justify-between py-3 px-4">
    <p class="text-sm text-gray-600">
      Page {{ pagination.page }} of {{ pagination.totalPages }}
      <span class="text-gray-400">({{ pagination.total }} total)</span>
    </p>
    <div class="flex space-x-2">
      <button
        @click="goToPage(pagination.page - 1)"
        :disabled="pagination.page <= 1 || loading"
        class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="goToPage(pagination.page + 1)"
        :disabled="pagination.page >= pagination.totalPages || loading"
        class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>
