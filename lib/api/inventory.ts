import { serverFetch } from '@/lib/api/server-fetch'
import type {
  IngredientResponseDto,
  InventoryControllerList200Pagination,
  InventoryControllerMovements200Pagination,
  InventoryMovementResponseDto,
  CreateIngredientDto,
  UpdateIngredientDto,
  RestockIngredientDto,
  InventoryControllerMovementsParams,
} from '@/lib/api/generated/api'

export interface InventoryResult {
  ingredients: IngredientResponseDto[]
  pagination: InventoryControllerList200Pagination | null
}

export interface MovementsResult {
  movements: InventoryMovementResponseDto[]
  pagination: InventoryControllerMovements200Pagination | null
}

export async function getInventory(): Promise<InventoryResult> {
  const res = await serverFetch<{
    data: { data?: IngredientResponseDto[]; pagination?: InventoryControllerList200Pagination }
    status: number
    headers: Headers
  }>('/api/v1/inventory', { method: 'GET' })
  if (res.status !== 200) return { ingredients: [], pagination: null }
  return {
    ingredients: res.data.data ?? [],
    pagination: res.data.pagination ?? null,
  }
}

export async function getInventoryById(id: string): Promise<IngredientResponseDto | null> {
  const res = await serverFetch<{
    data: IngredientResponseDto
    status: number
    headers: Headers
  }>(`/api/v1/inventory/${id}`, { method: 'GET' })
  if (res.status !== 200) return null
  return res.data
}

export async function createIngredient(data: CreateIngredientDto): Promise<IngredientResponseDto> {
  const res = await serverFetch<{
    data: IngredientResponseDto
    status: number
    headers: Headers
  }>('/api/v1/inventory', { method: 'POST', body: JSON.stringify(data) })
  if (res.status !== 201) throw new Error(`Failed to create ingredient: ${res.status}`)
  return res.data
}

export async function updateIngredient(id: string, data: UpdateIngredientDto): Promise<IngredientResponseDto> {
  const res = await serverFetch<{
    data: IngredientResponseDto
    status: number
    headers: Headers
  }>(`/api/v1/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
  if (res.status !== 200) throw new Error(`Failed to update ingredient: ${res.status}`)
  return res.data
}

export async function restockIngredient(id: string, data: RestockIngredientDto): Promise<IngredientResponseDto> {
  const res = await serverFetch<{
    data: IngredientResponseDto
    status: number
    headers: Headers
  }>(`/api/v1/inventory/${id}/restock`, { method: 'POST', body: JSON.stringify(data) })
  if (res.status !== 200) throw new Error(`Failed to restock ingredient: ${res.status}`)
  return res.data
}

export async function getStockMovements(params?: InventoryControllerMovementsParams): Promise<MovementsResult> {
  const queryParams: Record<string, string> = {}
  if (params?.page) queryParams.page = String(params.page)
  if (params?.limit) queryParams.limit = String(params.limit)
  if (params?.ingredientId) queryParams.ingredientId = params.ingredientId

  const res = await serverFetch<{
    data: { data?: InventoryMovementResponseDto[]; pagination?: InventoryControllerMovements200Pagination }
    status: number
    headers: Headers
  }>('/api/v1/inventory/movements', {
    method: 'GET',
    params: Object.keys(queryParams).length ? queryParams : undefined,
  })
  if (res.status !== 200) return { movements: [], pagination: null }
  return {
    movements: res.data.data ?? [],
    pagination: res.data.pagination ?? null,
  }
}

export interface InventoryAlert {
  id: string
  name: string
  unit: string
  currentStock: number
  minimumStock: number
  stockPct: number
}

export async function getInventoryAlerts(): Promise<InventoryAlert[]> {
  const { ingredients } = await getInventory()
  return ingredients
    .filter((i) => parseFloat(i.currentStock) <= parseFloat(i.minimumStock))
    .map((i) => {
      const current = parseFloat(i.currentStock)
      const minimum = parseFloat(i.minimumStock)
      // minimumStock ≈ 20% capacity, so capacity ≈ minimumStock * 5
      const capacity = minimum > 0 ? minimum * 5 : 10
      const stockPct = Math.min(100, Math.round((current / capacity) * 100))
      return { id: i.id, name: i.name, unit: i.unit, currentStock: current, minimumStock: minimum, stockPct }
    })
}
