import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
const { useNavigate } = await import('react-router-dom')

describe('Login page integration', () => {
  let originalAlert

  beforeEach(() => {
    originalAlert = window.alert
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    window.alert = originalAlert
    vi.restoreAllMocks()
  })

  it('should disable submit button when email is empty', async () => {
    render(<Login />)

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    expect(submitButton).toBeDisabled()
  })

  it('should disable submit button when password is empty', async () => {
    render(<Login />)

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    expect(submitButton).toBeDisabled()
    expect(loginUser).not.toHaveBeenCalled()
  })

  it('should disable submit button when email format is invalid', async () => {
    render(<Login />)

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'invalid-email')
    await userEvent.type(screen.getByLabelText('Contraseña', { selector: 'input' }), 'Abc12345!')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    expect(submitButton).toBeDisabled()
    expect(loginUser).not.toHaveBeenCalled()
  })

  it('should submit the login form when credentials are valid', async () => {
    const navigate = vi.fn()
    useNavigate.mockReturnValue(navigate)
    loginUser.mockResolvedValue({ token: 'abc' })

    render(<Login />)

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Contraseña', { selector: 'input' }), 'Abc12345!')
    await userEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(loginUser).toHaveBeenCalledWith({ correo: 'test@example.com', password: 'Abc12345!' })
    expect(navigate).toHaveBeenCalledWith('/')
  })
})