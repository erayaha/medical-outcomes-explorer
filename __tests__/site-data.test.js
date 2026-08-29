import {
  getAllDeviceMeasureLinks,
  getClinicalTrialFacilities,
  getDeviceByProductCode,
  getDeviceMeasureLinks,
  getDevices,
  getDeviceSignalSummary,
  getHospitals,
  getInterventionPrograms,
  getOutcomeOverview,
  getSnapshotMeta,
  getSnapshotSummary,
} from '@/lib/site-data';

describe('site data', () => {
  test('loads real hospital snapshot records', () => {
    const hospitals = getHospitals();
    expect(hospitals).toHaveLength(9);
    expect(hospitals[0]).toHaveProperty('providerId');
    expect(hospitals[0]).toHaveProperty('mortalityMeasures');
  });

  test('loads tracked device records across 8 therapeutic areas', () => {
    const devices = getDevices();
    expect(devices).toHaveLength(8);
    expect(getDeviceByProductCode('FRN')).toMatchObject({ productCode: 'FRN' });
    expect(getDeviceByProductCode('NIQ')).toMatchObject({ productCode: 'NIQ' });
  });

  test('computes snapshot summary values', () => {
    const summary = getSnapshotSummary();
    expect(summary.hospitalCount).toBe(9);
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

  test('loads clinical trial facility profiling', () => {
    const facilities = getClinicalTrialFacilities();
    expect(facilities).toHaveLength(9);
    expect(facilities[0]).toHaveProperty('clinicalTrialScore');
    expect(facilities[0]).toHaveProperty('researchTier');
  });

  test('loads device surveillance summary and measure links', () => {
    const deviceSummary = getDeviceSignalSummary();
    expect(deviceSummary.totalDevices).toBe(8);
    expect(deviceSummary.therapeuticAreas.length).toBeGreaterThanOrEqual(5);

    const mappings = getAllDeviceMeasureLinks();
    expect(mappings.length).toBe(8);
    expect(getDeviceMeasureLinks('FRN')).toHaveProperty('measureIds');
  });

  test('snapshot metadata documents source catalog and key usage', () => {
    const meta = getSnapshotMeta();
    expect(meta.apiKeysRequired.cms).toBe(false);
    expect(meta.apiKeysRequired.openFda).toBe(false);
    expect(meta.sourceCatalog.general).toContain('data.cms.gov');
  });
});
