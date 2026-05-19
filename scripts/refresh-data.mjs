import fs from "node:fs/promises";
import path from "node:path";
import {
  buildDeviceNarrative,
  buildHospitalNarrative,
  chooseFirstAvailableMetric,
  formatNumber,
  parseNumber,
  slugify,
} from "../lib/data-transformers.js";

const snapshotDir = path.join(process.cwd(), "data", "2026-05");
const selectedHospitalIds = ["050425", "330214", "450193"];
const selectedDeviceCodes = ["FRN", "QSN", "MNH"];
const deviceYearWindows = [2024, 2025, 2026];

const cmsDatasetUrls = {
  general: "https://data.cms.gov/provider-data/api/1/datastore/query/xubh-q36u/0",
  complications: "https://data.cms.gov/provider-data/api/1/datastore/query/ynj2-r877/0",
  readmissions: "https://data.cms.gov/provider-data/api/1/datastore/query/632h-zaca/0",
  hrrp: "https://data.cms.gov/provider-data/api/1/datastore/query/9n3s-kdb3/0",
  hac: "https://data.cms.gov/provider-data/api/1/datastore/query/yq43-i98g/0",
  hvbp: "https://data.cms.gov/provider-data/api/1/datastore/query/pudb-wetr/0",
};

const sourceCatalog = {
  general: "https://data.cms.gov/provider-data/dataset/xubh-q36u",
  complications: "https://data.cms.gov/provider-data/dataset/ynj2-r877",
  readmissions: "https://data.cms.gov/provider-data/dataset/632h-zaca",
  hrrp: "https://data.cms.gov/provider-data/dataset/9n3s-kdb3",
  hac: "https://data.cms.gov/provider-data/dataset/yq43-i98g",
  hvbp: "https://data.cms.gov/provider-data/dataset/pudb-wetr",
  openFda510k: "https://api.fda.gov/device/510k.json",
  openFdaEvent: "https://api.fda.gov/device/event.json",
  openFdaRecall: "https://api.fda.gov/device/recall.json",
};

const measures = [
  {
    id: "mortality",
    name: "CMS mortality measures",
    keywords: ["CMS hospital mortality rates", "hospital mortality measure"],
    description: "Mortality measures are sourced from the CMS Complications and Deaths dataset and HVBP clinical outcomes domain.",
    methodology: "This site shows current public CMS mortality scores plus HVBP baseline-versus-performance rates where available.",
  },
  {
    id: "readmissions",
    name: "CMS readmission measures",
    keywords: ["CMS hospital readmission rates explained", "hospital readmission reduction program data"],
    description: "Readmission measures are sourced from CMS Unplanned Hospital Visits and the Hospital Readmissions Reduction Program datasets.",
    methodology: "This site compares expected versus predicted readmission rates from HRRP and current CMS public reporting rows.",
  },
  {
    id: "complications",
    name: "CMS complications and HAC safety indicators",
    keywords: ["hospital complications data", "patient safety indicators hospital"],
    description: "Complication and safety fields are sourced from the CMS Complications and Deaths and HAC Reduction Program datasets.",
    methodology: "Current complication scores and FY2026 HAC indicators are rendered exactly as published by CMS for the selected hospitals.",
  },
];

const deviceToMeasureMap = [
  {
    productCode: "FRN",
    measureIds: ["complications", "readmissions"],
    rationale: "Infusion pump recalls and adverse-event reports are displayed next to CMS safety and readmission content because medication-delivery device failures can affect inpatient safety workflows.",
  },
  {
    productCode: "QSN",
    measureIds: ["complications", "mortality"],
    rationale: "Joint infection diagnostic device activity is shown with complications and mortality context because infections and delayed diagnosis can affect surgical outcomes.",
  },
  {
    productCode: "MNH",
    measureIds: ["readmissions", "complications"],
    rationale: "Spinal fixation device activity is shown with readmission and complication context because orthopedic implants can influence post-surgical complications and return visits.",
  },
];

function buildCmsUrl(baseUrl, facilityId, limit = 250) {
  const url = new URL(baseUrl);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("conditions[0][property]", "facility_id");
  url.searchParams.set("conditions[0][value]", facilityId);
  url.searchParams.set("conditions[0][operator]", "=");
  return url.toString();
}

function buildOpenFdaUrl(endpoint, search, extra = {}) {
  const url = new URL(`https://api.fda.gov/device/${endpoint}.json`);
  url.searchParams.set("search", search);
  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  if (process.env.OPENFDA_API_KEY) {
    url.searchParams.set("api_key", process.env.OPENFDA_API_KEY);
  }
  return url.toString();
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "medical-outcomes-explorer-data-refresh",
      accept: "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch ${url}: ${response.status} ${body.slice(0, 200)}`);
  }

  return response.json();
}

