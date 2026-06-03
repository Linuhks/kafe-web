'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2, Coffee, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PaginationWithSuspense } from '@/components/ui/pagination'
import ConfirmModal from '@/components/admin/ConfirmModal'
import {
  useProductsControllerToggleAvail,
  useProductsControllerRemove,
} from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import type { ProductResponseDto, CategoryResponseDto } from '@/lib/api/generated/api'

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  'Coffee Beans': 'bg-kafe-tertiary-fixed text-kafe-on-tertiary-fixed-variant',
  'Brewing Gear': 'bg-kafe-secondary-fixed text-kafe-on-secondary-fixed-variant',
  'Subscription': 'bg-kafe-primary-fixed text-kafe-on-primary-fixed-variant',
}
const DEFAULT_BADGE = 'bg-kafe-surface-container text-kafe-on-surface-variant'

const FILTER_CHIPS = ['All Items', 'Coffee Beans', 'Brewing Gear', 'Gifts'] as const

interface ProductRow {
  id: string
  name: string
  categoryName: string
  price: string
  isAvailable: boolean
  imageUrl: string | null
}

interface ProductsTableProps {
  products: ProductResponseDto[]
  categories: CategoryResponseDto[]
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

type SortKey = keyof Pick<ProductRow, 'name' | 'categoryName' | 'price'>
type SortDir = 'asc' | 'desc'

export default function ProductsTable({
  products,
  categories,
  totalItems,
  itemsPerPage,
  currentPage,
}: ProductsTableProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null)
  const [optimisticAvail, setOptimisticAvail] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All Items')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const { mutate: toggleAvail } = useProductsControllerToggleAvail({
    mutation: {
      onSuccess: (_, vars) => {
        addToast('Disponibilidade atualizada.', 'success')
        setOptimisticAvail((prev) => {
          const next = { ...prev }
          delete next[vars.id]
          return next
        })
        router.refresh()
      },
      onError: (_, vars) => {
        addToast('Erro ao atualizar disponibilidade.', 'error')
        setOptimisticAvail((prev) => {
          const next = { ...prev }
          delete next[vars.id]
          return next
        })
      },
    },
  })

  const { mutate: removeProduct, isPending: isRemoving } = useProductsControllerRemove({
    mutation: {
      onSuccess: () => {
        addToast('Produto removido com sucesso.', 'success')
        setDeleteTarget(null)
        router.refresh()
      },
      onError: () => {
        addToast('Erro ao remover produto.', 'error')
      },
    },
  })

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  const rows: ProductRow[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    categoryName: categoryMap[p.categoryId] ?? p.categoryId,
    price: p.price,
    isAvailable: optimisticAvail[p.id] ?? p.isAvailable,
    imageUrl: p.imageUrl as string | null,
  }))

  const filteredRows = useMemo(() => {
    let result = rows
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((r) => r.name.toLowerCase().includes(q))
    }
    if (activeCategory !== 'All Items') {
      result = result.filter((r) => r.categoryName === activeCategory)
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aStr = String(a[sortKey] ?? '')
        const bStr = String(b[sortKey] ?? '')
        const cmp = aStr.localeCompare(bStr, undefined, { numeric: true })
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return result
  }, [rows, searchQuery, activeCategory, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 opacity-50" />
    return sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
  }

  if (rows.length === 0) {
    return <p className="text-body-md text-kafe-on-surface-variant py-8 text-center">Nenhum produto encontrado.</p>
  }

  return (
    <>
      {/* Search + filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-kafe-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search beans, equipment…"
            className="w-full pl-10 pr-4 py-2 bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-lg focus:outline-none focus:border-kafe-primary transition-colors text-body-md text-kafe-on-surface placeholder:text-kafe-on-surface-variant/60"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveCategory(chip)}
              className={cn(
                'px-4 py-2 rounded-full text-label-sm whitespace-nowrap transition-colors',
                activeCategory === chip
                  ? 'bg-kafe-primary text-kafe-on-primary'
                  : 'bg-kafe-surface-container-lowest border border-kafe-outline-variant text-kafe-on-surface-variant hover:bg-kafe-surface-container-low',
              )}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-kafe-surface-container-lowest border border-kafe-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-kafe-surface-container-low border-b border-kafe-outline-variant">
                <th
                  className="px-6 py-4 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  <span className="inline-flex items-center gap-1">Product Name <SortIcon col="name" /></span>
                </th>
                <th
                  className="px-6 py-4 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('categoryName')}
                >
                  <span className="inline-flex items-center gap-1">Category <SortIcon col="categoryName" /></span>
                </th>
                <th
                  className="px-6 py-4 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider text-right cursor-pointer select-none"
                  onClick={() => handleSort('price')}
                >
                  <span className="inline-flex items-center justify-end gap-1 w-full">Price <SortIcon col="price" /></span>
                </th>
                <th className="px-6 py-4 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider text-center">
                  Availability
                </th>
                <th className="px-6 py-4 text-label-sm text-kafe-on-surface-variant uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-kafe-outline-variant">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-body-md text-kafe-on-surface-variant">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-kafe-surface-container-low transition-colors">
                    {/* Product name + thumbnail */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded overflow-hidden border border-kafe-outline-variant flex-shrink-0 bg-kafe-surface-container-highest flex items-center justify-center">
                          {row.imageUrl ? (
                            <img
                              src={row.imageUrl}
                              alt={row.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Coffee className="h-5 w-5 text-kafe-on-surface-variant" />
                          )}
                        </div>
                        <div>
                          <p className="text-[18px] text-kafe-primary font-semibold leading-tight">{row.name}</p>
                          <p className="text-label-sm text-kafe-on-surface-variant mt-0.5">{row.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    {/* Category badge */}
                    <td className="px-6 py-5">
                      <span
                        className={cn(
                          'inline-block rounded px-3 py-1 text-sm',
                          CATEGORY_BADGE_STYLES[row.categoryName] ?? DEFAULT_BADGE,
                        )}
                      >
                        {row.categoryName}
                      </span>
                    </td>
                    {/* Price */}
                    <td className="px-6 py-5 text-right text-[18px] text-kafe-on-surface font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        parseFloat(row.price),
                      )}
                    </td>
                    {/* Availability toggle */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={row.isAvailable}
                          aria-label={`Disponibilidade de ${row.name}`}
                          onClick={() => {
                            setOptimisticAvail((prev) => ({ ...prev, [row.id]: !row.isAvailable }))
                            toggleAvail({ id: row.id })
                          }}
                          className={cn(
                            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kafe-primary',
                            row.isAvailable ? 'bg-kafe-primary' : 'bg-kafe-outline-variant',
                          )}
                        >
                          <span
                            className={cn(
                              'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
                              row.isAvailable ? 'translate-x-4' : 'translate-x-0',
                            )}
                          />
                        </button>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${row.id}/edit`}
                          className="p-2 text-kafe-on-surface-variant hover:text-kafe-primary transition-colors rounded"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(row)}
                          className="p-2 text-kafe-on-surface-variant hover:text-kafe-error transition-colors rounded"
                          aria-label="Remover"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 bg-kafe-surface-container-low border-t border-kafe-outline-variant flex items-center justify-between">
          <span className="text-label-sm text-kafe-on-surface-variant">
            Showing {filteredRows.length} of {totalItems} products
          </span>
          <PaginationWithSuspense
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
          />
        </div>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        title="Remover produto"
        message={`Tem certeza que deseja remover "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={isRemoving}
        onConfirm={() => {
          if (deleteTarget) removeProduct({ id: deleteTarget.id })
        }}
      />
    </>
  )
}
