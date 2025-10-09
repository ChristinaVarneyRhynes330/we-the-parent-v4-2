import { test, expect } from '@playwright/test';

test.describe('Narrative Entry Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API call to get cases
    await page.route('**/api/cases', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ cases: [{ id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', case_name: 'Test Case' }] }),
      });
    });

    // Mock GET and POST requests for narrative entries
    await page.route('**/api/narrative', async route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]), // Start with no entries
        });
      }
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          // Return a mock of the created entry
          body: JSON.stringify([{ ...postData, id: `mock-${Date.now()}` }]),
        });
      }
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('activeCaseId', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');
    });

    // Navigate to the narrative page before each test
    await page.goto('/narrative');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 15000 });
  });

  test('Successfully create a new narrative entry', async ({ page }) => {
    const newEntryText = 'The quick brown fox jumps over the lazy dog.';
    await page.getByPlaceholder('Enter a new narrative point...').fill(newEntryText);
    await page.getByRole('button', { name: 'Add Entry' }).click();

    // Assert that the new entry is visible after the mocked API call
    await expect(page.getByText(newEntryText)).toBeVisible();
  });

  test('Edit an existing narrative entry', async ({ page }) => {
    const initialText = 'This is an entry to be edited.';
    const updatedText = 'This entry has been updated.';

    // Pre-condition: Create an entry to edit
    await page.getByPlaceholder('Enter a new narrative point...').fill(initialText);
    await page.getByRole('button', { name: 'Add Entry' }).click();
    await expect(page.getByText(initialText)).toBeVisible();

    // Find and edit the entry
    const entryRow = page.locator('.card', { hasText: initialText });
    await entryRow.getByTestId('edit-entry-button').click();
    await entryRow.locator('textarea').fill(updatedText);
    await entryRow.getByRole('button', { name: 'Save' }).click();

    // Assertions
    await expect(page.getByText(updatedText)).toBeVisible();
    await expect(page.getByText(initialText)).not.toBeVisible();
  });

  test('Delete a narrative entry', async ({ page }) => {
    const entryText = 'This entry will be deleted.';

    // Pre-condition: Create an entry to delete
    await page.getByPlaceholder('Enter a new narrative point...').fill(entryText);
    await page.getByRole('button', { name: 'Add Entry' }).click();
    await expect(page.getByText(entryText)).toBeVisible();

    // Find and delete the entry
    const entryRow = page.locator('.card', { hasText: entryText });
    page.on('dialog', dialog => dialog.accept());
    await entryRow.getByTestId('delete-entry-button').click();

    // Assertions
    await expect(page.getByText(entryText)).not.toBeVisible();
  });
});