import { describe, expect, it } from 'vitest';
import { requestUrl, summarize } from './pagespeed.ts';

describe('summarize', () => {
  const raw = {
    lighthouseResult: {
      lighthouseVersion: '13.0.0',
      categories: {
        performance: { score: 0.91 },
        accessibility: { score: 1 },
        'best-practices': { score: 0.5 },
        seo: { score: null },
      },
      audits: {
        'largest-contentful-paint': { score: 0.8, displayValue: '2.0 s' },
        'cumulative-layout-shift': { score: 1, displayValue: '0' },
        'total-blocking-time': { score: 0.2, displayValue: '900 ms' },
        'unused-js': {
          title: 'Reduce unused JavaScript',
          displayValue: 'Save 300 ms',
          details: { type: 'opportunity', overallSavingsMs: 300 },
        },
        'render-blocking': {
          title: 'Eliminate render-blocking resources',
          displayValue: 'Save 900 ms',
          details: { type: 'opportunity', overallSavingsMs: 900 },
        },
        'no-savings': { title: 'Nothing', details: { type: 'opportunity', overallSavingsMs: 0 } },
        'dom-size': {
          title: 'Avoid an excessive DOM size',
          score: 0.4,
          displayValue: '2,000 elements',
          details: { type: 'table' },
        },
      },
    },
    loadingExperience: {
      metrics: {
        INTERACTION_TO_NEXT_PAINT: { percentile: 180 },
        CUMULATIVE_LAYOUT_SHIFT_SCORE: { percentile: 5 },
      },
    },
  };

  const report = summarize(raw);

  it('turns category scores into percentages, treating a missing score as zero', () => {
    expect(report.scores).toEqual({
      performance: 91,
      accessibility: 100,
      bestPractices: 50,
      seo: 0,
    });
  });

  it('keeps the core vitals', () => {
    expect(report.vitals.tbt).toEqual({ score: 0.2, displayValue: '900 ms' });
  });

  it('lists opportunities with savings, biggest first', () => {
    expect(report.opportunities.map((o) => o.title)).toEqual([
      'Eliminate render-blocking resources',
      'Reduce unused JavaScript',
    ]);
  });

  it('lists failing diagnostics', () => {
    expect(report.diagnostics).toEqual([
      { title: 'Avoid an excessive DOM size', displayValue: '2,000 elements' },
    ]);
  });

  it('reads field data, scaling layout shift back from CrUX hundredths', () => {
    expect(report.field).toEqual({ inp: 180, cls: 0.05 });
  });

  it('reports no field data when CrUX has none', () => {
    expect(summarize({ lighthouseResult: {} }).field).toBeNull();
  });
});

describe('requestUrl', () => {
  it('asks for all four categories and adds the key only when present', () => {
    const url = new URL(requestUrl('https://example.com'));
    expect(url.searchParams.getAll('category')).toEqual([
      'performance',
      'accessibility',
      'best-practices',
      'seo',
    ]);
    expect(url.searchParams.has('key')).toBe(false);
    expect(new URL(requestUrl('https://example.com', 'k')).searchParams.get('key')).toBe('k');
  });
});
