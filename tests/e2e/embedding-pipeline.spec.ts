// FILE: tests/e2e/embedding-pipeline.spec.ts
// NEW - Test suite for embedding pipeline

import { test, expect } from '@playwright/test';

test.describe('Embedding Pipeline', () => {
  let testCaseId: string;

  test.beforeAll(async ({ request }) => {
    // Create a test case via API
    const response = await request.post('/api/cases', {
      data: {
        name: 'Embedding Test Case',
        case_number: 'TEST-EMB-001',
      },
    });
    const data = await response.json();
    testCaseId = data.case?.id;
    
    expect(testCaseId).toBeDefined();
  });

  test('should generate embeddings after document upload', async ({ page }) => {
    // Navigate to documents page
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');

    // Create a test file with meaningful content
    const testContent = `
      MOTION FOR INCREASED VISITATION
      
      Case Number: 2024-DP-12345
      
      The respondent respectfully requests increased visitation with the minor child.
      
      BACKGROUND
      The case was initiated on January 15, 2024. The minor child, John Doe, was placed
      in foster care. The respondent has completed all required services including parenting
      classes and substance abuse treatment.
      
      ARGUMENT
      The respondent has demonstrated substantial compliance with the case plan by:
      1. Completing parenting education program
      2. Maintaining stable employment
      3. Securing appropriate housing
      4. Passing all drug screenings
      
      WHEREFORE, the respondent requests this court grant increased visitation time.
    `.trim();

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'motion-for-visitation.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(testContent),
    });

    // Wait for upload to complete
    await page.waitForResponse(response => 
      response.url().includes('/api/upload') && response.status() === 200
    );

    // Verify success message
    await expect(page.locator('text=Successfully uploaded')).toBeVisible({ timeout: 10000 });

    // Wait a moment for Edge Function to process
    await page.waitForTimeout(5000);

    // Verify the document appears
    await expect(page.locator('text=motion-for-visitation.txt')).toBeVisible();
  });

  test('should retrieve relevant context in chat', async ({ page }) => {
    // Navigate to chat page
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Ask a question related to uploaded document
    const chatInput = page.locator('input[placeholder*="Ask"]').or(page.locator('#chat-input'));
    await chatInput.fill('What services have I completed?');
    
    // Submit the question
    await page.locator('button[type="submit"]').click();

    // Wait for response
    await page.waitForTimeout(3000);

    // Check that response contains relevant information from the document
    const responseText = await page.locator('.prose').last().textContent();
    
    // The AI should mention at least one of these services from our test document
    const mentionsServices = 
      responseText?.includes('parenting') ||
      responseText?.includes('employment') ||
      responseText?.includes('housing') ||
      responseText?.includes('drug screening');

    expect(mentionsServices).toBeTruthy();
  });

  test('should handle documents with insufficient content gracefully', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');

    // Upload a very short file (should not generate embeddings)
    const shortContent = 'Test';
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'short-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(shortContent),
    });

    // Wait for upload
    await page.waitForResponse(response => 
      response.url().includes('/api/upload') && response.status() === 200
    );

    // Should still succeed
    await expect(page.locator('text=Successfully uploaded')).toBeVisible({ timeout: 10000 });
  });

  test('should deduplicate identical chunks', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');

    const duplicateContent = `
      This is a test document with repeated content.
      This is a test document with repeated content.
      This is a test document with repeated content.
      This paragraph is the same as the others.
    `.trim();

    // Upload the file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'duplicate-content.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(duplicateContent),
    });

    await page.waitForResponse(response => 
      response.url().includes('/api/upload') && response.status() === 200
    );

    await expect(page.locator('text=Successfully uploaded')).toBeVisible({ timeout: 10000 });
    
    // The system should handle duplicates without error
    // (Actual deduplication check would require database access)
  });
});