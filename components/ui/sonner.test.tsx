import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

vi.mock('sonner', () => ({
  Toaster: ({ theme }: { theme: string }) =>
    React.createElement('div', { 'data-testid': 'toaster', 'data-theme': theme }),
}))

describe('Toaster', () => {
  it('renders without crashing', async () => {
    const { Toaster } = await import('./sonner')
    const { container } = render(<Toaster />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
