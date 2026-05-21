import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import UsersTable from './UsersTable'
import { ToastProvider } from '@/context/ToastContext'
import type { User } from '@/lib/types'

const { mockMutate } = vi.hoisted(() => ({ mockMutate: vi.fn() }))

vi.mock('@/lib/api/generated/api', () => ({
  useUsersControllerRemove: vi.fn(() => ({ mutate: mockMutate, isPending: false })),
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href }, children),
}))

const mockUsers: User[] = [
  { id: 'u1', name: 'Alice', email: 'alice@example.com', role: 'ADMIN', isActive: true, createdAt: '', updatedAt: '' },
  { id: 'u2', name: 'Bob', email: 'bob@example.com', role: 'BARISTA', isActive: false, createdAt: '', updatedAt: '' },
  { id: 'u3', name: 'Carol', email: 'carol@example.com', role: 'CLIENT', isActive: true, createdAt: '', updatedAt: '' },
]

function renderTable(users = mockUsers) {
  return render(
    <ToastProvider>
      <UsersTable users={users} />
    </ToastProvider>,
  )
}

describe('UsersTable', () => {
  beforeEach(() => mockMutate.mockReset())

  it('renders empty state when no users', () => {
    renderTable([])
    expect(screen.getByText('Nenhum usuário encontrado.')).toBeInTheDocument()
  })

  it('renders user names and emails', () => {
    renderTable()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
  })

  it('renders role badges', () => {
    renderTable()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Barista')).toBeInTheDocument()
    expect(screen.getByText('Cliente')).toBeInTheDocument()
  })

  it('renders active and inactive status badges', () => {
    renderTable()
    expect(screen.getAllByText('Ativo').length).toBeGreaterThan(0)
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })

  it('opens confirm modal on delete click', async () => {
    renderTable()
    const deleteButtons = screen.getAllByRole('button', { name: /remover/i })
    await userEvent.click(deleteButtons[0])
    expect(screen.getByText('Remover usuário')).toBeInTheDocument()
  })

  it('calls removeUser mutation on confirm', async () => {
    renderTable()
    const deleteButtons = screen.getAllByRole('button', { name: /remover/i })
    await userEvent.click(deleteButtons[0])
    const dialog = screen.getByRole('dialog')
    const confirmBtn = within(dialog).getByRole('button', { name: /^remover$/i })
    await userEvent.click(confirmBtn)
    expect(mockMutate).toHaveBeenCalledWith({ id: 'u1' })
  })
})
