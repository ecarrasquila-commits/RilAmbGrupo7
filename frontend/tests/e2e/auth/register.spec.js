import { test, expect } from '@playwright/test';

const API_BASE = 'http://127.0.0.1:8000/auth';

async function deleteUser(email) {
  return await fetch(`${API_BASE}/delete/${encodeURIComponent(email)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
}

test('register end-to-end flow', async ({ page }) => {
  const email = `e2e-register-${Date.now()}@example.com`;
  const password = 'Abc12345!';

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toBe('Registro exitoso');
    await dialog.accept();
  });

  try {
    await page.goto('/register');
    await page.type('#nombres', 'Juan', { delay: 100 });
    await page.type('#apellidos', 'Pérez', { delay: 100 });
    await page.type('#cedula', '1234567890', { delay: 100 });
    await page.type('#telefono', '3001234567', { delay: 100 });
    await page.type('#correo', email, { delay: 100 });
    await page.type('#pwd1', password, { delay: 100 });
    await page.type('#pwd2', password, { delay: 100 });
    await page.click('button:has-text("Crear cuenta")');

    await page.waitForURL('/login');
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  } finally {
    // Limpiar el usuario creado en la prueba, incluso si el flujo falla.
    // Si no existe el usuario porque no se alcanzó a crear, aceptamos 404.
    const deleteResponse = await deleteUser(email);
    expect(
      deleteResponse.ok || deleteResponse.status === 404
    ).toBeTruthy();
  }
});


