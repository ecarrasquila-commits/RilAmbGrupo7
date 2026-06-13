# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth\register.spec.js >> register end-to-end flow
- Location: tests\e2e\auth\register.spec.js:12:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - img
  - generic [ref=e4]:
    - generic [ref=e7]: RilAmb
    - generic [ref=e8]:
      - heading "Bienvenido de nuevo" [level=1] [ref=e9]
      - paragraph [ref=e10]: Accede a tu espacio de trabajo
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e14]: Correo electrónico
        - textbox "Correo electrónico" [ref=e16]:
          - /placeholder: tu@empresa.com
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]: Contraseña
          - link "¿Olvidaste tu contraseña?" [ref=e20] [cursor=pointer]:
            - /url: /recover-password
        - generic [ref=e21]:
          - textbox "Contraseña" [ref=e22]:
            - /placeholder: ••••••••
          - button "Mostrar contraseña":
            - img
      - button "Iniciar sesión" [disabled] [ref=e23] [cursor=pointer]
    - generic [ref=e27]:
      - text: ¿No tienes cuenta?
      - link "Crear cuenta" [ref=e28] [cursor=pointer]:
        - /url: /register
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const API_BASE = 'http://127.0.0.1:8000/auth';
  4  | 
  5  | async function deleteUser(email) {
  6  |   return await fetch(`${API_BASE}/delete/${encodeURIComponent(email)}`, {
  7  |     method: 'DELETE',
  8  |     headers: { 'Content-Type': 'application/json' },
  9  |   });
  10 | }
  11 | 
  12 | test('register end-to-end flow', async ({ page }) => {
  13 |   const email = `e2e-register-${Date.now()}@example.com`;
  14 |   const password = 'Abc12345!';
  15 | 
  16 |   page.once('dialog', async (dialog) => {
  17 |     expect(dialog.message()).toBe('Registro exitoso');
  18 |     await dialog.accept();
  19 |   });
  20 | 
  21 |   try {
  22 |     await page.goto('/register');
  23 |     await page.type('#nombres', 'Juan', { delay: 100 });
  24 |     await page.type('#apellidos', 'Pérez', { delay: 100 });
  25 |     await page.type('#cedula', '1234567890', { delay: 100 });
  26 |     await page.type('#telefono', '3001234567', { delay: 100 });
  27 |     await page.type('#correo', email, { delay: 100 });
  28 |     await page.type('#pwd1', password, { delay: 100 });
  29 |     await page.type('#pwd2', password, { delay: 100 });
  30 |     await page.click('button:has-text("Crear cuenta")');
  31 | 
  32 |     await page.waitForURL('/login');
  33 |     await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  34 |   } finally {
  35 |     // Limpiar el usuario creado en la prueba, incluso si el flujo falla.
  36 |     // Si no existe el usuario porque no se alcanzó a crear, aceptamos 404.
  37 |     const deleteResponse = await deleteUser(email);
  38 |     expect(
  39 |       deleteResponse.ok || deleteResponse.status === 404
> 40 |     ).toBeTruthy();
     |       ^ Error: expect(received).toBeTruthy()
  41 |   }
  42 | });
  43 | 
  44 | 
  45 | 
```