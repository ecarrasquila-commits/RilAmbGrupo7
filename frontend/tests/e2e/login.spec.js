import { test, expect } from '@playwright/test';

const API_BASE = 'http://127.0.0.1:8000/auth';

async function createUser(email, password) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombres: 'E2E',
      apellidos: 'Usuario',
      telefono: '+573001234567',
      correo: email,
      password,
    }),
  });

  return response;
}

test('login end-to-end flow', async ({ page }) => {
  const email = `e2e-login-${Date.now()}@example.com`;
  const password = 'Password123!';

  const registerResponse = await createUser(email, password);
  expect(registerResponse.ok).toBeTruthy();

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Login exitoso');
    await dialog.accept();
  });

  await page.goto('/');
  await page.type('#email', email, { delay: 100 });
  await page.type('#password', password, { delay: 100 });
  await page.click('button:has-text("Iniciar sesión")');

  await page.waitForURL('/dashboard');
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();
});