async function fetchCmsRows(datasetKey, facilityId) {
  const payload = await fetchJson(buildCmsUrl(cmsDatasetUrls[datasetKey], facilityId));
  return Array.isArray(payload) ? payload : payload.results || [];
}

async function fetchOpenFdaRows(endpoint, search, extra = {}) {
  try {
    const payload = await fetchJson(buildOpenFdaUrl(endpoint, search, extra));
    return payload.results || [];
  } catch (error) {
    if (String(error.message).includes("404")) {
      return [];
    }
    throw error;
  }
}

async function fetchOpenFdaTotal(endpoint, search) {
  try {
    const payload = await fetchJson(buildOpenFdaUrl(endpoint, search, { limit: 1 }));
    return payload.meta?.results?.total ?? 0;
  } catch (error) {
    if (String(error.message).includes("404")) {
      return 0;
    }
    throw error;
  }
}

function pickRows(rows, predicate, limit = 3) {
  return rows
    .filter(predicate)
    .sort((left, right) => {
      const rightScore = parseNumber(right.score);
      const leftScore = parseNumber(left.score);
      if (rightScore === null && leftScore === null) {
        return 0;
      }
      if (rightScore === null) {
        return -1;
      }
      if (leftScore === null) {
        return 1;
      }
      return rightScore - leftScore;
    })
    .slice(0, limit)
    .map((row) => ({
      measureId: row.measure_id || row.measure_name,
      measureName: row.measure_name,
      score: parseNumber(row.score),
      comparedToNational: row.compared_to_national || null,
    denominator: parseNumber(row.denominator),
    lowerEstimate: parseNumber(row.lower_estimate),
    higherEstimate: parseNumber(row.higher_estimate),
      startDate: row.start_date || null,
      endDate: row.end_date || null,
    }));
}

function buildHospitalRecord(general, complicationsRows, readmissionRows, hrrpRows, hacRows, hvbpRows) {
  const mortalityRows = pickRows(complicationsRows, (row) => row.measure_id?.startsWith("MORT_30_"));
  const complicationRows = pickRows(
    complicationsRows,
    (row) => row.measure_id === "COMP_HIP_KNEE" || row.measure_id?.startsWith("PSI_"),
  );
  const readmissions = pickRows(
    readmissionRows,
    (row) => row.measure_id === "READM_30_HOSP_WIDE" || row.measure_id?.startsWith("EDAC_30_"),
  );
  const hrrpRow =
    hrrpRows.find((row) => row.measure_name === "READM-30-HF-HRRP") ||
    hrrpRows.find((row) => row.measure_name === "READM-30-AMI-HRRP") ||
    hrrpRows[0] ||
    null;
  const hac = hacRows[0] || null;
  const hvbp = hvbpRows[0] || null;
  const hvbpMortality = chooseFirstAvailableMetric(hvbp, [
    "mort30hf",
    "mort30ami",
    "mort30pn",
    "mort30copd",
    "mort30cabg",
  ]);
  const hvbpComplication = chooseFirstAvailableMetric(hvbp, ["comphipknee"]);

  return {
    providerId: general.facility_id,
    slug: `${general.facility_id}-${slugify(general.facility_name)}`,
    name: general.facility_name,
    address: general.address,
    city: general.citytown,
    state: general.state,
    zipCode: general.zip_code,
    county: general.countyparish,
    phone: general.telephone_number,
    hospitalType: general.hospital_type,
    ownership: general.hospital_ownership,
    emergencyServices: general.emergency_services === "Yes",
    birthingFriendly: general.meets_criteria_for_birthing_friendly_designation === "Y",
    overallRating: parseNumber(general.hospital_overall_rating),
    summary: buildHospitalNarrative(general, hrrpRow, hac),
    qualityCounts: {
      mortalityBetter: parseNumber(general.count_of_mort_measures_better),
      mortalityNoDifferent: parseNumber(general.count_of_mort_measures_no_different),
      mortalityWorse: parseNumber(general.count_of_mort_measures_worse),
      readmissionsBetter: parseNumber(general.count_of_readm_measures_better),
      readmissionsNoDifferent: parseNumber(general.count_of_readm_measures_no_different),
      readmissionsWorse: parseNumber(general.count_of_readm_measures_worse),
      safetyBetter: parseNumber(general.count_of_safety_measures_better),
      safetyNoDifferent: parseNumber(general.count_of_safety_measures_no_different),
      safetyWorse: parseNumber(general.count_of_safety_measures_worse),
    },
    programs: [hrrpRow ? "HRRP" : null, hvbp ? "HVBP" : null, hac ? "HACRP" : null].filter(Boolean),
    mortalityMeasures: mortalityRows,
    readmissionMeasures: readmissions,
    complicationMeasures: complicationRows,
    hrrpMeasure: hrrpRow
      ? {
          measureName: hrrpRow.measure_name,
          excessReadmissionRatio: parseNumber(hrrpRow.excess_readmission_ratio),
          predictedReadmissionRate: parseNumber(hrrpRow.predicted_readmission_rate),
          expectedReadmissionRate: parseNumber(hrrpRow.expected_readmission_rate),
          readmissions: parseNumber(hrrpRow.number_of_readmissions),
          discharges: parseNumber(hrrpRow.number_of_discharges),
          startDate: hrrpRow.start_date,
          endDate: hrrpRow.end_date,
        }
      : null,
    hacSummary: hac
      ? {
          fiscalYear: hac.fiscal_year,
          totalHacScore: parseNumber(hac.total_hac_score),
          paymentReduction: hac.payment_reduction,
          clabsiSir: parseNumber(hac.clabsi_sir),
          cautiSir: parseNumber(hac.cauti_sir),
          ssiSir: parseNumber(hac.ssi_sir),
          cdiSir: parseNumber(hac.cdi_sir),
          mrsaSir: parseNumber(hac.mrsa_sir),
          haiStartDate: hac.hai_measures_start_date,
          haiEndDate: hac.hai_measures_end_date,
        }
      : null,
    hvbpSummary: hvbp
      ? {
          fiscalYear: hvbp.fiscal_year,
          mortalityMetric: hvbpMortality.metricName,
          mortalityBaselineRate: hvbpMortality.baseline,
          mortalityPerformanceRate: hvbpMortality.performance,
          complicationMetric: hvbpComplication.metricName,
          complicationBaselineRate: hvbpComplication.baseline,
          complicationPerformanceRate: hvbpComplication.performance,
        }
      : null,
    charts: {
      mortality: [
        { period: "Baseline", value: hvbpMortality.baseline },
        { period: "Performance", value: hvbpMortality.performance },
      ].filter((point) => point.value !== null),
      readmissions: hrrpRow
        ? [
            { period: "Expected", value: parseNumber(hrrpRow.expected_readmission_rate) },
            { period: "Predicted", value: parseNumber(hrrpRow.predicted_readmission_rate) },
          ].filter((point) => point.value !== null)
        : [],
      complications: [
        { period: "Current score", value: complicationRows[0]?.score ?? null },
      ].filter((point) => point.value !== null),
      safety: [
        { period: "Total HAC score", value: parseNumber(hac?.total_hac_score) },
      ].filter((point) => point.value !== null),
    },
    snapshotNotes: {
      mortalityWindow: mortalityRows[0] ? `${mortalityRows[0].startDate} to ${mortalityRows[0].endDate}` : null,
      readmissionWindow: readmissions[0] ? `${readmissions[0].startDate} to ${readmissions[0].endDate}` : null,
      hrrpWindow: hrrpRow ? `${hrrpRow.start_date} to ${hrrpRow.end_date}` : null,
    },
  };
}

