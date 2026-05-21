import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch } from './fetcher'

function makeFetchResponse(body: string | null, status: number) {
  return {
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    text: () => Promise.resolve(body),
  } as unknown as Response
}

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    delete process.env.NEXT_PUBLIC_API_URL
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    delete process.env.NEXT_PUBLIC_API_URL
  })

  it('calls fetch with the correct URL', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse('{}', 200))

    await apiFetch('/api/v1/products', { method: 'GET' })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/products'),
      expect.any(Object),
    )
  })

  it('appends query params to the URL', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse('{}', 200))

    await apiFetch('/api/v1/products', { method: 'GET', params: { page: '2', limit: '10' } })

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string
    expect(calledUrl).toContain('page=2')
    expect(calledUrl).toContain('limit=10')
  })

  it('sets Content-Type header when body is provided', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse('{}', 201))

    await apiFetch('/api/v1/products', { method: 'POST', body: JSON.stringify({ name: 'X' }) })

    const options = vi.mocked(fetch).mock.calls[0][1]
    expect((options?.headers as Record<string, string>)?.['Content-Type']).toBe('application/json')
  })

  it('returns parsed JSON with status and headers for 200', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse('{"id":"1"}', 200))

    const result = await apiFetch<{ data: { id: string }; status: number }>(
      '/api/v1/products/1',
      { method: 'GET' },
    )

    expect(result.data).toEqual({ id: '1' })
    expect(result.status).toBe(200)
  })

  it('returns empty data object for 204 response', async () => {
    vi.mocked(fetch).mockResolvedValue(makeFetchResponse(null, 204))

    const result = await apiFetch<{ data: object; status: number }>(
      '/api/v1/products/1',
      { method: 'DELETE' },
    )

    expect(result.data).toEqual({})
    expect(result.status).toBe(204)
  })

  it('throws in production when NEXT_PUBLIC_API_URL is not set', async () => {
    vi.stubGlobal('window', undefined as unknown as Window)
    vi.stubEnv('NODE_ENV', 'production')

    await expect(apiFetch('/api/v1/test', { method: 'GET' })).rejects.toThrow(
      'NEXT_PUBLIC_API_URL is required',
    )
  })
})
