import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@/lib/test-utils'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { useRouter } from 'next/navigation'
import LoginPage from './page'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useAuthControllerLogin } from '@/lib/api/generated/api'

const { mockSetUser, mockAddToast, mockMutateAsync, mockPush } = vi.hoisted(() => ({
  mockSetUser: vi.fn(),
  mockAddToast: vi.fn(),
  mockMutateAsync: vi.fn(),
  mockPush: vi.fn(),
}))

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/context/ToastContext', () => ({
  useToast: vi.fn(),
}))

vi.mock('@/lib/api/generated/api', () => ({
  useAuthControllerLogin: vi.fn(),
}))

function renderLogin({ isPending = false } = {}) {
  vi.mocked(useAuth).mockReturnValue({ setUser: mockSetUser, user: null, logout: vi.fn() })
  vi.mocked(useToast).mockReturnValue({ addToast: mockAddToast })
  vi.mocked(useAuthControllerLogin).mockReturnValue({ mutateAsync: mockMutateAsync, isPending } as any)
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })
  return render(<LoginPage />)
}

async function fillAndSubmit(email: string, password: string) {
  if (email) await userEvent.type(screen.getByLabelText('Endereço de E-mail'), email)
  if (password) await userEvent.type(screen.getByLabelText('Senha'), password)
  // fireEvent.submit bypasses jsdom's native HTML5 constraint validation
  // (which would block submission for invalid email values in type="email" inputs)
  const form = screen.getByLabelText('Endereço de E-mail').closest('form')!
  fireEvent.submit(form)
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('static structure', () => {
    it('renders "Bem-vindo de volta" heading and subtext', () => {
      renderLogin()
      expect(screen.getByText('Bem-vindo de volta')).toBeInTheDocument()
      expect(screen.getByText('Entre para continuar sua jornada no café.')).toBeInTheDocument()
    })

    it('renders email input, password input, and "Entrar" submit button', () => {
      renderLogin()
      expect(screen.getByLabelText('Endereço de E-mail')).toBeInTheDocument()
      expect(screen.getByLabelText('Senha')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    })

    it('renders "Esqueceu a senha?" and "Criar uma conta" links', () => {
      renderLogin()
      expect(screen.getByText('Esqueceu a senha?')).toBeInTheDocument()
      expect(screen.getByText('Criar uma conta')).toBeInTheDocument()
    })

    it('renders "Google" and "Apple" buttons', () => {
      renderLogin()
      expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Apple/i })).toBeInTheDocument()
    })

    it('renders "ou junte-se ao clube" divider text', () => {
      renderLogin()
      expect(screen.getByText(/ou junte-se ao clube/i)).toBeInTheDocument()
    })

    it('renders footer text "© 2024 Kafe Roastery. Todos os direitos reservados."', () => {
      renderLogin()
      expect(screen.getByText('© 2024 Kafe Roastery. Todos os direitos reservados.')).toBeInTheDocument()
    })

    it('hero image has alt "O Ritual do Preparo"', () => {
      renderLogin()
      expect(screen.getByAltText('O Ritual do Preparo')).toBeInTheDocument()
    })
  })

  describe('password visibility toggle', () => {
    it('starts with type="password" and toggle aria-label "Mostrar senha"', () => {
      renderLogin()
      expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
      expect(screen.getByRole('button', { name: 'Mostrar senha' })).toBeInTheDocument()
    })

    it('clicking toggle changes type to "text" and aria-label to "Ocultar senha"', async () => {
      renderLogin()
      await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }))
      expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text')
      expect(screen.getByRole('button', { name: 'Ocultar senha' })).toBeInTheDocument()
    })

    it('clicking toggle twice returns type to "password"', async () => {
      renderLogin()
      await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }))
      await userEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }))
      expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    })
  })

  describe('form validation', () => {
    it('submitting with non-email value shows "E-mail inválido"', async () => {
      renderLogin()
      await fillAndSubmit('notanemail', 'validpassword')
      await waitFor(() => expect(screen.getByText('E-mail inválido')).toBeInTheDocument())
    })

    it('submitting with short password shows "A senha deve ter pelo menos 8 caracteres"', async () => {
      renderLogin()
      await fillAndSubmit('test@example.com', 'short')
      await waitFor(() => expect(screen.getByText('A senha deve ter pelo menos 8 caracteres')).toBeInTheDocument())
    })

    it('submitting empty form shows errors for both fields', async () => {
      renderLogin()
      const form = screen.getByLabelText('Endereço de E-mail').closest('form')!
      fireEvent.submit(form)
      await waitFor(() => {
        expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
        expect(screen.getByText('A senha deve ter pelo menos 8 caracteres')).toBeInTheDocument()
      })
    })
  })

  describe('successful login', () => {
    const baseUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      isActive: true,
      createdAt: '',
      updatedAt: '',
    }

    it('ADMIN role redirects to "/admin/dashboard"', async () => {
      mockMutateAsync.mockResolvedValue({ status: 200, data: { token: 'tok', user: { ...baseUser, role: 'ADMIN' } } })
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/admin/dashboard'))
    })

    it('BARISTA role redirects to "/barista/queue"', async () => {
      mockMutateAsync.mockResolvedValue({ status: 200, data: { token: 'tok', user: { ...baseUser, role: 'BARISTA' } } })
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/barista/queue'))
    })

    it('CLIENT role redirects to "/orders/me"', async () => {
      mockMutateAsync.mockResolvedValue({ status: 200, data: { token: 'tok', user: { ...baseUser, role: 'CLIENT' } } })
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/orders/me'))
    })

    it('calls fetch with "/api/auth/login" POST with token', async () => {
      mockMutateAsync.mockResolvedValue({ status: 200, data: { token: 'mytoken', user: { ...baseUser, role: 'CLIENT' } } })
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() =>
        expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: 'mytoken' }),
        }),
      )
    })

    it('calls setUser with the user from the response', async () => {
      const mockUser = { ...baseUser, role: 'CLIENT' }
      mockMutateAsync.mockResolvedValue({ status: 200, data: { token: 'tok', user: mockUser } })
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockSetUser).toHaveBeenCalledWith(mockUser))
    })
  })

  describe('error handling', () => {
    it('non-200 response calls addToast with "E-mail ou senha inválidos" and "error"', async () => {
      mockMutateAsync.mockResolvedValue({ status: 401 })
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith('E-mail ou senha inválidos', 'error'))
    })

    it('mutateAsync throwing calls addToast with "Falha no login. Tente novamente." and "error"', async () => {
      mockMutateAsync.mockRejectedValue(new Error('Network error'))
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith('Falha no login. Tente novamente.', 'error'))
    })
  })

  describe('loading state', () => {
    it('when isPending=true, button text is "Entrando…" and button is disabled', () => {
      renderLogin({ isPending: true })
      const button = screen.getByRole('button', { name: 'Entrando…' })
      expect(button).toBeDisabled()
    })

    it('when isPending=false, button is not disabled and shows "Entrar"', () => {
      renderLogin()
      const button = screen.getByRole('button', { name: 'Entrar' })
      expect(button).not.toBeDisabled()
    })
  })

  describe('social buttons', () => {
    it('Google button has type="button"', () => {
      renderLogin()
      expect(screen.getByRole('button', { name: /Google/i })).toHaveAttribute('type', 'button')
    })

    it('Apple button has type="button"', () => {
      renderLogin()
      expect(screen.getByRole('button', { name: /Apple/i })).toHaveAttribute('type', 'button')
    })
  })
})
