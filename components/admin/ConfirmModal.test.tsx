import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ConfirmModal from './ConfirmModal'

function renderModal(props: Partial<React.ComponentProps<typeof ConfirmModal>> = {}) {
  const defaults = {
    open: true,
    onOpenChange: vi.fn(),
    message: 'Tem certeza?',
    onConfirm: vi.fn(),
  }
  return render(<ConfirmModal {...defaults} {...props} />)
}

describe('ConfirmModal', () => {
  it('does not render content when open is false', () => {
    renderModal({ open: false })
    expect(screen.queryByText('Tem certeza?')).not.toBeInTheDocument()
  })

  it('renders the message when open is true', () => {
    renderModal()
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
  })

  it('renders the default title', () => {
    renderModal()
    expect(screen.getByText('Confirmar ação')).toBeInTheDocument()
  })

  it('renders a custom title when provided', () => {
    renderModal({ title: 'Excluir item' })
    expect(screen.getByText('Excluir item')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    renderModal({ onConfirm })
    await userEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onOpenChange(false) when cancel button is clicked', async () => {
    const onOpenChange = vi.fn()
    renderModal({ onOpenChange })
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('disables both buttons when loading', () => {
    renderModal({ loading: true })
    const buttons = screen.getAllByRole('button')
    buttons.forEach(btn => expect(btn).toBeDisabled())
  })
})
