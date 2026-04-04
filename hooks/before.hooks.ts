import { Before } from '@wdio/cucumber-framework';
import { addAllureStoryContext, addBankingLabels } from '@framework/reporting/allure.helpers.js';

/**
 * Resets the app state and tags each scenario consistently before execution.
 */
Before(async (scenario) => {
  addBankingLabels('Authentication', scenario.pickle.name);
  addAllureStoryContext('Scenario', scenario.pickle.name);
  await browser.reloadSession();
});
