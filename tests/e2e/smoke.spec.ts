import { test, expect } from '@playwright/test'

test('smoke: app loads inbox by default', async ({ page }) => {
  await page.goto('/')
  // Если есть форма логина — пропускаем
  if (await page.locator('input[name="username"]').isVisible().catch(() => false)) {
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin')
    await page.click('button[type="submit"]')
  }
  await page.goto('/main')
  await expect(page.locator('text=Входящие')).toBeVisible()
})
