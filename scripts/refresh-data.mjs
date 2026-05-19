import fs from "node:fs/promises";
import path from "node:path";

const snapshotDir = path.join(process.cwd(), "data", "2026-05");

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

async function refresh() {
  const cmsUrl =
    "https://data.cms.gov/resource/xubh-q36u.json?$select=provider_id,hospital_name,city,state,hospital_type,hospital_overall_rating&$limit=5";
  const openFdaUrl =
    "https://api.fda.gov/device/510k.json?limit=5&sort=date_received:desc";

  const hospitalsSeed = JSON.parse(
    await fs.readFile(path.join(snapshotDir, "hospitals.json"), "utf8"),
  );
  const devicesSeed = JSON.parse(
    await fs.readFile(path.join(snapshotDir, "devices.json"), "utf8"),
  );

  let cmsSample = [];
  let openFdaSample = [];
  const warnings = [];

  try {
    const cmsHospitals = await fetchJson(cmsUrl);
    cmsSample = cmsHospitals.map((hospital) => ({
      providerId: hospital.provider_id,
      name: hospital.hospital_name,
      city: hospital.city,
      state: hospital.state,
      hospitalType: hospital.hospital_type,
      overallRating: hospital.hospital_overall_rating,
      source: "live",
    }));
  } catch (error) {
    warnings.push(`CMS refresh fallback used: ${error.message}`);
    cmsSample = hospitalsSeed.map((hospital) => ({
      providerId: hospital.providerId,
      name: hospital.name,
      city: hospital.city,
      state: hospital.state,
      hospitalType: hospital.hospitalType,
      overallRating: hospital.overallRating,
      source: "seed",
    }));
  }

  try {
    const openFdaDevices = await fetchJson(openFdaUrl);
    openFdaSample = (openFdaDevices.results || []).map((item) => ({
      kNumber: item.k_number,
      deviceName: item.device_name,
      applicant: item.applicant,
      advisoryCommittee: item.advisory_committee_description,
      source: "live",
    }));
  } catch (error) {
    warnings.push(`openFDA refresh fallback used: ${error.message}`);
    openFdaSample = devicesSeed.map((device) => ({
      kNumber: null,
      referenceCode: device.productCode,
      deviceName: null,
      deviceClass: device.deviceClass,
      applicant: device.manufacturerExamples.join(", "),
      advisoryCommittee: null,
      source: "seed",
    }));
  }

  const output = {
    generatedAt: new Date().toISOString(),
    warnings,
    cmsSample,
    openFdaSample,
  };

  await fs.writeFile(
    path.join(snapshotDir, "live-sample.json"),
    JSON.stringify(output, null, 2) + "\n",
  );

  console.log(`Wrote ${path.join(snapshotDir, "live-sample.json")}`);
}

refresh().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
