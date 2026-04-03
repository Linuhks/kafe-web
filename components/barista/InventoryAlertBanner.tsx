'use client'

import { AlertTriangle } from 'lucide-react'
import type { IngredientResponseDto } from '@/lib/api/generated/api'

interface InventoryAlertBannerProps {
  ingredients: IngredientResponseDto[]
}

export default function InventoryAlertBanner({ ingredients }: InventoryAlertBannerProps) {
  if (ingredients.length === 0) return null

  return (
    <div className="flex items-start gap-3 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-yellow-800">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="text-sm">
        <span className="font-semibold">Estoque baixo: </span>
        {ingredients.map(i => i.name).join(', ')}
      </div>
    </div>
  )
}