async function buildDeviceRecord(productCode) {
  const latest510k = (
    await fetchOpenFdaRows(
      "510k",
      `product_code:${productCode}`,
      { limit: 1, sort: "date_received:desc" },
    )
  )[0] || null;
  const latestEvent = (
    await fetchOpenFdaRows(
      "event",
      `device.device_report_product_code:${productCode}`,
      { limit: 1, sort: "date_received:desc" },
    )
  )[0] || null;
  const latestRecall = (
    await fetchOpenFdaRows(
      "recall",
      `product_code:${productCode}`,
      { limit: 1, sort: "event_date_initiated:desc" },
    )
  )[0] || null;

  const yearlyCounts = [];
  for (const year of deviceYearWindows) {
    const clearances = await fetchOpenFdaTotal(
      "510k",
      `product_code:${productCode} AND date_received:[${year}-01-01 TO ${year}-12-31]`,
    );
    const events = await fetchOpenFdaTotal(
      "event",
      `device.device_report_product_code:${productCode} AND date_received:[${year}0101 TO ${year}1231]`,
    );
    const recalls = await fetchOpenFdaTotal(
      "recall",
      `product_code:${productCode} AND event_date_initiated:[${year}-01-01 TO ${year}-12-31]`,
    );
    yearlyCounts.push({ period: String(year), clearances, events, recalls });
  }

  const deviceName =
    latest510k?.openfda?.device_name ||
    latestRecall?.openfda?.device_name ||
    latestEvent?.device?.[0]?.openfda?.device_name ||
    latest510k?.device_name ||
    latestRecall?.product_description ||
    productCode;
  const medicalSpecialty =
    latest510k?.openfda?.medical_specialty_description ||
    latestRecall?.openfda?.medical_specialty_description ||
    latest510k?.advisory_committee_description ||
    latestEvent?.device?.[0]?.openfda?.medical_specialty_description ||
    "Medical device";
  const manufacturerExamples = Array.from(
    new Set(
      [
        latest510k?.applicant,
        latestRecall?.recalling_firm,
        latestEvent?.device?.[0]?.manufacturer_d_name,
      ].filter(Boolean),
    ),
  );

  return {
    productCode,
    slug: `fda-510k-product-code-${productCode.toLowerCase()}`,
    deviceClass: deviceName,
    medicalSpecialty,
    manufacturerExamples,
    summary: buildDeviceNarrative({ productCode, latest510k, latestRecall, latestEvent }),
    latest510k: latest510k
      ? {
          kNumber: latest510k.k_number,
          deviceName: latest510k.device_name,
          applicant: latest510k.applicant,
          advisoryCommittee: latest510k.advisory_committee_description,
          decisionDate: latest510k.decision_date,
          receivedDate: latest510k.date_received,
        }
      : null,
    latestRecall: latestRecall
      ? {
          date: latestRecall.event_date_initiated,
          postedDate: latestRecall.event_date_posted,
          reason: latestRecall.reason_for_recall,
          classification: latestRecall.recall_status,
          firm: latestRecall.recalling_firm,
          productDescription: latestRecall.product_description,
        }
      : null,
    latestEvent: latestEvent
      ? {
          dateReceived: latestEvent.date_received,
          dateOfEvent: latestEvent.date_of_event,
          eventType: latestEvent.event_type,
          manufacturer: latestEvent.device?.[0]?.manufacturer_d_name || null,
          brandName: latestEvent.device?.[0]?.brand_name || null,
          genericName: latestEvent.device?.[0]?.generic_name || null,
          productProblems: latestEvent.product_problems || [],
        }
      : null,
    clearanceTimeline: yearlyCounts,
  };
}

