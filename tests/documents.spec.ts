import { test, expect } from '@playwright/test';
import type { Document } from '@/hooks/useDocuments';

let mockDocuments: Document[] = [];

test.describe('Document Management with Correct Stateful Mock', () => {
  test.beforeEach(async ({ page }) => {
    mockDocuments = [];

    await page.route('**/api/cases', async route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ cases: [{ id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', name: 'Test Case' }] })
      });
    });

    await page.route('**/api/documents**', async (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ documents: mockDocuments }),
        });
      }
    });

    await page.route('**/api/upload', async (route, request) => {
        const formData = request.formData();
        const file = formData.get('file');
        const caseId = formData.get('caseId');

        if (file && caseId) {
            const newDoc: Document = {
                id: `mock-doc-${Date.now()}`,
                case_id: caseId,
                file_name: file.name,
                file_path: `/${caseId}/${file.name}`,
                file_type: file.type,
                file_size: file.size,
                document_type: 'File',
                summary: 'This is a mock summary.',
                created_at: new Date().toISOString(),
            };
            mockDocuments.push(newDoc);
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ document: newDoc }),
            });
        }
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('activeCaseId', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');
    });

    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
  });

  test('Successfully upload a new document', async ({ page }) => {
    const fileName = 'my-test-document.txt';

    await expect(page.getByText('Loading documents...')).not.toBeVisible();

    await expect(page.getByText('No documents found for this case.')).toBeVisible();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByTestId('upload-document-label').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({ name: fileName, mimeType: 'text/plain', buffer: Buffer.from('test content') });
    await page.getByRole('button', { name: 'Upload' }).click();

    await page.waitForResponse('**/api/documents**');

    await expect(page.getByTestId('upload-success-message')).toContainText(`Successfully uploaded ${fileName}`);
    await expect(page.getByText(fileName)).toBeVisible();
  });
});