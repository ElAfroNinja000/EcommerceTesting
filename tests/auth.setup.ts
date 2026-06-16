import { test as setup } from '@playwright/test';
import { LoginPage } from './pages/login.page';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await page.waitForURL(/.*inventory.html/);
  await page.context().storageState({ path: authFile });
});
