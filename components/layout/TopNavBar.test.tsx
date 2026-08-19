import { describe, it, expect } from 'vitest'
import { render, screen } from '@/lib/test-utils'
import React from 'react'
import TopNavBar from './TopNavBar'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}))

describe('TopNavBar', () => {
  it('renders the Kafe brand link', () => {
    render(<TopNavBar />)
    expect(screen.getByRole('link', { name: 'Kafe' })).toHaveAttribute('href', '/')
  })

  it('renders all nav links', () => {
    render(<TopNavBar />)
    expect(screen.getByText('Loja')).toBeInTheDocument()
    expect(screen.getByText('Torrefação')).toBeInTheDocument()
    expect(screen.getByText('Nossa História')).toBeInTheDocument()
    expect(screen.getByText('Unidades')).toBeInTheDocument()
  })

  it('renders the user and cart action buttons', () => {
    render(<TopNavBar />)
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})
