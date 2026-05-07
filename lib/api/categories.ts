import {
  categoriesControllerList,
  categoriesControllerGetOne,
} from '@/lib/api/generated/api'
import type { CategoryResponseDto } from '@/lib/api/generated/api'

export interface CategoriesResult {
  categories: CategoryResponseDto[]
}

export async function getCategories(): Promise<CategoriesResult> {
  const res = await categoriesControllerList()
  if (res.status !== 200) return { categories: [] }
  return { categories: res.data.data ?? [] }
}

export async function getCategoryById(id: string): Promise<CategoryResponseDto | null> {
  const res = await categoriesControllerGetOne(id)
  if (res.status !== 200) return null
  return res.data
}
