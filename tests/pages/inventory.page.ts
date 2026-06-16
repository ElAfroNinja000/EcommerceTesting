import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly addBackpackButton: Locator;
  readonly removeBackpackButton: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItemNames: Locator;
  readonly shoppingCartLink: Locator;
  readonly checkoutButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly checkoutError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.addBackpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.removeBackpackButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItemNames = page.locator('[data-test="inventory-item-name"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.checkoutError = page.locator('[data-test="error"]');
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

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(optionValue);
  }

  async expectFirstItemName(name: string) {
    await expect(this.inventoryItemNames.first()).toHaveText(name);
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }

  async beginCheckout() {
    await this.checkoutButton.click();
  }

  async completeCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async expectCheckoutComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectCartCount(count: string) {
    await expect(this.cartBadge).toHaveText(count);
  }

  async expectEmptyCartBadge() {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async submitCheckoutFormPartial(fields: { firstName?: string; lastName?: string; postalCode?: string }) {
    if (fields.firstName !== undefined) await this.firstNameInput.fill(fields.firstName);
    if (fields.lastName !== undefined) await this.lastNameInput.fill(fields.lastName);
    if (fields.postalCode !== undefined) await this.postalCodeInput.fill(fields.postalCode);
    await this.continueButton.click();
  }

  async expectCheckoutErrorContains(message: string) {
    await expect(this.checkoutError).toBeVisible();
    await expect(this.checkoutError).toContainText(message);
  }
}
