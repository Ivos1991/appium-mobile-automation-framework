import type { UserModel } from '@models/user.model.js';

/**
 * Stable demo-app credentials used for the positive authentication slices.
 */
export const validBankUser: UserModel = {
  username: 'test@webdriver.io',
  password: '12345678',
};

/**
 * Negative credentials used to verify rejected authentication.
 */
export const invalidBankUser: UserModel = {
  username: 'invalid@bank.test',
  password: 'wrong-password',
};
