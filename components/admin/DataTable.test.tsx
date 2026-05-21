import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { DataTable, type Column } from './DataTable'

type Item = { id: string; name: string; value: number }

const columns: Column<Item>[] = [
  { key: 'name', header: 'Name', sortable: true, render: (row) => row.name },
  { key: 'value', header: 'Value', sortable: true, render: (row) => String(row.value) },
]

const rows: Item[] = [
  { id: '1', name: 'Banana', value: 3 },
  { id: '2', name: 'Apple', value: 1 },
  { id: '3', name: 'Cherry', value: 2 },
]

describe('DataTable', () => {
  it('renders empty message when no rows', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowKey={(r) => r.id}
        totalItems={0}
        itemsPerPage={10}
        currentPage={1}
      />,
    )
    expect(screen.getByText('Nenhum item encontrado.')).toBeInTheDocument()
  })

  it('renders custom empty message', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        getRowKey={(r) => r.id}
        totalItems={0}
        itemsPerPage={10}
        currentPage={1}
        emptyMessage="No data here"
      />,
    )
    expect(screen.getByText('No data here')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        totalItems={3}
        itemsPerPage={10}
        currentPage={1}
      />,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('renders all row data', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        totalItems={3}
        itemsPerPage={10}
        currentPage={1}
      />,
    )
    expect(screen.getByText('Banana')).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Cherry')).toBeInTheDocument()
  })

  it('sorts by column ascending on first click', async () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        totalItems={3}
        itemsPerPage={10}
        currentPage={1}
      />,
    )
    await userEvent.click(screen.getByText('Name'))
    const cells = screen.getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('Apple')
  })

  it('toggles sort direction on second click', async () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.id}
        totalItems={3}
        itemsPerPage={10}
        currentPage={1}
      />,
    )
    await userEvent.click(screen.getByText('Name'))
    await userEvent.click(screen.getByText('Name'))
    const cells = screen.getAllByRole('cell')
    expect(cells[0]).toHaveTextContent('Cherry')
  })
})
