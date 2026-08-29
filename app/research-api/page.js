import { DataExporter } from "@/components/data-exporter";
import { SiteShell } from "@/components/site-shell";
import { StructuredData } from "@/components/structured-data";
import { getDevices, getHospitals, getMeasures, getSnapshotMeta } from "@/lib/site-data";

export const metadata = {
  title: "Open Research Data Workbench & Government API Provenance | Medical Outcomes Explorer",
  description:
    "Open research datasets, CMS Provider Data API endpoints, openFDA surveillance catalogs, and export tools for epidemiological and health outcomes research.",
};

export default function ResearchApiPage() {
  const hospitals = getHospitals();
  const devices = getDevices();
  const measures = getMeasures();
  const snapshotMeta = getSnapshotMeta();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: "Medical Outcomes Explorer Open Data Catalog",
    description: "Versioned open datasets derived from CMS and FDA public repositories.",
    dataset: [
      {
        "@type": "Dataset",
        name: "CMS Hospital Quality Snapshot",
        description: "Standardized clinical quality measures, mortality, readmissions, and safety indicators.",
      },
      {
        "@type": "Dataset",
        name: "openFDA Medical Device Post-Market Surveillance Snapshot",
        description: "510(k) clearances, MAUDE adverse events, and recall classifications.",
      },
    ],
  };

  return (
    <SiteShell currentPath="/research-api">
      <StructuredData data={structuredData} />
      <div className="page-header">
        <span className="badge badge-accent">Open Science & Health Informatics</span>
        <h1 className="hero-title">Open Research Data Workbench & API Catalog</h1>
        <p className="hero-subtitle">
          Transparent, reproducible health informatics datasets sourced directly from CMS Provider Data and openFDA APIs. Download structured files and inspect exact dataset provenance.
        </p>
      </div>

      <DataExporter hospitals={hospitals} devices={devices} measures={measures} />

      <div className="panel stack-gap">
        <div className="section-heading">
          <h2>Federal Data Provenance & API Registry</h2>
          <p>
            Every value in this portal is linked to verified US Government open data endpoints.
          </p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Dataset Name</th>
                <th>Government Authority</th>
                <th>Dataset Identifier / API Endpoint</th>
                <th>Update Frequency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Hospital General Information</strong></td>
                <td>CMS (data.cms.gov)</td>
                <td><code>xubh-q36u</code></td>
                <td>Quarterly</td>
              </tr>
              <tr>
                <td><strong>Complications & Deaths</strong></td>
                <td>CMS (data.cms.gov)</td>
                <td><code>ynj2-r877</code></td>
                <td>Annual</td>
              </tr>
              <tr>
                <td><strong>Unplanned Hospital Visits & EDAC</strong></td>
                <td>CMS (data.cms.gov)</td>
                <td><code>632h-zaca</code></td>
                <td>Annual</td>
              </tr>
              <tr>
                <td><strong>Hospital Readmissions Reduction (HRRP)</strong></td>
                <td>CMS (data.cms.gov)</td>
                <td><code>9n3s-kdb3</code></td>
                <td>Fiscal Year</td>
              </tr>
              <tr>
                <td><strong>Hospital-Acquired Condition Reduction (HACRP)</strong></td>
                <td>CMS (data.cms.gov)</td>
                <td><code>yq43-i98g</code></td>
                <td>Fiscal Year</td>
              </tr>
              <tr>
                <td><strong>Hospital Value-Based Purchasing (HVBP)</strong></td>
                <td>CMS (data.cms.gov)</td>
                <td><code>pudb-wetr</code></td>
                <td>Fiscal Year</td>
              </tr>
              <tr>
                <td><strong>FDA 510(k) Premarket Clearances</strong></td>
                <td>FDA (api.fda.gov)</td>
                <td><code>/device/510k.json</code></td>
                <td>Weekly</td>
              </tr>
              <tr>
                <td><strong>FDA MAUDE Adverse Events</strong></td>
                <td>FDA (api.fda.gov)</td>
                <td><code>/device/event.json</code></td>
                <td>Monthly</td>
              </tr>
              <tr>
                <td><strong>FDA Medical Device Recalls (Enforcement)</strong></td>
                <td>FDA (api.fda.gov)</td>
                <td><code>/device/recall.json</code></td>
                <td>Weekly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SiteShell>
  );
}
