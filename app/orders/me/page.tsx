import { Suspense } from 'react'
import { getMyOrders } from '@/lib/api/orders'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PaginationWithSuspense } from '@/components/ui/pagination'
import type { Order, OrderStatus } from '@/lib/types'

function formatBRL(amount: string): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    parseFloat(amount),
  )
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(dateStr),
  )
}

function OrderCard({ order }: { order: Order }) {
  const clientName = typeof order.clientName === 'string' ? order.clientName : 'Anônimo'

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm">{clientName}</p>
          <p className="text-xs text-muted-foreground font-mono">{order.id.slice(0, 8)}…</p>
        </div>
        <Badge status={order.status as OrderStatus} />
      </div>

      <ul className="space-y-0.5 text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.productName}</span>
            <span className="text-muted-foreground">× {item.quantity}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t pt-3 text-sm">
        <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>
        <span className="font-semibold">{formatBRL(order.totalAmount)}</span>
      </div>
    </div>
  )
}

function OrderCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-between border-t pt-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

function OrderListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  )
}

async function OrderList({ page }: { page: number }) {
  const { orders, pagination } = await getMyOrders({ page })

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">Nenhum pedido encontrado.</div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {pagination && (pagination.totalPages ?? 0) > 1 && (
        <PaginationWithSuspense
          totalItems={pagination.total ?? 0}
          itemsPerPage={pagination.limit ?? 10}
          currentPage={pagination.page ?? page}
        />
      )}
    </div>
  )
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, Number(pageStr) || 1)

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Meus Pedidos</h1>
      <Suspense fallback={<OrderListSkeleton />}>
        <OrderList page={page} />
      </Suspense>
    </main>
  )
}
