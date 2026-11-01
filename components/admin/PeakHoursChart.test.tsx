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
    // 8 hour labels (every 3h) + 3 count labels for non-empty hours
    expect(container.querySelectorAll('text').length).toBe(11)
  })

  it('labels every third hour on the axis', () => {
    render(<PeakHoursChart data={[]} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('21')).toBeInTheDocument()
    expect(screen.queryByText('23')).not.toBeInTheDocument()
  })

  it('shows the order count above non-empty bars', () => {
    render(<PeakHoursChart data={[{ hour: 22, orderCount: 5 }] as never} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
