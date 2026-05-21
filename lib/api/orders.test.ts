import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockServerFetch = vi.fn()
vi.mock('@/lib/api/server-fetch', () => ({ serverFetch: mockServerFetch }))

const makeRes = (data: unknown, status = 200) => ({ data, status, headers: new Headers() })

describe('orders API', () => {
  beforeEach(() => mockServerFetch.mockReset())

  describe('getMyOrders', () => {
    it('returns orders and pagination on 200', async () => {
      const order = { id: 'o1', status: 'RECEIVED', items: [] }
      mockServerFetch.mockResolvedValue(makeRes({ data: [order], pagination: { total: 1 } }))
      const { getMyOrders } = await import('./orders')
      const result = await getMyOrders()
      expect(result.orders).toEqual([order])
      expect(result.pagination).toEqual({ total: 1 })
    })

    it('passes page as string query param', async () => {
      mockServerFetch.mockResolvedValue(makeRes({ data: [] }))
      const { getMyOrders } = await import('./orders')
      await getMyOrders({ page: 3 })
      expect(mockServerFetch).toHaveBeenCalledWith(
        '/api/v1/orders/me',
        expect.objectContaining({ params: { page: '3' } }),
      )
    })

    it('passes no params when page is not set', async () => {
      mockServerFetch.mockResolvedValue(makeRes({ data: [] }))
      const { getMyOrders } = await import('./orders')
      await getMyOrders()
      expect(mockServerFetch).toHaveBeenCalledWith(
        '/api/v1/orders/me',
        expect.objectContaining({ params: undefined }),
      )
    })

    it('returns empty on non-200', async () => {
      mockServerFetch.mockResolvedValue(makeRes({}, 401))
      const { getMyOrders } = await import('./orders')
      const result = await getMyOrders()
      expect(result.orders).toEqual([])
      expect(result.pagination).toBeNull()
    })
  })
})
