import { BaseComponent } from './base.component.js';

/**
 * Base screen holds small helpers that make concrete screens more readable.
 */
export abstract class BaseScreen extends BaseComponent {
  /**
   * Opens a bottom-tab item exposed through an accessibility id.
   */
  protected async tapTab(accessibilityId: string): Promise<void> {
    await this.actions.tap($(`~${accessibilityId}`));
  }

  /**
   * Performs a safe visibility check without leaking selectors into flows.
   */
  protected async isElementVisible(selector: string): Promise<boolean> {
    return this.actions.isVisible($(selector));
  }
}
