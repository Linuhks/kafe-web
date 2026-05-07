'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { useCategoriesControllerRemove } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import type { CategoryResponseDto } from '@/lib/api/generated/api'

interface CategoriesTableProps {
  categories: CategoryResponseDto[]
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter()
  const { addToast } = useToast()
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponseDto | null>(null)

  const { mutate: removeCategory, isPending } = useCategoriesControllerRemove({
    mutation: {
      onSuccess: () => {
        addToast('Categoria removida com sucesso.', 'success')
        setDeleteTarget(null)
        router.refresh()
      },
      onError: () => {
        addToast('Erro ao remover categoria.', 'error')
      },
    },
  })

  if (categories.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Nenhuma categoria encontrada.
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Nome</th>
              <th className="px-4 py-3 text-left font-medium">Descrição</th>
              <th className="px-4 py-3 text-left font-medium">Ordem</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {typeof cat.description === 'string' ? cat.description : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  {cat.isActive ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      Ativo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inativo</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button size="icon-sm" variant="ghost" asChild>
                      <Link href={`/admin/categories/${cat.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Link>
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(cat)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
        title="Remover categoria"
        message={`Tem certeza que deseja remover a categoria "${deleteTarget?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={() => deleteTarget && removeCategory({ id: deleteTarget.id })}
        loading={isPending}
      />
    </>
  )
}
