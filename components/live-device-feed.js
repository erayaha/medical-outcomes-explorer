"use client";

import { useEffect, useState } from "react";
import { fetchWithLocalCache } from "@/lib/browser-cache";

const openFdaEndpoint =
  "https://api.fda.gov/device/510k.json?limit=5&sort=date_received:desc";

export function LiveDeviceFeed() {
  const [state, setState] = useState({ loading: true, results: [], error: "" });

  async function load(forceRefresh = false) {
    setState((previous) => ({ ...previous, loading: true, error: "" }));
    try {
      const payload = await fetchWithLocalCache("openfda-510k-latest", openFdaEndpoint, {
        ttlMs: 1000 * 60 * 60 * 24,
        forceRefresh,
      });
      setState({ loading: false, results: payload.results ?? [], error: "" });
    } catch (error) {
      setState({
        loading: false,
        results: [],
        error: "Live openFDA results are unavailable right now. The static tracked product-code snapshot remains available below.",
      });
    }
  }

  useEffect(() => {
    load(false);
  }, []);

  return (
    <div className="panel stack-gap">
      <div className="section-heading split">
        <div>
          <h2>Latest openFDA 510(k) records</h2>
          <p>Client-side fetched from openFDA with localStorage caching and a manual refresh option.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => load(true)}>
          Refresh from source
        </button>
      </div>
      {state.loading ? <p>Loading live openFDA data…</p> : null}
      {state.error ? <p className="helper-text">{state.error}</p> : null}
      {state.results.length ? (
        <ul className="list-grid">
          {state.results.map((item) => (
            <li key={item.k_number} className="mini-card">
              <strong>{item.device_name || item.advisory_committee_description || "Unnamed device"}</strong>
              <span>{item.k_number}</span>
              <span>{item.applicant || "Unknown applicant"}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
