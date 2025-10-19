// File: tests/e2e/critical-flows.spec.ts

import { test, expect } from '@playwright/test';

// NOTE: This assumes you have already set up service worker mocking (e.g., MSW)
// in a global setup file or directly in your test environment for a true zero-cost E2E test.

test.describe('Critical Feature Flows (Mocked Environment)', () => {
  // Use the setup defined in playwright.config.ts which should include authentication
  test.use({ storageState: 'playwright/.auth/user.json' });

  test('1. Dashboard renders key widgets after mock login', async ({ page }) => {
    await page.goto('/');
    
    // Check for the presence of elements linked to successful mock data fetch
    await expect(page.getByRole('heading', { name: /Centralized Dashboard/i })).toBeVisible();
    await expect(page.getByText('Upcoming Court Dates:')).toBeVisible();
    await expect(page.getByText('Compliance Progress:')).toBeVisible();
  });

  test('2. AI Chat Vault loads and can send a streaming message', async ({ page }) => {
    // Navigate to the Chat Page
    await page.goto('/chat');
    
    // Verify initial message from the mock/initial state
    await expect(page.getByText(/AI Assistant, connected to your Evidence Binder/i)).toBeVisible();

    const chatInput = page.getByPlaceholder(/Ask a question about your case.../i);
    const sendButton = page.getByRole('button', { name: 'Send' });
    
    // Simulate typing and sending a message
    await chatInput.fill('What are the facts about my visitation?');
    await sendButton.click();

    // Check that the mock streaming response appears (this relies on the mock API route)
    // NOTE: A successful streaming test verifies both the client component (Step 9) and the API route (Step 8).
    await expect(page.getByText(/The court ordered supervised visitation/i)).toBeVisible({ timeout: 5000 });
  });

  test('3. Real-Time Courtroom Helper (Transcription) loads and accepts input', async ({ page }) => {
    // Navigate to the Transcription/Courtroom Helper Page
    await page.goto('/transcribe');

    // 1. Start the session
    const startButton = page.getByRole('button', { name: 'START Court Session' });
    await startButton.click();
    await expect(page.getByText(/ACTIVE: Analyzing Audio Stream/i)).toBeVisible();

    // 2. Simulate an input that triggers an objection (relies on API mock logic from Step 25)
    const transcriptInput = page.getByPlaceholder(/Paste a witness statement here to test the objection system/i);
    const analyzeButton = page.getByRole('button', { name: 'Send Chunk & Analyze' });
    
    await transcriptInput.fill('The case worker said the mother has no interest in attending services.');
    await analyzeButton.click();

    // 3. Verify the alert appears (this relies on the API route from Step 25)
    await expect(page.getByText(/OBJECTION ALERT!/i)).toBeVisible();
    await expect(page.getByText(/OBJECT: Hearsay/i)).toBeVisible();
  });

  test('4. Drafting Engine generates a template and the CoS block', async ({ page }) => {
    await page.goto('/draft');
    
    const generateButton = page.getByRole('button', { name: 'Generate Draft' });
    await generateButton.click();
    
    // 1. Verify the initial draft loads (relies on API mock from Step 21)
    await expect(page.getByText(/# MOTION FOR INCREASED VISITATION/i)).toBeVisible({ timeout: 5000 });

    // 2. Generate Certificate of Service (CoS) (relies on API mock from Step 31)
    const cosButton = page.getByRole('button', { name: 'Generate Certificate of Service' });
    await cosButton.click();
    
    await expect(page.getByText(/CoS ADDED \(Ready to Export\)/i)).toBeVisible();

    // 3. Verify the final text block is injected into the draft area
    await expect(page.getByText(/### CERTIFICATE OF SERVICE/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export Final DOCX' })).not.toBeDisabled();
  });

});