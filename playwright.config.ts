import { defineConfig } from '@playwright/test';

export default defineConfig({
  // 1. Configure the web server to run before tests
  webServer: {
    // Command to start your development server
    command: 'npm run dev',
    // URL where your application will be available
    url: 'http://localhost:3000',
    // Reuse an existing server if it's already running
    reuseExistingServer: !process.env.CI,
  },

  // 2. Set the base URL for all tests
  use: {
    baseURL: 'http://localhost:3000',
  },

  // 3. Directory where your tests are located
  testDir: 'tests',
});
