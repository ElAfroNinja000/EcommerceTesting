import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/inventory.page';

test.describe('Inventory sort @inventory @smoke', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();
  });

  test('sort A→Z shows Sauce Labs Backpack first', async () => {
    await inventoryPage.sortBy('az');
    await inventoryPage.expectFirstItemName('Sauce Labs Backpack');
  });

  test('sort Z→A shows Test.allTheThings() T-Shirt (Red) first', async () => {
    await inventoryPage.sortBy('za');
    await inventoryPage.expectFirstItemName('Test.allTheThings() T-Shirt (Red)');
  });

  test('sort price low→high yields ascending order', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPricesAsNumbers();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sort price high→low yields descending order', async () => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getPricesAsNumbers();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });
});

test.describe('Inventory product navigation @inventory @regression', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();
  });

  test('clicking first item opens its detail page and can return to inventory', async ({ page }) => {
    await inventoryPage.clickFirstItem();
    await inventoryPage.expectOnItemPage();
    await inventoryPage.expectAddToCartButtonVisible();
    await inventoryPage.goBackToInventory();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });
});
