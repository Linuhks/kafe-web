import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
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
  if (email) await userEvent.type(screen.getByLabelText('Email address'), email)
  if (password) await userEvent.type(screen.getByLabelText('Password'), password)
  // fireEvent.submit bypasses jsdom's native HTML5 constraint validation
  // (which would block submission for invalid email values in type="email" inputs)
  const form = screen.getByLabelText('Email address').closest('form')!
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
    it('renders "Welcome back" heading and subtext', () => {
      renderLogin()
      expect(screen.getByText('Welcome back')).toBeInTheDocument()
      expect(screen.getByText('Sign in to continue your coffee journey.')).toBeInTheDocument()
    })

    it('renders email input, password input, and "Sign In" submit button', () => {
      renderLogin()
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    })

    it('renders "Forgot Password?" and "Create an account" links', () => {
      renderLogin()
      expect(screen.getByText('Forgot Password?')).toBeInTheDocument()
      expect(screen.getByText('Create an account')).toBeInTheDocument()
    })

    it('renders "Google" and "Apple" buttons', () => {
      renderLogin()
      expect(screen.getByRole('button', { name: /Google/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Apple/i })).toBeInTheDocument()
    })

    it('renders "or join the club" divider text', () => {
      renderLogin()
      expect(screen.getByText(/or join the club/i)).toBeInTheDocument()
    })

    it('renders footer text "© 2024 Kafe Roastery. All rights reserved."', () => {
      renderLogin()
      expect(screen.getByText('© 2024 Kafe Roastery. All rights reserved.')).toBeInTheDocument()
    })

    it('hero image has alt "The Ritual of Brewing"', () => {
      renderLogin()
      expect(screen.getByAltText('The Ritual of Brewing')).toBeInTheDocument()
    })
  })

  describe('password visibility toggle', () => {
    it('starts with type="password" and toggle aria-label "Show password"', () => {
      renderLogin()
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
    })

    it('clicking toggle changes type to "text" and aria-label to "Hide password"', async () => {
      renderLogin()
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }))
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
      expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()
    })

    it('clicking toggle twice returns type to "password"', async () => {
      renderLogin()
      await userEvent.click(screen.getByRole('button', { name: 'Show password' }))
      await userEvent.click(screen.getByRole('button', { name: 'Hide password' }))
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    })
  })

  describe('form validation', () => {
    it('submitting with non-email value shows "Invalid email"', async () => {
      renderLogin()
      await fillAndSubmit('notanemail', 'validpassword')
      await waitFor(() => expect(screen.getByText('Invalid email')).toBeInTheDocument())
    })

    it('submitting with short password shows "Password must be at least 8 characters"', async () => {
      renderLogin()
      await fillAndSubmit('test@example.com', 'short')
      await waitFor(() => expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument())
    })

    it('submitting empty form shows errors for both fields', async () => {
      renderLogin()
      const form = screen.getByLabelText('Email address').closest('form')!
      fireEvent.submit(form)
      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument()
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()
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
    it('non-200 response calls addToast with "Invalid email or password" and "error"', async () => {
      mockMutateAsync.mockResolvedValue({ status: 401 })
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith('Invalid email or password', 'error'))
    })

    it('mutateAsync throwing calls addToast with "Login failed. Please try again." and "error"', async () => {
      mockMutateAsync.mockRejectedValue(new Error('Network error'))
      renderLogin()
      await fillAndSubmit('test@example.com', 'password123')
      await waitFor(() => expect(mockAddToast).toHaveBeenCalledWith('Login failed. Please try again.', 'error'))
    })
  })

  describe('loading state', () => {
    it('when isPending=true, button text is "Signing in…" and button is disabled', () => {
      renderLogin({ isPending: true })
      const button = screen.getByRole('button', { name: 'Signing in…' })
      expect(button).toBeDisabled()
    })

    it('when isPending=false, button is not disabled and shows "Sign In"', () => {
      renderLogin()
      const button = screen.getByRole('button', { name: 'Sign In' })
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
