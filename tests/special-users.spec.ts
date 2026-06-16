import { test } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { InventoryPage } from './pages/inventory.page';

const PASSWORD = 'secret_sauce';

test.describe('performance_glitch_user @special-users @regression', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('performance_glitch_user', PASSWORD);
    await inventoryPage.expectLoaded();
  });

  test('login succeeds despite slowness', async () => {
    test.slow();
    // expectLoaded() in beforeEach already asserts /inventory.html
    await inventoryPage.expectLoaded();
  });

  test('adding backpack to cart succeeds despite slowness', async () => {
    test.slow();
    await inventoryPage.addBackpackToCart();
    await inventoryPage.expectCartCount('1');
  });
});

test.describe('error_user @special-users @regression', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('error_user', PASSWORD);
    await inventoryPage.expectLoaded();
  });

  test('login succeeds', async () => {
    await inventoryPage.expectLoaded();
  });

  test('adding backpack to cart fails silently — cart badge does not appear', async () => {
    await inventoryPage.addBackpackToCart();
    // error_user: the "Add to cart" button click does not register in the cart
    await inventoryPage.expectEmptyCartBadge();
  });
});
