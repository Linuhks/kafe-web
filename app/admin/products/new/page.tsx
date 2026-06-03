'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronRight, ImageIcon } from 'lucide-react'
import {
  useProductsControllerCreate,
  useCategoriesControllerList,
} from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'

interface FormErrors {
  name?: string
  price?: string
  categoryId?: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const { setDirty, confirmNavigation } = useFormDirty()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})

  const { data: categoriesRes } = useCategoriesControllerList({
    query: { staleTime: 60_000 },
  })
  const categories = categoriesRes?.data?.data ?? []

  const { mutate: createProduct, isPending } = useProductsControllerCreate({
    mutation: {
      onSuccess: () => {
        setDirty(false)
        addToast('Produto criado com sucesso.', 'success')
        router.push('/admin/products')
      },
      onError: () => {
        addToast('Erro ao criar produto. Verifique os dados e tente novamente.', 'error')
      },
    },
  })

  function handleChange() {
    setDirty(true)
  }

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Nome é obrigatório.'
    if (!categoryId) errs.categoryId = 'Categoria é obrigatória.'
    if (!price.trim()) {
      errs.price = 'Preço é obrigatório.'
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errs.price = 'Preço deve ser um número positivo.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    createProduct({
      data: {
        name: name.trim(),
        description: description.trim() || undefined,
        price,
        imageUrl: imageUrl.trim() || undefined,
        categoryId,
        isAvailable,
      },
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pb-12">
      <header className="py-6 border-b border-kafe-outline-variant mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-headline-lg text-kafe-on-surface">New Product</h1>
            <p className="text-body-md text-kafe-on-surface-variant mt-1">
              Add a new artisanal selection to the Kafe catalog.
            </p>
          </div>
          <button
            type="button"
            onClick={() => confirmNavigation('/admin/products')}
            className="text-body-md text-kafe-on-surface-variant hover:text-kafe-on-surface transition-colors"
          >
            Cancel
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-grid items-start">
        <div className="lg:col-span-7 space-y-gutter-grid">
          <div className="bg-kafe-surface-container-lowest p-stack-md rounded-xl border border-kafe-outline-variant/30">
            <h2 className="text-headline-md text-kafe-on-surface mb-6">Product Information</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="font-label-sm text-label-sm text-kafe-primary uppercase"
                >
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); handleChange() }}
                  className="w-full bg-transparent border-b-2 border-kafe-outline-variant pb-2 focus:outline-none focus:border-kafe-primary text-kafe-on-surface"
                />
                {errors.name && <p className="text-xs text-kafe-error">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="font-label-sm text-label-sm text-kafe-primary uppercase"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); handleChange() }}
                  className="w-full bg-transparent border border-kafe-outline-variant p-4 rounded-lg focus:outline-none focus:border-kafe-primary text-kafe-on-surface resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-gutter-grid">
                <div className="space-y-2">
                  <label
                    htmlFor="categoryId"
                    className="font-label-sm text-label-sm text-kafe-primary uppercase"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="categoryId"
                      value={categoryId}
                      onChange={(e) => { setCategoryId(e.target.value); handleChange() }}
                      className="w-full appearance-none bg-transparent border-b-2 border-kafe-outline-variant pb-2 pr-8 focus:outline-none focus:border-kafe-primary text-kafe-on-surface"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 bottom-2 pointer-events-none text-kafe-outline-variant w-4 h-4" />
                  </div>
                  {errors.categoryId && <p className="text-xs text-kafe-error">{errors.categoryId}</p>}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="price"
                    className="font-label-sm text-label-sm text-kafe-primary uppercase"
                  >
                    Price
                  </label>
                  <div className="flex items-end border-b-2 border-kafe-outline-variant focus-within:border-kafe-primary pb-2">
                    <span className="text-kafe-on-surface-variant mr-1">$</span>
                    <input
                      id="price"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={price}
                      onChange={(e) => { setPrice(e.target.value); handleChange() }}
                      className="w-full bg-transparent focus:outline-none text-kafe-on-surface"
                    />
                  </div>
                  {errors.price && <p className="text-xs text-kafe-error">{errors.price}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-kafe-surface-container-low rounded-xl border border-kafe-outline-variant/30 p-stack-md flex items-center justify-between gap-4">
            <div>
              <p className="text-body-md font-medium text-kafe-on-surface">Availability</p>
              <p className="text-body-sm text-kafe-on-surface-variant">Toggle product visibility in the shop</p>
            </div>
            <label htmlFor="isAvailable" className="relative inline-flex cursor-pointer items-center">
              <input
                id="isAvailable"
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => { setIsAvailable(e.target.checked); handleChange() }}
                className="peer sr-only"
              />
              <div className="w-14 h-8 rounded-full bg-kafe-surface-variant peer-checked:bg-kafe-primary transition-colors
                after:content-[''] after:absolute after:top-1 after:left-1 after:w-6 after:h-6 after:rounded-full
                after:bg-white after:transition-all peer-checked:after:translate-x-6" />
            </label>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-gutter-grid">
          <div className="bg-kafe-surface-container-lowest p-stack-md rounded-xl border border-kafe-outline-variant/30">
            <h2 className="text-headline-md text-kafe-on-surface mb-6">Product Image</h2>

            <div className="aspect-square w-full rounded-xl overflow-hidden border border-kafe-outline-variant/30 bg-kafe-surface-container-low mb-6">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-kafe-outline-variant" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="imageUrl"
                className="font-label-sm text-label-sm text-kafe-primary uppercase"
              >
                Image URL
              </label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); handleChange() }}
                className="w-full bg-transparent border-b-2 border-kafe-outline-variant pb-2 focus:outline-none focus:border-kafe-primary text-kafe-on-surface"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-kafe-primary-container text-kafe-on-primary py-6 rounded-full flex items-center justify-center gap-2 text-body-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isPending ? (
              'Saving...'
            ) : (
              <>
                Create Product
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-center font-label-sm text-label-sm text-kafe-outline-variant uppercase tracking-widest">
            Drafts are saved automatically
          </p>
        </div>
      </form>
    </div>
  )
}
