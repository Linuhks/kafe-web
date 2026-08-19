import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import React from 'react'
import AdminOrderQueueClient from './AdminOrderQueueClient'
import { ToastProvider } from '@/context/ToastContext'
import type { OrderResponseDto } from '@/lib/api/generated/api'

const { mockQueue, mockList, mockUpdateStatus, mockMutateAsync } = vi.hoisted(() => ({
  mockQueue: vi.fn(),
  mockList: vi.fn(),
  mockUpdateStatus: vi.fn(),
  mockMutateAsync: vi.fn(),
}))

vi.mock('@/lib/api/generated/api', () => ({
  useOrdersControllerQueue: mockQueue,
  useOrdersControllerList: mockList,
  useOrdersControllerUpdateStatus: mockUpdateStatus,
}))

function makeOrder(overrides: Partial<OrderResponseDto>): OrderResponseDto {
  return {
    id: 'order-default-id',
    clientId: null,
    clientName: 'Cliente Padrão',
    baristaId: null,
    status: 'RECEIVED',
    notes: null,
    totalAmount: '10.00',
    items: [
      {
        id: 'item-1',
        orderId: 'order-default-id',
        productId: 'p1',
        productName: 'Espresso',
        quantity: 1,
        unitPrice: '10.00',
        totalPrice: '10.00',
        createdAt: '2026-08-01T10:00:00.000Z',
        updatedAt: '2026-08-01T10:00:00.000Z',
      },
    ],
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    ...overrides,
  }
}

const orderAna = makeOrder({
  id: 'order-aaa111',
  clientName: 'Ana',
  status: 'RECEIVED',
  createdAt: '2026-08-01T10:00:00.000Z',
})

const orderBruno = makeOrder({
  id: 'order-bbb222',
  clientName: 'Bruno',
  status: 'RECEIVED',
  createdAt: '2026-08-02T10:00:00.000Z',
  notes: 'Sem açúcar',
})

const orderCarla = makeOrder({
  id: 'order-ccc333',
  clientName: 'Carla',
  status: 'IN_PREPARATION',
  createdAt: '2026-08-01T09:00:00.000Z',
})

const orderReady = makeOrder({
  id: 'order-ddd444',
  clientName: null,
  status: 'READY',
  createdAt: '2026-08-01T08:00:00.000Z',
})

function setQueueData(orders: OrderResponseDto[], isPending = false) {
  mockQueue.mockReturnValue({
    data: { status: 200, data: orders },
    isPending,
    refetch: vi.fn(),
  })
}

function setReadyData(orders: OrderResponseDto[]) {
  mockList.mockReturnValue({
    data: { status: 200, data: { data: orders } },
    refetch: vi.fn(),
  })
}

function renderQueue() {
  return render(
    <ToastProvider>
      <AdminOrderQueueClient />
    </ToastProvider>,
  )
}

