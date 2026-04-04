import { WaitHelpers } from '@framework/utils/wait.helpers.js';
import { addAllureJson, addAllureStoryContext } from '@framework/reporting/allure.helpers.js';
import { homeScreen } from '@screens/home/home.screen.js';
import { loginScreen } from '@screens/login/login.screen.js';
import type { LoginOutcome, UserModel } from '@models/user.model.js';

export type LoginOptions = {
  dismissSuccessAlert?: boolean;
};

type LoginAlertState = {
  title: string | null;
  message: string | null;
};

/**
 * Login flow keeps authentication orchestration out of step definitions and screen objects.
 */
export class LoginFlow {
  /**
   * Executes the supported login flow for the provided user.
   */
  async login(user: UserModel, options?: LoginOptions): Promise<LoginOutcome> {
    const dismissSuccessAlert = options?.dismissSuccessAlert ?? true;

    await loginScreen.open();
    await loginScreen.enterUsername(user.username);
    await loginScreen.enterPassword(user.password);

    addAllureStoryContext('Login credentials used', `username=${user.username}`);

    await loginScreen.submit();

    const outcome = await this.resolveOutcome();

    if (outcome === 'success' && dismissSuccessAlert) {
      await loginScreen.dismissAlertIfPresent();
    }

    return outcome;
  }

  /**
   * Validates the native success dialog that the sample app displays after valid login.
   */
  async isSuccessfulLoginConfirmationVisible(): Promise<boolean> {
    await WaitHelpers.until(async () => {
      const alert = await this.readAlertState();

      return this.isSuccessAlert(alert);
    }, 15000, 'Expected the successful login confirmation dialog to be visible.');

    const alert = await this.readAlertState();
    const confirmationVisible = this.isSuccessAlert(alert);

    addAllureJson('Successful login confirmation', {
      title: alert.title,
      message: alert.message,
      confirmationVisible,
    });

    return confirmationVisible;
  }

  /**
   * Validates that the user reached the authenticated home context.
   */
  async isAuthenticatedHomeStateVisible(): Promise<boolean> {
    await homeScreen.openAccountOverview();

    await WaitHelpers.until(async () => homeScreen.isHomeTitleVisible(), 15000, 'Expected the authenticated account overview title to be visible.');

    const homeMarkers = await homeScreen.readAuthenticatedHomeMarkers();

    addAllureJson('Authenticated home markers', homeMarkers);

    return homeMarkers.homeTabVisible && homeMarkers.homeTitleVisible && !homeMarkers.loginContextVisible;
  }

  /**
   * Validates one specific account-summary marker after the generic home state is confirmed.
   */
  async isAuthenticatedAccountSummaryVisible(): Promise<boolean> {
    const authenticatedHomeVisible = await this.isAuthenticatedHomeStateVisible();

    if (!authenticatedHomeVisible) {
      return false;
    }

    await WaitHelpers.until(
      async () => homeScreen.isAccountSummaryHeadlineVisible(),
      15000,
      'Expected the authenticated account summary headline to be visible.'
    );

    const accountSummaryVisible = await homeScreen.isAccountSummaryHeadlineVisible();

    addAllureJson('Authenticated account summary marker', {
      accountSummaryHeadlineVisible: accountSummaryVisible,
    });

    return accountSummaryVisible;
  }

  /**
   * Resolves the high-level login result based on either the dialog or post-login context.
   */
  private async resolveOutcome(): Promise<LoginOutcome> {
    await WaitHelpers.until(async () => {
      const alert = await this.readAlertState();
      if (alert.title) {
        return true;
      }

      return homeScreen.isAccountOverviewVisible();
    }, 15000, 'Expected either a login result dialog or the account overview context.');

    const alert = await this.readAlertState();

    if (this.isSuccessAlert(alert)) {
      return 'success';
    }

    if (this.isFailureAlert(alert)) {
      return 'failure';
    }

    return (await homeScreen.isAccountOverviewVisible()) ? 'success' : 'failure';
  }

  /**
   * Reads the current native login result dialog state in one place.
   */
  private async readAlertState(): Promise<LoginAlertState> {
    return {
      title: await loginScreen.readAlertTitle(),
      message: await loginScreen.readAlertMessage(),
    };
  }

  /**
   * Encapsulates the success alert matching logic so it stays consistent across the flow.
   */
  private isSuccessAlert(alert: LoginAlertState): boolean {
    const title = alert.title?.toLowerCase() ?? '';
    const message = alert.message?.toLowerCase() ?? '';

    return title.includes('success') || message.includes('logged in');
  }

  /**
   * Encapsulates the failure alert matching logic so it stays consistent across the flow.
   */
  private isFailureAlert(alert: LoginAlertState): boolean {
    const title = alert.title?.toLowerCase() ?? '';
    const message = alert.message?.toLowerCase() ?? '';

    return title.includes('error') || message.includes('invalid') || message.includes('does not match');
  }
}

export const loginFlow = new LoginFlow();
