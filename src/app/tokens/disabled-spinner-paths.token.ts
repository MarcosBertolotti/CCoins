import { InjectionToken } from '@angular/core';

/**
 * Injection token for the disabled spinner paths.
 */
export const DISABLED_SPINNER_PATHS = new InjectionToken<string[]>(
  'DISABLED_SPINNER_PATHS'
);