describe('AdminOrderQueueClient', () => {
  beforeEach(() => {
    mockMutateAsync.mockReset()
    mockMutateAsync.mockResolvedValue(undefined)
    mockUpdateStatus.mockReturnValue({ mutateAsync: mockMutateAsync, mutate: vi.fn() })
    setQueueData([orderAna, orderBruno, orderCarla])
    setReadyData([orderReady])
  })

  it('shows loading skeletons while the queue is pending', () => {
    setQueueData([], true)
    const { container } = renderQueue()
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
    expect(screen.queryByText('Ana')).not.toBeInTheDocument()
  })

  it('shows the empty state when there are no active orders', () => {
    setQueueData([])
    setReadyData([])
    renderQueue()
    expect(screen.getByText('Nenhum pedido ativo no momento.')).toBeInTheDocument()
  })

  it('renders orders split across the correct columns', () => {
    renderQueue()
    expect(screen.getByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
    expect(screen.getByText('Carla')).toBeInTheDocument()
    expect(screen.getByText('Cliente')).toBeInTheDocument() // fallback for null clientName
  })

  it('falls back to "Cliente" label and shows notes when present', () => {
    renderQueue()
    expect(screen.getByText(/Sem açúcar/)).toBeInTheDocument()
  })

  it('shows the "Sem pedidos em preparo" placeholder when that column is empty', () => {
    setQueueData([orderAna])
    renderQueue()
    expect(screen.getByText('Sem pedidos em preparo')).toBeInTheDocument()
  })

  it('shows the "Nenhum pedido pronto" placeholder when there is no ready order', () => {
    setReadyData([])
    renderQueue()
    expect(screen.getByText('Nenhum pedido pronto para entrega')).toBeInTheDocument()
  })

  it('filters orders by client name search', async () => {
    renderQueue()
    await userEvent.type(screen.getByPlaceholderText('Buscar por cliente...'), 'Bruno')
    expect(screen.getByText('Bruno')).toBeInTheDocument()
    expect(screen.queryByText('Ana')).not.toBeInTheDocument()
    expect(screen.queryByText('Cliente')).not.toBeInTheDocument()
  })

  it('switches the active category tab on click', async () => {
    renderQueue()
    const expressosTab = screen.getByRole('button', { name: 'Expressos' })
    await userEvent.click(expressosTab)
    expect(expressosTab.className).toContain('kafe-primary')
    // filtering by category is not implemented; orders stay visible
    expect(screen.getByText('Ana')).toBeInTheDocument()
  })

  it('sorts orders within a column when a sort option is selected', async () => {
    renderQueue()
    const namesBefore = screen.getAllByText(/^(Ana|Bruno)$/)
    expect(namesBefore[0]).toHaveTextContent('Bruno')
    expect(namesBefore[1]).toHaveTextContent('Ana')

    await userEvent.click(screen.getByRole('button', { name: /Mais recentes/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Mais antigos' }))

    const namesAfter = screen.getAllByText(/^(Ana|Bruno)$/)
    expect(namesAfter[0]).toHaveTextContent('Ana')
    expect(namesAfter[1]).toHaveTextContent('Bruno')
    expect(screen.getByRole('button', { name: /Mais antigos/ })).toBeInTheDocument()
  })

  it('opens the order detail modal when a card is clicked', async () => {
    renderQueue()
    await userEvent.click(screen.getByText('Ana'))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Ana')).toBeInTheDocument()
    expect(within(dialog).getByText('Espresso')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Iniciar preparo' })).toBeInTheDocument()
  })

  it('advances a RECEIVED order to IN_PREPARATION from the card button', async () => {
    setQueueData([orderAna])
    setReadyData([])
    renderQueue()
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar preparo' }))
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: orderAna.id,
      data: { status: 'IN_PREPARATION' },
    })
  })

  it('advances an IN_PREPARATION order to READY', async () => {
    renderQueue()
    await userEvent.click(screen.getByRole('button', { name: 'Concluir' }))
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: orderCarla.id,
      data: { status: 'READY' },
    })
  })

  it('marks a READY order as delivered', async () => {
    renderQueue()
    await userEvent.click(screen.getByRole('button', { name: 'Marcar como entregue' }))
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: orderReady.id,
      data: { status: 'DELIVERED' },
    })
  })

  it('cancels an order via the trash button without opening the modal', async () => {
    setQueueData([orderAna])
    setReadyData([])
    renderQueue()
    const [cancelBtn] = screen.getAllByRole('button', { name: 'Cancelar pedido' })
    await userEvent.click(cancelBtn)
    expect(mockMutateAsync).toHaveBeenCalledWith({
      id: orderAna.id,
      data: { status: 'CANCELLED' },
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('does not render a cancel button for READY orders', () => {
    setQueueData([])
    setReadyData([orderReady])
    renderQueue()
    expect(screen.queryByRole('button', { name: 'Cancelar pedido' })).not.toBeInTheDocument()
  })

  it('disables the advance button and shows "Atualizando..." while a mutation is pending', async () => {
    mockMutateAsync.mockReturnValue(new Promise(() => {}))
    setQueueData([orderAna])
    setReadyData([])
    renderQueue()
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar preparo' }))
    const pendingBtn = screen.getByRole('button', { name: 'Atualizando...' })
    expect(pendingBtn).toBeDisabled()
  })

  it('shows the total active order count in the footer stats', () => {
    renderQueue()
    expect(screen.getByText('Pedidos na Fila')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
