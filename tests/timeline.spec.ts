import { test, expect } from '@playwright/test';

// The base URL is configured in playwright.config.ts
const TIMELINE_URL = '/timeline';

/**
 * This test covers the full end-to-end user flow for creating and deleting a timeline event.
 * It uses Playwright's network interception to mock API responses, ensuring the test is
 * fast, reliable, and independent of the actual backend state.
 */
test.describe('Timeline Event CRUD Operations', () => {
  test('should allow a user to create and then delete an event', async ({ page }) => {
    // --- Test Data ---
    const eventTitle = `Review preliminary hearing transcript ${Date.now()}`;
    const eventDescription = 'The transcript was 200 pages long and contained key details.';
    const eventDate = '2025-11-15';
    const eventDateFormatted = '11/15/2025'; // US locale format

    // --- Mock API State ---
    let mockEventsDb: any[] = [];

    // Intercept API calls to mock the backend
    await page.route('**/api/events**', async (route, request) => {
      const method = request.method();

      // Mock GET request to fetch all events
      if (method === 'GET') {
        return route.fulfill({ status: 200, json: { events: mockEventsDb } });
      }

      // Mock POST request to create an event
      // NOTE: This assumes your form submission triggers a POST request.
      if (method === 'POST') {
        const newEvent = {
          id: `mock_id_${Date.now()}`,
          title: eventTitle,
          description: eventDescription,
          date: eventDate,
        };
        mockEventsDb.push(newEvent);
        return route.fulfill({ status: 201, json: newEvent });
      }

      // Mock DELETE request
      if (method === 'DELETE') {
        const url = request.url();
        const id = url.split('/').pop();
        mockEventsDb = mockEventsDb.filter(event => event.id !== id);
        return route.fulfill({ status: 200 });
      }

      // Allow other requests to pass through
      return route.continue();
    });

    // --- 1. Navigate and Verify Initial State ---
    await page.goto(TIMELINE_URL);
    await expect(page.getByRole('heading', { name: 'Case Timeline' })).toBeVisible();
    // Initially, no events should be present
    await expect(page.getByText(eventTitle)).not.toBeVisible();

    // --- 2. Create a New Event ---
    await page.getByRole('button', { name: 'Add Event' }).click();

    // Fill out the form. Note: getByLabel is preferred. If your form doesn't use
    // labels, you might need to use getByPlaceholder or other selectors.
    await page.getByLabel('Title').fill(eventTitle);
    await page.getByLabel('Date').fill(eventDate);
    await page.getByLabel('Description').fill(eventDescription);
    await page.getByRole('button', { name: 'Save Event' }).click();

    // --- 3. Verify Event Creation ---
    // The new event should now be visible on the timeline.
    const newEventLocator = page.locator('div').filter({ hasText: eventTitle }).first();
    await expect(newEventLocator).toBeVisible();
    await expect(page.getByText(eventDescription)).toBeVisible();
    await expect(page.getByText(eventDateFormatted)).toBeVisible();

    // --- 4. Delete the Event ---
    // Find the delete button within the scope of the newly created event
    await newEventLocator.getByRole('button', { name: 'Delete' }).click();

    // If you have a custom confirmation modal, you would assert its visibility
    // and click the confirmation button here. For native browser `confirm()` dialogs,
    // Playwright accepts them by default.

    // --- 5. Verify Event Deletion ---
    // The event should no longer be visible in the DOM.
    await expect(page.getByText(eventTitle)).not.toBeVisible();
  });
});
