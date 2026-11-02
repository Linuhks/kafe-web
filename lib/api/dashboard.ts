import { serverFetch } from '@/lib/api/server-fetch'
import type { DashboardSummary, TopProduct, PeakHour } from '@/lib/types'

export interface DateRange {
  from: string
  to: string
}

/**
 * The picker works in whole days (YYYY-MM-DD) but kafe-api compares `createdAt` against
 * `new Date(value)`: a bare date is midnight UTC, so `to` would exclude that whole day (and a
 * one-day range would always be empty). Send the start of `from` and the end of `to`.
 */
export function toApiRange(range?: DateRange): Record<string, string> {
  if (!range) return {}
  const params: Record<string, string> = {}
  const from = new Date(`${range.from}T00:00:00`)
  const to = new Date(`${range.to}T23:59:59.999`)
  if (!Number.isNaN(from.getTime())) params.from = from.toISOString()
  if (!Number.isNaN(to.getTime())) params.to = to.toISOString()
  return params
}

function withParams(params: Record<string, string>) {
  return Object.keys(params).length ? params : undefined
}

export async function getDashboardSummary(dateRange?: DateRange): Promise<DashboardSummary | null> {
  const res = await serverFetch<{ data: DashboardSummary; status: number; headers: Headers }>(
    '/api/v1/dashboard/summary',
    { method: 'GET', params: withParams(toApiRange(dateRange)) },
  )
  if (res.status !== 200) return null
  return res.data
}

export async function getTopProducts(params?: { limit?: number; dateRange?: DateRange }): Promise<TopProduct[]> {
  const queryParams: Record<string, string> = { ...toApiRange(params?.dateRange) }
  if (params?.limit) queryParams.limit = String(params.limit)

  const res = await serverFetch<{ data: TopProduct[]; status: number; headers: Headers }>(
    '/api/v1/dashboard/top-products',
    { method: 'GET', params: withParams(queryParams) },
  )
  if (res.status !== 200) return []
  return res.data
}

export async function getPeakHours(dateRange?: DateRange): Promise<PeakHour[]> {
  const res = await serverFetch<{ data: PeakHour[]; status: number; headers: Headers }>(
    '/api/v1/dashboard/peak-hours',
    { method: 'GET', params: withParams(toApiRange(dateRange)) },
  )
  if (res.status !== 200) return []
  return res.data
}
