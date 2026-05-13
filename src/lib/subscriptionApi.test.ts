import { describe, it, expect } from 'vitest';
import { normalizePlanKey } from './subscriptionApi';

describe('normalizePlanKey', () => {
  it('maps weekly and monthly', () => {
    expect(normalizePlanKey('weekly')).toBe('weekly');
    expect(normalizePlanKey('MONTHLY')).toBe('monthly');
  });

  it('maps yearly and annual to yearly', () => {
    expect(normalizePlanKey('yearly')).toBe('yearly');
    expect(normalizePlanKey('annual')).toBe('yearly');
  });

  it('returns null for unknown', () => {
    expect(normalizePlanKey('')).toBe(null);
    expect(normalizePlanKey('foo')).toBe(null);
  });
});
