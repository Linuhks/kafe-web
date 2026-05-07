'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addToast } = useToast()

  function handleAddToCart() {
    addItem(product)
    addToast(`${product.name} adicionado ao carrinho`, 'success')
  }

  return (
    <div className="flex flex-col rounded-lg border bg-card overflow-hidden">
      <div className="relative aspect-square bg-muted">
        <Image
          src={typeof product.imageUrl === 'string' ? product.imageUrl : '/images/product-placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div>
          <h3 className="font-medium leading-tight">{product.name}</h3>
          {typeof product.description === 'string' && product.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-semibold">
            {Number(product.price).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
          <Button size="sm" onClick={handleAddToCart} disabled={!product.isAvailable}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.isAvailable ? 'Adicionar' : 'Indisponível'}
          </Button>
        </div>
      </div>
    </div>
  )
}
