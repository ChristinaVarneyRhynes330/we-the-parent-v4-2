import { test, expect } from '@playwright/test';

test.describe('Timeline Event Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API call to get cases
    await page.route('**/api/cases', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ cases: [{ id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', case_name: 'Test Case' }] }),
      });
    });

    // Mock GET and POST requests for timeline events
    await page.route('**/api/events', async route => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]), // Start with no events
        });
      }
      if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON();
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ ...postData, id: `mock-${Date.now()}` }),
        });
      }
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('activeCaseId', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');
    });

    // Navigate to the timeline page before each test
    await page.goto('/timeline');
    await expect(page.locator('#loading-screen')).toBeHidden({ timeout: 15000 });
  });

  test('Successfully create a new timeline event', async ({ page }) => {
    // Get initial event count
    const initialCountText = await page.locator('data-testid=total-events-stat').textContent();
    const initialCount = initialCountText ? parseInt(initialCountText.match(/\d+/)?.[0] || '0') : 0;

    // Click "Add New Event"
    await page.getByRole('button', { name: 'Add New Event' }).click();

    // Fill out the form
    await page.getByLabel('Event Title').fill('Filed Motion to Compel Discovery');
    await page.getByLabel('Event Date').fill('2025-10-15T09:00');
    await page.getByLabel('Event Description').fill('Filed the motion with the clerk of courts after the opposing party failed to respond.');

    // Click "Save Event"
    await page.getByRole('button', { name: 'Save Event' }).click();

    // Assertions
    await expect(page.getByText('Event created successfully')).toBeVisible();
    await expect(page.getByText('Filed Motion to Compel Discovery')).toBeVisible();
    
    const newCountText = await page.locator('data-testid=total-events-stat').textContent();
    const newCount = newCountText ? parseInt(newCountText.match(/\d+/)?.[0] || '0') : 0;
    expect(newCount).toBe(initialCount + 1);
  });

  test('Edit an existing timeline event', async ({ page }) => {
    // Pre-condition: Create an event to edit
    await page.getByRole('button', { name: 'Add New Event' }).click();
    await page.getByLabel('Event Title').fill('Initial Consultation');
    await page.getByLabel('Event Date').fill('2025-09-01T10:00');
    await page.getByRole('button', { name: 'Save Event' }).click();
    await expect(page.getByText('Event created successfully')).toBeVisible();
    
    const initialCountText = await page.locator('data-testid=total-events-stat').textContent();
    const initialCount = initialCountText ? parseInt(initialCountText.match(/\d+/)?.[0] || '0') : 0;

    // Find and edit the event
    const eventRow = page.locator('div.event-item', { hasText: 'Initial Consultation' });
    await eventRow.getByRole('button', { name: 'Edit' }).click();

    // Update the form
    await page.getByLabel('Event Title').fill('Strategy Meeting with Counsel');
    await page.getByLabel('Event Date').fill('2025-11-01T11:00');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Assertions
    await expect(page.getByText('Event updated successfully')).toBeVisible();
    await expect(page.getByText('Strategy Meeting with Counsel')).toBeVisible();
    await expect(page.getByText('11/1/2025')).toBeVisible();
    
    const newCountText = await page.locator('data-testid=total-events-stat').textContent();
    const newCount = newCountText ? parseInt(newCountText.match(/\d+/)?.[0] || '0') : 0;
    expect(newCount).toBe(initialCount);
  });

  test('Delete a timeline event', async ({ page }) => {
    // Pre-condition: Create an event to delete
    await page.getByRole('button', { name: 'Add New Event' }).click();
    await page.getByLabel('Event Title').fill('Mediation Session');
    await page.getByLabel('Event Date').fill('2025-10-20T14:00');
    await page.getByRole('button', { name: 'Save Event' }).click();
    await expect(page.getByText('Event created successfully')).toBeVisible();

    const initialCountText = await page.locator('data-testid=total-events-stat').textContent();
    const initialCount = initialCountText ? parseInt(initialCountText.match(/\d+/)?.[0] || '0') : 0;

    // Find and delete the event
    const eventRow = page.locator('div.event-item', { hasText: 'Mediation Session' });
    page.on('dialog', dialog => dialog.accept()); // Handle confirmation dialog
    await eventRow.getByRole('button', { name: 'Delete' }).click();

    // Assertions
    await expect(page.getByText('Event deleted successfully')).toBeVisible();
    await expect(page.getByText('Mediation Session')).not.toBeVisible();
    
    const newCountText = await page.locator('data-testid=total-events-stat').textContent();
    const newCount = newCountText ? parseInt(newCountText.match(/\d+/)?.[0] || '0') : 0;
    expect(newCount).toBe(initialCount - 1);
  });

  const validationTestCases = [
    { title: '', date: '2025-12-10T09:00', errorMessage: 'Event Title is a required field' },
    { title: 'Phone call with witness', date: '', errorMessage: 'Event Date is a required field' },
    { title: '', date: '', errorMessage: 'Event Title and Date are required' },
  ];

  for (const { title, date, errorMessage } of validationTestCases) {
    test(`Attempt to create an event with missing info: ${errorMessage}`, async ({ page }) => {
      const initialCountText = await page.locator('data-testid=total-events-stat').textContent();
      const initialCount = initialCountText ? parseInt(initialCountText.match(/\d+/)?.[0] || '0') : 0;
      
      await page.getByRole('button', { name: 'Add New Event' }).click();

      if (title) await page.getByLabel('Event Title').fill(title);
      if (date) await page.getByLabel('Event Date').fill(date);
      
      await page.getByRole('button', { name: 'Save Event' }).click();

      // Assertions
      await expect(page.getByText(errorMessage)).toBeVisible();
      
      const newCountText = await page.locator('data-testid=total-events-stat').textContent();
      const newCount = newCountText ? parseInt(newCountText.match(/\d+/)?.[0] || '0') : 0;
      expect(newCount).toBe(initialCount);
    });
  }
});