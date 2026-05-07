import {
  productsControllerList,
  productsControllerGetOne,
} from '@/lib/api/generated/api'
import type {
  ProductResponseDto,
  ProductsControllerList200Pagination,
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
