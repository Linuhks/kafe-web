import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  getOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  restock: vi.fn(),
  movements: vi.fn(),
}))

vi.mock('@/lib/api/generated/api', () => ({
  inventoryControllerList: mocks.list,
  inventoryControllerGetOne: mocks.getOne,
  inventoryControllerCreate: mocks.create,
  inventoryControllerUpdate: mocks.update,
  inventoryControllerRestock: mocks.restock,
  inventoryControllerMovements: mocks.movements,
}))

const makeRes = (data: unknown, status = 200) => ({ data, status, headers: new Headers() })
const mockIngredient = { id: 'i1', name: 'Milk', quantity: 10, unit: 'L', minStock: 2 }

describe('inventory API', () => {
  beforeEach(() => Object.values(mocks).forEach(m => m.mockReset()))

  describe('getInventory', () => {
    it('returns ingredients and pagination on 200', async () => {
      mocks.list.mockResolvedValue(makeRes({ data: [mockIngredient], pagination: { total: 1 } }))
      const { getInventory } = await import('./inventory')
      const result = await getInventory()
      expect(result.ingredients).toEqual([mockIngredient])
    })

    it('returns empty on non-200', async () => {
      mocks.list.mockResolvedValue(makeRes({}, 500))
      const { getInventory } = await import('./inventory')
      const result = await getInventory()
      expect(result.ingredients).toEqual([])
      expect(result.pagination).toBeNull()
    })
  })

  describe('getInventoryById', () => {
    it('returns ingredient on 200', async () => {
      mocks.getOne.mockResolvedValue(makeRes(mockIngredient))
      const { getInventoryById } = await import('./inventory')
      expect(await getInventoryById('i1')).toEqual(mockIngredient)
    })

    it('returns null on non-200', async () => {
      mocks.getOne.mockResolvedValue(makeRes({}, 404))
      const { getInventoryById } = await import('./inventory')
      expect(await getInventoryById('missing')).toBeNull()
    })
  })

  describe('createIngredient', () => {
    it('returns created ingredient on 201', async () => {
      mocks.create.mockResolvedValue(makeRes(mockIngredient, 201))
      const { createIngredient } = await import('./inventory')
      expect(await createIngredient({ name: 'Milk', unit: 'L', minStock: 2 } as never)).toEqual(mockIngredient)
    })

    it('throws on non-201', async () => {
      mocks.create.mockResolvedValue(makeRes({}, 400))
      const { createIngredient } = await import('./inventory')
      await expect(createIngredient({} as never)).rejects.toThrow('Failed to create ingredient')
    })
  })

  describe('updateIngredient', () => {
    it('returns updated ingredient on 200', async () => {
      mocks.update.mockResolvedValue(makeRes({ ...mockIngredient, name: 'Oat Milk' }))
      const { updateIngredient } = await import('./inventory')
      const result = await updateIngredient('i1', { name: 'Oat Milk' } as never)
      expect(result.name).toBe('Oat Milk')
    })

    it('throws on non-200', async () => {
      mocks.update.mockResolvedValue(makeRes({}, 400))
      const { updateIngredient } = await import('./inventory')
      await expect(updateIngredient('i1', {} as never)).rejects.toThrow('Failed to update ingredient')
    })
  })

  describe('restockIngredient', () => {
    it('returns updated ingredient on 200', async () => {
      mocks.restock.mockResolvedValue(makeRes({ ...mockIngredient, quantity: 20 }))
      const { restockIngredient } = await import('./inventory')
      const result = await restockIngredient('i1', { quantity: 10 } as never)
      expect(result.quantity).toBe(20)
    })

    it('throws on non-200', async () => {
      mocks.restock.mockResolvedValue(makeRes({}, 400))
      const { restockIngredient } = await import('./inventory')
      await expect(restockIngredient('i1', {} as never)).rejects.toThrow('Failed to restock ingredient')
    })
  })

  describe('getStockMovements', () => {
    it('returns movements and pagination on 200', async () => {
      const movement = { id: 'm1', ingredientId: 'i1', quantity: 5, type: 'IN' }
      mocks.movements.mockResolvedValue(makeRes({ data: [movement], pagination: { total: 1 } }))
      const { getStockMovements } = await import('./inventory')
      const result = await getStockMovements()
      expect(result.movements).toEqual([movement])
    })

    it('returns empty on non-200', async () => {
      mocks.movements.mockResolvedValue(makeRes({}, 500))
      const { getStockMovements } = await import('./inventory')
      const result = await getStockMovements()
      expect(result.movements).toEqual([])
      expect(result.pagination).toBeNull()
    })
  })
})
