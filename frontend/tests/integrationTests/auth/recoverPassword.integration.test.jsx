import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RecoverPassword from '../../../src/pages/authentication/recoverPassword'

vi.mock('../../../src/services/authService', () => ({
  forgotPassword: vi.fn(),
  verifyResetCode: vi.fn(),
  resetPassword: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

const { forgotPassword, verifyResetCode, resetPassword } = await import('../../../src/services/authService')

describe('RecoverPassword page integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should disable send button until a valid email is entered', async () => {
    render(<RecoverPassword />)

    const sendButton = screen.getByRole('button', { name: /enviar código de verificación/i })
    const emailInput = screen.getByLabelText(/correo electrónico/i)

    expect(sendButton).toBeDisabled()

    await userEvent.type(emailInput, 'invalid-email')
    expect(sendButton).toBeDisabled()

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'test@example.com')
    expect(sendButton).toBeEnabled()
  })

  it('advances to confirmation screen after sending a valid email', async () => {
    forgotPassword.mockResolvedValue({})

    render(<RecoverPassword />)

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar código de verificación/i }))

    expect(forgotPassword).toHaveBeenCalledWith('test@example.com')
    expect(await screen.findByText(/revisa tu correo/i)).toBeInTheDocument()
  })

  it('should disable verify button until 6 digits are entered and then allow verification', async () => {
    forgotPassword.mockResolvedValue({})
    verifyResetCode.mockResolvedValue({})

    render(<RecoverPassword />)

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar código de verificación/i }))

    const otpInputs = await screen.findAllByRole('textbox')
    const verifyButton = screen.getByRole('button', { name: /verificar código/i })

    expect(verifyButton).toBeDisabled()

    for (let i = 0; i < otpInputs.length; i += 1) {
      await userEvent.type(otpInputs[i], String(i + 1))
    }

    expect(verifyButton).toBeEnabled()
    await userEvent.click(verifyButton)

    expect(verifyResetCode).toHaveBeenCalledWith({ correo: 'test@example.com', code: '123456' })
    expect(await screen.findByRole('button', { name: /guardar nueva contraseña/i })).toBeInTheDocument()
  })

  it('should disable save button until password requirements are met and confirmation matches', async () => {
    forgotPassword.mockResolvedValue({})
    verifyResetCode.mockResolvedValue({})

    render(<RecoverPassword />)

    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /enviar código de verificación/i }))

    const otpInputs = await screen.findAllByRole('textbox')
    for (let i = 0; i < otpInputs.length; i += 1) {
      await userEvent.type(otpInputs[i], String(i + 1))
    }

    await userEvent.click(screen.getByRole('button', { name: /verificar código/i }))

    const saveButton = await screen.findByRole('button', { name: /guardar nueva contraseña/i })
    expect(saveButton).toBeDisabled()

    await userEvent.type(screen.getByLabelText(/nueva contraseña/i), 'weakpass')
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'weakpass')
    expect(saveButton).toBeDisabled()

    await userEvent.clear(screen.getByLabelText(/nueva contraseña/i))
    await userEvent.clear(screen.getByLabelText(/confirmar contraseña/i))
    await userEvent.type(screen.getByLabelText(/nueva contraseña/i), 'Abc12345!')
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'Different9!')
    expect(saveButton).toBeDisabled()

    await userEvent.clear(screen.getByLabelText(/confirmar contraseña/i))
    await userEvent.type(screen.getByLabelText(/confirmar contraseña/i), 'Abc12345!')
    expect(saveButton).toBeEnabled()
  })
})