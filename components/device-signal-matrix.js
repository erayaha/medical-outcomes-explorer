"use client";

import Link from "next/link";
import { useState } from "react";

export function DeviceSignalMatrix({ devices, deviceMappings = [] }) {
  const [selectedTherapy, setSelectedTherapy] = useState("all");

  const therapies = ["all", ...new Set(devices.map((d) => d.therapeuticArea).filter(Boolean))];

  const filteredDevices = devices.filter((device) => {
    return selectedTherapy === "all" || device.therapeuticArea === selectedTherapy;
  });

  return (
    <div className="stack-gap">
      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>FDA Post-Market Surveillance Matrix</h2>
          <p>
            Surveillance telemetry tracking FDA 510(k) clearances, MAUDE adverse events (Deaths, Injuries, Malfunctions), and Class I/II/III recalls across medical device product codes.
          </p>
        </div>

        <div className="filters">
          <label>
            Therapeutic specialty filter
            <select
              value={selectedTherapy}
              onChange={(e) => setSelectedTherapy(e.target.value)}
            >
              {therapies.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All therapeutic areas (8 categories)" : t}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid-cards">
        {filteredDevices.map((device) => {
          const mapping = deviceMappings.find((m) => m.productCode === device.productCode);
          const totalEvents = device.clearanceTimeline?.reduce((acc, t) => acc + (t.events || 0), 0) || 0;
          const totalRecalls = device.clearanceTimeline?.reduce((acc, t) => acc + (t.recalls || 0), 0) || 0;
          const deaths = device.eventBreakdown?.deaths || 0;
          const injuries = device.eventBreakdown?.injuries || 0;
          const malfunctions = device.eventBreakdown?.malfunctions || 0;

          return (
            <div key={device.productCode} className="panel stack-gap device-card">
              <div className="device-header">
                <div>
                  <span className="badge badge-accent">Code {device.productCode}</span>
                  <span className="badge">{device.riskClassification || "Class II"}</span>
                </div>
                <h3>
                  <Link href={`/devices-fda/${device.productCode}`} className="highlight-link">
                    {device.deviceClass}
                  </Link>
                </h3>
                <p className="helper-text">{device.therapeuticArea || device.medicalSpecialty}</p>
              </div>

              <div className="metric-quad">
                <div className="quad-item">
                  <span>3-Yr MAUDE Reports</span>
                  <strong>{totalEvents.toLocaleString()}</strong>
                </div>
                <div className="quad-item">
                  <span>Recalls Logged</span>
                  <strong style={{ color: totalRecalls > 0 ? "#f59e0b" : "#10b981" }}>
                    {totalRecalls}
                  </strong>
                </div>
                <div className="quad-item">
                  <span>Reported Deaths</span>
                  <strong style={{ color: deaths > 0 ? "#ef4444" : "#10b981" }}>
                    {deaths}
                  </strong>
                </div>
                <div className="quad-item">
                  <span>Reported Injuries</span>
                  <strong>{injuries.toLocaleString()}</strong>
                </div>
              </div>

              {device.latestRecall ? (
                <div className="alert-box">
                  <strong>Latest Recall ({device.latestRecall.classification})</strong>
                  <p>{device.latestRecall.reason}</p>
                  <span className="helper-text">Firm: {device.latestRecall.firm} • Date: {device.latestRecall.date}</span>
                </div>
              ) : null}

              {mapping ? (
                <div className="clinical-link-box">
                  <strong>Hospital Outcomes Linkage:</strong>
                  <p>{mapping.rationale}</p>
                </div>
              ) : null}

              <div className="device-footer">
                <Link href={`/devices-fda/${device.productCode}`} className="btn btn-secondary">
                  View Full Device Surveillance Profile →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
