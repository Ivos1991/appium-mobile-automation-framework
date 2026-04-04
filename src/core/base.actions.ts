import type { ChainablePromiseElement } from 'webdriverio';
import { WaitHelpers } from '@framework/utils/wait.helpers.js';

type ElementHandle = WebdriverIO.Element | ChainablePromiseElement;

/**
 * Reusable low-level UI actions shared by screens and components.
 */
export class BaseActions {
  /**
   * Clicks an element after waiting for it to become visible.
   */
  async tap(element: ElementHandle): Promise<void> {
    const resolvedElement = await this.resolveElement(element);
    await WaitHelpers.forDisplayed(element);
    await resolvedElement.click();
  }

  /**
   * Replaces the current value in a text field.
   */
  async typeText(element: ElementHandle, value: string): Promise<void> {
    const resolvedElement = await this.resolveElement(element);
    await WaitHelpers.forDisplayed(element);
    await resolvedElement.clearValue();
    await resolvedElement.setValue(value);
  }

  /**
   * Reads visible text from an element.
   */
  async readText(element: ElementHandle): Promise<string> {
    const resolvedElement = await this.resolveElement(element);
    await WaitHelpers.forDisplayed(element);
    return resolvedElement.getText();
  }

  /**
   * Returns a safe visibility check for optional elements.
   */
  async isVisible(element: ElementHandle): Promise<boolean> {
    return WaitHelpers.isDisplayed(element);
  }

  /**
   * Resolves WDIO lazy element handles in one place so the public methods stay small.
   */
  private async resolveElement(element: ElementHandle): Promise<WebdriverIO.Element> {
    return (await element) as WebdriverIO.Element;
  }
}
