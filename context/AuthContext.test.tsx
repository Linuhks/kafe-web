import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { AuthProvider, useAuth } from './AuthContext'

function AuthConsumer() {
  const { user, setUser, logout } = useAuth()
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <button onClick={() => setUser({ id: '1', email: 'a@b.com', name: 'Ana', role: 'CLIENT' })}>
        set user
      </button>
      <button onClick={() => logout()}>logout</button>
    </div>
  )
}

function renderAuth() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>,
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url === '/api/auth/session') {
          return Promise.resolve({ ok: false, json: () => Promise.resolve(null) })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts with null user', async () => {
    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('null'))
  })

  it('updates user via setUser', async () => {
    renderAuth()
    await waitFor(() => screen.getByTestId('user'))
    await userEvent.click(screen.getByText('set user'))
    expect(screen.getByTestId('user')).toHaveTextContent('a@b.com')
  })

  it('clears user after logout', async () => {
    renderAuth()
    await userEvent.click(screen.getByText('set user'))
    await userEvent.click(screen.getByText('logout'))
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('null'))
  })

  it('calls POST /api/auth/logout on logout', async () => {
    renderAuth()
    await userEvent.click(screen.getByText('logout'))
    expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
  })

  it('populates user from session on mount when session API returns a user', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: { id: '2', email: 'x@y.com', name: 'X', role: 'ADMIN' } }),
        }),
      ),
    )

    renderAuth()
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('x@y.com'))
  })

  it('throws when useAuth is called outside AuthProvider', () => {
    const consoleError = console.error
    console.error = () => {}
    expect(() => render(<AuthConsumer />)).toThrow('useAuth must be used within AuthProvider')
    console.error = consoleError
  })
})
