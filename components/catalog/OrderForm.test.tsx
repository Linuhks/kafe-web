import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import OrderForm from './OrderForm'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'

const { mockMutate, capturedMutation, mockToastError } = vi.hoisted(() => ({
  mockMutate: vi.fn(),
  capturedMutation: { ref: null as null | { onSuccess: (r: unknown) => void; onError: (e: unknown) => void } },
  mockToastError: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: mockToastError,
    warning: vi.fn(),
  }),
  Toaster: () => null,
}))

vi.mock('@/lib/api/generated/api', () => ({
  useOrdersControllerCreate: vi.fn((options: { mutation?: { onSuccess?: (r: unknown) => void; onError?: (e: unknown) => void } }) => {
    capturedMutation.ref = {
      onSuccess: options?.mutation?.onSuccess ?? (() => {}),
      onError: options?.mutation?.onError ?? (() => {}),
    }
    return { mutate: mockMutate, isPending: false }
  }),
}))

const mockOrder = {
  id: 'order-abc', clientId: null, clientName: null, baristaId: null,
  status: 'RECEIVED', notes: null, totalAmount: '5.50', items: [],
  createdAt: '', updatedAt: '',
}

function renderForm(isOpen = true) {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve(null) })),
  )
  const onClose = vi.fn()
  return {
    onClose,
    ...render(
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <OrderForm isOpen={isOpen} onClose={onClose} />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>,
    ),
  }
}

describe('OrderForm', () => {
  beforeEach(() => {
    sessionStorage.clear()
    mockMutate.mockReset()
    mockToastError.mockReset()
    vi.unstubAllGlobals()
  })

  it('does not render content when closed', () => {
    renderForm(false)
    expect(screen.queryByText('Finalizar pedido')).not.toBeInTheDocument()
  })

  it('renders the form title when open', () => {
    renderForm()
    expect(screen.getByText('Finalizar pedido')).toBeInTheDocument()
  })

  it('renders name and notes fields', () => {
    renderForm()
    expect(screen.getByLabelText(/Seu nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Observações/i)).toBeInTheDocument()
  })

  it('cancel button calls onClose', async () => {
    const { onClose } = renderForm()
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('submit button is disabled when cart is empty', () => {
    renderForm()
    expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeDisabled()
  })

  it('submits form data when cart has items', async () => {
    sessionStorage.setItem(
      'kafe_cart',
      JSON.stringify([{ product: { id: 'p1', name: 'Espresso', price: '5.50', isAvailable: true, categoryId: 'c1', description: null, imageUrl: null }, quantity: 1 }]),
    )
    renderForm()

    const submitBtn = await screen.findByRole('button', { name: /confirmar pedido/i })
    expect(submitBtn).not.toBeDisabled()

    await userEvent.type(screen.getByLabelText(/Seu nome/i), 'Ana')
    await userEvent.click(submitBtn)
    expect(mockMutate).toHaveBeenCalled()
  })

  it('shows confirmed order view on mutation success', async () => {
    renderForm()
    await act(async () => {
      capturedMutation.ref?.onSuccess({ status: 201, data: mockOrder })
    })
    expect(screen.getByText('Pedido confirmado!')).toBeInTheDocument()
    expect(screen.getByText(/Seu pedido foi recebido/i)).toBeInTheDocument()
  })

  it('calls error toast on mutation error', async () => {
    renderForm()
    await act(async () => {
      capturedMutation.ref?.onError(new Error('Network error'))
    })
    expect(mockToastError).toHaveBeenCalledWith('Erro ao criar pedido')
  })

  it('close button on confirmed order calls onClose', async () => {
    const { onClose } = renderForm()
    await act(async () => {
      capturedMutation.ref?.onSuccess({ status: 201, data: mockOrder })
    })
    await userEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
