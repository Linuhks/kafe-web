import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockServerFetch = vi.fn()
vi.mock('@/lib/api/server-fetch', () => ({ serverFetch: mockServerFetch }))

const makeRes = (data: unknown, status = 200) => ({ data, status, headers: new Headers() })

describe('dashboard API', () => {
  beforeEach(() => mockServerFetch.mockReset())

  describe('getDashboardSummary', () => {
    it('returns summary data on 200', async () => {
      const summary = { totalOrders: 10, revenue: 100 }
      mockServerFetch.mockResolvedValue(makeRes(summary))
      const { getDashboardSummary } = await import('./dashboard')
      const result = await getDashboardSummary()
      expect(result).toEqual(summary)
    })

    it('returns null on non-200', async () => {
      mockServerFetch.mockResolvedValue(makeRes({}, 500))
      const { getDashboardSummary } = await import('./dashboard')
      const result = await getDashboardSummary()
      expect(result).toBeNull()
    })
  })

  describe('getTopProducts', () => {
    it('returns products array on 200', async () => {
      const products = [{ productId: '1', name: 'Espresso', totalSold: 50 }]
      mockServerFetch.mockResolvedValue(makeRes(products))
      const { getTopProducts } = await import('./dashboard')
      const result = await getTopProducts({ limit: 5 })
      expect(result).toEqual(products)
    })

    it('returns empty array on non-200', async () => {
      mockServerFetch.mockResolvedValue(makeRes({}, 500))
      const { getTopProducts } = await import('./dashboard')
      const result = await getTopProducts()
      expect(result).toEqual([])
    })
  })

  describe('getPeakHours', () => {
    it('returns peak hours on 200', async () => {
      const hours = [{ hour: 8, count: 12 }]
      mockServerFetch.mockResolvedValue(makeRes(hours))
      const { getPeakHours } = await import('./dashboard')
      const result = await getPeakHours()
      expect(result).toEqual(hours)
    })

    it('returns empty array on non-200', async () => {
      mockServerFetch.mockResolvedValue(makeRes({}, 500))
      const { getPeakHours } = await import('./dashboard')
      const result = await getPeakHours()
      expect(result).toEqual([])
    })
  })
  describe('date range', () => {
    const range = { from: '2026-01-10', to: '2026-01-10' }

    it('toApiRange sends the start of `from` and the end of `to` (a one-day range is not empty)', async () => {
      const { toApiRange } = await import('./dashboard')
      const { from, to } = toApiRange(range)
      expect(new Date(from).getTime()).toBe(new Date('2026-01-10T00:00:00').getTime())
      expect(new Date(to).getTime()).toBe(new Date('2026-01-10T23:59:59.999').getTime())
      expect(new Date(to).getTime()).toBeGreaterThan(new Date(from).getTime())
    })

    it('toApiRange returns nothing without a range and ignores an invalid date', async () => {
      const { toApiRange } = await import('./dashboard')
      expect(toApiRange()).toEqual({})
      expect(Object.keys(toApiRange({ from: 'nope', to: '2026-01-10' }))).toEqual(['to'])
    })

    it('getDashboardSummary and getPeakHours forward the range as query params', async () => {
      mockServerFetch.mockResolvedValue(makeRes({}))
      const { getDashboardSummary, getPeakHours } = await import('./dashboard')
      await getDashboardSummary(range)
      await getPeakHours(range)
      for (const call of mockServerFetch.mock.calls) {
        expect(call[1].params).toEqual({ from: expect.any(String), to: expect.any(String) })
      }
    })

    it('getTopProducts forwards both the limit and the range', async () => {
      mockServerFetch.mockResolvedValue(makeRes([]))
      const { getTopProducts } = await import('./dashboard')
      await getTopProducts({ limit: 5, dateRange: range })
      expect(mockServerFetch.mock.calls[0][1].params).toEqual({
        limit: '5',
        from: expect.any(String),
        to: expect.any(String),
      })
    })

    it('sends no params when there is no range and no limit', async () => {
      mockServerFetch.mockResolvedValue(makeRes({}))
      const { getDashboardSummary } = await import('./dashboard')
      await getDashboardSummary()
      expect(mockServerFetch.mock.calls[0][1].params).toBeUndefined()
    })
  })
})
