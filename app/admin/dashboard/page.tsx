export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import {
  Bell,
  ShoppingBag,
  Banknote,
  ReceiptText,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Clock,
} from 'lucide-react'
import { getDashboardSummary, getTopProducts, getPeakHours } from '@/lib/api/dashboard'
import { getInventoryAlerts } from '@/lib/api/inventory'
import DateRangePicker from '@/components/admin/DateRangePicker'
import PeakHoursChart from '@/components/admin/PeakHoursChart'
import DashboardInventoryAlerts from '@/components/admin/DashboardInventoryAlerts'
import GenerateReportButton from '@/components/admin/GenerateReportButton'
import { Skeleton } from '@/components/ui/skeleton'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { from = today(), to = today() } = await searchParams
  const dateRange = { from, to }

  const [summary, topProducts, peakHours, inventoryAlerts] = await Promise.all([
    getDashboardSummary(dateRange),
    getTopProducts({ limit: 10 }),
    getPeakHours(dateRange),
    getInventoryAlerts(),
  ])

  const stats = [
    {
      label: 'Total Orders',
      value: summary?.totalOrders?.toString() ?? '—',
      Icon: ShoppingBag,
      change: '+12%',
      positive: true,
    },
    {
      label: 'Total Revenue',
      value: summary ? formatCurrency(summary.totalRevenue) : '—',
      Icon: Banknote,
      change: '+8%',
      positive: true,
    },
    {
      label: 'Average Ticket',
      value: summary ? formatCurrency(summary.avgOrderValue) : '—',
      Icon: ReceiptText,
      change: '-3%',
      positive: false,
    },
  ]

  return (
    <div className="p-margin-page space-y-stack-md max-w-7xl mx-auto">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-headline-lg text-[var(--kafe-on-surface)]">Overview</h1>
          <p className="text-body-md text-[var(--kafe-on-surface-variant)]">{formatDate(new Date())}</p>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Notifications" className="relative p-2 rounded-xl hover:bg-[var(--kafe-surface-container-low)] transition-colors">
            <Bell className="w-5 h-5 text-[var(--kafe-on-surface-variant)]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--kafe-error)]" />
          </button>
          <GenerateReportButton />
        </div>
      </header>

      {/* Date Range Filter Row */}
      <div className="flex justify-end">
        <Suspense fallback={<Skeleton className="h-10 w-80" />}>
          <DateRangePicker from={from} to={to} />
        </Suspense>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, Icon, change, positive }) => (
          <div
            key={label}
            className="bg-[var(--kafe-surface-container-lowest)] rounded-2xl border border-[var(--kafe-outline-variant)]/30 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[var(--kafe-secondary-container)]/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[var(--kafe-on-secondary-container)]" />
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm ${
                  positive
                    ? 'bg-green-50 text-green-700'
                    : 'bg-[var(--kafe-error-container)] text-[var(--kafe-on-error-container)]'
                }`}
              >
                {positive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {change}
              </div>
            </div>
            <div>
              <p className="text-label-sm text-[var(--kafe-on-surface-variant)] uppercase tracking-wide">
                {label}
              </p>
              <p className="text-4xl font-bold text-[var(--kafe-on-surface)] mt-1">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Grid: Best Selling Products + Peak Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Best Selling Products Panel */}
        <div className="lg:col-span-2 bg-[var(--kafe-surface-container-lowest)] rounded-3xl border border-[var(--kafe-outline-variant)]/30 p-6">
          <h2 className="text-headline-md text-[var(--kafe-on-surface)] mb-4">Best Selling Products</h2>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[var(--kafe-outline-variant)] rounded-2xl text-center px-6">
              <BarChart2 className="w-10 h-10 text-[var(--kafe-on-surface-variant)] mb-3" />
              <p className="text-headline-md text-[var(--kafe-on-surface)]">No sales data yet</p>
              <p className="text-body-md text-[var(--kafe-on-surface-variant)] mt-1 mb-4">
                Sales will appear here once orders have been placed.
              </p>
              <button className="text-body-md text-[var(--kafe-primary)] hover:underline">
                Sync Point of Sale
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[var(--kafe-outline-variant)]/20">
              <table className="w-full text-sm">
                <thead className="bg-[var(--kafe-surface-container-low)]">
                  <tr>
                    <th className="text-left px-4 py-3 text-label-sm text-[var(--kafe-on-surface-variant)]">
                      Product
                    </th>
                    <th className="text-right px-4 py-3 text-label-sm text-[var(--kafe-on-surface-variant)]">
                      Qty. Sold
                    </th>
                    <th className="text-right px-4 py-3 text-label-sm text-[var(--kafe-on-surface-variant)]">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--kafe-outline-variant)]/20">
                  {topProducts.map((p) => (
                    <tr
                      key={p.productId}
                      className="hover:bg-[var(--kafe-surface-container-low)]/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-[var(--kafe-on-surface)]">{p.productName}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--kafe-on-surface-variant)]">
                        {p.quantitySold}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[var(--kafe-on-surface)]">
                        {formatCurrency(p.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Peak Hours Panel */}
        <div className="lg:col-span-1 bg-[var(--kafe-surface-container-lowest)] rounded-3xl border border-[var(--kafe-outline-variant)]/30 p-6">
          <h2 className="text-headline-md text-[var(--kafe-on-surface)] mb-4">Peak Hours</h2>
          {peakHours.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[var(--kafe-outline-variant)] rounded-2xl text-center px-6">
              <Clock className="w-10 h-10 text-[var(--kafe-on-surface-variant)] mb-3" />
              <p className="text-headline-md text-[var(--kafe-on-surface)]">Awaiting Hourly Traffic</p>
              <p className="text-body-md text-[var(--kafe-on-surface-variant)] mt-1">
                Hourly order data will appear here once orders come in.
              </p>
            </div>
          ) : (
            <PeakHoursChart data={peakHours} />
          )}
        </div>
      </div>

      {/* Inventory Alerts */}
      <DashboardInventoryAlerts alerts={inventoryAlerts} />
    </div>
  )
}
