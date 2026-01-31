import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useOrgsStore } from '@/stores/orgs'
import * as client from '@/api/client'

vi.mock('@/api/client', () => ({
  orgsApi: {
    list: vi.fn(),
    create: vi.fn(),
    getMembers: vi.fn()
  },
  ApiError: class ApiError extends Error {
    status: number
    constructor(message: string, status: number) {
      super(message)
      this.status = status
    }
  }
}))

describe('orgs store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchOrgs', () => {
    it('fetches and stores organizations', async () => {
      const mockOrgs = [
        { id: '1', name: 'Org 1', role: 'admin' },
        { id: '2', name: 'Org 2', role: 'member' }
      ]
      vi.mocked(client.orgsApi.list).mockResolvedValue(mockOrgs)

      const store = useOrgsStore()
      await store.fetchOrgs()

      expect(store.orgs).toEqual(mockOrgs)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('handles empty response', async () => {
      vi.mocked(client.orgsApi.list).mockResolvedValue([])

      const store = useOrgsStore()
      await store.fetchOrgs()

      expect(store.orgs).toEqual([])
    })

    it('handles non-array response gracefully', async () => {
      vi.mocked(client.orgsApi.list).mockResolvedValue('invalid' as unknown as [])

      const store = useOrgsStore()
      await store.fetchOrgs()

      expect(store.orgs).toEqual([])
    })

    it('sets error on failure', async () => {
      const apiError = new client.ApiError('Unauthorized', 401)
      vi.mocked(client.orgsApi.list).mockRejectedValue(apiError)

      const store = useOrgsStore()
      await store.fetchOrgs()

      expect(store.error).toBe('Unauthorized')
      expect(store.orgs).toEqual([])
      expect(store.isLoading).toBe(false)
    })

    it('sets isLoading during request', async () => {
      let resolveList: (value: []) => void
      vi.mocked(client.orgsApi.list).mockImplementation(
        () => new Promise((resolve) => { resolveList = resolve })
      )

      const store = useOrgsStore()
      const fetchPromise = store.fetchOrgs()

      expect(store.isLoading).toBe(true)

      resolveList!([])
      await fetchPromise

      expect(store.isLoading).toBe(false)
    })
  })

  describe('createOrg', () => {
    it('creates org and refreshes list', async () => {
      vi.mocked(client.orgsApi.create).mockResolvedValue('Created')
      vi.mocked(client.orgsApi.list).mockResolvedValue([
        { id: '1', name: 'New Org', role: 'owner' }
      ])

      const store = useOrgsStore()
      await store.createOrg('New Org')

      expect(client.orgsApi.create).toHaveBeenCalledWith('New Org')
      expect(client.orgsApi.list).toHaveBeenCalled()
      expect(store.orgs).toHaveLength(1)
    })

    it('sets error and throws on failure', async () => {
      const apiError = new client.ApiError('Name taken', 400)
      vi.mocked(client.orgsApi.create).mockRejectedValue(apiError)

      const store = useOrgsStore()

      await expect(store.createOrg('Taken Name')).rejects.toThrow()
      expect(store.error).toBe('Name taken')
    })
  })

  describe('fetchMembers', () => {
    it('fetches and returns members', async () => {
      const mockMembers = [
        { userId: 'user-1', role: 'owner' },
        { userId: 'user-2', role: 'member' }
      ]
      vi.mocked(client.orgsApi.getMembers).mockResolvedValue(mockMembers)

      const store = useOrgsStore()
      const members = await store.fetchMembers('org-123')

      expect(client.orgsApi.getMembers).toHaveBeenCalledWith('org-123')
      expect(members).toEqual(mockMembers)
    })

    it('handles non-array response gracefully', async () => {
      vi.mocked(client.orgsApi.getMembers).mockResolvedValue('invalid' as unknown as [])

      const store = useOrgsStore()
      const members = await store.fetchMembers('org-123')

      expect(members).toEqual([])
    })

    it('returns empty array and sets error on failure', async () => {
      const apiError = new client.ApiError('Not found', 404)
      vi.mocked(client.orgsApi.getMembers).mockRejectedValue(apiError)

      const store = useOrgsStore()
      const members = await store.fetchMembers('invalid-org')

      expect(members).toEqual([])
      expect(store.error).toBe('Not found')
    })
  })
})
