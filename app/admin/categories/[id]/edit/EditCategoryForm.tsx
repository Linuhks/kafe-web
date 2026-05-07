'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCategoriesControllerUpdate } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'
import type { CategoryResponseDto } from '@/lib/api/generated/api'

interface FormErrors {
  name?: string
}

export default function EditCategoryForm({ category }: { category: CategoryResponseDto }) {
  const router = useRouter()
  const { addToast } = useToast()
  const { setDirty, confirmNavigation } = useFormDirty()

  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(
    typeof category.description === 'string' ? category.description : '',
  )
  const [sortOrder, setSortOrder] = useState(String(category.sortOrder))
  const [isActive, setIsActive] = useState(category.isActive)
  const [errors, setErrors] = useState<FormErrors>({})

  const { mutate: updateCategory, isPending } = useCategoriesControllerUpdate({
    mutation: {
      onSuccess: () => {
        setDirty(false)
        addToast('Categoria atualizada com sucesso.', 'success')
        router.push('/admin/categories')
      },
      onError: () => {
        addToast('Erro ao atualizar categoria. Verifique os dados e tente novamente.', 'error')
      },
    },
  })

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Nome é obrigatório.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    updateCategory({
      id: category.id,
      data: {
        name: name.trim(),
        description: description.trim() || undefined,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : undefined,
        isActive,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">Nome</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => { setName(e.target.value); setDirty(true) }}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="description">
          Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <Input
          id="description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); setDirty(true) }}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="sortOrder">Ordem de exibição</label>
        <Input
          id="sortOrder"
          type="number"
          min="0"
          step="1"
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); setDirty(true) }}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          checked={isActive}
          onChange={(e) => { setIsActive(e.target.checked); setDirty(true) }}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        <label className="text-sm font-medium" htmlFor="isActive">Ativo</label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
        <Button type="button" variant="outline" onClick={() => confirmNavigation('/admin/categories')}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
