"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function getMapPosition(latitude, longitude) {
  const x = ((longitude + 125) / 60) * 100;
  const y = (1 - (latitude - 25) / 25) * 100;
  return { left: `${Math.max(5, Math.min(95, x))}%`, top: `${Math.max(10, Math.min(90, y))}%` };
}

export function HospitalExplorer({ hospitals }) {
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");

  const states = useMemo(
    () => ["all", ...new Set(hospitals.map((hospital) => hospital.state))],
    [hospitals],
  );

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesQuery = [hospital.name, hospital.city, hospital.providerId]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesState = stateFilter === "all" || hospital.state === stateFilter;
    return matchesQuery && matchesState;
  });

  return (
    <section className="explorer-grid">
      <div className="panel stack-gap">
        <div className="filters">
          <label>
            Search hospitals
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by hospital, city, or CMS ID"
            />
          </label>
          <label>
            Filter by state
            <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state === "all" ? "All states" : state}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Location</th>
                <th>Type</th>
                <th>CMS rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr key={hospital.providerId}>
                  <td>
                    <Link href={`/hospitals/${hospital.slug}`}>{hospital.name}</Link>
                  </td>
                  <td>
                    {hospital.city}, {hospital.state}
                  </td>
                  <td>{hospital.hospitalType}</td>
                  <td>{hospital.overallRating}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <div className="map-card" aria-label="Hospital location map">
          <div className="map-grid" />
          {filteredHospitals.map((hospital) => {
            const position = getMapPosition(hospital.latitude, hospital.longitude);
            return (
              <Link
                key={hospital.providerId}
                href={`/hospitals/${hospital.slug}`}
                className="map-pin"
                style={position}
                title={hospital.name}
              >
                <span>{hospital.state}</span>
              </Link>
            );
          })}
        </div>
        <p className="helper-text">
          The map uses approximate coordinates from the versioned snapshot so each hospital detail page remains crawlable and linked from static HTML.
        </p>
      </div>
    </section>
  );
}
