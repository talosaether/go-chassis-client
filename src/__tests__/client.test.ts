import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api, ApiError } from '@/api/client'

describe('api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('makes GET request by default', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('response')
    })
    vi.stubGlobal('fetch', mockFetch)

    await api('/test')

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'GET',
        credentials: 'include'
      })
    )
  })

  it('makes POST request with form-encoded body', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('response')
    })
    vi.stubGlobal('fetch', mockFetch)

    await api('/test', { method: 'POST', body: { key: 'value' } })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    )
  })

  it('parses JSON response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('{"id": "123", "name": "Test"}')
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await api<{ id: string; name: string }>('/test')

    expect(result).toEqual({ id: '123', name: 'Test' })
  })

  it('returns text when JSON parsing fails', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('plain text response')
    })
    vi.stubGlobal('fetch', mockFetch)

    const result = await api('/test')

    expect(result).toBe('plain text response')
  })

  it('throws ApiError on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: () => Promise.resolve('Unauthorized')
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(api('/test')).rejects.toThrow(ApiError)
    await expect(api('/test')).rejects.toMatchObject({
      message: 'Unauthorized',
      status: 401
    })
  })

  it('uses statusText when error body is empty', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('')
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(api('/test')).rejects.toMatchObject({
      message: 'Internal Server Error',
      status: 500
    })
  })
})
