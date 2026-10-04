'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCategoriesControllerCreate } from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'
import { cn } from '@/lib/utils'
import { Lightbulb } from 'lucide-react'

interface FormErrors {
  name?: string
}

const inputClass =
  'w-full px-4 py-3 bg-kafe-surface border border-kafe-outline-variant rounded-xl text-body-md text-kafe-on-surface placeholder:text-kafe-on-surface-variant/50 transition-all focus:outline-none focus:border-kafe-primary focus:ring-4 focus:ring-kafe-primary/5'

export default function NewCategoryPage() {
  const t = useTranslations('adminCategories')
  const tn = useTranslations('adminCategories.new')
  const tc = useTranslations('common')
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
        addToast(tn('created'), 'success')
        router.push('/admin/categories')
      },
      onError: () => {
        addToast(tn('createError'), 'error')
      },
    },
  })

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = t('form.nameRequired')
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
    <div className="p-8 max-w-5xl space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-headline-lg text-kafe-on-surface mb-2">{tn('title')}</h1>
          <p className="text-body-md text-kafe-on-surface-variant">
            {tn('subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => confirmNavigation('/admin/categories')}
          className="border border-kafe-outline-variant text-kafe-on-surface-variant rounded-full px-6 py-2.5 text-label-sm hover:bg-kafe-surface-container-low hover:border-kafe-on-surface-variant transition-all duration-200"
        >
          {tc('cancel')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-kafe-outline-variant/30 shadow-[0_4px_20px_-2px_rgba(85,55,34,0.08)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-label-sm text-kafe-on-surface" htmlFor="name">{tc('name')}</label>
                <input
                  id="name"
                  className={cn(inputClass, errors.name && 'border-kafe-error')}
                  placeholder={tn('namePlaceholder')}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setDirty(true) }}
                />
                {errors.name && <p className="text-xs text-kafe-error mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-label-sm text-kafe-on-surface" htmlFor="description">
                  {t('form.descriptionOptional')}
                </label>
                <textarea
                  id="description"
                  className={cn(inputClass, 'resize-none')}
                  rows={4}
                  placeholder={tn('descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setDirty(true) }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-label-sm text-kafe-on-surface" htmlFor="sortOrder">
                  {t('form.displayOrderOptional')}
                </label>
                <div className="w-32">
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
                <p className="text-xs text-kafe-on-surface-variant">
                  {tn('displayOrderHint')}
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-kafe-primary text-kafe-on-primary rounded-xl py-4 text-label-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all duration-200 active:scale-[0.98] shadow-md shadow-kafe-primary/10"
                >
                  {isPending ? tc('saving') : tn('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-kafe-primary/5 rounded-2xl p-6 border border-kafe-primary/10">
            <div className="w-10 h-10 bg-kafe-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5 text-kafe-secondary" />
            </div>
            <h3 className="text-headline-md text-kafe-secondary mb-2">{tn('tipTitle')}</h3>
            <p className="text-sm text-kafe-on-surface-variant leading-relaxed">
              {tn('tipBody')}
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-kafe-outline-variant/30 shadow-[0_4px_20px_-2px_rgba(85,55,34,0.08)]">
            <div className="relative h-40 bg-kafe-surface-container-low overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-kafe-primary/70 to-kafe-secondary/50" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="text-white font-bold tracking-widest uppercase text-xs">{tn('previewLabel')}</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-kafe-surface-container-low rounded w-3/4" />
              <div className="h-3 bg-kafe-surface-container-low rounded w-full" />
              <div className="h-3 bg-kafe-surface-container-low rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
