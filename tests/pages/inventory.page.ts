import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly addBackpackButton: Locator;
  readonly removeBackpackButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.addBackpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.removeBackpackButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.inventoryList).toBeVisible();
  }

  async addBackpackToCart() {
    await this.addBackpackButton.click();
  }

  async removeBackpackFromCart() {
    await this.removeBackpackButton.click();
  }

  async expectCartCount(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }

  async expectEmptyCartBadge() {
    await expect(this.cartBadge).toHaveCount(0);
  }
}
