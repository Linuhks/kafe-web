'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCategoriesControllerCreate } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'

interface FormErrors {
  name?: string
}

export default function NewCategoryPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const { setDirty, confirmNavigation } = useFormDirty()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const { mutate: createCategory, isPending } = useCategoriesControllerCreate({
    mutation: {
      onSuccess: () => {
        setDirty(false)
        addToast('Categoria criada com sucesso.', 'success')
        router.push('/admin/categories')
      },
      onError: () => {
        addToast('Erro ao criar categoria. Verifique os dados e tente novamente.', 'error')
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
    createCategory({
      data: {
        name: name.trim(),
        description: description.trim() || undefined,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : undefined,
      },
    })
  }

  return (
    <div className="p-6 max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nova categoria</h1>
        <Button variant="outline" onClick={() => confirmNavigation('/admin/categories')}>
          Cancelar
        </Button>
      </div>

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
          <label className="text-sm font-medium" htmlFor="sortOrder">
            Ordem de exibição <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <Input
            id="sortOrder"
            type="number"
            min="0"
            step="1"
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setDirty(true) }}
            placeholder="0"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Criar categoria'}
          </Button>
        </div>
      </form>
    </div>
  )
}
