import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import NavBar from './NavBar'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
  Toaster: () => null,
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [k: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

vi.mock('@/components/catalog/CartSidebar', () => ({
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? React.createElement('div', { 'data-testid': 'cart-sidebar' }) : null,
}))

function renderNavBar() {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve(null) })),
  )
  return render(
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <NavBar />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>,
  )
}

describe('NavBar', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.unstubAllGlobals()
  })

  it('renders the Kafe brand name', () => {
    renderNavBar()
    expect(screen.getByText('Kafe')).toBeInTheDocument()
  })

  it('renders the Carrinho button when no user is logged in', async () => {
    renderNavBar()
    expect(await screen.findByRole('button', { name: /carrinho/i })).toBeInTheDocument()
  })

  it('opens CartSidebar when cart button is clicked', async () => {
    renderNavBar()
    const cartBtn = await screen.findByRole('button', { name: /carrinho/i })
    await userEvent.click(cartBtn)
    expect(screen.getByTestId('cart-sidebar')).toBeInTheDocument()
  })

  it('does not show logout button when no user', () => {
    renderNavBar()
    expect(screen.queryByTitle('Sair')).not.toBeInTheDocument()
  })
})
