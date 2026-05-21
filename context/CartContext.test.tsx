import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { CartProvider, useCart } from './CartContext'
import type { Product } from '@/lib/types'

const mockProduct: Product = {
  id: 'p1',
  name: 'Espresso',
  price: '5.50',
  description: null,
  imageUrl: null,
  isAvailable: true,
  categoryId: 'cat1',
}

const mockProduct2: Product = {
  id: 'p2',
  name: 'Cappuccino',
  price: '8.00',
  description: null,
  imageUrl: null,
  isAvailable: true,
  categoryId: 'cat1',
}

function CartConsumer() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart()
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="total">{total.toFixed(2)}</span>
      {items.map(i => (
        <div key={i.product.id} data-testid={`item-${i.product.id}`}>
          {i.product.name} x{i.quantity}
        </div>
      ))}
      <button onClick={() => addItem(mockProduct)}>add p1</button>
      <button onClick={() => addItem(mockProduct2)}>add p2</button>
      <button onClick={() => removeItem('p1')}>remove p1</button>
      <button onClick={() => updateQuantity('p1', 3)}>qty 3</button>
      <button onClick={() => updateQuantity('p1', 0)}>qty 0</button>
      <button onClick={() => clearCart()}>clear</button>
    </div>
  )
}

function renderCart() {
  return render(
    <CartProvider>
      <CartConsumer />
    </CartProvider>,
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('adds a new product with quantity 1', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    expect(screen.getByTestId('item-p1')).toHaveTextContent('Espresso x1')
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('increments quantity for existing product', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('add p1'))
    expect(screen.getByTestId('item-p1')).toHaveTextContent('Espresso x2')
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('removes a product from the cart', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('remove p1'))
    expect(screen.queryByTestId('item-p1')).not.toBeInTheDocument()
  })

  it('updates quantity of a product', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('qty 3'))
    expect(screen.getByTestId('item-p1')).toHaveTextContent('Espresso x3')
  })

  it('removes product when quantity is set to 0', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('qty 0'))
    expect(screen.queryByTestId('item-p1')).not.toBeInTheDocument()
  })

  it('clears all items', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('add p2'))
    await userEvent.click(screen.getByText('clear'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('calculates total correctly', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('add p2'))
    // 2 * 5.50 + 1 * 8.00 = 19.00
    expect(screen.getByTestId('total')).toHaveTextContent('19.00')
  })

  it('sums itemCount across all quantities', async () => {
    renderCart()
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('add p1'))
    await userEvent.click(screen.getByText('add p2'))
    expect(screen.getByTestId('count')).toHaveTextContent('3')
  })

  it('restores cart from sessionStorage on mount', () => {
    const stored = JSON.stringify([{ product: mockProduct, quantity: 2 }])
    sessionStorage.setItem('kafe_cart', stored)

    renderCart()
    expect(screen.getByTestId('item-p1')).toHaveTextContent('Espresso x2')
  })

  it('throws when useCart is called outside CartProvider', () => {
    const consoleError = console.error
    console.error = () => {}
    expect(() => render(<CartConsumer />)).toThrow('useCart must be used within CartProvider')
    console.error = consoleError
  })
})
