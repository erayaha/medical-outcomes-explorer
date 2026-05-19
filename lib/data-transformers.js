export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function parseNumber(value) {
  if (value === null || value === undefined || value === "" || value === "Not Available" || value === "N/A" || value === "Too Few to Report") {
    return null;
  }

  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatNumber(value, digits = 1) {
  const parsed = parseNumber(value);
  return parsed === null ? "Not available" : parsed.toFixed(digits);
}

export function chooseFirstAvailableMetric(record, metricNames) {
  for (const metricName of metricNames) {
    const baseline = parseNumber(record?.[`${metricName}_baseline_rate`]);
    const performance = parseNumber(record?.[`${metricName}_performance_rate`]);

    if (baseline !== null || performance !== null) {
      return {
        metricName,
        baseline,
        performance,
      };
    }
  }

  return {
    metricName: null,
    baseline: null,
    performance: null,
  };
}

export function safeAverage(values, digits = 1) {
  const numeric = values.map(parseNumber).filter((value) => value !== null);
  if (!numeric.length) {
    return null;
  }
  const average = numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
  return Number(average.toFixed(digits));
}

export function buildHospitalNarrative(general, hrrp, hac) {
  const rating = parseNumber(general.hospital_overall_rating);
  const readmBetter = parseNumber(general.count_of_readm_measures_better) ?? 0;
  const readmWorse = parseNumber(general.count_of_readm_measures_worse) ?? 0;
  const safetyBetter = parseNumber(general.count_of_safety_measures_better) ?? 0;
  const paymentReduction = hac?.payment_reduction === "Yes" ? "with a HAC payment reduction" : "without a HAC payment reduction";
  const ratio = parseNumber(hrrp?.excess_readmission_ratio);
  const ratioText = ratio === null ? "HRRP excess readmission ratio not available" : `HRRP excess readmission ratio ${ratio.toFixed(4)}`;

  return `${general.facility_name} has a CMS overall rating of ${rating ?? "unrated"}${rating ? "/5" : ""}, ${readmBetter} readmission measures better than national comparison and ${readmWorse} worse, ${safetyBetter} safety measures better than national comparison, and ${paymentReduction}. ${ratioText}.`;
}

export function buildDeviceNarrative({ productCode, latest510k, latestRecall, latestEvent }) {
  const decisionDate = latest510k?.decision_date || latest510k?.date_received || "recent FDA records";
  const recallDate = latestRecall?.event_date_initiated || latestRecall?.event_date_posted || "no recent recall date listed";
  const eventDate = latestEvent?.date_received || latestEvent?.date_of_event || "recent MAUDE records";
  const applicant = latest510k?.applicant || latestRecall?.recalling_firm || latestEvent?.device?.[0]?.manufacturer_d_name || "FDA-listed manufacturers";

  return `Product code ${productCode} is represented in current FDA records by ${applicant}. The latest 510(k) activity in this snapshot is dated ${decisionDate}, the latest recall activity is dated ${recallDate}, and the latest adverse-event report is dated ${eventDate}.`;
}
