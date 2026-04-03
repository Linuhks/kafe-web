'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import ProductCard from './ProductCard'
import type { Category, Product } from '@/lib/types'

interface CategoryTabsProps {
  categories: Category[]
  products: Product[]
}

export default function CategoryTabs({ categories, products }: CategoryTabsProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const filtered =
    selectedCategoryId == null
      ? products
      : products.filter(p => p.categoryId === selectedCategoryId)

  const activeCategories = categories.filter(c => c.isActive)

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={cn(
            'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            selectedCategoryId === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          Todos
        </button>
        {activeCategories
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={cn(
                'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                selectedCategoryId === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {cat.name}
            </button>
          ))}
      </div>

      {/* Products grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          Nenhum produto disponível nesta categoria.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered
            .filter(p => p.isAvailable)
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      )}
    </div>
  )
}
