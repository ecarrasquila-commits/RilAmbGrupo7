import { test, expect } from '@playwright/test';

const API_BASE = 'http://127.0.0.1:8000/auth';

async function loginUser(email, password) {
  return await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: email, password }),
  });
}

test('register end-to-end flow', async ({ page }) => {
  const email = `e2e-register-${Date.now()}@example.com`;
  const password = 'Abc12345!';

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Registro exitoso');
    await dialog.accept();
  });

  await page.goto('/register');
  await page.type('#nombres', 'Juan', { delay: 100 });
  await page.type('#apellidos', 'Pérez', { delay: 100 });
  await page.type('#cedula', '1234567890', { delay: 100 });
  await page.type('#telefono', '+573001234567', { delay: 100 });
  await page.type('#correo', email, { delay: 100 });
  await page.type('#pwd1', password, { delay: 100 });
  await page.type('#pwd2', password, { delay: 100 });
  await page.click('button:has-text("Crear cuenta")');

  await page.waitForURL('/');

  const loginResponse = await loginUser(email, password);
  expect(loginResponse.ok).toBeTruthy();
  const loginJson = await loginResponse.json();
  expect(loginJson.access_token).toBeTruthy();
});
