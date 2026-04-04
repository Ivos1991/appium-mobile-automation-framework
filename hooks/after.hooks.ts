import { After } from '@wdio/cucumber-framework';
import allureReporter from '@wdio/allure-reporter';

/**
 * Adds a screenshot only for failed scenarios to keep evidence useful and concise.
 */
After(async (scenario) => {
  if (scenario.result?.status !== 'FAILED') {
    return;
  }

  const screenshot = await browser.takeScreenshot();
  allureReporter.addAttachment('Failure screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
});
