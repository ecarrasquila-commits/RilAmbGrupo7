import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  // @ts-ignore - process is available in Node.js environment
  forbidOnly: process?.env?.CI === 'true',
  // @ts-ignore - process is available in Node.js environment
  retries: process?.env?.CI === 'true' ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    browserName: 'chromium',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    slowMo: 3000,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
