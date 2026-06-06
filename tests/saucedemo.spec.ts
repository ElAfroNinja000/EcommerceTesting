import { test } from '@playwright/test';
import { InventoryPage } from './pages/inventory.page';
import { LoginPage } from './pages/login.page';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('SauceDemo POM smoke tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('logs in with a valid user', async () => {
    await loginPage.login(USERNAME, PASSWORD);
    await inventoryPage.expectLoaded();
  });

  test('shows an error for locked out user', async () => {
    await loginPage.login('locked_out_user', PASSWORD);
    await loginPage.expectLockedOutError();
  });

  test('adds and removes backpack from cart', async () => {
    await loginPage.login(USERNAME, PASSWORD);
    await inventoryPage.expectLoaded();

    await inventoryPage.addBackpackToCart();
    await inventoryPage.expectCartCount('1');

    await inventoryPage.removeBackpackFromCart();
    await inventoryPage.expectEmptyCartBadge();
  });
});
