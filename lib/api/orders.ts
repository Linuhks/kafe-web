import { serverFetch } from '@/lib/api/server-fetch'
import type { Order } from '@/lib/types'
import type { OrdersControllerMyOrders200Pagination } from '@/lib/api/generated/api'

export interface MyOrdersResult {
  orders: Order[]
  pagination: OrdersControllerMyOrders200Pagination | null
}

export async function getMyOrders(params?: { page?: number }): Promise<MyOrdersResult> {
  const queryParams: Record<string, string> = {}
  if (params?.page) {
    queryParams.page = String(params.page)
  }

  const res = await serverFetch<{
    data: { data?: Order[]; pagination?: OrdersControllerMyOrders200Pagination }
    status: number
    headers: Headers
  }>('/api/v1/orders/me', {
    method: 'GET',
    params: Object.keys(queryParams).length ? queryParams : undefined,
  })

  if (res.status !== 200) return { orders: [], pagination: null }
  return {
    orders: res.data.data ?? [],
    pagination: res.data.pagination ?? null,
  }
}
