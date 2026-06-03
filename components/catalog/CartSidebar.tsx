'use client'

import { useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import OrderForm from './OrderForm'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-surface-container-lowest shadow-xl flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant p-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--kafe-primary)]">Sua Seleção</h2>
            <p className="text-sm text-[var(--kafe-on-surface-variant)]">Preparado para seu ritual</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-[var(--kafe-surface-container)] p-8 rounded-full mb-6">
                <ShoppingBag className="h-10 w-10 text-[var(--kafe-on-surface-variant)]" />
              </div>
              <p className="text-sm text-[var(--kafe-on-surface-variant)] mb-4">Seu carrinho está vazio.</p>
              <Button variant="outline" onClick={onClose}>
                Continuar comprando
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {Number(product.price).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeItem(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — always rendered */}
        <div className="border-t border-outline-variant p-8 bg-surface-container-low space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-2xl font-extrabold text-[var(--kafe-primary)]">
              {total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
          <Button
            className="w-full disabled:bg-[var(--kafe-surface-dim)] disabled:text-[var(--kafe-outline)] disabled:cursor-not-allowed"
            onClick={() => setIsOrderFormOpen(true)}
            disabled={itemCount === 0}
          >
            Finalizar Pedido
          </Button>
        </div>
      </div>

      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
      />
    </>
  )
}
