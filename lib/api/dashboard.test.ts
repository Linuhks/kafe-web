import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSummary = vi.fn()
const mockTopProducts = vi.fn()
const mockPeakHours = vi.fn()

vi.mock('@/lib/api/generated/api', () => ({
  dashboardControllerSummary: mockSummary,
  dashboardControllerTopProducts: mockTopProducts,
  dashboardControllerPeakHours: mockPeakHours,
}))

const makeRes = (data: unknown, status = 200) => ({ data, status, headers: new Headers() })

describe('dashboard API', () => {
  beforeEach(() => {
    mockSummary.mockReset()
    mockTopProducts.mockReset()
    mockPeakHours.mockReset()
  })

  describe('getDashboardSummary', () => {
    it('returns summary data on 200', async () => {
      const summary = { totalOrders: 10, revenue: 100 }
      mockSummary.mockResolvedValue(makeRes(summary))
      const { getDashboardSummary } = await import('./dashboard')
      const result = await getDashboardSummary()
      expect(result).toEqual(summary)
    })

    it('returns null on non-200', async () => {
      mockSummary.mockResolvedValue(makeRes({}, 500))
      const { getDashboardSummary } = await import('./dashboard')
      const result = await getDashboardSummary()
      expect(result).toBeNull()
    })
  })

  describe('getTopProducts', () => {
    it('returns products array on 200', async () => {
      const products = [{ productId: '1', name: 'Espresso', totalSold: 50 }]
      mockTopProducts.mockResolvedValue(makeRes(products))
      const { getTopProducts } = await import('./dashboard')
      const result = await getTopProducts({ limit: 5 })
      expect(result).toEqual(products)
    })

    it('returns empty array on non-200', async () => {
      mockTopProducts.mockResolvedValue(makeRes({}, 500))
      const { getTopProducts } = await import('./dashboard')
      const result = await getTopProducts()
      expect(result).toEqual([])
    })
  })

  describe('getPeakHours', () => {
    it('returns peak hours on 200', async () => {
      const hours = [{ hour: 8, count: 12 }]
      mockPeakHours.mockResolvedValue(makeRes(hours))
      const { getPeakHours } = await import('./dashboard')
      const result = await getPeakHours()
      expect(result).toEqual(hours)
    })

    it('returns empty array on non-200', async () => {
      mockPeakHours.mockResolvedValue(makeRes({}, 500))
      const { getPeakHours } = await import('./dashboard')
      const result = await getPeakHours()
      expect(result).toEqual([])
    })
  })
})
