/**
 * Minimal credential model for the current authentication-focused slices.
 */
export type UserModel = {
  username: string;
  password: string;
};

/**
 * Supported high-level outcomes for the implemented login flow.
 */
export type LoginOutcome = 'success' | 'failure';
