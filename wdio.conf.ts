import path from 'node:path';
import dotenv from 'dotenv';
import { resolveConfig } from './src/framework/config/config.js';

dotenv.config();

const frameworkConfig = resolveConfig();
const androidCapabilities = {
  platformName: 'Android',
  'appium:automationName': frameworkConfig.androidAutomationName,
  'appium:deviceName': frameworkConfig.androidDeviceName,
  'appium:app': path.resolve(process.cwd(), frameworkConfig.androidAppPath),
  'appium:appPackage': frameworkConfig.androidAppPackage,
  'appium:appActivity': frameworkConfig.androidAppActivity,
  'appium:appWaitActivity': frameworkConfig.androidAppWaitActivity,
  'appium:newCommandTimeout': frameworkConfig.newCommandTimeoutSeconds,
  'appium:adbExecTimeout': 120000,
  'appium:androidInstallTimeout': 120000,
  'appium:uiautomator2ServerLaunchTimeout': 60000,
  'appium:autoGrantPermissions': true,
  'appium:forceAppLaunch': true,
  'appium:disableWindowAnimation': true,
  'appium:noReset': frameworkConfig.androidNoReset,
  ...(frameworkConfig.androidUdid ? { 'appium:udid': frameworkConfig.androidUdid } : {}),
  ...(frameworkConfig.androidPlatformVersion
    ? { 'appium:platformVersion': frameworkConfig.androidPlatformVersion }
    : {}),
};

export const config = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 1,
  logLevel: 'info',
  bail: 0,
  waitforTimeout: frameworkConfig.defaultTimeoutMs,
  connectionRetryTimeout: frameworkConfig.connectionRetryTimeoutMs,
  connectionRetryCount: frameworkConfig.connectionRetryCount,
  hostname: frameworkConfig.appiumHost,
  port: frameworkConfig.appiumPort,
  path: frameworkConfig.appiumPath,
  services: frameworkConfig.appiumManagedService
    ? [
        [
          'appium',
          {
            command: frameworkConfig.appiumCommand,
            logPath: frameworkConfig.appiumLogPath,
            args: {
              relaxedSecurity: true,
              address: frameworkConfig.appiumHost,
              port: frameworkConfig.appiumPort,
              basePath: frameworkConfig.appiumPath,
            },
          },
        ],
      ]
    : [],
  framework: 'cucumber',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: frameworkConfig.allureResultsDir,
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
  ],
  cucumberOpts: {
    require: [
      path.join(process.cwd(), 'step-definitions/**/*.ts'),
      path.join(process.cwd(), 'hooks/**/*.ts'),
    ],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: true,
    tagExpression: '',
    timeout: frameworkConfig.stepTimeoutMs,
    ignoreUndefinedDefinitions: false,
  },
  capabilities: [androidCapabilities],
} satisfies WebdriverIO.Config;
