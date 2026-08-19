import { describe, it, expect } from 'vitest'
import { render, screen } from '@/lib/test-utils'
import React from 'react'
import Footer from './Footer'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}))

describe('Footer', () => {
  it('renders the Kafe wordmark', () => {
    render(<Footer />)
    expect(screen.getByText('Kafe')).toBeInTheDocument()
  })

  it('renders all footer links', () => {
    render(<Footer />)
    expect(screen.getByText('Política de Privacidade')).toBeInTheDocument()
    expect(screen.getByText('Termos de Serviço')).toBeInTheDocument()
    expect(screen.getByText('Contato')).toBeInTheDocument()
    expect(screen.getByText('Atacado')).toBeInTheDocument()
  })

  it('renders the copyright notice', () => {
    render(<Footer />)
    expect(screen.getByText(/Todos os direitos reservados/)).toBeInTheDocument()
  })
})
