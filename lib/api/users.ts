import { apiFetch } from '@/lib/api/fetcher'
import type { User } from '@/lib/types'
import type {
  UsersControllerList200Pagination,
} from '@/lib/api/generated/api'

export interface UsersResult {
  users: User[]
  pagination: UsersControllerList200Pagination | null
}

export async function getUsers(params?: { page?: number; limit?: number }): Promise<UsersResult> {
  const queryParams: Record<string, string> = {}
  if (params?.page) queryParams.page = String(params.page)
  if (params?.limit) queryParams.limit = String(params.limit)

  const res = await apiFetch<{
    data: { data?: User[]; pagination?: UsersControllerList200Pagination }
    status: number
    headers: Headers
  }>('/api/v1/users', {
    method: 'GET',
    params: Object.keys(queryParams).length ? queryParams : undefined,
  })

  if (res.status !== 200) return { users: [], pagination: null }
  return {
    users: res.data.data ?? [],
    pagination: res.data.pagination ?? null,
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const res = await apiFetch<{
    data: { data?: User }
    status: number
    headers: Headers
  }>(`/api/v1/users/${id}`, {
    method: 'GET',
  })

  if (res.status !== 200) return null
  return res.data.data ?? null
}
