import {
  buildDeviceNarrative,
  buildHospitalNarrative,
  chooseFirstAvailableMetric,
  parseNumber,
  safeAverage,
  slugify,
} from '@/lib/data-transformers';

describe('data transformers', () => {
  test('slugify normalizes punctuation and spaces', () => {
    expect(slugify('NYU LANGONE HOSPITALS')).toBe('nyu-langone-hospitals');
  });

  test('parseNumber handles empty and report-suppressed values', () => {
    expect(parseNumber('19.3142')).toBeCloseTo(19.3142);
    expect(parseNumber('Too Few to Report')).toBeNull();
    expect(parseNumber('Not Available')).toBeNull();
  });

  test('chooseFirstAvailableMetric returns the first baseline/performance pair', () => {
    const record = {
      mort30ami_baseline_rate: '0.874426',
      mort30ami_performance_rate: '0.890687',
      mort30hf_baseline_rate: '0.885949',
      mort30hf_performance_rate: '0.912874',
    };

    expect(chooseFirstAvailableMetric(record, ['mort30hf', 'mort30ami'])).toEqual({
      metricName: 'mort30hf',
      baseline: 0.885949,
      performance: 0.912874,
    });
  });

  test('safeAverage skips nullish values', () => {
    expect(safeAverage([1, null, '2.0', 'Not Available'], 2)).toBe(1.5);
  });

  test('hospital narrative stays factual', () => {
    const narrative = buildHospitalNarrative(
      {
        facility_name: 'NYU LANGONE HOSPITALS',
        hospital_overall_rating: '5',
        count_of_readm_measures_better: '8',
        count_of_readm_measures_worse: '2',
        count_of_safety_measures_better: '5',
      },
      { excess_readmission_ratio: '0.8765' },
      { payment_reduction: 'No' },
    );

    expect(narrative).toContain('CMS overall rating of 5/5');
    expect(narrative).toContain('HRRP excess readmission ratio 0.8765');
  });

  test('device narrative references latest FDA dates', () => {
    const narrative = buildDeviceNarrative({
      productCode: 'FRN',
      latest510k: { decision_date: '2026-01-28', applicant: 'Koru Medical Systems, Inc.' },
      latestRecall: { event_date_initiated: '2026-02-11' },
      latestEvent: { date_received: '20260430' },
    });

    expect(narrative).toContain('Product code FRN');
    expect(narrative).toContain('2026-01-28');
    expect(narrative).toContain('2026-02-11');
  });
});
