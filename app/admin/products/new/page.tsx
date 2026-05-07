'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    <div className="p-6 max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Novo produto</h1>
        <Button variant="outline" onClick={() => confirmNavigation('/admin/products')}>
          Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="name">Nome</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => { setName(e.target.value); handleChange() }}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="description">Descrição</label>
          <Input
            id="description"
            value={description}
            onChange={(e) => { setDescription(e.target.value); handleChange() }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="price">Preço</label>
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
          <label className="text-sm font-medium" htmlFor="imageUrl">URL da imagem</label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => { setImageUrl(e.target.value); handleChange() }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Categoria</label>
          <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); handleChange() }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
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
          <label className="text-sm font-medium" htmlFor="isAvailable">Disponível</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Criar produto'}
          </Button>
        </div>
      </form>
    </div>
  )
}
