import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import PeakHoursChart from './PeakHoursChart'

describe('PeakHoursChart', () => {
  it('renders an SVG element', () => {
    render(<PeakHoursChart data={[]} />)
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('has accessibility label', () => {
    render(<PeakHoursChart data={[]} />)
    expect(screen.getByLabelText('Pedidos por hora do dia')).toBeInTheDocument()
  })

  it('renders 24 hour bars', () => {
    render(<PeakHoursChart data={[]} />)
    const rects = document.querySelectorAll('rect')
    expect(rects.length).toBe(24)
  })

  it('renders bars with data', () => {
    const data = [
      { hour: 8, orderCount: 15 },
      { hour: 12, orderCount: 30 },
      { hour: 18, orderCount: 20 },
    ] as never
    const { container } = render(<PeakHoursChart data={data} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
    // 24 hour labels + 24 bars
    expect(container.querySelectorAll('text').length).toBe(24)
  })

  it('renders hour labels 0-23', () => {
    render(<PeakHoursChart data={[]} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('23')).toBeInTheDocument()
  })
})
