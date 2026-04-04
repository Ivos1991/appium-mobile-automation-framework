import { BaseScreen } from '@core/base.screen.js';

/**
 * Stable home markers currently used to prove post-login app context.
 */
export type AuthenticatedHomeMarkers = {
  homeTabVisible: boolean;
  homeTitleVisible: boolean;
  loginContextVisible: boolean;
};

/**
 * Home screen exposes only the selectors and reads needed by the implemented slices.
 */
export class HomeScreen extends BaseScreen {
  private get homeTab() {
    return $('~Home');
  }

  private get homeTitle() {
    return $('~Home-screen');
  }

  private get logo() {
    return $('~Login-screen');
  }

  private get accountSummaryHeadline() {
    return $('//*[contains(@text, "WebdriverIO") or contains(@content-desc, "WebdriverIO")]');
  }

  /**
   * Opens the default home/account overview tab.
   */
  async openAccountOverview(): Promise<void> {
    await this.actions.tap(this.homeTab);
  }

  /**
   * Checks whether the persistent Home tab is visible.
   */
  async isHomeTabVisible(): Promise<boolean> {
    return this.actions.isVisible(this.homeTab);
  }

  /**
   * Checks whether the authenticated home title is visible.
   */
  async isHomeTitleVisible(): Promise<boolean> {
    return this.actions.isVisible(this.homeTitle);
  }

  /**
   * Treats the home title as the minimal account overview marker.
   */
  async isAccountOverviewVisible(): Promise<boolean> {
    return this.isHomeTitleVisible();
  }

  /**
   * Checks whether the login screen context is still visible.
   */
  async isLoginContextVisible(): Promise<boolean> {
    return this.actions.isVisible(this.logo);
  }

  /**
   * Checks the more specific content marker used for account-summary validation.
   */
  async isAccountSummaryHeadlineVisible(): Promise<boolean> {
    return this.actions.isVisible(this.accountSummaryHeadline);
  }

  /**
   * Returns the current set of post-login markers in one read operation for reporting.
   */
  async readAuthenticatedHomeMarkers(): Promise<AuthenticatedHomeMarkers> {
    return {
      homeTabVisible: await this.isHomeTabVisible(),
      homeTitleVisible: await this.isHomeTitleVisible(),
      loginContextVisible: await this.isLoginContextVisible(),
    };
  }
}

export const homeScreen = new HomeScreen();
