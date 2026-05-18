import { describe, expect, it, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '../utils/render'

const navigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => navigate }
})

vi.mock('@/services/auth', () => ({
  loginApi: vi.fn(async (creds: { email: string; password: string }) => {
    if (creds.email === 'admin@example.com' && creds.password === 'admin123') {
      return { token: 't', user: { id: '1', email: creds.email, name: 'admin', role: 'admin' } }
    }
    throw new Error('Invalid email or password')
  }),
}))

import { LoginScreen } from '@/modules/auth/LoginScreen'

beforeEach(() => {
  navigate.mockClear()
  localStorage.clear()
})

describe('LoginScreen', () => {
  it('renders email and password fields', () => {
    renderWithProviders(<LoginScreen />)
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('navigates to /dashboard on successful login', async () => {
    renderWithProviders(<LoginScreen />)
    await userEvent.type(screen.getByPlaceholderText('Enter your email'), 'admin@example.com')
    await userEvent.type(screen.getByPlaceholderText('Enter your password'), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }))
    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/dashboard'))
    expect(localStorage.getItem('token')).toBe('t')
  })
})
