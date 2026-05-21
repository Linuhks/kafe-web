import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockList = vi.fn()
const mockGetOne = vi.fn()

vi.mock('@/lib/api/generated/api', () => ({
  categoriesControllerList: mockList,
  categoriesControllerGetOne: mockGetOne,
}))

const makeRes = (data: unknown, status = 200) => ({ data, status, headers: new Headers() })

describe('categories API', () => {
  beforeEach(() => { mockList.mockReset(); mockGetOne.mockReset() })

  describe('getCategories', () => {
    it('returns categories on 200', async () => {
      mockList.mockResolvedValue(makeRes({ data: [{ id: '1', name: 'Cafés' }] }))
      const { getCategories } = await import('./categories')
      const result = await getCategories()
      expect(result.categories).toEqual([{ id: '1', name: 'Cafés' }])
    })

    it('returns empty array on non-200', async () => {
      mockList.mockResolvedValue(makeRes({}, 500))
      const { getCategories } = await import('./categories')
      const result = await getCategories()
      expect(result.categories).toEqual([])
    })

    it('returns empty array when data is nullish', async () => {
      mockList.mockResolvedValue(makeRes({ data: null }))
      const { getCategories } = await import('./categories')
      const result = await getCategories()
      expect(result.categories).toEqual([])
    })
  })

  describe('getCategoryById', () => {
    it('returns category on 200', async () => {
      mockGetOne.mockResolvedValue(makeRes({ id: '1', name: 'Cafés' }))
      const { getCategoryById } = await import('./categories')
      const result = await getCategoryById('1')
      expect(result).toEqual({ id: '1', name: 'Cafés' })
    })

    it('returns null on non-200', async () => {
      mockGetOne.mockResolvedValue(makeRes({}, 404))
      const { getCategoryById } = await import('./categories')
      const result = await getCategoryById('missing')
      expect(result).toBeNull()
    })
  })
})
