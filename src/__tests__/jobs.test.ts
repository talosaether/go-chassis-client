import { describe, it, expect, vi, beforeEach } from 'vitest'
import { jobsApi } from '@/api/client'

describe('jobs api', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('list', () => {
    it('fetches all jobs by default', async () => {
      const mockJobs = [
        { id: '1', type: 'email', status: 'pending' },
        { id: '2', type: 'report', status: 'completed' }
      ]
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockJobs))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.list()

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs?status=all',
        expect.objectContaining({ method: 'GET', credentials: 'include' })
      )
      expect(result).toEqual(mockJobs)
    })

    it('fetches jobs with pending status filter', async () => {
      const mockJobs = [{ id: '1', type: 'email', status: 'pending' }]
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockJobs))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.list('pending')

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs?status=pending',
        expect.objectContaining({ method: 'GET' })
      )
      expect(result).toEqual(mockJobs)
    })

    it('fetches jobs with completed status filter', async () => {
      const mockJobs = [{ id: '2', type: 'report', status: 'completed' }]
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockJobs))
      })
      vi.stubGlobal('fetch', mockFetch)

      const result = await jobsApi.list('completed')

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/jobs?status=completed',
        expect.objectContaining({ method: 'GET' })
      )
      expect(result).toEqual(mockJobs)
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
