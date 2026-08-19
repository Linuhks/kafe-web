import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import DashboardInventoryAlerts from './DashboardInventoryAlerts'
import type { InventoryAlert } from '@/lib/api/inventory'

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () => {
    const dict: Record<string, string> = {
      title: 'Alertas de Estoque',
      restockNow: 'Reabastecer Agora',
    }
    return (key: string, values?: { count?: number }) => {
      if (key === 'itemsCritical') return `${values?.count} itens críticos`
      return dict[key] ?? key
    }
  }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}))

const alerts: InventoryAlert[] = [
  { id: 'i1', name: 'Leite', unit: 'L', currentStock: 2, minimumStock: 10, stockPct: 10 },
  { id: 'i2', name: 'Café', unit: 'kg', currentStock: 8, minimumStock: 10, stockPct: 40 },
]

describe('DashboardInventoryAlerts', () => {
  it('renders nothing when there are no alerts', async () => {
    const element = await DashboardInventoryAlerts({ alerts: [] })
    const { container } = render(<>{element}</>)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the title and critical item count', async () => {
    const element = await DashboardInventoryAlerts({ alerts })
    render(<>{element}</>)
    expect(screen.getByText('Alertas de Estoque')).toBeInTheDocument()
    expect(screen.getByText('2 itens críticos')).toBeInTheDocument()
  })

  it('renders each alert with its stock and unit', async () => {
    const element = await DashboardInventoryAlerts({ alerts })
    render(<>{element}</>)
    expect(screen.getByText('Leite')).toBeInTheDocument()
    expect(screen.getByText('2 L')).toBeInTheDocument()
    expect(screen.getByText('Café')).toBeInTheDocument()
    expect(screen.getByText('8 kg')).toBeInTheDocument()
  })

  it('renders a restock link for every alert', async () => {
    const element = await DashboardInventoryAlerts({ alerts })
    render(<>{element}</>)
    const links = screen.getAllByRole('link', { name: 'Reabastecer Agora' })
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/admin/inventory')
  })
})
