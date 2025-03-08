import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Check page title
  await expect(page).toHaveTitle(/Ansight/);

  // Click on "Get Started" link
  await page.getByRole('link', { name: 'Get Started' }).click();

  // Right-click on a specific div element
  await page
    .locator('div')
    .filter({ hasText: 'Welcome backSign in to your' })
    .nth(1)
    .click({
      button: 'right',
    });
});

test('Login page', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(
    page.getByText('Sign in to your account using your email')
  ).toBeVisible();
  const emailInput = page.locator('input[type="email"]');
  const submitButton = page.locator('button[type="submit"]');

  await expect(emailInput).toBeVisible();
  await expect(submitButton).toBeVisible();
  await emailInput.fill(`ajitha@apptino.com`);
  await submitButton.click();
});
