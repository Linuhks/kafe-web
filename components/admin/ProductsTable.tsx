'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable, type Column } from '@/components/admin/DataTable'
import ConfirmModal from '@/components/admin/ConfirmModal'
import {
  useProductsControllerToggleAvail,
  useProductsControllerRemove,
} from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import type { ProductResponseDto, CategoryResponseDto } from '@/lib/api/generated/api'

interface ProductRow {
  id: string
  name: string
  categoryName: string
  price: string
  isAvailable: boolean
}

interface ProductsTableProps {
  products: ProductResponseDto[]
  categories: CategoryResponseDto[]
  totalItems: number
  itemsPerPage: number
  currentPage: number
}

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
  }))

  const columns: Column<ProductRow>[] = [
    {
      key: 'name',
      header: 'Nome',
      sortable: true,
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'categoryName',
      header: 'Categoria',
      sortable: true,
      render: (row) => <span className="text-muted-foreground">{row.categoryName}</span>,
    },
    {
      key: 'price',
      header: 'Preço',
      sortable: true,
      render: (row) => (
        <span>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            parseFloat(row.price),
          )}
        </span>
      ),
    },
    {
      key: 'isAvailable',
      header: 'Disponível',
      render: (row) => (
        <button
          type="button"
          role="switch"
          aria-checked={row.isAvailable}
          aria-label={`Disponibilidade de ${row.name}`}
          onClick={() => {
            setOptimisticAvail((prev) => ({ ...prev, [row.id]: !row.isAvailable }))
            toggleAvail({ id: row.id })
          }}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            row.isAvailable ? 'bg-primary' : 'bg-input'
          }`}
        >
          <span
            className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
              row.isAvailable ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/products/${row.id}/edit`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Remover</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        emptyMessage="Nenhum produto encontrado."
      />

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
