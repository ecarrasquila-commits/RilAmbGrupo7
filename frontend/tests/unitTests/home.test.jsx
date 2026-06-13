import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../src/pages/home'

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

describe('Home Component', () => {
  it('renders navigation buttons that point to the correct registration and login routes', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    const registerLinks = screen.getAllByRole('link', { name: /crear cuenta/i })
    expect(registerLinks.length).toBeGreaterThan(0)
    registerLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/register')
    })

    const startLink = screen.getByRole('link', { name: /comenzar ahora/i })
    expect(startLink).toHaveAttribute('href', '/register')

    const loginLinks = screen.getAllByRole('link', { name: /acceder/i })
    expect(loginLinks.length).toBeGreaterThan(0)
    loginLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/login')
    })
  })
})
