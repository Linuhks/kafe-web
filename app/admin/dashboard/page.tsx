export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getDashboardSummary, getTopProducts, getPeakHours } from '@/lib/api/dashboard'
import DateRangePicker from '@/components/admin/DateRangePicker'
import PeakHoursChart from '@/components/admin/PeakHoursChart'
import { Skeleton } from '@/components/ui/skeleton'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function formatCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num)
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { from = today(), to = today() } = await searchParams
  const dateRange = { from, to }

  const [summary, topProducts, peakHours] = await Promise.all([
    getDashboardSummary(dateRange),
    getTopProducts({ limit: 10 }),
    getPeakHours(dateRange),
  ])

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Suspense fallback={<Skeleton className="h-10 w-80" />}>
          <DateRangePicker from={from} to={to} />
        </Suspense>
      </div>

      {/* Summary Cards */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Resumo
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-5 space-y-1">
            <p className="text-sm text-muted-foreground">Total de pedidos</p>
            <p className="text-3xl font-bold">{summary?.totalOrders ?? '—'}</p>
          </div>
          <div className="rounded-lg border bg-card p-5 space-y-1">
            <p className="text-sm text-muted-foreground">Receita total</p>
            <p className="text-3xl font-bold">
              {summary ? formatCurrency(summary.totalRevenue) : '—'}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-5 space-y-1">
            <p className="text-sm text-muted-foreground">Ticket médio</p>
            <p className="text-3xl font-bold">
              {summary ? formatCurrency(summary.avgOrderValue) : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Top Products */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Produtos mais vendidos
        </h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum dado disponível.</p>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Produto</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                    Qtd. vendida
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                    Receita
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">{p.productName}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{p.quantitySold}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatCurrency(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Peak Hours Chart */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Horários de pico
        </h2>
        <div className="rounded-lg border bg-card p-4">
          <PeakHoursChart data={peakHours} />
        </div>
      </section>
    </div>
  )
}
