'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useProductsControllerGetOne,
  useProductsControllerUpdate,
  useProductsControllerListIngredients,
  useProductsControllerAddIngredient,
  useProductsControllerRemoveIngredient,
  useCategoriesControllerList,
  useInventoryControllerList,
  type ProductIngredientResponseDto,
} from '@/lib/api/generated/api'
import { useToast } from '@/context/ToastContext'
import { useFormDirty } from '@/lib/hooks/useFormDirty'

interface FormErrors {
  name?: string
  price?: string
  categoryId?: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params)
  const t = useTranslations('adminProducts.edit')
  const tc = useTranslations('common')
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
  const [initialized, setInitialized] = useState(false)

  const [addIngredientId, setAddIngredientId] = useState('')
  const [addQuantity, setAddQuantity] = useState('')
  const [addIngredientError, setAddIngredientError] = useState('')

  const { data: productRes } = useProductsControllerGetOne(id)
  const { data: categoriesRes } = useCategoriesControllerList({
    query: { staleTime: 60_000 },
  })
  const { data: ingredientsListData, refetch: refetchProductIngredients } =
    useProductsControllerListIngredients(id)
  const { data: allIngredientsRes } = useInventoryControllerList()

  const product = productRes?.data

  const categories = categoriesRes?.data?.data ?? []
  const productIngredients: ProductIngredientResponseDto[] =
    ingredientsListData?.status === 200 ? ingredientsListData.data : []
  const allIngredients = allIngredientsRes?.data?.data ?? []

  useEffect(() => {
    if (product && !initialized) {
      setName(product.name)
      setDescription((product.description ?? '') as string) // Orval generates { [key: string]: unknown } | null for @nullable fields without explicit base type
      setPrice(product.price)
      setImageUrl((product.imageUrl ?? '') as string) // Orval generates { [key: string]: unknown } | null for @nullable fields without explicit base type
      setCategoryId(product.categoryId)
      setIsAvailable(product.isAvailable)
      setInitialized(true)
    }
  }, [product, initialized])

  const { mutate: updateProduct, isPending } = useProductsControllerUpdate({
    mutation: {
      onSuccess: () => {
        setDirty(false)
        addToast(t('updated'), 'success')
        router.push('/admin/products')
      },
      onError: () => {
        addToast(t('updateError'), 'error')
      },
    },
  })

  const { mutate: addIngredient, isPending: isAdding } = useProductsControllerAddIngredient({
    mutation: {
      onSuccess: () => {
        addToast(t('ingredientAdded'), 'success')
        setAddIngredientId('')
        setAddQuantity('')
        setAddIngredientError('')
        refetchProductIngredients()
      },
      onError: () => {
        addToast(t('ingredientAddError'), 'error')
      },
    },
  })

  const { mutate: removeIngredient } = useProductsControllerRemoveIngredient({
    mutation: {
      onSuccess: () => {
        addToast(t('ingredientRemoved'), 'success')
        refetchProductIngredients()
      },
      onError: () => {
        addToast(t('ingredientRemoveError'), 'error')
      },
    },
  })

  function handleChange() {
    setDirty(true)
  }

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = t('nameRequired')
    if (!categoryId) errs.categoryId = t('categoryRequired')
    if (!price.trim()) {
      errs.price = t('priceRequired')
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errs.price = t('priceInvalid')
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    updateProduct({
      id,
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

  function handleAddIngredient() {
    if (!addIngredientId) {
      setAddIngredientError(t('selectIngredient'))
      return
    }
    if (!addQuantity || isNaN(parseFloat(addQuantity)) || parseFloat(addQuantity) <= 0) {
      setAddIngredientError(t('quantityInvalid'))
      return
    }
    const alreadyAdded = productIngredients.some((pi) => pi.ingredientId === addIngredientId)
    if (alreadyAdded) {
      setAddIngredientError(t('ingredientDuplicate'))
      return
    }
    setAddIngredientError('')
    addIngredient({ id, data: { ingredientId: addIngredientId, quantity: addQuantity } })
  }

  if (!initialized) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">{tc('loading')}</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-lg space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button variant="outline" onClick={() => confirmNavigation('/admin/products')}>
          {tc('cancel')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="name">{tc('name')}</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => { setName(e.target.value); handleChange() }}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="description">{tc('description')}</label>
          <Input
            id="description"
            value={description}
            onChange={(e) => { setDescription(e.target.value); handleChange() }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="price">{t('price')}</label>
          <Input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => { setPrice(e.target.value); handleChange() }}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="imageUrl">{t('imageUrl')}</label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => { setImageUrl(e.target.value); handleChange() }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">{t('category')}</label>
          <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); handleChange() }}>
            <SelectTrigger>
              <SelectValue placeholder={t('categoryPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isAvailable"
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => { setIsAvailable(e.target.checked); handleChange() }}
            className="h-4 w-4 rounded border-input accent-primary"
          />
          <label className="text-sm font-medium" htmlFor="isAvailable">{t('available')}</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? tc('saving') : tc('saveChanges')}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('ingredients')}</h2>

        {productIngredients.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noIngredients')}</p>
        ) : (
          <div className="rounded-lg border divide-y">
            {productIngredients.map((pi) => {
              const ingredient = allIngredients.find((i) => i.id === pi.ingredientId)
              return (
                <div key={pi.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <span className="text-sm font-medium">
                      {ingredient?.name ?? pi.ingredientId}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {pi.quantity} {ingredient?.unit ?? ''}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient({ id, ingredientId: pi.ingredientId })}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">{t('removeIngredient')}</span>
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium">{t('addIngredient')}</p>
          <div className="flex gap-2">
            <Select
              value={addIngredientId}
              onValueChange={(v) => { setAddIngredientId(v); setAddIngredientError('') }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t('ingredientPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {allIngredients.map((ing) => (
                  <SelectItem key={ing.id} value={ing.id}>
                    {ing.name} ({ing.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              placeholder={t('quantityPlaceholder')}
              value={addQuantity}
              onChange={(e) => { setAddQuantity(e.target.value); setAddIngredientError('') }}
              className="w-24"
            />
            <Button type="button" onClick={handleAddIngredient} disabled={isAdding}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {addIngredientError && (
            <p className="text-xs text-destructive">{addIngredientError}</p>
          )}
        </div>
      </div>
    </div>
  )
}
