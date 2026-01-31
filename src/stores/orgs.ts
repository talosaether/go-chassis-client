import { ref } from 'vue'
import { defineStore } from 'pinia'
import { orgsApi, ApiError } from '@/api/client'
import type { Org, OrgMember } from '@/types'

// TODO: Waiting on backend to return JSON arrays instead of text
// See: /orgs and /orgs/members endpoints need to return:
//   [{ "id": "...", "name": "...", "role": "..." }]
//   [{ "userId": "...", "role": "..." }]

export const useOrgsStore = defineStore('orgs', () => {
  const orgs = ref<Org[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchOrgs(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const response = await orgsApi.list()
      orgs.value = Array.isArray(response) ? response : []
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Failed to fetch organizations'
      error.value = message
      orgs.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function createOrg(name: string): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await orgsApi.create(name)
      await fetchOrgs()
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Failed to create organization'
      error.value = message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function fetchMembers(orgId: string): Promise<OrgMember[]> {
    try {
      const response = await orgsApi.getMembers(orgId)
      return Array.isArray(response) ? response : []
    } catch (e) {
      const message = e instanceof ApiError ? e.message : 'Failed to fetch members'
      error.value = message
      return []
    }
  }

  return {
    orgs,
    isLoading,
    error,
    fetchOrgs,
    createOrg,
    fetchMembers
  }
})
