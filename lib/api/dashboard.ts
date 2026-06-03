import { serverFetch } from '@/lib/api/server-fetch'
import type { DashboardSummary, TopProduct, PeakHour } from '@/lib/types'

export interface DateRange {
  from: string
  to: string
}

export async function getDashboardSummary(_dateRange?: DateRange): Promise<DashboardSummary | null> {
  const res = await serverFetch<{ data: DashboardSummary; status: number; headers: Headers }>(
    '/api/v1/dashboard/summary',
    { method: 'GET' },
  )
  if (res.status !== 200) return null
  return res.data
}

export async function getTopProducts(params?: { limit?: number }): Promise<TopProduct[]> {
  const queryParams: Record<string, string> = {}
  if (params?.limit) queryParams.limit = String(params.limit)

  const res = await serverFetch<{ data: TopProduct[]; status: number; headers: Headers }>(
    '/api/v1/dashboard/top-products',
    { method: 'GET', params: Object.keys(queryParams).length ? queryParams : undefined },
  )
  if (res.status !== 200) return []
  return res.data
}

export async function getPeakHours(_dateRange?: DateRange): Promise<PeakHour[]> {
  const res = await serverFetch<{ data: PeakHour[]; status: number; headers: Headers }>(
    '/api/v1/dashboard/peak-hours',
    { method: 'GET' },
  )
  if (res.status !== 200) return []
  return res.data
}
