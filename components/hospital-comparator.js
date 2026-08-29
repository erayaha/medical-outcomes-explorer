"use client";

import Link from "next/link";
import { useState } from "react";

export function HospitalComparator({ hospitals }) {
  const [selectedIds, setSelectedIds] = useState([
    hospitals[0]?.providerId || "330214",
    hospitals[1]?.providerId || "360180",
  ]);

  const toggleHospital = (providerId) => {
    if (selectedIds.includes(providerId)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((id) => id !== providerId));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, providerId]);
      } else {
        setSelectedIds([selectedIds[1], selectedIds[2], providerId]);
      }
    }
  };

  const comparedHospitals = selectedIds
    .map((id) => hospitals.find((h) => h.providerId === id))
    .filter(Boolean);

  const exportComparisonCsv = () => {
    const headers = [
      "Metric",
      ...comparedHospitals.map((h) => `"${h.name} (${h.state})"`),
    ];
    const rows = [
      ["CMS Overall Rating", ...comparedHospitals.map((h) => `${h.overallRating}/5`)],
      ["Bed Count", ...comparedHospitals.map((h) => h.bedCount || "n/a")],
      ["Clinical Trial Score", ...comparedHospitals.map((h) => `${h.clinicalTrialScore}/100`)],
      ["Research Tier", ...comparedHospitals.map((h) => `"${h.researchTier}"`)],
      ["HRRP Excess Ratio", ...comparedHospitals.map((h) => h.hrrpMeasure?.excessReadmissionRatio || "n/a")],
      ["HRRP Penalty Status", ...comparedHospitals.map((h) => `"${h.hrrpMeasure?.penaltyStatus || 'Exempt'}"`)],
      ["Total HAC Score", ...comparedHospitals.map((h) => h.hacSummary?.totalHacScore ?? "n/a")],
      ["HAC Penalty Reduction", ...comparedHospitals.map((h) => h.hacSummary?.paymentReduction || "No")],
      ["CLABSI Infection SIR", ...comparedHospitals.map((h) => h.hacSummary?.clabsiSir ?? "n/a")],
      ["CAUTI Infection SIR", ...comparedHospitals.map((h) => h.hacSummary?.cautiSir ?? "n/a")],
      ["SSI Infection SIR", ...comparedHospitals.map((h) => h.hacSummary?.ssiSir ?? "n/a")],
      ["COMP-HIP-KNEE Complication Rate (%)", ...comparedHospitals.map((h) => h.complicationMeasures?.[0]?.score ?? "n/a")],
    ];

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hospital-comparison-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="stack-gap">
      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>Select Hospitals to Benchmark (Up to 3)</h2>
          <p>
            Choose from premier academic medical centers and health systems to compare mortality, readmissions, infection SIRs, and financial risk profiles side-by-side.
          </p>
        </div>
        <div className="selector-chips">
          {hospitals.map((hospital) => {
            const isSelected = selectedIds.includes(hospital.providerId);
            return (
              <button
                key={hospital.providerId}
                type="button"
                className={`chip ${isSelected ? "chip-active" : ""}`}
                onClick={() => toggleHospital(hospital.providerId)}
                aria-pressed={isSelected}
              >
                <strong>{hospital.name}</strong>
                <span>({hospital.state} • {hospital.overallRating ? `${hospital.overallRating}★` : "n/a"})</span>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button type="button" className="btn btn-primary" onClick={exportComparisonCsv}>
            ⬇ Export Comparison Matrix (CSV)
          </button>
        </div>
      </div>

      <div className="panel table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: "260px" }}>Clinical Quality Domain</th>
              {comparedHospitals.map((hospital) => (
                <th key={hospital.providerId}>
                  <Link href={`/hospitals/${hospital.slug}`} className="highlight-link">
                    {hospital.name}
                  </Link>
                  <div className="helper-text">{hospital.city}, {hospital.state} • ID {hospital.providerId}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="table-group-header">
              <td colSpan={comparedHospitals.length + 1}>Executive Scorecard & Clinical Capacity</td>
            </tr>
            <tr>
              <td><strong>CMS Overall Rating</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>
                  <span className="badge badge-accent">
                    {h.overallRating ? `${h.overallRating} / 5 Stars` : "Not Rated"}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Licensed Inpatient Beds</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>{h.bedCount?.toLocaleString() || "n/a"} beds</td>
              ))}
            </tr>
            <tr>
              <td><strong>Clinical Trial Readiness Score</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>
                  <strong>{h.clinicalTrialScore || 85} / 100</strong>
                  <div className="helper-text">{h.researchTier}</div>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Centers of Excellence</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>
                  <div className="tag-cloud">
                    {h.specialties?.map((spec) => (
                      <span key={spec} className="tag">{spec}</span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            <tr className="table-group-header">
              <td colSpan={comparedHospitals.length + 1}>Hospital Readmissions (HRRP) & Financial Risk</td>
            </tr>
            <tr>
              <td><strong>Excess Readmission Ratio (ERR)</strong></td>
              {comparedHospitals.map((h) => {
                const ratio = h.hrrpMeasure?.excessReadmissionRatio;
                const isPenalty = ratio && ratio > 1.0;
                return (
                  <td key={h.providerId}>
                    <strong style={{ color: isPenalty ? "#ef4444" : "#10b981" }}>
                      {ratio !== null && ratio !== undefined ? ratio.toFixed(4) : "n/a"}
                    </strong>
                    <div className="helper-text">{h.hrrpMeasure?.penaltyStatus || "Exempt / No Penalty"}</div>
                  </td>
                );
              })}
            </tr>
            <tr>
              <td><strong>Predicted vs Expected Readmission</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>
                  {h.hrrpMeasure ? (
                    <span>
                      Predicted: <strong>{h.hrrpMeasure.predictedReadmissionRate}%</strong> | Expected: <strong>{h.hrrpMeasure.expectedReadmissionRate}%</strong>
                    </span>
                  ) : "n/a"}
                </td>
              ))}
            </tr>

            <tr className="table-group-header">
              <td colSpan={comparedHospitals.length + 1}>Patient Safety & Healthcare-Associated Infections (HACRP)</td>
            </tr>
            <tr>
              <td><strong>Total HAC Composite Score</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>
                  <strong>{h.hacSummary?.totalHacScore !== null && h.hacSummary?.totalHacScore !== undefined ? h.hacSummary.totalHacScore : "n/a"}</strong>
                  <div className="helper-text">Payment Reduction: {h.hacSummary?.paymentReduction || "No"}</div>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Infection Standardized Ratios (SIR)</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>
                  {h.hacSummary ? (
                    <ul className="mini-stat-list">
                      <li>CLABSI SIR: <strong>{h.hacSummary.clabsiSir ?? "n/a"}</strong></li>
                      <li>CAUTI SIR: <strong>{h.hacSummary.cautiSir ?? "n/a"}</strong></li>
                      <li>SSI SIR: <strong>{h.hacSummary.ssiSir ?? "n/a"}</strong></li>
                      <li>CDI SIR: <strong>{h.hacSummary.cdiSir ?? "n/a"}</strong></li>
                      <li>MRSA SIR: <strong>{h.hacSummary.mrsaSir ?? "n/a"}</strong></li>
                    </ul>
                  ) : "n/a"}
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Hip/Knee Complication Rate</strong></td>
              {comparedHospitals.map((h) => (
                <td key={h.providerId}>
                  <strong>{h.complicationMeasures?.[0]?.score ? `${h.complicationMeasures[0].score}%` : "n/a"}</strong>
                  <div className="helper-text">{h.complicationMeasures?.[0]?.comparedToNational || "National Baseline"}</div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
