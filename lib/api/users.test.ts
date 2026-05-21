import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockApiFetch = vi.fn()
vi.mock('@/lib/api/fetcher', () => ({ apiFetch: mockApiFetch }))

const mockUser = { id: 'u1', email: 'a@b.com', name: 'Ana', role: 'CLIENT' }
const makeRes = (data: unknown, status = 200) => ({ data, status, headers: new Headers() })

describe('users API', () => {
  beforeEach(() => mockApiFetch.mockReset())

  describe('getUsers', () => {
    it('returns users and pagination on 200', async () => {
      mockApiFetch.mockResolvedValue(makeRes({ data: [mockUser], pagination: { total: 1 } }))
      const { getUsers } = await import('./users')
      const result = await getUsers({ page: 1, limit: 10 })
      expect(result.users).toEqual([mockUser])
    })

    it('passes page and limit as string query params', async () => {
      mockApiFetch.mockResolvedValue(makeRes({ data: [] }))
      const { getUsers } = await import('./users')
      await getUsers({ page: 2, limit: 20 })
      expect(mockApiFetch).toHaveBeenCalledWith(
        '/api/v1/users',
        expect.objectContaining({ params: { page: '2', limit: '20' } }),
      )
    })

    it('returns empty when status is not 200', async () => {
      mockApiFetch.mockResolvedValue(makeRes({}, 500))
      const { getUsers } = await import('./users')
      const result = await getUsers()
      expect(result.users).toEqual([])
      expect(result.pagination).toBeNull()
    })
  })

  describe('getUserById', () => {
    it('returns user on 200', async () => {
      mockApiFetch.mockResolvedValue(makeRes({ data: mockUser }))
      const { getUserById } = await import('./users')
      expect(await getUserById('u1')).toEqual(mockUser)
    })

    it('returns null on non-200', async () => {
      mockApiFetch.mockResolvedValue(makeRes({}, 404))
      const { getUserById } = await import('./users')
      expect(await getUserById('missing')).toBeNull()
    })
  })
})
