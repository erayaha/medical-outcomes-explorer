import fs from "node:fs";
import path from "node:path";
import { parseNumber, safeAverage } from "@/lib/data-transformers";

const snapshotDir = path.join(process.cwd(), "data", "2026-05");

function loadJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(snapshotDir, fileName), "utf8"));
}

export function getHospitals() {
  return loadJson("hospitals.json");
}

export function getHospitalBySlug(slug) {
  return getHospitals().find((hospital) => hospital.slug === slug);
}

export function getMeasures() {
  return loadJson("measures.json");
}

export function getDevices() {
  return loadJson("devices.json");
}

export function getDeviceByProductCode(productCode) {
  return getDevices().find((device) => device.productCode === productCode);
}

export function getDeviceMeasureLinks(productCode) {
  return loadJson("device_to_measure_map.json").find(
    (mapping) => mapping.productCode === productCode,
  );
}

export function getSnapshotMeta() {
  return loadJson("snapshot-meta.json");
}

export function getSnapshotSummary() {
  const hospitals = getHospitals();
  const devices = getDevices();

  return {
    hospitalCount: hospitals.length,
    averageRating: safeAverage(hospitals.map((hospital) => hospital.overallRating)),
    averageReadmissionRatio: safeAverage(
      hospitals.map((hospital) => hospital.hrrpMeasure?.excessReadmissionRatio),
      4,
    ),
    paymentReductionHospitals: hospitals.filter(
      (hospital) => hospital.hacSummary?.paymentReduction === "Yes",
    ).length,
    latestRecallCount: devices.reduce(
      (sum, device) => sum + (device.clearanceTimeline.at(-1)?.recalls || 0),
      0,
    ),
    generatedAt: getSnapshotMeta().generatedAt,
  };
}

export function getOutcomeOverview() {
  const hospitals = getHospitals();

  return {
    mortalityComparison: ["Baseline", "Performance"].map((period) => ({
      period,
      value: safeAverage(
        hospitals.map(
          (hospital) => hospital.charts.mortality.find((item) => item.period === period)?.value,
        ),
        4,
      ),
    })),
    readmissionComparison: ["Expected", "Predicted"].map((period) => ({
      period,
      value: safeAverage(
        hospitals.map(
          (hospital) => hospital.charts.readmissions.find((item) => item.period === period)?.value,
        ),
        2,
      ),
    })),
    safetyScores: hospitals.map((hospital) => ({
      period: hospital.state,
      value: parseNumber(hospital.hacSummary?.totalHacScore),
    })),
  };
}

export function getInterventionPrograms() {
  const hospitals = getHospitals();

  return [
    {
      id: "HRRP",
      title: "Hospital Readmissions Reduction Program",
      hospitals: hospitals.filter((hospital) => hospital.hrrpMeasure).length,
      firstLabel: "Expected readmission rate",
      secondLabel: "Predicted readmission rate",
      firstValue: safeAverage(
        hospitals.map((hospital) => hospital.hrrpMeasure?.expectedReadmissionRate),
        2,
      ),
      secondValue: safeAverage(
        hospitals.map((hospital) => hospital.hrrpMeasure?.predictedReadmissionRate),
        2,
      ),
      description:
        "Expected versus predicted readmission rates are sourced from the FY2026 CMS HRRP public file for the selected hospitals.",
    },
    {
      id: "HVBP",
      title: "Hospital Value-Based Purchasing clinical outcomes",
      hospitals: hospitals.filter((hospital) => hospital.hvbpSummary?.mortalityBaselineRate !== null).length,
      firstLabel: "Baseline mortality domain rate",
      secondLabel: "Performance mortality domain rate",
      firstValue: safeAverage(
        hospitals.map((hospital) => hospital.hvbpSummary?.mortalityBaselineRate),
        4,
      ),
      secondValue: safeAverage(
        hospitals.map((hospital) => hospital.hvbpSummary?.mortalityPerformanceRate),
        4,
      ),
      description:
        "Baseline and performance rates come from the FY2026 CMS HVBP clinical outcomes dataset.",
    },
    {
      id: "HACRP",
      title: "Hospital-Acquired Condition Reduction Program",
      hospitals: hospitals.filter((hospital) => hospital.hacSummary).length,
      firstLabel: "Average total HAC score",
      secondLabel: "Hospitals with payment reduction",
      firstValue: safeAverage(
        hospitals.map((hospital) => hospital.hacSummary?.totalHacScore),
        4,
      ),
      secondValue: hospitals.filter(
        (hospital) => hospital.hacSummary?.paymentReduction === "Yes",
      ).length,
      description:
        "Current FY2026 HAC scores and payment reduction flags are shown exactly as published by CMS.",
    },
  ];
}
