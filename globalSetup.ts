import { chromium, FullConfig } from '@playwright/test';

// Define the path where the authentication state will be saved
const authFile = 'playwright-auth.json';

async function globalSetup(config: FullConfig) {
  // Check if the auth file already exists to skip re-logging in
  // You might remove this check if your tokens expire quickly
  // try {
  //   await fs.promises.access(authFile);
  //   console.log('Authentication file already exists. Skipping login.');
  //   return;
  // } catch (e) {
  //   console.log('Authentication file not found. Performing login...');
  // }

  // 1. Launch a browser instance
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 2. Navigate to your login page
  await page.goto('http://localhost:3000/login'); 

  // 3. Perform the login steps (ADAPT THESE SELECTORS TO YOUR APP!)
  // Example: Fill in username and password fields
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  
  // Example: Click the submit button
  await page.click('button[type="submit"]');

  // 4. Wait for the application to redirect to the authenticated page
  // Replace '/dashboard' with the post-login page of your app
  await page.waitForURL('http://localhost:3000/dashboard'); 
  
  // Optional: Add a check to ensure you are logged in
  await page.waitForSelector('text=Welcome back'); 

  // 5. Save the state (cookies, local storage, etc.)
  await page.context().storageState({ path: authFile });
  
  // 6. Close the browser
  await browser.close();
  
  console.log('Authentication state saved successfully.');
}

export default globalSetup;