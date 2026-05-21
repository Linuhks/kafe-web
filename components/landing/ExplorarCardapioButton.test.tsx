import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { ExplorarCardapioButton } from './ExplorarCardapioButton'
import { useRouter } from 'next/navigation'

describe('ExplorarCardapioButton', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    mockPush.mockReset()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>)
  })

  it('renders the explore button text', () => {
    render(<ExplorarCardapioButton />)
    expect(screen.getByText(/Explorar Cardápio/i)).toBeInTheDocument()
  })

  it('navigates to /cardapio on click', async () => {
    render(<ExplorarCardapioButton />)
    await userEvent.click(screen.getByRole('button'))
    expect(mockPush).toHaveBeenCalledWith('/cardapio')
  })

  it('shows loading state after click', async () => {
    render(<ExplorarCardapioButton />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText(/Carregando/i)).toBeInTheDocument()
  })

  it('disables the button in loading state', async () => {
    render(<ExplorarCardapioButton />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
