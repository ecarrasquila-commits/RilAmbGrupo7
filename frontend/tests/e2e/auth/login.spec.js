import { test, expect } from '@playwright/test';

const API_BASE = 'http://127.0.0.1:8000/auth';

async function createUser(email, password) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombres: 'E2E',
      apellidos: 'Login',
      telefono: '+573001234567',
      correo: email,
      password,
    }),
  });

  return response;
}

test('login end-to-end flow', async ({ page }) => {
  const email = 'e2e-login-test@example.com';
  const password = 'Password123!';

  // Intentar crear el usuario. Si ya existe, no hay problema.
  // Si no existe, se crea. Si existe, retorna 400 pero podemos ignorarlo.
  try {
    await createUser(email, password);
  } catch {
    // Usuario ya existe, eso está bien
  }

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Login exitoso');
    await dialog.accept();
  });

  await page.goto('/login');
  await page.type('#email', email, { delay: 100 });
  await page.type('#password', password, { delay: 100 });
  await page.click('button:has-text("Iniciar sesión")');

  await page.waitForURL('/dashboard');
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();
});
