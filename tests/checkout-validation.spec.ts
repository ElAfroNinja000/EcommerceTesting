import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/inventory.page';

test.describe('Checkout form validation @checkout-validation @regression', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
    await inventoryPage.expectLoaded();
    await inventoryPage.addBackpackToCart();
    await inventoryPage.openCart();
    await inventoryPage.beginCheckout();
  });

  test('submit without first name shows required error', async () => {
    await inventoryPage.submitCheckoutFormPartial({
      lastName: 'Tester',
      postalCode: '12345',
    });
    await inventoryPage.expectCheckoutErrorContains('First Name is required');
  });

  test('submit without last name shows required error', async () => {
    await inventoryPage.submitCheckoutFormPartial({
      firstName: 'E2E',
      postalCode: '12345',
    });
    await inventoryPage.expectCheckoutErrorContains('Last Name is required');
  });

  test('submit without postal code shows required error', async () => {
    await inventoryPage.submitCheckoutFormPartial({
      firstName: 'E2E',
      lastName: 'Tester',
    });
    await inventoryPage.expectCheckoutErrorContains('Postal Code is required');
  });

  test('submit completely empty form shows first name required error', async () => {
    await inventoryPage.continueButton.click();
    await inventoryPage.expectCheckoutErrorContains('First Name is required');
  });

  test('XSS payload in all fields does not trigger script execution', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    const xssPayload = '<script>alert(1)</script>';
    await inventoryPage.completeCheckoutInfo(xssPayload, xssPayload, xssPayload);

    // Verify we reached the order summary page (step two)
    await expect(page).toHaveURL(/.*checkout-step-two/);

    // Assert no dialog was triggered by the XSS payload
    expect(dialogTriggered, 'XSS alert dialog should not have been triggered').toBe(false);
  });
});
