import { test, expect } from '@playwright/test';

test.describe('Document Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API call to get cases
    await page.route('**/api/cases', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ cases: [{ id: '123', case_name: 'Test Case' }] }),
      });
    });

    // Mock GET requests for documents
    await page.route('**/api/documents', async route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]), // Start with no documents
        });
      }
      await route.continue();
    });

    // Mock POST requests to upload a new document
    await page.route('**/api/upload', async route => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, fileName: 'test-document.txt' }),
        });
      }
      await route.continue();
    });

    // Navigate to the documents page before each test
    await page.goto('/documents');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 15000 });
  });

  test('Successfully upload a new document', async ({ page }) => {
    // Get initial document count
    const initialCount = await page.locator('.card', { hasText: 'Document:' }).count();

    // Create a fake file to upload
    const fileContent = 'This is a test document.';
    const fileName = 'test-document.txt';

    // Set up the file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('upload-document-label').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({ name: fileName, mimeType: 'text/plain', buffer: Buffer.from(fileContent) });

    // Assertions
    await expect(page.getByText(`Successfully uploaded ${fileName}`)).toBeVisible();
    await expect(page.getByText(fileName)).toBeVisible();
    
    const newCount = await page.locator('.card', { hasText: 'Document:' }).count();
    expect(newCount).toBe(initialCount + 1);
  });

  test('Delete a document', async ({ page }) => {
    // Pre-condition: Upload a document to delete
    const fileContent = 'This is a document to be deleted.';
    const fileName = 'delete-me.txt';
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('upload-document-label').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({ name: fileName, mimeType: 'text/plain', buffer: Buffer.from(fileContent) });
    await expect(page.getByText(`Successfully uploaded ${fileName}`)).toBeVisible();

    const initialCount = await page.locator('.card', { hasText: 'Document:' }).count();

    // Find and delete the document
    const documentRow = page.locator('.card', { hasText: fileName });
    page.on('dialog', dialog => dialog.accept()); // Handle confirmation dialog
    await documentRow.getByRole('button', { name: 'Delete document' }).click();

    // Assertions
    await expect(page.getByText(`Successfully deleted "${fileName}"`)).toBeVisible();
    await expect(page.getByText(fileName)).not.toBeVisible();
    
    const newCount = await page.locator('.card', { hasText: 'Document:' }).count();
    expect(newCount).toBe(initialCount - 1);
  });
});