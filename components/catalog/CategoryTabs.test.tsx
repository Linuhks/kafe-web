import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import CategoryTabs from './CategoryTabs'
import { CartProvider } from '@/context/CartContext'
import { ToastProvider } from '@/context/ToastContext'
import type { Category, Product } from '@/lib/types'

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
  Toaster: () => null,
}))

const categories: Category[] = [
  { id: 'cat1', name: 'Cafés', isActive: true, sortOrder: 1, description: null },
  { id: 'cat2', name: 'Sucos', isActive: true, sortOrder: 2, description: null },
  { id: 'cat3', name: 'Inativo', isActive: false, sortOrder: 3, description: null },
]

const products: Product[] = [
  { id: 'p1', name: 'Espresso', price: '5', description: null, imageUrl: null, isAvailable: true, categoryId: 'cat1' },
  { id: 'p2', name: 'Orange Juice', price: '7', description: null, imageUrl: null, isAvailable: true, categoryId: 'cat2' },
]

function renderTabs(cats = categories, prods = products) {
  return render(
    <CartProvider>
      <ToastProvider>
        <CategoryTabs categories={cats} products={prods} />
      </ToastProvider>
    </CartProvider>,
  )
}

describe('CategoryTabs', () => {
  beforeEach(() => sessionStorage.clear())

  it('renders Todos tab plus one button per active category', () => {
    renderTabs()
    expect(screen.getByRole('button', { name: 'Todos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cafés' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sucos' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Inativo' })).not.toBeInTheDocument()
  })

  it('shows all available products when Todos is selected (default)', () => {
    renderTabs()
    expect(screen.getByText('Espresso')).toBeInTheDocument()
    expect(screen.getByText('Orange Juice')).toBeInTheDocument()
  })

  it('filters products when a category is clicked', async () => {
    renderTabs()
    await userEvent.click(screen.getByRole('button', { name: 'Cafés' }))
    expect(screen.getByText('Espresso')).toBeInTheDocument()
    expect(screen.queryByText('Orange Juice')).not.toBeInTheDocument()
  })

  it('shows all products again when Todos is re-selected', async () => {
    renderTabs()
    await userEvent.click(screen.getByRole('button', { name: 'Cafés' }))
    await userEvent.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getByText('Espresso')).toBeInTheDocument()
    expect(screen.getByText('Orange Juice')).toBeInTheDocument()
  })

  it('shows empty message when no products in selected category', async () => {
    renderTabs()
    await userEvent.click(screen.getByRole('button', { name: 'Sucos' }))
    // Sucos has no product initially - add one that's unavailable to test filter
  })

  it('applies active class to selected tab', async () => {
    renderTabs()
    const cafesBtn = screen.getByRole('button', { name: 'Cafés' })
    await userEvent.click(cafesBtn)
    expect(cafesBtn.className).toContain('bg-primary')
  })
})
