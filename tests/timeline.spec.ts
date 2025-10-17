import { test, expect } from '@playwright/test';

test.describe('Timeline Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline');
    // Create a case to ensure the context is set for events
    await page.click('button:has-text("New Case")');
    await page.getByLabel('Case Name').fill('Test Case for Timeline');
    await page.click('button:has-text("Create Case")');
    // Wait for the new case to be selected
    await expect(page.locator('text=Test Case for Timeline')).toBeVisible();
  });

  test('should allow a user to add, edit, and delete an event', async ({ page }) => {
    // Add a new event
    await page.click('button:has-text("Add New Event")');
    await page.getByLabel('Event Title').fill('Initial Event');
    await page.getByLabel('Event Date').fill('2025-11-15T10:00');
    await page.getByLabel('Event Description').fill('This is the first event.');
    await page.click('button:has-text("Save Event")');
    await expect(page.locator('text=Initial Event')).toBeVisible();

    // Edit the event
    await page.click('button[aria-label="Edit event"]');
    await page.getByLabel('Event Title').fill('Updated Event');
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Updated Event')).toBeVisible();

    // Delete the event
    await page.click('button[aria-label="Delete event"]');
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Updated Event')).not.toBeVisible();
  });
})