import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PaginationWithSuspense } from '@/components/ui/pagination'
import DateRangePicker from '@/components/admin/DateRangePicker'
import IngredientFilter from '@/components/admin/IngredientFilter'
import { getInventory, getStockMovements } from '@/lib/api/inventory'

const ITEMS_PER_PAGE = 20

interface PageProps {
  searchParams: Promise<{
    from?: string
    to?: string
    ingredientId?: string
    page?: string
  }>
}

export default async function InventoryMovementsPage({ searchParams }: PageProps) {
  const { from, to, ingredientId, page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10))

  const [{ ingredients }, { movements }] = await Promise.all([
    getInventory(),
    getStockMovements(ingredientId ? { ingredientId } : undefined),
  ])

  const ingredientMap = new Map(ingredients.map((ing) => [ing.id, ing.name]))

  const filtered = movements.filter((m) => {
    const created = new Date(m.createdAt)
    if (from) {
      const fromDate = new Date(from)
      fromDate.setHours(0, 0, 0, 0)
      if (created < fromDate) return false
    }
    if (to) {
      const toDate = new Date(to)
      toDate.setHours(23, 59, 59, 999)
      if (created > toDate) return false
    }
    return true
  })

  const totalItems = filtered.length
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Movimentações de estoque</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/inventory">← Voltar ao estoque</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Suspense>
          <DateRangePicker from={from ?? ''} to={to ?? ''} />
        </Suspense>
        <Suspense>
          <IngredientFilter ingredients={ingredients} selectedId={ingredientId ?? ''} />
        </Suspense>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Ingrediente</th>
              <th className="px-4 py-3 text-left font-medium">Tipo</th>
              <th className="px-4 py-3 text-left font-medium">Quantidade</th>
              <th className="px-4 py-3 text-left font-medium">Nota</th>
              <th className="px-4 py-3 text-left font-medium">Pedido</th>
              <th className="px-4 py-3 text-left font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            ) : (
              paginated.map((movement) => (
                <tr key={movement.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    {ingredientMap.get(movement.ingredientId) ?? movement.ingredientId}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {movement.type}
                  </td>
                  <td className="px-4 py-3">{movement.quantity}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {typeof movement.note === 'string' ? movement.note : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {typeof movement.orderId === 'string' ? movement.orderId : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(movement.createdAt).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalItems > ITEMS_PER_PAGE && (
        <PaginationWithSuspense
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
        />
      )}
    </div>
  )
}
