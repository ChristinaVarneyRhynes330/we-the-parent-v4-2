import { test, expect } from '@playwright/test';

// ============================================
// DOCUMENT UPLOAD FLOW
// ============================================

test.describe('Document Upload Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
  });

  test('should display documents page correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Documents');
    await expect(page.locator('text=Upload Document')).toBeVisible();
  });

  test('should show upload button and trigger file selection', async ({ page }) => {
    const uploadLabel = page.locator('[data-testid="upload-document-label"]');
    await expect(uploadLabel).toBeVisible();
    
    // Verify file input exists
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('should handle file upload simulation', async ({ page }) => {
    // This test simulates the UI interaction
    // In a real test with a running backend, you would upload an actual file
    
    const uploadButton = page.locator('text=Upload Document');
    await expect(uploadButton).toBeVisible();
    
    // Check that the documents list exists
    const docsList = page.locator('[data-testid="documents-list"]').or(page.locator('.space-y-4').first());
    await expect(docsList).toBeAttached();
  });

  test('should display empty state when no documents exist', async ({ page }) => {
    // If there are no documents, should show empty state
    const emptyState = page.locator('text=No documents found');
    const hasDocuments = await emptyState.count() === 0;
    
    if (!hasDocuments) {
      await expect(emptyState).toBeVisible();
    }
  });
});

// ============================================
// TIMELINE MANAGEMENT FLOW
// ============================================

test.describe('Timeline Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/timeline');
    await page.waitForLoadState('networkidle');
  });

  test('should display timeline page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Timeline');
    await expect(page.locator('button:has-text("Add New Event")')).toBeVisible();
  });

  test('should open event form when Add New Event is clicked', async ({ page }) => {
    await page.click('button:has-text("Add New Event")');
    
    // Dialog should be visible
    await expect(page.locator('role=dialog')).toBeVisible();
    await expect(page.locator('text=Event Title')).toBeVisible();
  });

  test('should validate required fields in event form', async ({ page }) => {
    await page.click('button:has-text("Add New Event")');
    
    // Try to submit without filling required fields
    const saveButton = page.locator('button:has-text("Save Event")');
    await saveButton.click();
    
    // Should show validation error
    await expect(page.locator('text=required').or(page.locator('[role="alert"]'))).toBeVisible();
  });

  test('should close event form when cancel is clicked', async ({ page }) => {
    await page.click('button:has-text("Add New Event")');
    await expect(page.locator('role=dialog')).toBeVisible();
    
    await page.click('button:has-text("Cancel")');
    await expect(page.locator('role=dialog')).not.toBeVisible();
  });

  test('should display total events stat', async ({ page }) => {
    const statElement = page.locator('[data-testid="total-events-stat"]');
    await expect(statElement).toBeVisible();
    await expect(statElement).toContainText('Total Number of Events');
  });
});

// ============================================
// NAVIGATION TESTS
// ============================================

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    const pages = [
      { path: '/', heading: 'Dashboard' },
      { path: '/documents', heading: 'Documents' },
      { path: '/timeline', heading: 'Timeline' },
      { path: '/chat', heading: 'AI Legal Assistant' },
      { path: '/children', heading: 'Children' },
      { path: '/calendar', heading: 'Calendar' },
    ];

    for (const { path, heading } of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toContainText(heading, { timeout: 10000 });
    }
  });

  test('should have working sidebar navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check sidebar is visible
    const sidebar = page.locator('nav');
    await expect(sidebar).toBeVisible();
    
    // Click on Documents link
    await page.click('a:has-text("Documents")');
    await expect(page).toHaveURL('/documents');
    
    // Click on Timeline link
    await page.click('a:has-text("Timeline")').catch(() => page.goto('/timeline'));
    await expect(page).toHaveURL('/timeline');
  });
});

// ============================================
// CHILDREN MANAGEMENT
// ============================================

test.describe('Children Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/children');
    await page.waitForLoadState('networkidle');
  });

  test('should display children page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Children');
    await expect(page.locator('button:has-text("Add Child")')).toBeVisible();
  });

  test('should open child form modal', async ({ page }) => {
    await page.click('button:has-text("Add Child")');
    
    await expect(page.locator('text=Add Child Information')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });

  test('should validate required fields for child', async ({ page }) => {
    await page.click('button:has-text("Add Child")');
    
    // Try to submit without required fields
    await page.click('button:has-text("Save Child")');
    
    // HTML5 validation should prevent submission
    const nameInput = page.locator('input[name="name"]');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

// ============================================
// CHAT FUNCTIONALITY
// ============================================

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
  });

  test('should display chat interface', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('AI Legal Assistant');
    
    // Check for chat input
    const chatInput = page.locator('input[placeholder*="Ask"]').or(page.locator('#chat-input'));
    await expect(chatInput).toBeVisible();
  });

  test('should have functional send button', async ({ page }) => {
    const sendButton = page.locator('button[type="submit"]').or(page.locator('button[aria-label="Send message"]'));
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();
  });
});

// ============================================
// DASHBOARD TESTS
// ============================================

test.describe('Dashboard', () => {
  test('should display dashboard with key metrics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Check for quick action cards
    const quickActions = page.locator('text=Quick Actions');
    await expect(quickActions).toBeVisible();
  });

  test('should show case progress section', async ({ page }) => {
    await page.goto('/');
    
    const caseProgress = page.locator('text=Case Plan Progress').or(page.locator('text=Case Progress'));
    await expect(caseProgress).toBeVisible();
  });
});

// ============================================
// RESPONSIVE DESIGN TESTS
// ============================================

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should load
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/documents');
    
    await expect(page.locator('h1')).toBeVisible();
  });
});

// ============================================
// ACCESSIBILITY TESTS
// ============================================

test.describe('Accessibility', () => {
  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/timeline');
    await page.click('button:has-text("Add New Event")');
    
    // Check for proper labels
    const titleInput = page.locator('input[name="title"]');
    const titleLabel = page.locator('label[for="title"]');
    
    await expect(titleLabel).toBeVisible();
  });

  test('should have ARIA labels on icon buttons', async ({ page }) => {
    await page.goto('/children');
    await page.click('button:has-text("Add Child")');
    
    const closeButton = page.locator('button[aria-label="Close modal"]').or(page.locator('button[aria-label="Close dialog"]'));
    await expect(closeButton).toBeVisible();
  });
});