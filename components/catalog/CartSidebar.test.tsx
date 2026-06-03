import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import CartSidebar from './CartSidebar'
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

vi.mock('./OrderForm', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? React.createElement('div', { 'data-testid': 'order-form' }, 'Order Form') : null,
}))

const mockProduct: Product = {
  id: 'p1',
  name: 'Espresso',
  price: '5.50',
  description: null,
  imageUrl: null,
  isAvailable: true,
  categoryId: 'cat1',
}

function renderSidebar(isOpen = true, preloadItems = false) {
  if (preloadItems) {
    sessionStorage.setItem(
      'kafe_cart',
      JSON.stringify([{ product: mockProduct, quantity: 2 }]),
    )
  }
  const onClose = vi.fn()
  return {
    onClose,
    ...render(
      <CartProvider>
        <ToastProvider>
          <CartSidebar isOpen={isOpen} onClose={onClose} />
        </ToastProvider>
      </CartProvider>,
    ),
  }
}

describe('CartSidebar', () => {
  beforeEach(() => sessionStorage.clear())

  it('shows empty cart message when no items', () => {
    renderSidebar(true)
    expect(screen.getByText('Seu carrinho está vazio.')).toBeInTheDocument()
  })

  it('calls onClose when overlay is clicked', async () => {
    const { onClose } = renderSidebar(true)
    const overlay = document.querySelector('[aria-hidden="true"]')
    if (overlay) await userEvent.click(overlay as HTMLElement)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when X button is clicked', async () => {
    const { onClose } = renderSidebar(true)
    const buttons = screen.getAllByRole('button')
    const closeBtn = buttons.find(b => b.querySelector('svg'))
    if (closeBtn) await userEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not render overlay when sidebar is closed', () => {
    renderSidebar(false)
    expect(document.querySelector('div[aria-hidden="true"]')).not.toBeInTheDocument()
  })

  it('renders header with Sua Seleção title', () => {
    renderSidebar(true, true)
    expect(screen.getByText('Sua Seleção')).toBeInTheDocument()
  })

  it('renders item names and quantity when items are in cart', async () => {
    renderSidebar(true, true)
    expect(await screen.findByText('Espresso')).toBeInTheDocument()
  })

  it('shows total and Finalizar Pedido in footer when items exist', async () => {
    renderSidebar(true, true)
    expect(await screen.findByText('Total')).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /finalizar pedido/i })).toBeInTheDocument()
  })

  it('increments quantity via plus button', async () => {
    renderSidebar(true, true)
    const espresso = await screen.findByText('Espresso')
    // Navigate up to the li element, then find buttons within it
    const li = espresso.closest('li')!
    const itemButtons = within(li).getAllByRole('button')
    // [0]=minus, [1]=plus, [2]=trash
    await userEvent.click(itemButtons[1])
  })

  it('removes item via trash button', async () => {
    renderSidebar(true, true)
    const espresso = await screen.findByText('Espresso')
    const li = espresso.closest('li')!
    const itemButtons = within(li).getAllByRole('button')
    await userEvent.click(itemButtons[2]) // trash
    expect(screen.queryByText('Espresso')).not.toBeInTheDocument()
  })

  it('opens order form when Finalizar Pedido is clicked', async () => {
    renderSidebar(true, true)
    const orderBtn = await screen.findByRole('button', { name: /finalizar pedido/i })
    await userEvent.click(orderBtn)
    expect(screen.getByTestId('order-form')).toBeInTheDocument()
  })
})
