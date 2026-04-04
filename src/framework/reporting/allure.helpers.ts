import { Buffer } from 'node:buffer';
import allureReporter from '@wdio/allure-reporter';

/**
 * A2dds a small text attachment to the current Allure entry.
 */
export const addAllureStoryContext = (name: string, content: string): void => {
  allureReporter.addAttachment(name, Buffer.from(content, 'utf-8'), 'text/plain');
};

/**
 * Adds structured JSON evidence without forcing callers to handle serialization.
 */
export const addAllureJson = (name: string, payload: unknown): void => {
  allureReporter.addAttachment(name, JSON.stringify(payload, null, 2), 'application/json');
};

/**
 * Applies high-level banking-oriented labels that keep the report readable.
 */
export const addBankingLabels = (feature: string, story: string): void => {
  allureReporter.addFeature(feature);
  allureReporter.addStory(story);
};
