import { describe, it, expect, vi, beforeEach } from 'vitest'
import { jobsApi } from '@/api/client'

describe('jobs api', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('list', () => {
    it('fetches all jobs with default pagination', async () => {
      const mockResponse = {
        jobs: [
          { id: '1', type: 'email', status: 'pending' },
          { id: '2', type: 'report', status: 'completed' }
        ],
        pagination: { page: 1, limit: 20, total: 2, totalPages: 1 }
      }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.list()

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs?status=all&page=1&limit=20',
        expect.objectContaining({ method: 'GET', credentials: 'include' })
      )
      expect(result).toEqual(mockResponse)
    })

    it('fetches jobs with status filter and custom pagination', async () => {
      const mockResponse = {
        jobs: [{ id: '1', type: 'email', status: 'pending' }],
        pagination: { page: 2, limit: 10, total: 15, totalPages: 2 }
      }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.list({ status: 'pending', page: 2, limit: 10 })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs?status=pending&page=2&limit=10',
        expect.objectContaining({ method: 'GET' })
      )
      expect(result).toEqual(mockResponse)
    })

    it('fetches completed jobs', async () => {
      const mockResponse = {
        jobs: [{ id: '2', type: 'report', status: 'completed' }],
        pagination: { page: 1, limit: 20, total: 1, totalPages: 1 }
      }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.list({ status: 'completed' })

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs?status=completed&page=1&limit=20',
        expect.objectContaining({ method: 'GET' })
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('get', () => {
    it('fetches a single job by id', async () => {
      const mockJob = { id: 'job-123', type: 'email', status: 'pending' }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockJob))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.get('job-123')

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs/job-123',
        expect.objectContaining({ method: 'GET', credentials: 'include' })
      )
      expect(result).toEqual(mockJob)
    })
  })

  describe('enqueue', () => {
    it('creates a new job with type and data', async () => {
      const mockJob = { id: 'new-job', type: 'email', status: 'pending' }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockJob))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.enqueue('email', 'test data')

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
      )
      expect(result).toEqual(mockJob)
    })
  })
})
