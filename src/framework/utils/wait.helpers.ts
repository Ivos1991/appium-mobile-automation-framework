import type { ChainablePromiseElement } from 'webdriverio';

type ElementHandle = WebdriverIO.Element | ChainablePromiseElement;

/**
 * Centralized wait helpers keep timeout behavior consistent across screens and flows.
 */
export class WaitHelpers {
  /**
   * Waits until the element is visible to the user.
   */
  static async forDisplayed(element: ElementHandle, timeout = 15000): Promise<void> {
    const resolvedElement = (await element) as WebdriverIO.Element;
    await resolvedElement.waitForDisplayed({ timeout });
  }

  /**
   * Waits until the element is no longer visible.
   */
  static async forHidden(element: ElementHandle, timeout = 15000): Promise<void> {
    const resolvedElement = (await element) as WebdriverIO.Element;
    await resolvedElement.waitForDisplayed({ timeout, reverse: true });
  }

  /**
   * Polls an async condition until it evaluates to true.
   */
  static async until(
    condition: () => Promise<boolean>,
    timeout = 15000,
    timeoutMsg = 'Expected condition was not met within the timeout.'
  ): Promise<void> {
    await browser.waitUntil(condition, { timeout, timeoutMsg });
  }

  /**
   * Returns false instead of throwing when an element is missing or not displayed.
   */
  static async isDisplayed(element: ElementHandle): Promise<boolean> {
    const resolvedElement = (await element) as WebdriverIO.Element;

    if (!(await resolvedElement.isExisting())) {
      return false;
    }

    return resolvedElement.isDisplayed();
  }
}
