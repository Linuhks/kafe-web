import { describe, it, expect } from 'vitest'
import { render, screen } from '@/lib/test-utils'
import React from 'react'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders with text content', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders status label when status prop is provided', () => {
    render(<Badge status="RECEIVED" />)
    expect(screen.getByText('Recebido')).toBeInTheDocument()
  })

  it('renders with destructive variant', () => {
    render(<Badge variant="destructive">Error</Badge>)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
})
