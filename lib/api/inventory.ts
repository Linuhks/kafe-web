import {
  inventoryControllerList,
  inventoryControllerGetOne,
  inventoryControllerCreate,
  inventoryControllerUpdate,
  inventoryControllerRestock,
  inventoryControllerMovements,
} from '@/lib/api/generated/api'
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
  const res = await inventoryControllerList()
  if (res.status !== 200) return { ingredients: [], pagination: null }
  return {
    ingredients: res.data.data ?? [],
    pagination: res.data.pagination ?? null,
  }
}

export async function getInventoryById(id: string): Promise<IngredientResponseDto | null> {
  const res = await inventoryControllerGetOne(id)
  if (res.status !== 200) return null
  return res.data
}

export async function createIngredient(data: CreateIngredientDto): Promise<IngredientResponseDto> {
  const res = await inventoryControllerCreate(data)
  if (res.status !== 201) throw new Error(`Failed to create ingredient: ${res.status}`)
  return res.data
}

export async function updateIngredient(id: string, data: UpdateIngredientDto): Promise<IngredientResponseDto> {
  const res = await inventoryControllerUpdate(id, data)
  if (res.status !== 200) throw new Error(`Failed to update ingredient: ${res.status}`)
  return res.data
}

export async function restockIngredient(id: string, data: RestockIngredientDto): Promise<IngredientResponseDto> {
  const res = await inventoryControllerRestock(id, data)
  if (res.status !== 200) throw new Error(`Failed to restock ingredient: ${res.status}`)
  return res.data
}

export async function getStockMovements(params?: InventoryControllerMovementsParams): Promise<MovementsResult> {
  const res = await inventoryControllerMovements(params)
  if (res.status !== 200) return { movements: [], pagination: null }
  return {
    movements: res.data.data ?? [],
    pagination: res.data.pagination ?? null,
  }
}
