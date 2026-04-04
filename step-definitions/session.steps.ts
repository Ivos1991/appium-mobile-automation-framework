import { Then, When } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { sessionFlow } from '@flows/session.flow.js';
import { loginScreen } from '@screens/login/login.screen.js';

/**
 * Session feature steps stay thin and leave state transitions to the flow layer.
 */
When('the authenticated app session is restarted', async () => {
  await sessionFlow.resetAuthenticatedSession();
});

Then('the user is required to sign in again', async () => {
  await expect(await loginScreen.isVisible()).toBe(true);
});
