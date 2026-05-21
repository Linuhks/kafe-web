import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import StatusButton from './StatusButton'

describe('StatusButton', () => {
  it('renders "Iniciar preparo" for RECEIVED status', () => {
    render(
      <StatusButton
        orderId="o1"
        currentStatus="RECEIVED"
        onUpdate={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.getByRole('button', { name: /iniciar preparo/i })).toBeInTheDocument()
  })

  it('renders "Marcar como pronto" for IN_PREPARATION status', () => {
    render(
      <StatusButton
        orderId="o1"
        currentStatus="IN_PREPARATION"
        onUpdate={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.getByRole('button', { name: /marcar como pronto/i })).toBeInTheDocument()
  })

  it('renders "Entregar" for READY status', () => {
    render(
      <StatusButton
        orderId="o1"
        currentStatus="READY"
        onUpdate={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(screen.getByRole('button', { name: /entregar/i })).toBeInTheDocument()
  })

  it('calls onUpdate with orderId and next status when clicked', async () => {
    const onUpdate = vi.fn().mockResolvedValue(undefined)
    render(
      <StatusButton
        orderId="o1"
        currentStatus="RECEIVED"
        onUpdate={onUpdate}
        isUpdating={false}
      />,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onUpdate).toHaveBeenCalledWith('o1', 'IN_PREPARATION')
  })

  it('renders nothing for DELIVERED status (no further transition)', () => {
    const { container } = render(
      <StatusButton
        orderId="o1"
        currentStatus="DELIVERED"
        onUpdate={vi.fn()}
        isUpdating={false}
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('disables button and shows spinner when isUpdating is true', () => {
    render(
      <StatusButton
        orderId="o1"
        currentStatus="RECEIVED"
        onUpdate={vi.fn()}
        isUpdating={true}
      />,
    )
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
