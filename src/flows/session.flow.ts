import { addAllureStoryContext } from '@framework/reporting/allure.helpers.js';
import { loginScreen } from '@screens/login/login.screen.js';

/**
 * Session flow models the small session-guard behavior supported by the current demo-app slice.
 */
export class SessionFlow {
  /**
   * Resets the WDIO session and returns the app to the login entry point.
   */
  async resetAuthenticatedSession(): Promise<void> {
    addAllureStoryContext(
      'Session transition',
      'The sample app does not expose a dedicated logout or persisted-authentication flow in this slice, so session behavior is modeled as a controlled fresh app session that requires login again.'
    );

    await browser.reloadSession();
    await loginScreen.open();
  }
}

export const sessionFlow = new SessionFlow();
