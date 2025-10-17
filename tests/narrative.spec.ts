import { test, expect } from '@playwright/test';
import { NarrativeEntry } from '@/hooks/useNarrative';

test.describe('Narrative Entry Management', () => {
  // Use a variable to hold the state of the narrative entries for the mock API
  let narrativeEntries: NarrativeEntry[] = [];

  test.beforeEach(async ({ page }) => {
    // Reset the entries before each test to ensure isolation
    narrativeEntries = [];

    // Mock the API call to get cases
    await page.route('**/api/cases', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ cases: [{ id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', case_name: 'Test Case' }] }),
      });
    });

    // Mock GET and POST requests for the main narrative endpoint
    await page.route('**/api/narrative', async route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ entries: narrativeEntries }),
        });
      }
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        const newEntry: NarrativeEntry = {
          ...postData,
          id: `mock-${Date.now()}`,
          created_at: new Date().toISOString(),
        } as NarrativeEntry;
        narrativeEntries.push(newEntry);
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newEntry), // Return the single created entry
        });
      }
    });

    // Mock PATCH and DELETE requests for specific narrative entries
    await page.route('**/api/narrative/*', async route => {
      const entryId = route.request().url().split('/').pop() || '';

      if (route.request().method() === 'PATCH') {
        const updates = route.request().postDataJSON();
        narrativeEntries = narrativeEntries.map(entry =>
          entry.id === entryId ? { ...entry, ...updates } : entry
        );
        const updatedEntry = narrativeEntries.find(e => e.id === entryId);
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updatedEntry),
        });
      }

      if (route.request().method() === 'DELETE') {
        narrativeEntries = narrativeEntries.filter(entry => entry.id !== entryId);
        return route.fulfill({ status: 204 });
      }
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('activeCaseId', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');
    });

    // Navigate to the narrative page before each test
    await page.goto('/narrative');
    await expect(page.getByText('Loading entries...')).toBeHidden({ timeout: 15000 });
  });

  test('Successfully create a new narrative entry', async ({ page }) => {
    const newEntryText = 'The quick brown fox jumps over the lazy dog.';
    await page.getByPlaceholder('Enter a new narrative point...').fill(newEntryText);
    await page.getByRole('button', { name: 'Add Entry' }).click();

    await page.waitForResponse('**/api/narrative');

    // Assert that the new entry is visible
    await expect(page.getByText(newEntryText)).toBeVisible();
  });

  test('Edit an existing narrative entry', async ({ page }) => {
    const initialText = 'This is an entry to be edited.';
    const updatedText = 'This entry has been updated.';

    // Pre-condition: Create an entry to edit
    await page.getByPlaceholder('Enter a new narrative point...').fill(initialText);
    await page.getByRole('button', { name: 'Add Entry' }).click();
    await page.waitForResponse('**/api/narrative');
    await expect(page.getByText(initialText)).toBeVisible();

    // Find the card and click its edit button
    const entryCard = page.locator('.card', { hasText: initialText });
    await entryCard.getByTestId('edit-entry-button').click();
    
    // The card is now in edit mode. Fill the textarea and save.
    // The `entryCard` locator is still valid.
    await entryCard.locator('textarea').fill(updatedText);
    await entryCard.getByRole('button', { name: 'Save' }).click();

    await page.waitForResponse('**/api/narrative/*');

    // Assertions
    await expect(page.getByText(updatedText)).toBeVisible();
    await expect(page.getByText(initialText)).not.toBeVisible();
  });

  test('Delete a narrative entry', async ({ page }) => {
    const entryText = 'This entry will be deleted.';

    // Pre-condition: Create an entry to delete
    await page.getByPlaceholder('Enter a new narrative point...').fill(entryText);
    await page.getByRole('button', { name: 'Add Entry' }).click();
    await page.waitForResponse('**/api/narrative');
    await expect(page.getByText(entryText)).toBeVisible();

    // Find and delete the entry
    const entryRow = page.locator('.card', { hasText: entryText });
    page.on('dialog', dialog => dialog.accept());
    await entryRow.getByTestId('delete-entry-button').click();

    await page.waitForResponse('**/api/narrative/*');

    // Assertions
    await expect(entryRow).not.toBeVisible();
  });
});