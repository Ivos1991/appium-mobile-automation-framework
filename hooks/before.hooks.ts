import { Before } from '@wdio/cucumber-framework';
import { addAllureStoryContext, addBankingLabels } from '@framework/reporting/allure.helpers.js';

/**
 * Tags each scenario consistently before execution.
 */
Before(async (scenario) => {
  addBankingLabels('Authentication', scenario.pickle.name);
  addAllureStoryContext('Scenario', scenario.pickle.name);
});
