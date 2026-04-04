import path from 'node:path';

/**
 * Centralized runtime configuration used by WDIO, helper scripts, and flows.
 */
type FrameworkConfig = {
  appiumCommand: string;
  appiumHost: string;
  appiumPort: number;
  appiumPath: string;
  appiumLogPath: string;
  appiumManagedService: boolean;
  androidAutomationName: string;
  androidDeviceName: string;
  androidUdid?: string;
  androidPlatformVersion?: string;
  androidAppPath: string;
  androidAppPackage: string;
  androidAppActivity: string;
  androidAppWaitActivity: string;
  androidNoReset: boolean;
  defaultTimeoutMs: number;
  stepTimeoutMs: number;
  connectionRetryTimeoutMs: number;
  connectionRetryCount: number;
  newCommandTimeoutSeconds: number;
  allureResultsDir: string;
};

const parseInteger = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (!value) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

const requireEnv = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

/**
 * Resolves the full framework configuration from environment variables with safe defaults.
 */
export const resolveConfig = (): FrameworkConfig => ({
  appiumCommand: process.env.APPIUM_COMMAND ?? 'appium',
  appiumHost: process.env.APPIUM_HOST ?? '127.0.0.1',
  appiumPort: parseInteger(process.env.APPIUM_PORT, 4723),
  appiumPath: process.env.APPIUM_PATH ?? '/',
  appiumLogPath: path.join(process.cwd(), 'artifacts', 'appium-logs'),
  appiumManagedService: parseBoolean(process.env.APPIUM_MANAGED_SERVICE, true),
  androidAutomationName: process.env.ANDROID_AUTOMATION_NAME ?? 'UiAutomator2',
  androidDeviceName: requireEnv('ANDROID_DEVICE_NAME', 'Android Emulator'),
  androidUdid: process.env.ANDROID_UDID || undefined,
  androidPlatformVersion: process.env.ANDROID_PLATFORM_VERSION || undefined,
  androidAppPath: requireEnv('ANDROID_APP_PATH'),
  androidAppPackage: requireEnv('ANDROID_APP_PACKAGE', 'com.wdiodemoapp'),
  androidAppActivity: requireEnv('ANDROID_APP_ACTIVITY', 'com.wdiodemoapp.MainActivity'),
  androidAppWaitActivity: requireEnv('ANDROID_APP_WAIT_ACTIVITY', 'com.wdiodemoapp.MainActivity'),
  androidNoReset: parseBoolean(process.env.ANDROID_NO_RESET, false),
  defaultTimeoutMs: parseInteger(process.env.DEFAULT_TIMEOUT_MS, 15000),
  stepTimeoutMs: parseInteger(process.env.STEP_TIMEOUT_MS, 60000),
  connectionRetryTimeoutMs: parseInteger(process.env.CONNECTION_RETRY_TIMEOUT_MS, 120000),
  connectionRetryCount: parseInteger(process.env.CONNECTION_RETRY_COUNT, 3),
  newCommandTimeoutSeconds: parseInteger(process.env.NEW_COMMAND_TIMEOUT_SECONDS, 240),
  allureResultsDir: path.join(process.cwd(), 'artifacts', 'allure-results'),
});

export type { FrameworkConfig };
