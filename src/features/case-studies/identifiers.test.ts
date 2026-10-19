import { describe, expect, it } from 'vitest';
import { contractCode, experimentNumber, reportId, ticketNumber } from './identifiers.ts';

describe('decorative identifiers', () => {
  it('are the same on every call', () => {
    expect(ticketNumber('natours')).toBe(ticketNumber('natours'));
    expect(reportId('natours')).toBe(reportId('natours'));
  });

  it('stay in their ranges', () => {
    for (const id of ['a', 'natours', 'module-federation']) {
      expect(ticketNumber(id)).toBeGreaterThanOrEqual(1000);
      expect(ticketNumber(id)).toBeLessThan(10000);
      expect(experimentNumber(id)).toBeGreaterThanOrEqual(1000);
    }
  });

  it('keep the v1 experiment and contract numbers', () => {
    // v1 summed the character codes: "abc" is 294.
    expect(experimentNumber('abc')).toBe(1294);
    expect(contractCode('abc')).toBe('126');
  });
});
