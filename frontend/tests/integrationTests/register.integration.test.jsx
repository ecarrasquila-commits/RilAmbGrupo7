import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Register from '../../src/pages/register'

vi.mock('../../src/services/authService', () => ({
  registerUser: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}))

const { registerUser } = await import('../../src/services/authService')

describe('Register page integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should submit the register form when all fields are valid', async () => {
    registerUser.mockResolvedValue({ id: '1' })

    render(<Register />)

    await userEvent.type(screen.getByLabelText(/nombres/i), 'Juan')
    await userEvent.type(screen.getByLabelText(/apellidos/i), 'Pérez')
    await userEvent.type(screen.getByLabelText(/cédula/i), '1234567890')
    await userEvent.type(screen.getByLabelText(/teléfono/i), '+573001234567')
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Abc12345!')
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'Abc12345!')

    const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
    await userEvent.click(submitButton)

    expect(registerUser).toHaveBeenCalledWith({
      nombres: 'Juan',
      apellidos: 'Pérez',
      telefono: '+573001234567',
      correo: 'test@example.com',
      password: 'Abc12345!',
    })
  })
})
