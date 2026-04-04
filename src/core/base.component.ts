import { BaseActions } from './base.actions.js';

/**
 * Base component exposes shared actions without forcing business behavior into the UI layer.
 */
export abstract class BaseComponent {
  protected readonly actions = new BaseActions();
}
