import { BaseScreen } from '@core/base.screen.js';

/**
 * Login screen exposes only native demo-app UI interactions and reads.
 */
export class LoginScreen extends BaseScreen {
  private get loginTab() {
    return $('~Login');
  }

  private get emailInput() {
    return $('~input-email');
  }

  private get passwordInput() {
    return $('~input-password');
  }

  private get submitLoginButton() {
    return $('~button-LOGIN');
  }

  private get androidAlertTitle() {
    return $('//*[@resource-id="android:id/alertTitle" or @text="Success" or @text="Error"]');
  }

  private get androidAlertMessage() {
    return $('//*[@resource-id="android:id/message" or contains(@text, "logged in") or contains(@text, "invalid") or contains(@text, "do not match")]');
  }

  private get androidAlertPrimaryButton() {
    return $('//*[@resource-id="android:id/button1" or @text="OK"]');
  }

  /**
   * Opens the login tab from the bottom navigation.
   */
  async open(): Promise<void> {
    await this.actions.tap(this.loginTab);
  }

  /**
   * Enters the username field value.
   */
  async enterUsername(username: string): Promise<void> {
    await this.actions.typeText(this.emailInput, username);
  }

  /**
   * Enters the password field value.
   */
  async enterPassword(password: string): Promise<void> {
    await this.actions.typeText(this.passwordInput, password);
  }

  /**
   * Submits the login form.
   */
  async submit(): Promise<void> {
    await this.actions.tap(this.submitLoginButton);
  }

  /**
   * Checks whether the login screen is currently visible.
   */
  async isVisible(): Promise<boolean> {
    return this.actions.isVisible(this.emailInput);
  }

  /**
   * Reads the native alert title when a login result dialog is shown.
   */
  async readAlertTitle(): Promise<string | null> {
    if (!(await this.actions.isVisible(this.androidAlertTitle))) {
      return null;
    }

    return this.actions.readText(this.androidAlertTitle);
  }

  /**
   * Reads the native alert message when a login result dialog is shown.
   */
  async readAlertMessage(): Promise<string | null> {
    if (!(await this.actions.isVisible(this.androidAlertMessage))) {
      return null;
    }

    return this.actions.readText(this.androidAlertMessage);
  }

  /**
   * Closes the native alert when the primary button is visible.
   */
  async dismissAlertIfPresent(): Promise<void> {
    if (await this.actions.isVisible(this.androidAlertPrimaryButton)) {
      await this.actions.tap(this.androidAlertPrimaryButton);
    }
  }
}

export const loginScreen = new LoginScreen();
