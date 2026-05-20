import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Kafe/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
