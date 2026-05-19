import fs from "node:fs";
import path from "node:path";

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

export function getSnapshotSummary() {
  const hospitals = getHospitals();
  const devices = getDevices();
  const latestHospitalMetrics = hospitals.map((hospital) => hospital.metrics.at(-1));

  return {
    hospitalCount: hospitals.length,
    averageRating: (hospitals.reduce((sum, hospital) => sum + hospital.overallRating, 0) / hospitals.length).toFixed(1),
    latestReadmissions: (
      latestHospitalMetrics.reduce((sum, metric) => sum + metric.readmissions, 0) / latestHospitalMetrics.length
    ).toFixed(1),
    deviceClasses: devices.length,
    totalLatestEvents: devices.reduce((sum, device) => sum + device.clearanceTimeline.at(-1).events, 0),
  };
}
