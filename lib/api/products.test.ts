import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => ({
  list: vi.fn(),
  getOne: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  toggleAvail: vi.fn(),
  listIngredients: vi.fn(),
  addIngredient: vi.fn(),
  removeIngredient: vi.fn(),
}))

vi.mock('@/lib/api/generated/api', () => ({
  productsControllerList: mocks.list,
  productsControllerGetOne: mocks.getOne,
  productsControllerCreate: mocks.create,
  productsControllerUpdate: mocks.update,
  productsControllerRemove: mocks.remove,
  productsControllerToggleAvail: mocks.toggleAvail,
  productsControllerListIngredients: mocks.listIngredients,
  productsControllerAddIngredient: mocks.addIngredient,
  productsControllerRemoveIngredient: mocks.removeIngredient,
}))

const makeRes = (data: unknown, status = 200) => ({ data, status, headers: new Headers() })
const mockProduct = { id: 'p1', name: 'Espresso', price: '5.50', isAvailable: true, categoryId: 'c1', description: null, imageUrl: null }

describe('products API', () => {
  beforeEach(() => Object.values(mocks).forEach(m => m.mockReset()))

  describe('getProducts', () => {
    it('returns products and pagination on 200', async () => {
      mocks.list.mockResolvedValue(makeRes({ data: [mockProduct], pagination: { total: 1 } }))
      const { getProducts } = await import('./products')
      const result = await getProducts({ page: 1, limit: 10 })
      expect(result.products).toEqual([mockProduct])
      expect(result.pagination).toEqual({ total: 1 })
    })

    it('returns empty on non-200', async () => {
      mocks.list.mockResolvedValue(makeRes({}, 500))
      const { getProducts } = await import('./products')
      const result = await getProducts()
      expect(result.products).toEqual([])
      expect(result.pagination).toBeNull()
    })

    it('handles no params', async () => {
      mocks.list.mockResolvedValue(makeRes({ data: [] }))
      const { getProducts } = await import('./products')
      await getProducts()
      expect(mocks.list).toHaveBeenCalledWith(undefined)
    })
  })

  describe('getProductById', () => {
    it('returns product on 200', async () => {
      mocks.getOne.mockResolvedValue(makeRes(mockProduct))
      const { getProductById } = await import('./products')
      const result = await getProductById('p1')
      expect(result).toEqual(mockProduct)
    })

    it('returns null on non-200', async () => {
      mocks.getOne.mockResolvedValue(makeRes({}, 404))
      const { getProductById } = await import('./products')
      expect(await getProductById('missing')).toBeNull()
    })
  })

  describe('createProduct', () => {
    it('returns created product on 201', async () => {
      mocks.create.mockResolvedValue(makeRes(mockProduct, 201))
      const { createProduct } = await import('./products')
      const result = await createProduct({ name: 'Espresso', price: '5.50', categoryId: 'c1' } as never)
      expect(result).toEqual(mockProduct)
    })

    it('throws on non-201', async () => {
      mocks.create.mockResolvedValue(makeRes({}, 400))
      const { createProduct } = await import('./products')
      await expect(createProduct({} as never)).rejects.toThrow('Failed to create product')
    })
  })

  describe('updateProduct', () => {
    it('returns updated product on 200', async () => {
      mocks.update.mockResolvedValue(makeRes({ ...mockProduct, name: 'Updated' }))
      const { updateProduct } = await import('./products')
      const result = await updateProduct('p1', { name: 'Updated' } as never)
      expect(result.name).toBe('Updated')
    })

    it('throws on non-200', async () => {
      mocks.update.mockResolvedValue(makeRes({}, 400))
      const { updateProduct } = await import('./products')
      await expect(updateProduct('p1', {} as never)).rejects.toThrow('Failed to update product')
    })
  })

  describe('deleteProduct', () => {
    it('resolves on 204', async () => {
      mocks.remove.mockResolvedValue(makeRes(null, 204))
      const { deleteProduct } = await import('./products')
      await expect(deleteProduct('p1')).resolves.toBeUndefined()
    })

    it('throws on non-204', async () => {
      mocks.remove.mockResolvedValue(makeRes({}, 500))
      const { deleteProduct } = await import('./products')
      await expect(deleteProduct('p1')).rejects.toThrow('Failed to delete product')
    })
  })

  describe('toggleProductAvailability', () => {
    it('resolves on 200', async () => {
      mocks.toggleAvail.mockResolvedValue(makeRes({}))
      const { toggleProductAvailability } = await import('./products')
      await expect(toggleProductAvailability('p1')).resolves.toBeUndefined()
    })

    it('throws on non-200', async () => {
      mocks.toggleAvail.mockResolvedValue(makeRes({}, 400))
      const { toggleProductAvailability } = await import('./products')
      await expect(toggleProductAvailability('p1')).rejects.toThrow('Failed to toggle')
    })
  })

  describe('getProductIngredients', () => {
    it('returns ingredients on 200', async () => {
      mocks.listIngredients.mockResolvedValue(makeRes([{ id: 'i1', name: 'Milk' }]))
      const { getProductIngredients } = await import('./products')
      const result = await getProductIngredients('p1')
      expect(result).toEqual([{ id: 'i1', name: 'Milk' }])
    })

    it('returns empty array on non-200', async () => {
      mocks.listIngredients.mockResolvedValue(makeRes({}, 404))
      const { getProductIngredients } = await import('./products')
      expect(await getProductIngredients('p1')).toEqual([])
    })
  })

  describe('addProductIngredient', () => {
    it('returns added ingredient on 201', async () => {
      mocks.addIngredient.mockResolvedValue(makeRes({ id: 'i1' }, 201))
      const { addProductIngredient } = await import('./products')
      const result = await addProductIngredient('p1', { ingredientId: 'i1', quantity: 1 } as never)
      expect(result).toEqual({ id: 'i1' })
    })

    it('throws on non-201', async () => {
      mocks.addIngredient.mockResolvedValue(makeRes({}, 400))
      const { addProductIngredient } = await import('./products')
      await expect(addProductIngredient('p1', {} as never)).rejects.toThrow('Failed to add ingredient')
    })
  })

  describe('removeProductIngredient', () => {
    it('resolves on 204', async () => {
      mocks.removeIngredient.mockResolvedValue(makeRes(null, 204))
      const { removeProductIngredient } = await import('./products')
      await expect(removeProductIngredient('p1', 'i1')).resolves.toBeUndefined()
    })

    it('throws on non-204', async () => {
      mocks.removeIngredient.mockResolvedValue(makeRes({}, 500))
      const { removeProductIngredient } = await import('./products')
      await expect(removeProductIngredient('p1', 'i1')).rejects.toThrow('Failed to remove ingredient')
    })
  })
})
