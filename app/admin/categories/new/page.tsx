'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCategoriesControllerCreate } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'
import { cn } from '@/lib/utils'

interface FormErrors {
  name?: string
}

const inputClass =
  'bg-transparent border-b border-kafe-outline-variant focus:border-kafe-primary outline-none py-2 text-body-md text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 transition-colors w-full'

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
        <h1 className={cn('text-headline-md text-kafe-on-surface')}>Nova categoria</h1>
        <button
          type="button"
          onClick={() => confirmNavigation('/admin/categories')}
          className="border border-kafe-primary text-kafe-primary rounded-full px-6 py-2.5 text-label-sm"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-kafe-surface-container-low rounded-xl p-8 space-y-4">
        <div className="space-y-1">
          <label className="text-label-sm text-kafe-on-surface-variant" htmlFor="name">Nome</label>
          <input
            id="name"
            className={inputClass}
            value={name}
            onChange={(e) => { setName(e.target.value); setDirty(true) }}
          />
          {errors.name && <p className="text-xs text-kafe-error">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-label-sm text-kafe-on-surface-variant" htmlFor="description">
            Descrição <span className="text-kafe-on-surface-variant/60 font-normal">(opcional)</span>
          </label>
          <input
            id="description"
            className={inputClass}
            value={description}
            onChange={(e) => { setDescription(e.target.value); setDirty(true) }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-label-sm text-kafe-on-surface-variant" htmlFor="sortOrder">
            Ordem de exibição <span className="text-kafe-on-surface-variant/60 font-normal">(opcional)</span>
          </label>
          <input
            id="sortOrder"
            type="number"
            min="0"
            step="1"
            className={inputClass}
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setDirty(true) }}
            placeholder="0"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-kafe-primary text-kafe-on-primary rounded-full px-6 py-2.5 text-label-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Salvando...' : 'Criar categoria'}
          </button>
        </div>
      </form>
    </div>
  )
}
