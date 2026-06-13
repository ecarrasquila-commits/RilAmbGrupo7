import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../../src/pages/authentication/login'

vi.mock('../../../src/services/authService', () => ({
  loginUser: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: vi.fn(),
}))

const { loginUser } = await import('../../../src/services/authService')

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ======================================================
  // Validation: required fields and input formats
  // ======================================================

  it('should disable submit button when email is empty', async () => {
    render(<Login />)

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    expect(submitButton).toBeDisabled()
  })

  it('should disable submit button when password is empty', async () => {
    render(<Login />)

    const emailInput = screen.getByLabelText('Correo electrónico')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')

    expect(emailInput).toHaveValue('test@example.com')
    expect(submitButton).toBeDisabled()
    expect(loginUser).not.toHaveBeenCalled()
  })

  it('should disable submit and not call loginUser when email format is invalid', async () => {
    render(<Login />)

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.type(passwordInput, 'password123')

    expect(submitButton).toBeDisabled()
    expect(emailInput).toHaveValue('invalid-email')
    expect(loginUser).not.toHaveBeenCalled()
  })

  it('should require a password value before enabling submit', async () => {
    render(<Login />)

    const emailInput = screen.getByLabelText('Correo electrónico')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')

    expect(submitButton).toBeDisabled()
    expect(loginUser).not.toHaveBeenCalled()
  })

  // Note: the login form currently validates password presence only, not a specific character pattern.

  // ======================================================
  // Success path
  // ======================================================

  it('should call loginUser when form is valid', async () => {
    loginUser.mockResolvedValue({ access_token: 'token' })

    render(<Login />)

    const emailInput = screen.getByLabelText('Correo electrónico')
    const passwordInput = screen.getByLabelText('Contraseña')
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    expect(submitButton).toBeEnabled()

    await userEvent.click(submitButton)

    expect(loginUser).toHaveBeenCalledWith({
      correo: 'test@example.com',
      password: 'password123',
    })
  })

  // ======================================================
  // UI behavior
  // ======================================================

  it('should toggle password visibility', async () => {
    render(<Login />)

    const passwordInput = screen.getByLabelText('Contraseña')
    const visibilityButton = screen.getByRole('button', {
      name: /mostrar contraseña/i,
    })

    await userEvent.type(passwordInput, 'password123')

    expect(passwordInput).toHaveAttribute('type', 'password')
    await userEvent.click(visibilityButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(
      screen.getByRole('button', { name: /ocultar contraseña/i })
    ).toBeInTheDocument()
  })

  // ======================================================
  // Navigation links (unit-level verification of routing anchors)
  // ======================================================

  it('should render links to password recovery and registration', async () => {
    render(<Login />)

    expect(
      screen.getByRole('link', { name: /olvidaste tu contraseña/i })
    ).toHaveAttribute('href', '/recover-password')

    expect(
      screen.getByRole('link', { name: /crear cuenta/i })
    ).toHaveAttribute('href', '/register')
  })
})
