import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ProductCard from './ProductCard'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import type { Product } from '@/lib/types'

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
  Toaster: () => null,
}))

const baseProduct: Product = {
  id: 'p1',
  name: 'Espresso',
  price: '5.50',
  description: 'Strong coffee',
  imageUrl: '/img/espresso.jpg',
  isAvailable: true,
  categoryId: 'cat1',
}

function renderCard(product: Product = baseProduct) {
  return render(
    <CartProvider>
      <ToastProvider>
        <ProductCard product={product} />
      </ToastProvider>
    </CartProvider>,
  )
}

describe('ProductCard', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders the product name', () => {
    renderCard()
    expect(screen.getByText('Espresso')).toBeInTheDocument()
  })

  it('renders the product price in BRL format', () => {
    renderCard()
    expect(screen.getByText(/R\$\s*5,50/)).toBeInTheDocument()
  })

  it('renders the product description', () => {
    renderCard()
    expect(screen.getByText('Strong coffee')).toBeInTheDocument()
  })

  it('clicking Adicionar adds item to cart (button is enabled)', async () => {
    renderCard()
    const btn = screen.getByRole('button', { name: /adicionar/i })
    expect(btn).not.toBeDisabled()
    await userEvent.click(btn)
  })

  it('shows Indisponível and disables button for unavailable product', () => {
    renderCard({ ...baseProduct, isAvailable: false })
    const btn = screen.getByRole('button', { name: /indisponível/i })
    expect(btn).toBeDisabled()
  })

  it('falls back to placeholder on image error', async () => {
    renderCard()
    const img = screen.getByRole('img', { name: 'Espresso' })
    await act(async () => { fireEvent.error(img) })
    expect(img).toHaveAttribute('src', '/images/product-placeholder.svg')
  })
})
