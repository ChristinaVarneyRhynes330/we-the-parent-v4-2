import { test, expect } from '@playwright/test';

test.describe('Narrative Entry Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the narrative page before each test
    await page.goto('/narrative');
  });

  test('Successfully create a new narrative entry', async ({ page }) => {
    const newEntryText = 'The quick brown fox jumps over the lazy dog.';

    // Get initial entry count
    const initialCount = await page.locator('.card >> text=The quick brown fox').count();

    // Fill out the form
    await page.getByPlaceholder('Enter a new narrative point...').fill(newEntryText);
    await page.getByRole('button', { name: 'Add Entry' }).click();

    // Assertions
    await expect(page.getByText(newEntryText)).toBeVisible();
    
    const newCount = await page.locator('.card >> text=The quick brown fox').count();
    expect(newCount).toBe(initialCount + 1);
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
    await entryRow.getByRole('button').nth(0).click(); // Click the edit button

    // Update the form
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

    const initialCount = await page.locator('.card >> text=This entry will be deleted').count();

    // Find and delete the entry
    const entryRow = page.locator('.card', { hasText: entryText });
    page.on('dialog', dialog => dialog.accept()); // Handle confirmation dialog
    await entryRow.getByRole('button').nth(1).click(); // Click the delete button

    // Assertions
    await expect(page.getByText(entryText)).not.toBeVisible();
    
    const newCount = await page.locator('.card >> text=This entry will be deleted').count();
    expect(newCount).toBe(initialCount - 1);
  });
});