async function refresh() {
  const hospitalInputs = await Promise.all(
    selectedHospitalIds.map(async (facilityId) => {
      const [generalRows, complicationRows, readmissionRows, hrrpRows, hacRows, hvbpRows] = await Promise.all([
        fetchCmsRows("general", facilityId),
        fetchCmsRows("complications", facilityId),
        fetchCmsRows("readmissions", facilityId),
        fetchCmsRows("hrrp", facilityId),
        fetchCmsRows("hac", facilityId),
        fetchCmsRows("hvbp", facilityId),
      ]);

      return buildHospitalRecord(
        generalRows[0],
        complicationRows,
        readmissionRows,
        hrrpRows,
        hacRows,
        hvbpRows,
      );
    }),
  );

  const devices = await Promise.all(selectedDeviceCodes.map((code) => buildDeviceRecord(code)));

  const snapshotMeta = {
    generatedAt: new Date().toISOString(),
    hospitalsUpdated: hospitalInputs.length,
    devicesUpdated: devices.length,
    apiKeysRequired: {
      cms: false,
      openFda: false,
      openFdaOptionalKeySupported: true,
    },
    sourceCatalog,
  };

  const liveSample = {
    generatedAt: snapshotMeta.generatedAt,
    warnings: [],
    cmsSample: hospitalInputs.map((hospital) => ({
      providerId: hospital.providerId,
      name: hospital.name,
      state: hospital.state,
      overallRating: hospital.overallRating,
      source: "live",
    })),
    openFdaSample: devices.map((device) => ({
      referenceCode: device.productCode,
      deviceClass: device.deviceClass,
      latest510k: device.latest510k?.kNumber || null,
      source: "live",
    })),
  };

  await Promise.all([
    fs.writeFile(path.join(snapshotDir, "hospitals.json"), `${JSON.stringify(hospitalInputs, null, 2)}\n`),
    fs.writeFile(path.join(snapshotDir, "devices.json"), `${JSON.stringify(devices, null, 2)}\n`),
    fs.writeFile(path.join(snapshotDir, "measures.json"), `${JSON.stringify(measures, null, 2)}\n`),
    fs.writeFile(path.join(snapshotDir, "device_to_measure_map.json"), `${JSON.stringify(deviceToMeasureMap, null, 2)}\n`),
    fs.writeFile(path.join(snapshotDir, "snapshot-meta.json"), `${JSON.stringify(snapshotMeta, null, 2)}\n`),
    fs.writeFile(path.join(snapshotDir, "live-sample.json"), `${JSON.stringify(liveSample, null, 2)}\n`),
  ]);

  console.log(`Wrote refreshed live CMS and openFDA snapshots to ${snapshotDir}`);
  console.log(`Hospitals: ${hospitalInputs.map((hospital) => `${hospital.providerId} ${hospital.name}`).join(" | ")}`);
  console.log(`Devices: ${devices.map((device) => `${device.productCode} ${device.deviceClass}`).join(" | ")}`);
}

refresh().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
