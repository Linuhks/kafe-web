import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import OrderQueueCard from './OrderQueueCard'
import type { OrderResponseDto } from '@/lib/api/generated/api'

const baseOrder: OrderResponseDto = {
  id: 'abc12345-6789-abcd-ef01-234567890abc',
  clientId: null,
  clientName: 'Maria',
  baristaId: null,
  status: 'RECEIVED',
  notes: null,
  totalAmount: '11.00',
  items: [
    {
      id: 'item1',
      orderId: 'abc12345-6789-abcd-ef01-234567890abc',
      productId: 'p1',
      productName: 'Espresso',
      quantity: 2,
      unitPrice: '5.50',
      totalPrice: '11.00',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('OrderQueueCard', () => {
  it('renders the client name', () => {
    render(
      <OrderQueueCard order={baseOrder} updatingId={null} onStatusUpdate={vi.fn()} />,
    )
    expect(screen.getByText('Maria')).toBeInTheDocument()
  })

  it('shows "Anônimo" when clientName is null', () => {
    render(
      <OrderQueueCard
        order={{ ...baseOrder, clientName: null }}
        updatingId={null}
        onStatusUpdate={vi.fn()}
      />,
    )
    expect(screen.getByText('Anônimo')).toBeInTheDocument()
  })

  it('renders item names', () => {
    render(
      <OrderQueueCard order={baseOrder} updatingId={null} onStatusUpdate={vi.fn()} />,
    )
    expect(screen.getByText('Espresso')).toBeInTheDocument()
  })

  it('renders the status badge', () => {
    render(
      <OrderQueueCard order={baseOrder} updatingId={null} onStatusUpdate={vi.fn()} />,
    )
    expect(screen.getByText('Recebido')).toBeInTheDocument()
  })

  it('shows notes when present', () => {
    render(
      <OrderQueueCard
        order={{ ...baseOrder, notes: 'Sem açúcar' }}
        updatingId={null}
        onStatusUpdate={vi.fn()}
      />,
    )
    expect(screen.getByText(/Sem açúcar/)).toBeInTheDocument()
  })

  it('shows Cancelar button for active orders', () => {
    render(
      <OrderQueueCard order={baseOrder} updatingId={null} onStatusUpdate={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('does not show Cancelar for DELIVERED orders', () => {
    render(
      <OrderQueueCard
        order={{ ...baseOrder, status: 'DELIVERED' }}
        updatingId={null}
        onStatusUpdate={vi.fn()}
      />,
    )
    expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument()
  })

  it('opens confirm dialog on cancel click', async () => {
    render(
      <OrderQueueCard order={baseOrder} updatingId={null} onStatusUpdate={vi.fn()} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(screen.getByText('Cancelar pedido?')).toBeInTheDocument()
  })

  it('calls onStatusUpdate with CANCELLED when confirm cancel is clicked', async () => {
    const onStatusUpdate = vi.fn().mockResolvedValue(undefined)
    render(
      <OrderQueueCard order={baseOrder} updatingId={null} onStatusUpdate={onStatusUpdate} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    await userEvent.click(screen.getByRole('button', { name: /confirmar cancelamento/i }))
    await waitFor(() =>
      expect(onStatusUpdate).toHaveBeenCalledWith(baseOrder.id, 'CANCELLED'),
    )
  })

  it('disables cancel button when isUpdating for this order', () => {
    render(
      <OrderQueueCard
        order={baseOrder}
        updatingId={baseOrder.id}
        onStatusUpdate={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled()
  })

  it('shows truncated order id', () => {
    render(
      <OrderQueueCard order={baseOrder} updatingId={null} onStatusUpdate={vi.fn()} />,
    )
    expect(screen.getByText(/abc12345…/)).toBeInTheDocument()
  })
})
