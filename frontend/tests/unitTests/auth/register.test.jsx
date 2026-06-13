import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Register from '../../../src/pages/authentication/register'

vi.mock('../../../src/services/authService', () => ({
  registerUser: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: vi.fn(),
}))

const { registerUser } = await import('../../../src/services/authService')

describe('Register Component', () => {
  let originalLocation

  beforeEach(() => {
    originalLocation = window.location
    delete window.location
    window.location = { href: '' }
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  afterEach(() => {
    window.location = originalLocation
    vi.restoreAllMocks()
  })

  // ======================================================
  // Validation: required fields and input formats
  // ======================================================

  it('should disable submit when required fields are missing', async () => {
    render(<Register />)

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })

    expect(submitButton).toBeDisabled()
    expect(registerUser).not.toHaveBeenCalled()
  })

  it('should disable submit when names contain invalid characters or numeric fields are non-digit', async () => {
    render(<Register />)

    await userEvent.type(screen.getByLabelText(/nombres/i), 'Juan1')
    await userEvent.type(screen.getByLabelText(/apellidos/i), 'Pérez#')
    await userEvent.type(screen.getByLabelText(/cédula/i), 'abc123')
    await userEvent.type(screen.getByLabelText(/teléfono/i), '123abc')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Abc12345!')
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'Abc12345!')

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    expect(submitButton).toBeDisabled()
    expect(registerUser).not.toHaveBeenCalled()
  })

  it('should disable submit when email format is invalid', async () => {
    render(<Register />)

    await userEvent.type(screen.getByLabelText(/nombres/i), 'Juan')
    await userEvent.type(screen.getByLabelText(/apellidos/i), 'Pérez')
    await userEvent.type(screen.getByLabelText(/cédula/i), '1234567890')
    await userEvent.type(screen.getByLabelText(/teléfono/i), '3001234567')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@invalid')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Abc12345!')
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'Abc12345!')

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    expect(submitButton).toBeDisabled()
    expect(registerUser).not.toHaveBeenCalled()
  })

  it('should disable submit when password does not meet complexity requirements', async () => {
    render(<Register />)

    await userEvent.type(screen.getByLabelText(/nombres/i), 'Juan')
    await userEvent.type(screen.getByLabelText(/apellidos/i), 'Pérez')
    await userEvent.type(screen.getByLabelText(/cédula/i), '1234567890')
    await userEvent.type(screen.getByLabelText(/teléfono/i), '3001234567')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'password')
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'password')

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    expect(submitButton).toBeDisabled()
    expect(registerUser).not.toHaveBeenCalled()
  })

  it('should disable submit when passwords do not match', async () => {
    render(<Register />)

    await userEvent.type(screen.getByLabelText(/nombres/i), 'Juan')
    await userEvent.type(screen.getByLabelText(/apellidos/i), 'Pérez')
    await userEvent.type(screen.getByLabelText(/cédula/i), '1234567890')
    await userEvent.type(screen.getByLabelText(/teléfono/i), '3001234567')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Abc12345!')
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'Abc12345?')

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    expect(submitButton).toBeDisabled()
    expect(registerUser).not.toHaveBeenCalled()
  })

  // ======================================================
  // Success path
  // ======================================================

  it('should call registerUser when the form is valid', async () => {
    registerUser.mockResolvedValue({ id: '1' })

    render(<Register />)

    await userEvent.type(screen.getByLabelText(/nombres/i), 'Juan')
    await userEvent.type(screen.getByLabelText(/apellidos/i), 'Pérez')
    await userEvent.type(screen.getByLabelText(/cédula/i), '1234567890')
    await userEvent.type(screen.getByLabelText(/teléfono/i), '3001234567')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Abc12345!')
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'Abc12345!')

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await userEvent.click(submitButton)

    expect(registerUser).toHaveBeenCalledWith({
      nombres: 'Juan',
      apellidos: 'Pérez',
      telefono: '3001234567',
      correo: 'test@example.com',
      password: 'Abc12345!',
    })
  })

  // ======================================================
  // UI behavior
  // ======================================================

  it('should toggle password visibility in the register password field', async () => {
    render(<Register />)

    const passwordInput = screen.getByLabelText('Contraseña')
    const [toggleButton] = screen.getAllByRole('button', {
      name: /mostrar contraseña/i,
    })

    expect(passwordInput).toHaveAttribute('type', 'password')
    await userEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /ocultar contraseña/i })).toBeInTheDocument()
  })
})
