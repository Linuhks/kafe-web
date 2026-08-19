import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import React from 'react'
import GenerateReportButton from './GenerateReportButton'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}))

describe('GenerateReportButton', () => {
  it('renders the button label', () => {
    render(<GenerateReportButton />)
    expect(screen.getByRole('button', { name: 'Gerar Relatório' })).toBeInTheDocument()
  })

  it('shows a success toast when clicked', async () => {
    render(<GenerateReportButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Gerar Relatório' }))
    expect(toast.success).toHaveBeenCalledWith('Geração de relatório iniciada')
  })
})
