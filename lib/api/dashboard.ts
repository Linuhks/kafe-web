import {
  dashboardControllerSummary,
  dashboardControllerTopProducts,
  dashboardControllerPeakHours,
} from '@/lib/api/generated/api'
import type { DashboardSummary, TopProduct, PeakHour } from '@/lib/types'

export interface DateRange {
  from: string
  to: string
}

export async function getDashboardSummary(_dateRange?: DateRange): Promise<DashboardSummary | null> {
  const res = await dashboardControllerSummary()
  if (res.status !== 200) return null
  return res.data
}

export async function getTopProducts(params?: { limit?: number }): Promise<TopProduct[]> {
  const res = await dashboardControllerTopProducts(params)
  if (res.status !== 200) return []
  return res.data
}

export async function getPeakHours(_dateRange?: DateRange): Promise<PeakHour[]> {
  const res = await dashboardControllerPeakHours()
  if (res.status !== 200) return []
  return res.data
}
