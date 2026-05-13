import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isGigAccessEnforcementEnabled } from './featureFlags';

describe('featureFlags', () => {
  const env = import.meta.env as Record<string, string | undefined>;
  let previous: string | undefined;

  beforeEach(() => {
    previous = env.VITE_GIG_ACCESS_ENFORCEMENT;
  });

  afterEach(() => {
    if (previous === undefined) {
      delete env.VITE_GIG_ACCESS_ENFORCEMENT;
    } else {
      env.VITE_GIG_ACCESS_ENFORCEMENT = previous;
    }
  });

  it('isGigAccessEnforcementEnabled is false when unset', () => {
    delete env.VITE_GIG_ACCESS_ENFORCEMENT;
    expect(isGigAccessEnforcementEnabled()).toBe(false);
  });

  it('isGigAccessEnforcementEnabled is true when VITE_GIG_ACCESS_ENFORCEMENT is true', () => {
    env.VITE_GIG_ACCESS_ENFORCEMENT = 'true';
    expect(isGigAccessEnforcementEnabled()).toBe(true);
  });
});
