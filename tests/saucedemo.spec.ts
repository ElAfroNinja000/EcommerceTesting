import { test } from '@playwright/test';
import { InventoryPage } from './pages/inventory.page';
import { LoginPage } from './pages/login.page';

const PASSWORD = 'secret_sauce';

const loginProfiles = [
  {
    name: 'standard user logs in successfully',
    username: 'standard_user',
    password: PASSWORD,
    expected: 'success' as const,
  },
  {
    name: 'locked out user sees lockout error',
    username: 'locked_out_user',
    password: PASSWORD,
    expected: 'error' as const,
    errorMessage: 'Sorry, this user has been locked out.',
  },
  {
    name: 'invalid credentials show auth error',
    username: 'standard_user',
    password: 'wrong_password',
    expected: 'error' as const,
    errorMessage: 'Username and password do not match',
  },
];

test.describe('Auth @auth @smoke', () => {
  // Ces tests gèrent leur propre login — ils ne doivent pas hériter du storageState
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  for (const profile of loginProfiles) {
    test(profile.name, async () => {
      await loginPage.login(profile.username, profile.password);

      if (profile.expected === 'success') {
        await inventoryPage.expectLoaded();
        return;
      }

      await loginPage.expectErrorContains(profile.errorMessage);
    });
  }
});

test.describe('Cart @cart @smoke @regression', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();
  });

  test('add and remove backpack from cart', async () => {
    await inventoryPage.addBackpackToCart();
    await inventoryPage.expectCartCount('1');

    await inventoryPage.removeBackpackFromCart();
    await inventoryPage.expectEmptyCartBadge();
  });
});

test.describe('Checkout @checkout @smoke @regression', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();
  });

  test('critical path: cart and checkout completion', async () => {
    await inventoryPage.addBackpackToCart();
    await inventoryPage.expectCartCount('1');

    await inventoryPage.openCart();
    await inventoryPage.beginCheckout();
    await inventoryPage.completeCheckoutInfo('E2E', 'Tester', '12345');
    await inventoryPage.finishCheckout();
    await inventoryPage.expectCheckoutComplete();
  });
});
