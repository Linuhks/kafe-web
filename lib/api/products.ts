import {
  productsControllerList,
  productsControllerGetOne,
  productsControllerCreate,
  productsControllerUpdate,
  productsControllerRemove,
  productsControllerToggleAvail,
  productsControllerListIngredients,
  productsControllerAddIngredient,
  productsControllerRemoveIngredient,
} from '@/lib/api/generated/api'
import type {
  ProductResponseDto,
  ProductsControllerList200Pagination,
  CreateProductDto,
  UpdateProductDto,
  ProductIngredientResponseDto,
  AddProductIngredientDto,
} from '@/lib/api/generated/api'

export interface ProductsResult {
  products: ProductResponseDto[]
  pagination: ProductsControllerList200Pagination | null
}

export async function getProducts(params?: {
  page?: number
  limit?: number
}): Promise<ProductsResult> {
  const queryParams: Record<string, string | number | boolean | undefined> = {}
  if (params?.page) queryParams.page = params.page
  if (params?.limit) queryParams.limit = params.limit

  const res = await productsControllerList(
    Object.keys(queryParams).length ? queryParams : undefined,
  )
  if (res.status !== 200) return { products: [], pagination: null }
  return {
    products: res.data.data ?? [],
    pagination: res.data.pagination ?? null,
  }
}

export async function getProductById(id: string): Promise<ProductResponseDto | null> {
  const res = await productsControllerGetOne(id)
  if (res.status !== 200) return null
  return (res.data as unknown as ProductResponseDto) ?? null
}

export async function createProduct(data: CreateProductDto): Promise<ProductResponseDto> {
  const res = await productsControllerCreate(data)
  if (res.status !== 201) throw new Error(`Failed to create product: ${res.status}`)
  return res.data as ProductResponseDto
}

export async function updateProduct(id: string, data: UpdateProductDto): Promise<ProductResponseDto> {
  const res = await productsControllerUpdate(id, data)
  if (res.status !== 200) throw new Error(`Failed to update product: ${res.status}`)
  return res.data as ProductResponseDto
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await productsControllerRemove(id)
  if (res.status !== 204) throw new Error(`Failed to delete product: ${res.status}`)
}

export async function toggleProductAvailability(id: string): Promise<void> {
  const res = await productsControllerToggleAvail(id)
  if (res.status !== 200) throw new Error(`Failed to toggle product availability: ${res.status}`)
}

export async function getProductIngredients(productId: string): Promise<ProductIngredientResponseDto[]> {
  const res = await productsControllerListIngredients(productId)
  if (res.status !== 200) return []
  return res.data as ProductIngredientResponseDto[]
}

export async function addProductIngredient(productId: string, data: AddProductIngredientDto): Promise<ProductIngredientResponseDto> {
  const res = await productsControllerAddIngredient(productId, data)
  if (res.status !== 201) throw new Error(`Failed to add ingredient: ${res.status}`)
  return res.data as ProductIngredientResponseDto
}

export async function removeProductIngredient(productId: string, ingredientId: string): Promise<void> {
  const res = await productsControllerRemoveIngredient(productId, ingredientId)
  if (res.status !== 204) throw new Error(`Failed to remove ingredient: ${res.status}`)
}
