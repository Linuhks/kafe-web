import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockApiFetch = vi.fn()
vi.mock('./fetcher', () => ({ apiFetch: mockApiFetch }))

const mockGetCookies = vi.fn()
vi.mock('next/headers', () => ({
  cookies: () => mockGetCookies(),
}))

describe('serverFetch', () => {
  beforeEach(() => {
    mockApiFetch.mockReset()
    mockGetCookies.mockReset()
  })

  it('passes Authorization header when kafe_token cookie exists', async () => {
    mockGetCookies.mockResolvedValue({ get: (k: string) => (k === 'kafe_token' ? { value: 'tok123' } : undefined) })
    mockApiFetch.mockResolvedValue({ data: {}, status: 200, headers: new Headers() })

    const { serverFetch } = await import('./server-fetch')
    await serverFetch('/api/v1/products', { method: 'GET' })

    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/products',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer tok123' }),
      }),
    )
  })

  it('omits Authorization header when no token cookie is present', async () => {
    mockGetCookies.mockResolvedValue({ get: () => undefined })
    mockApiFetch.mockResolvedValue({ data: {}, status: 200, headers: new Headers() })

    const { serverFetch } = await import('./server-fetch')
    await serverFetch('/api/v1/products', { method: 'GET' })

    const passedHeaders = vi.mocked(mockApiFetch).mock.calls[0][1].headers as Record<string, string>
    expect(passedHeaders?.Authorization).toBeUndefined()
  })

  it('returns the result from apiFetch', async () => {
    mockGetCookies.mockResolvedValue({ get: () => undefined })
    mockApiFetch.mockResolvedValue({ data: { id: '1' }, status: 200, headers: new Headers() })

    const { serverFetch } = await import('./server-fetch')
    const result = await serverFetch<{ data: { id: string }; status: number }>(
      '/api/v1/products/1',
      { method: 'GET' },
    )

    expect(result).toEqual({ data: { id: '1' }, status: 200, headers: expect.any(Headers) })
  })
})
