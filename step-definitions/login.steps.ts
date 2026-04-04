import { Given, Then, When } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import { loginFlow } from '@flows/login.flow.js';
import { loginScreen } from '@screens/login/login.screen.js';
import { invalidBankUser, validBankUser } from '@testdata/users.js';
import type { LoginOutcome } from '@models/user.model.js';

let loginOutcome: LoginOutcome | undefined;

/**
 * Login feature steps intentionally delegate all orchestration to the flow layer.
 */
Given('the user is on the mobile banking login screen', async () => {
  await loginScreen.open();
  await expect(await loginScreen.isVisible()).toBe(true);
});

When('the user signs in with valid credentials', async () => {
  loginOutcome = await loginFlow.login(validBankUser);
});

When('the user signs in with valid credentials for runtime smoke', async () => {
  loginOutcome = await loginFlow.login(validBankUser, { dismissSuccessAlert: false });
});

When('the user signs in with invalid credentials', async () => {
  loginOutcome = await loginFlow.login(invalidBankUser);
});

Then('the successful login confirmation is visible', async () => {
  await expect(loginOutcome).toBe('success');
  await expect(await loginFlow.isSuccessfulLoginConfirmationVisible()).toBe(true);
});

Then('the authenticated account summary content is visible', async () => {
  await expect(loginOutcome).toBe('success');
  await expect(await loginFlow.isAuthenticatedAccountSummaryVisible()).toBe(true);
});

Then('the login attempt is rejected', async () => {
  await expect(loginOutcome).toBe('failure');
  await expect(await loginScreen.isVisible()).toBe(true);
});
