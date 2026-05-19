import {
  getDeviceByProductCode,
  getDevices,
  getHospitals,
  getInterventionPrograms,
  getOutcomeOverview,
  getSnapshotMeta,
  getSnapshotSummary,
} from '@/lib/site-data';

describe('site data', () => {
  test('loads real hospital snapshot records', () => {
    const hospitals = getHospitals();
    expect(hospitals).toHaveLength(3);
    expect(hospitals[0]).toHaveProperty('providerId');
    expect(hospitals[0]).toHaveProperty('mortalityMeasures');
  });

  test('loads tracked device records', () => {
    const devices = getDevices();
    expect(devices).toHaveLength(3);
    expect(getDeviceByProductCode('FRN')).toMatchObject({ productCode: 'FRN' });
  });

  test('computes snapshot summary values', () => {
    const summary = getSnapshotSummary();
    expect(summary.hospitalCount).toBe(3);
    expect(summary.generatedAt).toBeTruthy();
    expect(summary.latestRecallCount).toBeGreaterThanOrEqual(0);
  });

  test('builds aggregated outcomes and interventions', () => {
    const overview = getOutcomeOverview();
    const programs = getInterventionPrograms();
    expect(overview.mortalityComparison).toHaveLength(2);
    expect(overview.readmissionComparison).toHaveLength(2);
    expect(programs.map((program) => program.id)).toEqual(['HRRP', 'HVBP', 'HACRP']);
  });

  test('snapshot metadata documents source catalog and key usage', () => {
    const meta = getSnapshotMeta();
    expect(meta.apiKeysRequired.cms).toBe(false);
    expect(meta.apiKeysRequired.openFda).toBe(false);
    expect(meta.sourceCatalog.general).toContain('data.cms.gov');
  });
});
