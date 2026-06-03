'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import type { Product } from '@/lib/types'

const PLACEHOLDER = '/images/product-placeholder.svg'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addToast } = useToast()
  const [imgSrc, setImgSrc] = useState(
    typeof product.imageUrl === 'string' ? product.imageUrl : PLACEHOLDER,
  )

  function handleAddToCart() {
    addItem(product)
    addToast(`${product.name} adicionado ao carrinho`, 'success')
  }

  return (
    <article className="group flex flex-col rounded-lg bg-surface-container-lowest border border-outline-variant overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative h-64 bg-secondary-container/20 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          onError={() => setImgSrc(PLACEHOLDER)}
        />
        <span className="absolute top-4 right-4 bg-[var(--kafe-background)]/90 px-3 py-1 rounded-full shadow-sm text-sm font-semibold">
          {Number(product.price).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-6 flex-1">
        <div>
          <h3 className="text-xl font-bold text-on-surface">{product.name}</h3>
          {typeof product.description === 'string' && product.description && (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>
          )}
        </div>
        <button
          className="mt-auto w-full bg-[var(--kafe-primary)] text-[var(--kafe-on-primary)] py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm hover:opacity-90 disabled:bg-[var(--kafe-surface-dim)] disabled:text-[var(--kafe-outline)] disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={!product.isAvailable}
        >
          {product.isAvailable ? 'Adicionar' : 'Indisponível'}
          {product.isAvailable && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </article>
  )
}
