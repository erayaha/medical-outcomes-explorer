"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

  const stateSummary = states
    .filter((state) => state !== "all")
    .map((state) => ({
      state,
      hospitals: hospitals.filter((hospital) => hospital.state === state).length,
      averageRating:
        hospitals
          .filter((hospital) => hospital.state === state && hospital.overallRating !== null)
          .reduce((sum, hospital, _, rows) => sum + hospital.overallRating / rows.length, 0) || 0,
    }));

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
              placeholder="Search by hospital, city, or CMS provider ID"
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
                <th>Programs</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map((hospital) => (
                <tr key={hospital.providerId}>
                  <td>
                    <Link href={`/hospitals/${hospital.slug}`}>{hospital.name}</Link>
                    <div className="helper-text">Provider ID {hospital.providerId}</div>
                  </td>
                  <td>
                    {hospital.city}, {hospital.state}
                  </td>
                  <td>{hospital.hospitalType}</td>
                  <td>{hospital.overallRating ? `${hospital.overallRating}/5` : "Not rated"}</td>
                  <td>{hospital.programs.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>State snapshot</h2>
          <p>Real CMS facility records currently loaded into the static snapshot.</p>
        </div>
        <ul className="list-grid">
          {stateSummary.map((item) => (
            <li key={item.state} className="mini-card">
              <strong>{item.state}</strong>
              <span>{item.hospitals} hospital record(s)</span>
              <span>Average rating {item.averageRating ? item.averageRating.toFixed(1) : "n/a"}</span>
            </li>
          ))}
        </ul>
        <p className="helper-text">
          The app uses direct CMS facility records and avoids synthetic map coordinates so every value shown remains traceable to the government snapshot.
        </p>
      </div>
    </section>
  );
}
