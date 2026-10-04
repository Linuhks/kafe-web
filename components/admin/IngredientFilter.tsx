'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { IngredientResponseDto } from '@/lib/api/generated/api'

interface IngredientFilterProps {
  ingredients: IngredientResponseDto[]
  selectedId: string
}

export default function IngredientFilter({ ingredients, selectedId }: IngredientFilterProps) {
  const t = useTranslations('adminInventory.movements')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'all') {
        params.delete('ingredientId')
      } else {
        params.set('ingredientId', value)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <Select value={selectedId || 'all'} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={t('allIngredients')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('allIngredients')}</SelectItem>
        {ingredients.map((ing) => (
          <SelectItem key={ing.id} value={ing.id}>
            {ing.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
