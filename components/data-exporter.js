"use client";

import { useState } from "react";

export function DataExporter({ hospitals, devices, measures }) {
  const [downloadFormat, setDownloadFormat] = useState("json");

  const downloadHospitals = () => {
    if (downloadFormat === "json") {
      downloadFile(JSON.stringify(hospitals, null, 2), "cms-hospitals-snapshot.json", "application/json");
    } else {
      const headers = ["providerId", "name", "city", "state", "overallRating", "hospitalType", "excessReadmissionRatio", "totalHacScore"];
      const rows = hospitals.map((h) => [
        h.providerId,
        `"${h.name}"`,
        `"${h.city}"`,
        h.state,
        h.overallRating ?? "",
        `"${h.hospitalType}"`,
        h.hrrpMeasure?.excessReadmissionRatio ?? "",
        h.hacSummary?.totalHacScore ?? "",
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      downloadFile(csv, "cms-hospitals-snapshot.csv", "text/csv");
    }
  };

  const downloadDevices = () => {
    if (downloadFormat === "json") {
      downloadFile(JSON.stringify(devices, null, 2), "fda-devices-snapshot.json", "application/json");
    } else {
      const headers = ["productCode", "deviceClass", "medicalSpecialty", "therapeuticArea", "riskClassification", "deaths", "injuries", "malfunctions"];
      const rows = devices.map((d) => [
        d.productCode,
        `"${d.deviceClass}"`,
        `"${d.medicalSpecialty}"`,
        `"${d.therapeuticArea || ''}"`,
        `"${d.riskClassification || ''}"`,
        d.eventBreakdown?.deaths ?? 0,
        d.eventBreakdown?.injuries ?? 0,
        d.eventBreakdown?.malfunctions ?? 0,
      ]);
      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      downloadFile(csv, "fda-devices-snapshot.csv", "text/csv");
    }
  };

  const downloadMeasures = () => {
    downloadFile(JSON.stringify(measures, null, 2), "cms-measures-catalog.json", "application/json");
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel stack-gap">
      <div className="section-heading">
        <h2>Open Data Export & Research API Workbench</h2>
        <p>
          Download pristine government datasets (CMS Provider Data & openFDA Medical Device surveillance records) formatted for statistical modeling, academic research, and epidemiological analysis.
        </p>
      </div>

      <div className="filters">
        <label>
          Export file format
          <select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
          >
            <option value="json">Structured JSON (.json)</option>
            <option value="csv">Tabular CSV (.csv)</option>
          </select>
        </label>
      </div>

      <div className="btn-group" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
        <button type="button" className="btn btn-primary" onClick={downloadHospitals}>
          ⬇ Download Hospital Quality Dataset ({downloadFormat.toUpperCase()})
        </button>
        <button type="button" className="btn btn-primary" onClick={downloadDevices}>
          ⬇ Download FDA Device Surveillance ({downloadFormat.toUpperCase()})
        </button>
        <button type="button" className="btn btn-secondary" onClick={downloadMeasures}>
          ⬇ Download Measure Dictionary (JSON)
        </button>
      </div>
    </div>
  );
}
